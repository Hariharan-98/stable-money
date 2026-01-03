import { useState, useMemo } from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    ComposedChart
} from 'recharts';
import { IndianRupee, TrendingDown, Calendar, AlertTriangle, ArrowRight } from 'lucide-react';
import { trackSliderInteraction } from '../utils/analytics';

interface ErosionPoint {
    year: number;
    value: number;
    loss: number;
}

export const InflationCalculator = () => {
    const [initialAmount, setInitialAmount] = useState<number>(10000); // 10k
    const [inflationRate, setInflationRate] = useState<number>(6); // 6%
    const [years, setYears] = useState<number>(10); // 10 years

    const calculateErosion = (amount: number, rate: number, yrs: number) => {
        const data: ErosionPoint[] = [];
        const r = rate / 100;

        for (let i = 0; i <= yrs; i++) {
            const futureValue = amount / Math.pow(1 + r, i);
            data.push({
                year: i,
                value: Math.round(futureValue),
                loss: Math.round(amount - futureValue)
            });
        }
        return data;
    };

    const results = useMemo(() => {
        return calculateErosion(initialAmount, inflationRate, years);
    }, [initialAmount, inflationRate, years]);

    const finalValue = results[results.length - 1].value;
    const valueLost = initialAmount - finalValue;
    const percentageLost = (valueLost / initialAmount) * 100;

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
        suffix,
        colorClass = "text-blue-500"
    }: any) => (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${colorClass}`} />
                    {label}
                </label>
                <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg font-mono text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {value}{suffix && <span className="text-xs ml-1 text-gray-500">{suffix}</span>}
                </div>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                onMouseUp={() => trackSliderInteraction('Inflation Calculator')}
                onTouchEnd={() => trackSliderInteraction('Inflation Calculator')}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-orange-500"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-900/20">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <TrendingDown className="w-6 h-6 text-orange-600" />
                    Inflation Calculator
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    See how the silent thief steals your money's value over time.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Inputs */}
                <div className="lg:col-span-4 p-6 border-r border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <InputControl
                        label="Initial Amount"
                        value={initialAmount}
                        setValue={setInitialAmount}
                        min={1000} max={1000000} step={1000}
                        icon={IndianRupee}
                        colorClass="text-green-600"
                    />
                    <InputControl
                        label="Annual Inflation Rate"
                        value={inflationRate}
                        setValue={setInflationRate}
                        min={1} max={20} step={0.5}
                        icon={TrendingDown}
                        suffix="%"
                        colorClass="text-orange-600"
                    />
                    <InputControl
                        label="Time Period"
                        value={years}
                        setValue={setYears}
                        min={1} max={50} step={1}
                        icon={Calendar}
                        suffix="Years"
                        colorClass="text-blue-600"
                    />

                    <div className="mt-8 bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-100 dark:border-orange-800">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-orange-800 dark:text-orange-200 leading-relaxed">
                                At <strong>{inflationRate}%</strong> inflation, prices double roughly every <strong>{Math.round(72 / inflationRate)} years</strong>. Your money buys less and less.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="lg:col-span-8 p-6 lg:p-8 space-y-8">

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-gray-900 text-white rounded-xl p-6 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>

                            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">Purchasing Power Reality</h3>

                            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Today you have</p>
                                    <p className="text-2xl font-bold">{formatCurrency(initialAmount)}</p>
                                </div>

                                <ArrowRight className="hidden md:block w-8 h-8 text-orange-500 opacity-50" />

                                <div>
                                    <p className="text-gray-400 text-sm mb-1">In {years} years, it feels like</p>
                                    <p className="text-4xl font-extrabold text-orange-400">{formatCurrency(finalValue)}</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-2">
                                <span className="text-orange-400 font-bold">{percentageLost.toFixed(1)}% Lost</span>
                                <span className="text-gray-500">•</span>
                                <span className="text-gray-400">That's {formatCurrency(valueLost)} gone due to inflation.</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="h-80 w-full">
                        <p className="text-sm font-semibold text-gray-500 mb-4">Purchasing Power Erosion Curve</p>
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={results} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                <XAxis
                                    dataKey="year"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                    tickCount={5}
                                />
                                <YAxis
                                    hide
                                    domain={['dataMin', 'dataMax']}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1f2937', color: '#fff' }}
                                    formatter={(val: any) => [formatCurrency(Number(val)), 'Purchasing Power']}
                                    labelFormatter={(label) => `Year ${label}`}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#f97316"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </div>
        </div>
    );
};
