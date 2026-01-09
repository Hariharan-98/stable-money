import { useMemo } from 'react';
import { CalculatorInput } from './CalculatorInput';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { IndianRupee, Percent, Calendar, Calculator, CheckCircle, AlertCircle } from 'lucide-react';
import { SEO } from './SEO';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';


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



    return (
        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden text-slate-100 font-sans">
            <SEO
                title="Loan EMI Calculator with Prepayment Analysis | Stable Money"
                description="Calculate your Home Loan, Car Loan, or Personal Loan EMI. Analyze the impact of prepayments on your tenure and interest savings."
                keywords="EMI calculator, loan calculator, home loan EMI, prepayment calculator"
                canonical="https://stablemoney.com/emi-calculator"
                schema={schema}
            />
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-white/5">
                <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                    <Calculator className="w-6 h-6 text-neon-cyan" />
                    Loan EMI & Savings Planner
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                    Visualize how small prepayments slash your loan tenure and interest.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Left Panel: Inputs */}
                <div className="lg:col-span-4 p-6 border-r border-white/10 bg-white/5">
                    <CalculatorInput
                        label="Loan Amount"
                        value={loanAmount}
                        setValue={setLoanAmount}
                        min={100000} max={10000000} step={100000}
                        icon={IndianRupee}
                        suffix="₹"
                        iconClass="text-neon-cyan"
                    />
                    <CalculatorInput
                        label="Interest Rate"
                        value={interestRate}
                        setValue={setInterestRate}
                        min={1} max={20} step={0.1}
                        icon={Percent}
                        suffix="%"
                        iconClass="text-neon-purple"
                    />
                    <CalculatorInput
                        label="Tenure"
                        value={tenureYears}
                        setValue={setTenureYears}
                        min={1} max={30} step={1}
                        icon={Calendar}
                        suffix="Yrs"
                        iconClass="text-neon-amber"
                    />

                    {/* Prepayment Section */}
                    <div className="mt-8 glass rounded-2xl p-6 border border-white/10 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan/50"></div>
                        <div className="flex items-center justify-between mb-6">
                            <label className="text-sm font-bold text-white flex items-center gap-2">
                                <CheckCircle className={`w-4 h-4 ${isPrepaymentEnabled ? 'text-neon-cyan' : 'text-gray-500'}`} />
                                Smart Prepayments
                            </label>
                            <div
                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 ring-4 ${isPrepaymentEnabled ? 'bg-neon-cyan ring-neon-cyan/20' : 'bg-gray-700 ring-transparent'}`}
                                onClick={() => setIsPrepaymentEnabled(!isPrepaymentEnabled)}
                            >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-lg transform transition-transform duration-300 ${isPrepaymentEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </div>

                        {isPrepaymentEnabled && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Extra Payment</label>
                                    <div className="relative group/input">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-cyan font-bold tracking-tight">₹</span>
                                        <input
                                            type="number"
                                            value={prepaymentAmount}
                                            onChange={(e) => setPrepaymentAmount(Number(e.target.value))}
                                            className="w-full pl-8 pr-4 py-3 rounded-xl border border-white/20 bg-white/5 focus:ring-2 focus:ring-neon-cyan outline-none text-sm font-bold text-white transition-all group-hover/input:bg-white/10"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Frequency</label>
                                    <select
                                        value={prepaymentFrequency}
                                        onChange={(e) => setPrepaymentFrequency(e.target.value as any)}
                                        className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/5 focus:ring-2 focus:ring-neon-cyan outline-none text-sm font-bold text-white transition-all hover:bg-white/10"
                                    >
                                        <option value="monthly" className="bg-slate-900">Monthly</option>
                                        <option value="quarterly" className="bg-slate-900">Quarterly</option>
                                        <option value="yearly" className="bg-slate-900">Yearly</option>
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
                        <div className="glass p-5 rounded-2xl border border-white/10 shadow-lg group">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Monthly EMI</p>
                            <p className="text-2xl font-black text-white group-hover:text-neon-cyan transition-colors">{formatCurrency(Math.round(regularEMI))}</p>
                        </div>
                        {isPrepaymentEnabled ? (
                            <>
                                <div className="glass p-5 rounded-2xl border border-white/10 shadow-lg group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-neon-cyan/5 rounded-full blur-xl"></div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-neon-cyan mb-1 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> Total Savings
                                    </p>
                                    <p className="text-2xl font-black text-neon-cyan group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.4)] transition-all">{formatCurrency(savings.money)}</p>
                                </div>
                                <div className="glass p-5 rounded-2xl border border-white/10 shadow-lg group text-right">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-neon-purple mb-1 flex items-center justify-end gap-1">
                                        <Calendar className="w-3 h-3" /> Time Saved
                                    </p>
                                    <p className="text-2xl font-black text-white group-hover:text-neon-purple transition-colors">{formatTimeSaved(savings.timeMonths)}</p>
                                </div>
                            </>
                        ) : (
                            <div className="col-span-2 glass border border-dashed border-white/20 p-5 rounded-2xl flex items-center justify-center text-center group hover:border-neon-cyan/40 transition-all">
                                <div className="animate-pulse group-hover:animate-none">
                                    <AlertCircle className="w-6 h-6 text-neon-cyan/40 mx-auto mb-2 group-hover:text-neon-cyan transition-colors" />
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest group-hover:text-gray-300 transition-colors">Apply Smart Prepayments to see Savings</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chart */}
                    <div className="glass rounded-2xl p-6 h-80 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan to-neon-purple opacity-30"></div>
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">Total Amount Comparison</p>
                            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-tighter">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-sm bg-slate-500"></div>
                                    <span className="text-gray-500">Principal</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-sm bg-neon-purple ring-4 ring-neon-purple/20"></div>
                                    <span className="text-white">Interest</span>
                                </div>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height="80%">
                            <BarChart
                                data={chartData}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                barSize={32}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#ffffff" opacity={0.05} />
                                <XAxis type="number" hide />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={110}
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    formatter={(value: any) => formatCurrency(Number(value))}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        borderColor: 'rgba(255, 255, 255, 0.1)',
                                        color: '#ffffff',
                                        borderRadius: '12px',
                                        backdropFilter: 'blur(8px)',
                                        fontSize: '11px',
                                        fontWeight: 'bold'
                                    }}
                                />
                                <Bar dataKey="Principal" stackId="a" fill="#475569" radius={0} />
                                <Bar dataKey="Interest" stackId="a" fill="#a855f7" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </div>
        </div>
    );
};
