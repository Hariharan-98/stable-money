import { useState, useMemo } from 'react';
import { CalculatorInput } from './CalculatorInput';
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




    return (
        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden text-slate-100 font-sans">
            <SEO
                title="Income Tax Calculator FY 2025-26 (Old vs New Regime) | Stable Money"
                description="Compare your tax liability under Old vs New Tax Regime for FY 2025-26. Calculate tax savings with 80C, HRA, and Standard Deduction."
                keywords="Income tax calculator, tax calculator 2025-26, old vs new regime, tax saving calculator"
                canonical="https://stablemoney.com/tax-calculator"
                schema={schema}
            />
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-neon-blue/10 rounded-xl">
                        <FileText className="w-6 h-6 text-neon-blue" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-display font-bold text-white tracking-tight">Tax Optimizer</h2>
                        <p className="text-sm text-gray-400">AY 2026-27 (FY 2025-26)</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Inputs */}
                {/* Inputs */}
                <div className="lg:col-span-4 p-6 border-r border-white/10 bg-white/5">
                    <div className="space-y-10">
                        <div>
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 border-l-4 border-neon-blue pl-3">Income Sources</h3>
                            <CalculatorInput label="Gross Salary" value={grossSalary} setValue={setGrossSalary} min={0} max={10000000} step={10000} icon={IndianRupee} iconClass="text-neon-blue" />
                            <CalculatorInput label="Other Income" value={otherIncome} setValue={setOtherIncome} min={0} max={5000000} step={5000} icon={IndianRupee} iconClass="text-neon-cyan" />
                        </div>

                        <div>
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 border-l-4 border-neon-amber pl-3">Deductions (Old Only)</h3>
                            <CalculatorInput label="80C Investments" value={deduction80C} setValue={setDeduction80C} min={0} max={150000} step={5000} icon={Calculator} iconClass="text-neon-amber" />
                            <CalculatorInput label="80D Medical" value={deduction80D} setValue={setDeduction80D} min={0} max={100000} step={1000} icon={Calculator} iconClass="text-neon-cyan" />
                            <CalculatorInput label="HRA Exemption" value={hra} setValue={setHra} min={0} max={1000000} step={5000} icon={Calculator} iconClass="text-neon-green" />
                            <CalculatorInput label="Sec 24 Interest" value={homeLoanInterest} setValue={setHomeLoanInterest} min={0} max={200000} step={5000} icon={Calculator} iconClass="text-neon-purple" />
                            <CalculatorInput label="Other Deduction" value={otherDeductions} setValue={setOtherDeductions} min={0} max={500000} step={5000} icon={Calculator} iconClass="text-neon-orange" />
                        </div>
                    </div>
                </div>

                {/* Results Column */}
                <div className="lg:col-span-8 p-6 lg:p-8 space-y-8">

                    {/* Comparison Card */}
                    <div className={`glass rounded-3xl p-8 border transition-all duration-500 shadow-2xl relative overflow-hidden group ${betterRegime === 'New' ? 'border-neon-blue/40 shadow-neon-blue/10' : 'border-neon-amber/40 shadow-neon-amber/10'}`}>
                        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-60 ${betterRegime === 'New' ? 'bg-neon-blue/20' : 'bg-neon-amber/20'}`}></div>

                        <div className="grid grid-cols-2 gap-8 relative z-10">
                            {/* Vertical divider */}
                            <div className="absolute left-1/2 top-4 bottom-4 w-px bg-white/10 hidden md:block"></div>

                            {/* Old */}
                            <div className={`text-center transition-all ${betterRegime === 'Old' ? 'scale-105' : 'opacity-60 grayscale-[0.5]'}`}>
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${betterRegime === 'Old' ? 'text-neon-amber' : 'text-gray-500'}`}>Old Regime</p>
                                <p className="text-3xl font-display font-black text-white mb-1">{formatCurrency(totalTaxOld)}</p>
                                <p className="text-[10px] font-bold text-gray-500 uppercase">Yearly Tax</p>
                                {betterRegime === 'Old' && (
                                    <div className="mt-4 inline-flex items-center gap-2 bg-neon-amber/10 text-neon-amber border border-neon-amber/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                                        <CheckCircle className="w-3.5 h-3.5" /> Optimal Choice
                                    </div>
                                )}
                            </div>

                            {/* New */}
                            <div className={`text-center transition-all ${betterRegime === 'New' ? 'scale-105' : 'opacity-60 grayscale-[0.5]'}`}>
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${betterRegime === 'New' ? 'text-neon-blue' : 'text-gray-500'}`}>New Regime</p>
                                <p className={`text-3xl font-display font-black mb-1 ${betterRegime === 'New' ? 'text-neon-blue drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-white'}`}>{formatCurrency(totalTaxNew)}</p>
                                <p className="text-[10px] font-bold text-gray-500 uppercase">Yearly Tax</p>
                                {betterRegime === 'New' && (
                                    <div className="mt-4 inline-flex items-center gap-2 bg-neon-blue/10 text-neon-blue border border-neon-blue/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                                        <CheckCircle className="w-3.5 h-3.5" /> Optimal Choice
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Verdict */}
                        <div className={`mt-8 pt-8 border-t border-white/10 text-center relative z-10 p-6 rounded-2xl ${betterRegime === 'New' ? 'bg-neon-blue/5' : 'bg-neon-amber/5'}`}>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Stable Money Verdict</p>
                            <h4 className="text-xl font-display font-black text-white mb-1">
                                Save <span className="text-neon-green text-3xl mx-2">{formatCurrency(diff)}</span> Per Year
                            </h4>
                            <p className="text-sm font-medium text-gray-500">
                                Equivalent to <span className="text-white font-bold">{formatCurrency(diff / 12)} monthly</span> by choosing the <span className={`font-black ${betterRegime === 'New' ? 'text-neon-blue' : 'text-neon-amber'}`}>{betterRegime} Regime</span>.
                            </p>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="h-64 mt-12 glass rounded-3xl p-6 border border-white/10 relative overflow-hidden">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 border-l-4 border-neon-blue pl-3">Liability Comparison</p>
                        <ResponsiveContainer width="100%" height="80%">
                            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} width={80} stroke="none" />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        fontSize: '11px'
                                    }}
                                    formatter={(value: any) => [formatCurrency(value), 'Tax']}
                                />
                                <Bar dataKey="tax" radius={[0, 8, 8, 0]} barSize={32}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name.includes(betterRegime) ? '#10b981' : '#334155'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-8 glass rounded-2xl p-5 border border-neon-blue/20 bg-neon-blue/5 flex items-start gap-4">
                        <div className="p-2 bg-neon-blue/10 rounded-lg">
                            <Info className="w-5 h-5 text-neon-blue shrink-0" />
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                            <p className="text-neon-blue mb-1">FY 25-26 Budget Updates:</p>
                            <p>New Regime Standard Deduction increased to <span className="text-white">₹75,000</span>. Tax-free limit effectively <span className="text-white">₹12 Lakhs</span> (with rebate).</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
