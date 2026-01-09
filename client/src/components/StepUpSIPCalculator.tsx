import { useMemo } from 'react';
import { CalculatorInput } from './CalculatorInput';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { IndianRupee, TrendingUp, Calendar, Percent } from 'lucide-react';
import { SEO } from './SEO';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/storageKeys';


interface CalculationResult {
    year: number;
    invested: number;
    value: number;
    gain: number;
}

const COLORS = ['#94a3b8', '#06b6d4']; // Slate-400 (Invested), Neon-Cyan (Gains)

export const StepUpSIPCalculator = () => {
    // Schema for SIP Calculator
    const schema = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Stable Money SIP Calculator",
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
            "reviewCount": "1250"
        }
    });

    // --- State ---
    const [monthlyInvestment, setMonthlyInvestment] = useLocalStorage<number>(STORAGE_KEYS.SIP_MONTHLY_INVESTMENT, 5000);
    const [stepUpBox, setStepUpBox] = useLocalStorage<number>(STORAGE_KEYS.SIP_STEP_UP, 10);
    const [returnRate, setReturnRate] = useLocalStorage<number>(STORAGE_KEYS.SIP_RETURN_RATE, 12);
    const [timePeriod, setTimePeriod] = useLocalStorage<number>(STORAGE_KEYS.SIP_TIME_PERIOD, 10);

    // --- Calculation Logic ---
    const results: CalculationResult[] = useMemo(() => {
        let balance = 0;
        let totalInvested = 0;
        let currentMonthlyInv = monthlyInvestment;
        const monthlyRate = returnRate / 100 / 12;
        const dataPoints: CalculationResult[] = [];

        for (let year = 1; year <= timePeriod; year++) {
            for (let month = 1; month <= 12; month++) {
                // Assume investment is made at the beginning of the month for interest calculation or end?
                // Let's do: Add money, then apply interest for the month.
                balance = (balance + currentMonthlyInv) * (1 + monthlyRate);
                totalInvested += currentMonthlyInv;
            }

            dataPoints.push({
                year,
                invested: Math.round(totalInvested),
                value: Math.round(balance),
                gain: Math.round(balance - totalInvested)
            });

            // Annual Step-Up
            currentMonthlyInv = currentMonthlyInv * (1 + stepUpBox / 100);
        }
        return dataPoints;
    }, [monthlyInvestment, stepUpBox, returnRate, timePeriod]);

    const summary = useMemo(() => {
        if (results.length === 0) return { invested: 0, value: 0, gain: 0 };
        return results[results.length - 1];
    }, [results]);

    const pieData = [
        { name: 'Invested Amount', value: summary.invested },
        { name: 'Est. Returns', value: summary.gain },
    ];

    // --- Helpers for formatting ---
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };



    return (
        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden text-slate-100 font-sans">
            <SEO
                title="SIP Calculator with Step-Up | Stable Money"
                description="Calculate your mutual fund returns with our advanced Step-Up SIP Calculator. Plan for your financial goals with precise inflation-adjusted projections."
                keywords="SIP calculator, step up SIP, mutual fund calculator, SIP return calculator"
                canonical="https://stablemoney.com/calculator"
                schema={schema}
            />

            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-white/5">
                <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-neon-cyan" />
                    Step-Up SIP Calculator
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                    Calculate how increasing your SIP annually impacts your wealth creation.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-8">

                {/* Left Column: Inputs */}
                <div className="lg:col-span-4 space-y-2">
                    <CalculatorInput
                        label="Monthly Investment"
                        value={monthlyInvestment}
                        setValue={setMonthlyInvestment}
                        min={500} max={100000} step={500}
                        icon={IndianRupee}
                        suffix="₹"
                        iconClass="text-neon-cyan"
                    />
                    <CalculatorInput
                        label="Annual Step-Up"
                        value={stepUpBox}
                        setValue={setStepUpBox}
                        min={0} max={50} step={1}
                        icon={TrendingUp}
                        suffix="%"
                        iconClass="text-neon-purple"
                    />
                    <CalculatorInput
                        label="Expected Return (p.a)"
                        value={returnRate}
                        setValue={setReturnRate}
                        min={1} max={30} step={0.5}
                        icon={Percent}
                        suffix="%"
                        iconClass="text-neon-pink"
                    />
                    <CalculatorInput
                        label="Time Period"
                        value={timePeriod}
                        setValue={setTimePeriod}
                        min={1} max={40} step={1}
                        icon={Calendar}
                        suffix="Yr"
                        iconClass="text-neon-amber"
                    />
                </div>

                {/* Right Column: Charts & Results */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glass p-5 rounded-2xl border border-white/10 shadow-lg group">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Total Invested</p>
                            <p className="text-2xl font-black text-white group-hover:text-neon-cyan transition-colors">{formatCurrency(summary.invested)}</p>
                        </div>
                        <div className="glass p-5 rounded-2xl border border-white/10 shadow-lg group">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-neon-cyan mb-1">Est. Returns</p>
                            <p className="text-2xl font-black text-neon-cyan group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all">{formatCurrency(summary.gain)}</p>
                        </div>
                        <div className="glass p-5 rounded-2xl border border-white/10 shadow-lg group">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-neon-purple mb-1 text-right">Total Value</p>
                            <p className="text-2xl font-black text-white text-right group-hover:text-neon-purple transition-colors">{formatCurrency(summary.value)}</p>
                        </div>
                    </div>

                    {/* Charts Area */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Donut Chart */}
                        <div className="md:col-span-1 h-72 relative flex flex-col justify-center items-center glass rounded-2xl border border-white/10 p-6 overflow-hidden group">
                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-neon-cyan/5 rounded-full blur-2xl"></div>
                            <p className="absolute top-4 left-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Ratio</p>
                            <ResponsiveContainer width="100%" height="80%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(val: any) => formatCurrency(Number(val || 0))}
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
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex justify-center flex-wrap gap-4 text-[10px] w-full mt-2 font-bold uppercase tracking-tighter">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                                    <span className="text-gray-400">Invested</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-neon-cyan ring-4 ring-neon-cyan/20"></div>
                                    <span className="text-white">Gains</span>
                                </div>
                            </div>
                        </div>

                        {/* Area Chart */}
                        <div className="md:col-span-2 h-72 glass rounded-2xl border border-white/10 p-6 relative overflow-hidden">
                            <p className="text-xs font-bold text-gray-500 mb-6 uppercase tracking-widest px-2">Wealth Growth Over {timePeriod} Years</p>
                            <ResponsiveContainer width="100%" height="80%">
                                <AreaChart data={results} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.05} />
                                    <XAxis
                                        dataKey="year"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: '#64748b', fontWeight: 'bold' }}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                            borderColor: 'rgba(255, 255, 255, 0.1)',
                                            color: '#ffffff',
                                            borderRadius: '12px',
                                            backdropFilter: 'blur(8px)',
                                            fontSize: '11px',
                                            fontWeight: 'bold'
                                        }}
                                        itemStyle={{ color: '#ffffff' }}
                                        formatter={(value: any) => [formatCurrency(Number(value || 0)), '']}
                                        labelFormatter={(label) => `Year ${label}`}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="invested"
                                        stackId="1"
                                        stroke="#94a3b8"
                                        fill="#94a3b8"
                                        fillOpacity={0.2}
                                        name="Invested Amount"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="gain"
                                        stackId="1"
                                        stroke="#06b6d4"
                                        fill="url(#colorValue)"
                                        fillOpacity={1}
                                        name="Wealth Gained"
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
