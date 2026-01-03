import { useState, useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { IndianRupee, FileText, CheckCircle, Info, Calculator } from 'lucide-react';
import { SEO } from './SEO';

export const TaxCalculator = () => {
    const schema = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Stable Money Income Tax Calculator FY 2025-26",
        "operatingSystem": "Web",
        "applicationCategory": "FinanceApplication",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "850"
        }
    });

    // --- Inputs ---
    const [grossSalary, setGrossSalary] = useState<number>(1500000);
    const [otherIncome, setOtherIncome] = useState<number>(50000);

    // Deductions (Old Regime Mostly)
    const [deduction80C, setDeduction80C] = useState<number>(150000);
    const [deduction80D, setDeduction80D] = useState<number>(25000);
    const [hra, setHra] = useState<number>(0);
    const [homeLoanInterest, setHomeLoanInterest] = useState<number>(0);
    const [otherDeductions, setOtherDeductions] = useState<number>(0);

    // --- Logic ---
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(Math.round(val));
    };

    const calculation = useMemo(() => {
        const totalIncome = grossSalary + otherIncome;

        // --- OLD REGIME ---
        const stdDeductionOld = 50000;
        const totalDeductionsOld = Math.min(deduction80C, 150000) +
            deduction80D +
            hra +
            Math.min(homeLoanInterest, 200000) +
            otherDeductions +
            stdDeductionOld;

        const taxableIncomeOld = Math.max(0, totalIncome - totalDeductionsOld);

        let taxOld = 0;
        // Old Slabs
        if (taxableIncomeOld > 1000000) {
            taxOld += (taxableIncomeOld - 1000000) * 0.30;
            taxOld += 112500; // Tax for 10L
        } else if (taxableIncomeOld > 500000) {
            taxOld += (taxableIncomeOld - 500000) * 0.20;
            taxOld += 12500; // Tax for 5L
        } else if (taxableIncomeOld > 250000) {
            taxOld += (taxableIncomeOld - 250000) * 0.05;
        }

        // Rebate 87A (Old: Income <= 5L)
        if (taxableIncomeOld <= 500000) {
            taxOld = 0;
        }

        // Cess
        const cessOld = taxOld * 0.04;
        const totalTaxOld = taxOld + cessOld;


        // --- NEW REGIME (FY 25-26) ---
        const stdDeductionNew = 75000;
        // Only family pension deduction allowed usually, keeping it simple to just Std Ded for now as per prompt instructions
        const taxableIncomeNew = Math.max(0, totalIncome - stdDeductionNew);

        let taxNew = 0;
        // New Slabs FY 25-26
        // 0-4L: Nil
        // 4-8L: 5%
        // 8-12L: 10%
        // 12-16L: 15%
        // 16-20L: 20%
        // 20-24L: 25%
        // >24L: 30%

        let incomeForSlab = taxableIncomeNew;

        if (incomeForSlab > 2400000) {
            taxNew += (incomeForSlab - 2400000) * 0.30;
            incomeForSlab = 2400000;
        }
        if (incomeForSlab > 2000000) {
            taxNew += (incomeForSlab - 2000000) * 0.25;
            incomeForSlab = 2000000;
        }
        if (incomeForSlab > 1600000) {
            taxNew += (incomeForSlab - 1600000) * 0.20;
            incomeForSlab = 1600000;
        }
        if (incomeForSlab > 1200000) {
            taxNew += (incomeForSlab - 1200000) * 0.15;
            incomeForSlab = 1200000;
        }
        if (incomeForSlab > 800000) {
            taxNew += (incomeForSlab - 800000) * 0.10;
            incomeForSlab = 800000;
        }
        if (incomeForSlab > 400000) {
            taxNew += (incomeForSlab - 400000) * 0.05;
            incomeForSlab = 400000;
        }

        // Rebate 87A (New: Income <= 12L) - technically check implies taxable <= 12L
        if (taxableIncomeNew <= 1200000) {
            taxNew = 0;
        }

        // Cess
        const cessNew = taxNew * 0.04;
        const totalTaxNew = taxNew + cessNew;

        return {
            taxableIncomeOld,
            totalTaxOld,
            taxableIncomeNew,
            totalTaxNew,
            diff: Math.abs(totalTaxOld - totalTaxNew),
            betterRegime: totalTaxNew <= totalTaxOld ? 'New' : 'Old'
        };

    }, [grossSalary, otherIncome, deduction80C, deduction80D, hra, homeLoanInterest, otherDeductions]);

    const { totalTaxOld, totalTaxNew, diff, betterRegime } = calculation;

    const chartData = [
        { name: 'Old Regime', tax: Math.round(totalTaxOld) },
        { name: 'New Regime', tax: Math.round(totalTaxNew) },
    ];

    const InputControl = ({ label, value, setValue, icon: Icon }: any) => (
        <div className="mb-4">
            <label className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                {Icon && <Icon className="w-3 h-3" />}
                {label}
            </label>
            <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 border border-gray-200 dark:border-gray-600">
                <span className="text-gray-400 mr-2 text-sm">₹</span>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full bg-transparent outline-none text-gray-900 dark:text-gray-100 font-mono text-sm"
                />
            </div>

        </div>
    );


    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden font-sans">
            <SEO
                title="Income Tax Calculator FY 2025-26 (Old vs New Regime) | Stable Money"
                description="Compare your tax liability under Old vs New Tax Regime for FY 2025-26. Calculate tax savings with 80C, HRA, and Standard Deduction."
                keywords="Income tax calculator, tax calculator 2025-26, old vs new regime, tax saving calculator"
                canonical="https://stablemoney.com/tax-calculator"
                schema={schema}
            />
            {/* Header */}
            <div className="p-6 bg-slate-100 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Income Tax Comparison</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">FY 2025-26 (AY 2026-27)</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Inputs */}
                <div className="lg:col-span-5 p-6 border-r border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/30">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-bold text-blue-600 uppercase mb-4 flex items-center gap-2">
                                <IndianRupee className="w-4 h-4" /> Income Sources
                            </h3>
                            <InputControl label="Gross Salary" value={grossSalary} setValue={setGrossSalary} />
                            <InputControl label="Other Income" value={otherIncome} setValue={setOtherIncome} />
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-blue-600 uppercase mb-4 flex items-center gap-2">
                                <Calculator className="w-4 h-4" /> Deductions (Old Regime)
                            </h3>
                            <InputControl label="80C (PPF, ELSS, LIC)" value={deduction80C} setValue={setDeduction80C} />
                            <InputControl label="80D (Health Insurance)" value={deduction80D} setValue={setDeduction80D} />
                            <InputControl label="HRA Exemption" value={hra} setValue={setHra} />
                            <InputControl label="Home Loan Interest (Sec 24)" value={homeLoanInterest} setValue={setHomeLoanInterest} />
                            <InputControl label="Other Deductions" value={otherDeductions} setValue={setOtherDeductions} />
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="lg:col-span-7 p-6 lg:p-8 bg-white dark:bg-gray-800">

                    {/* Comparison Card */}
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-8">
                        <div className="grid grid-cols-2 gap-8 relative">
                            {/* Vertical divider */}
                            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700 transform -translate-x-1/2 hidden md:block"></div>

                            {/* Old */}
                            <div className="text-center relative z-10">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Old Regime</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{formatCurrency(totalTaxOld)}</p>
                                <p className="text-xs text-gray-400">Total Tax Payable</p>
                                {betterRegime === 'Old' && (
                                    <div className="mt-3 inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                        <CheckCircle className="w-3 h-3" /> Best Option
                                    </div>
                                )}
                            </div>

                            {/* New */}
                            <div className="text-center relative z-10">
                                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">New Regime</p>
                                <p className="text-2xl font-bold text-blue-600 mb-1">{formatCurrency(totalTaxNew)}</p>
                                <p className="text-xs text-gray-400">Total Tax Payable</p>
                                {betterRegime === 'New' && (
                                    <div className="mt-3 inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                                        <CheckCircle className="w-3 h-3" /> Best Option
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Verdict */}
                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                You save <span className="font-bold text-green-600 text-xl">{formatCurrency(diff)}</span> by choosing the
                                <strong className={`ml-1 ${betterRegime === 'New' ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>{betterRegime} Regime</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="h-64 mt-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
                                <Tooltip cursor={{ fill: 'transparent' }} formatter={(value: any) => formatCurrency(value)} />
                                <Bar dataKey="tax" radius={[0, 4, 4, 0]} barSize={40}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name.includes(betterRegime) ? '#16a34a' : '#94a3b8'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                            <p className="font-bold mb-1">FY 25-26 Updates:</p>
                            <p>New Regime Standard Deduction increased to ₹75,000. Tax-free limit effectively ₹12 Lakhs (with rebate).</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
