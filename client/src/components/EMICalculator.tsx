import { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { IndianRupee, Percent, Calendar, Calculator, CheckCircle, AlertCircle } from 'lucide-react';
import { SEO } from './SEO';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';
import { trackSliderInteraction } from '../utils/analytics';

interface SimulationResult {
    totalInterest: number;
    totalAmount: number;
    months: number;
}

export const EMICalculator = () => {
    const schema = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Stable Money EMI Calculator",
        "operatingSystem": "Web",
        "applicationCategory": "FinanceApplication",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "2100"
        }
    });

    // --- State ---
    const [loanAmount, setLoanAmount] = useLocalStorage<number>(STORAGE_KEYS.EMI_LOAN_AMOUNT, 5000000); // 50L
    const [interestRate, setInterestRate] = useLocalStorage<number>(STORAGE_KEYS.EMI_INTEREST_RATE, 8.5);
    const [tenureYears, setTenureYears] = useLocalStorage<number>(STORAGE_KEYS.EMI_TENURE, 20);

    const [isPrepaymentEnabled, setIsPrepaymentEnabled] = useLocalStorage<boolean>(STORAGE_KEYS.EMI_PREPAYMENT_ENABLED, false);
    const [prepaymentAmount, setPrepaymentAmount] = useLocalStorage<number>(STORAGE_KEYS.EMI_PREPAYMENT_AMOUNT, 5000);
    const [prepaymentFrequency, setPrepaymentFrequency] = useLocalStorage<'monthly' | 'quarterly' | 'yearly'>(STORAGE_KEYS.EMI_PREPAYMENT_FREQUENCY, 'monthly');

    // --- Logic ---
    const calculateRegularEMI = (p: number, r: number, n: number) => {
        const monthlyRate = r / 12 / 100;
        return (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    };

    const regularEMI = useMemo(() => {
        const months = tenureYears * 12;
        if (loanAmount === 0 || interestRate === 0) return 0;
        return calculateRegularEMI(loanAmount, interestRate, months);
    }, [loanAmount, interestRate, tenureYears]);

    const calculateSimulation = (
        principal: number,
        rate: number,
        tenureMonths: number,
        emi: number,
        extraPay: number,
        freq: 'monthly' | 'quarterly' | 'yearly'
    ): SimulationResult => {
        let balance = principal;
        let totalInterest = 0;
        let monthsElapsed = 0;
        const monthlyRate = rate / 12 / 100;

        while (balance > 1 && monthsElapsed < tenureMonths * 2) { // Safety break
            const interest = balance * monthlyRate;
            let principalComponent = emi - interest;

            // Add extra payment if frequency matches
            let extra = 0;
            if (extraPay > 0) {
                if (freq === 'monthly') extra = extraPay;
                else if (freq === 'quarterly' && (monthsElapsed + 1) % 3 === 0) extra = extraPay;
                else if (freq === 'yearly' && (monthsElapsed + 1) % 12 === 0) extra = extraPay;
            }

            // Adjust comparison if last payment
            if (principalComponent + extra > balance) {
                // Final payment adjustments
                // Logic to just pay what's left
                // But for simple calc:
                principalComponent = balance; // Pay off rest
                extra = 0;
            }

            balance = balance - (principalComponent + extra);
            totalInterest += interest;
            monthsElapsed++;

            if (balance <= 0) break;
        }

        return {
            totalInterest: Math.round(totalInterest),
            totalAmount: Math.round(principal + totalInterest),
            months: monthsElapsed
        };
    };

    const regularScenario = useMemo(() => {
        return calculateSimulation(loanAmount, interestRate, tenureYears * 12, regularEMI, 0, 'monthly');
    }, [loanAmount, interestRate, tenureYears, regularEMI]);

    const prepaymentScenario = useMemo(() => {
        if (!isPrepaymentEnabled) return regularScenario;
        return calculateSimulation(loanAmount, interestRate, tenureYears * 12, regularEMI, prepaymentAmount, prepaymentFrequency);
    }, [loanAmount, interestRate, tenureYears, regularEMI, isPrepaymentEnabled, prepaymentAmount, prepaymentFrequency, regularScenario]);

    const savings = useMemo(() => {
        return {
            money: regularScenario.totalAmount - prepaymentScenario.totalAmount,
            timeMonths: regularScenario.months - prepaymentScenario.months
        };
    }, [regularScenario, prepaymentScenario]);

    // --- Chart Data ---
    const chartData = [
        {
            name: 'Regular Loan',
            Principal: loanAmount,
            Interest: regularScenario.totalInterest,
            amt: regularScenario.totalAmount
        },
        {
            name: 'With Prepayment',
            Principal: loanAmount,
            Interest: prepaymentScenario.totalInterest,
            amt: prepaymentScenario.totalAmount
        }
    ];

    // --- Helpers ---
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    const formatTimeSaved = (months: number) => {
        const yrs = Math.floor(months / 12);
        const m = months % 12;
        if (yrs > 0 && m > 0) return `${yrs} Years & ${m} Months`;
        if (yrs > 0) return `${yrs} Years`;
        return `${m} Months`;
    };

    const InputControl = ({
        label,
        value,
        setValue,
        min,
        max,
        step,
        icon: Icon,
        suffix,
        bgClass = "bg-gray-100"
    }: {
        label: string,
        value: number,
        setValue: (v: number) => void,
        min: number,
        max: number,
        step: number,
        icon: any,
        suffix?: string,
        bgClass?: string
    }) => (
        <div className={`p-4 rounded-xl ${bgClass} mb-4`}>
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Icon className="w-4 h-4 text-blue-500" />
                    {label}
                </label>
                <div className="flex items-center bg-white dark:bg-gray-800 rounded-md px-3 py-1 border border-gray-200 dark:border-gray-600">
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val >= 0) setValue(val);
                        }}
                        className="w-24 text-right bg-transparent border-none focus:ring-0 text-sm font-semibold text-gray-900 dark:text-white p-0"
                    />
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">{suffix}</span>
                </div>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                onMouseUp={() => trackSliderInteraction('EMI Calculator')}
                onTouchEnd={() => trackSliderInteraction('EMI Calculator')}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
            />
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <SEO
                title="Loan EMI Calculator with Prepayment Analysis | Stable Money"
                description="Calculate your Home Loan, Car Loan, or Personal Loan EMI. Analyze the impact of prepayments on your tenure and interest savings."
                keywords="EMI calculator, loan calculator, home loan EMI, prepayment calculator"
                canonical="https://stablemoney.com/emi-calculator"
                schema={schema}
            />
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-transparent dark:from-indigo-900/20">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Calculator className="w-6 h-6 text-indigo-600" />
                    Smart Loan & Prepayment Calculator
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    See how small prepayments can save you lakhs in interest.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Left Panel: Inputs */}
                <div className="lg:col-span-4 p-6 border-r border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <InputControl
                        label="Loan Amount"
                        value={loanAmount}
                        setValue={setLoanAmount}
                        min={100000} max={10000000} step={100000}
                        icon={IndianRupee}
                        suffix="₹"
                        bgClass="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
                    />
                    <InputControl
                        label="Interest Rate"
                        value={interestRate}
                        setValue={setInterestRate}
                        min={1} max={20} step={0.1}
                        icon={Percent}
                        suffix="%"
                        bgClass="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
                    />
                    <InputControl
                        label="Tenure"
                        value={tenureYears}
                        setValue={setTenureYears}
                        min={1} max={30} step={1}
                        icon={Calendar}
                        suffix="Yrs"
                        bgClass="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700"
                    />

                    {/* Prepayment Section */}
                    <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-5 border border-indigo-100 dark:border-indigo-800">
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-indigo-600" />
                                Make Prepayments?
                            </label>
                            <div
                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${isPrepaymentEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}
                                onClick={() => setIsPrepaymentEnabled(!isPrepaymentEnabled)}
                            >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isPrepaymentEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </div>

                        {isPrepaymentEnabled && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Extra Payment Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                                        <input
                                            type="number"
                                            value={prepaymentAmount}
                                            onChange={(e) => setPrepaymentAmount(Number(e.target.value))}
                                            className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Frequency</label>
                                    <select
                                        value={prepaymentFrequency}
                                        onChange={(e) => setPrepaymentFrequency(e.target.value as any)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                    >
                                        <option value="monthly">Monthly</option>
                                        <option value="quarterly">Quarterly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Results */}
                <div className="lg:col-span-8 p-6 lg:p-8 space-y-8">

                    {/* Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-200 dark:border-gray-600">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Estimated Monthly EMI</p>
                            <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{formatCurrency(Math.round(regularEMI))}</p>
                        </div>
                        {isPrepaymentEnabled ? (
                            <>
                                <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border border-green-200 dark:border-green-800">
                                    <p className="text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> Total Savings
                                    </p>
                                    <p className="text-2xl font-extrabold text-green-700 dark:text-green-400 mt-1">{formatCurrency(savings.money)}</p>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800">
                                    <p className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> Time Saved
                                    </p>
                                    <p className="text-2xl font-extrabold text-blue-700 dark:text-blue-400 mt-1">{formatTimeSaved(savings.timeMonths)}</p>
                                </div>
                            </>
                        ) : (
                            <div className="col-span-2 bg-indigo-50 dark:bg-indigo-900/10 border border-dashed border-indigo-200 dark:border-indigo-800 p-5 rounded-xl flex items-center justify-center text-center">
                                <div>
                                    <AlertCircle className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                                    <p className="text-sm text-indigo-600 dark:text-indigo-300 font-medium">Enable Prepayment to calculate potential savings!</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 h-80 relative">
                        <p className="text-sm font-semibold text-gray-500 mb-4">Total Amount Payable Comparison</p>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                barSize={40}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.1} />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={(value: any) => formatCurrency(Number(value))}
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1f2937', color: '#fff' }}
                                />
                                <Legend />
                                <Bar dataKey="Principal" stackId="a" fill="#94a3b8" />
                                <Bar dataKey="Interest" stackId="a" fill="#6366f1" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-slate-400 rounded-sm"></div>
                            <span>Principal Amount</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-indigo-500 rounded-sm"></div>
                            <span>Interest Payable</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
