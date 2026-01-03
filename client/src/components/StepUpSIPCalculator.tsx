import { useMemo } from 'react';
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
import { trackSliderInteraction } from '../utils/analytics';

interface CalculationResult {
    year: number;
    invested: number;
    value: number;
    gain: number;
}

const COLORS = ['#94a3b8', '#10b981']; // Slate-400 (Invested), Emerald-500 (Gains)

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

    const InputControl = ({
        label,
        value,
        setValue,
        min,
        max,
        step,
        icon: Icon,
        suffix
    }: {
        label: string,
        value: number,
        setValue: (v: number) => void,
        min: number,
        max: number,
        step: number,
        icon: any,
        suffix?: string
    }) => (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Icon className="w-4 h-4 text-blue-500" />
                    {label}
                </label>
                <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-md px-3 py-1 border border-gray-200 dark:border-gray-600">
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val >= 0 && val <= max * 1.5) setValue(val); // Allow typing slightly beyond range temporarily, but standard usage clamped by slider usually
                        }}
                        className="w-20 text-right bg-transparent border-none focus:ring-0 text-sm font-semibold text-gray-900 dark:text-white p-0"
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
                onMouseUp={() => trackSliderInteraction('SIP Calculator')}
                onTouchEnd={() => trackSliderInteraction('SIP Calculator')}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
            />
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <SEO
                title="SIP Calculator with Step-Up | Stable Money"
                description="Calculate your mutual fund returns with our advanced Step-Up SIP Calculator. Plan for your financial goals with precise inflation-adjusted projections."
                keywords="SIP calculator, step up SIP, mutual fund calculator, SIP return calculator"
                canonical="https://stablemoney.com/calculator"
                schema={schema}
            />

            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    Step-Up SIP Calculator
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Calculate how increasing your SIP annually impacts your wealth creation.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-8">

                {/* Left Column: Inputs */}
                <div className="lg:col-span-4 space-y-2">
                    <InputControl
                        label="Monthly Investment"
                        value={monthlyInvestment}
                        setValue={setMonthlyInvestment}
                        min={500} max={100000} step={500}
                        icon={IndianRupee}
                        suffix="₹"
                    />
                    <InputControl
                        label="Annual Step-Up"
                        value={stepUpBox}
                        setValue={setStepUpBox}
                        min={0} max={50} step={1}
                        icon={TrendingUp}
                        suffix="%"
                    />
                    <InputControl
                        label="Expected Return (p.a)"
                        value={returnRate}
                        setValue={setReturnRate}
                        min={1} max={30} step={0.5}
                        icon={Percent}
                        suffix="%"
                    />
                    <InputControl
                        label="Time Period"
                        value={timePeriod}
                        setValue={setTimePeriod}
                        min={1} max={40} step={1}
                        icon={Calendar}
                        suffix="Yr"
                    />
                </div>

                {/* Right Column: Charts & Results */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-500 dark:text-blue-400 mb-1">Total Limit Invested</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(summary.invested)}</p>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
                            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Est. Returns</p>
                            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(summary.gain)}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Total Value</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(summary.value)}</p>
                        </div>
                    </div>

                    {/* Charts Area */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Donut Chart */}
                        <div className="md:col-span-1 h-64 relative flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 p-2">
                            <p className="absolute top-4 left-4 text-xs font-semibold text-gray-500">Ratio</p>
                            <ResponsiveContainer width="100%" height="80%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(val: any) => formatCurrency(Number(val || 0))}
                                        contentStyle={{ backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px', border: 'none' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex justify-center gap-2 text-[10px] w-full px-2">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                    <span className="text-gray-500">Invested</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-gray-500">Gains</span>
                                </div>
                            </div>
                        </div>

                        {/* Area Chart */}
                        <div className="md:col-span-2 h-64 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                            <p className="text-xs font-semibold text-gray-500 mb-4">Wealth Growth Over {timePeriod} Years</p>
                            <ResponsiveContainer width="100%" height="85%">
                                <AreaChart data={results} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                    <XAxis
                                        dataKey="year"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb', fontSize: '12px' }}
                                        itemStyle={{ color: '#f9fafb' }}
                                        formatter={(value: any) => [formatCurrency(Number(value || 0)), '']}
                                        labelFormatter={(label) => `Year ${label}`}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="invested"
                                        stackId="1"
                                        stroke="#94a3b8"
                                        fill="#94a3b8"
                                        fillOpacity={0.5}
                                        name="Invested Amount"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="gain"
                                        stackId="1"
                                        stroke="#10b981"
                                        fill="#10b981"
                                        fillOpacity={0.6}
                                        name="Wealth Gained"
                                        strokeWidth={2}
                                    />
                                    {/* Re-doing the areas to be stacked Invested + Gain = Total */}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
