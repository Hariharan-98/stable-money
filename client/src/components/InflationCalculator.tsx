import { useState, useMemo } from 'react';
import { CalculatorInput } from './CalculatorInput';
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



    return (
        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden text-slate-100 font-sans">
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-white/5">
                <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                    <TrendingDown className="w-6 h-6 text-neon-orange" />
                    Purchasing Power Erosion
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                    Visualize the silent thief stealing your money's value over time.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Inputs */}
                <div className="lg:col-span-4 p-6 border-r border-white/10 bg-white/5">
                    <CalculatorInput
                        label="Initial Amount"
                        value={initialAmount}
                        setValue={setInitialAmount}
                        min={1000} max={1000000} step={1000}
                        icon={IndianRupee}
                        iconClass="text-neon-cyan"
                    />
                    <CalculatorInput
                        label="Inflation Rate"
                        value={inflationRate}
                        setValue={setInflationRate}
                        min={1} max={20} step={0.5}
                        icon={TrendingDown}
                        suffix="%"
                        iconClass="text-neon-orange"
                    />
                    <CalculatorInput
                        label="Time Period"
                        value={years}
                        setValue={setYears}
                        min={1} max={50} step={1}
                        icon={Calendar}
                        suffix="Years"
                        iconClass="text-neon-amber"
                    />

                    <div className="mt-8 glass rounded-2xl p-5 border border-white/10 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-neon-orange/50"></div>
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-neon-orange shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                At <span className="text-white font-bold">{inflationRate}%</span> inflation, prices double roughly every <span className="text-white font-bold">{Math.round(72 / inflationRate)} years</span>.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="lg:col-span-8 p-6 lg:p-8 space-y-8">

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-orange/5 rounded-full blur-[100px] -mr-16 -mt-16 group-hover:opacity-100 opacity-60 transition-opacity"></div>

                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8">Erosion Reality</p>

                            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 relative z-10">
                                <div>
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Today's Value</p>
                                    <p className="text-3xl font-display font-black text-white">{formatCurrency(initialAmount)}</p>
                                </div>

                                <div className="hidden md:flex bg-white/5 p-3 rounded-full border border-white/5">
                                    <ArrowRight className="w-6 h-6 text-neon-orange" />
                                </div>

                                <div>
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">In {years} years, it buys</p>
                                    <p className="text-5xl font-display font-black text-neon-orange drop-shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all group-hover:drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]">{formatCurrency(finalValue)}</p>
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap items-center gap-4 relative z-10">
                                <span className="bg-neon-orange/10 text-neon-orange px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-neon-orange/20">{percentageLost.toFixed(1)}% Value Erosion</span>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Loss: {formatCurrency(valueLost)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="h-80 w-full glass rounded-3xl p-6 border border-white/10 relative overflow-hidden">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 px-2">Purchasing Power Decay</p>
                        <ResponsiveContainer width="100%" height="80%">
                            <ComposedChart data={results} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.05} />
                                <XAxis
                                    dataKey="year"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 'bold' }}
                                    tickCount={5}
                                />
                                <YAxis
                                    hide
                                    domain={['dataMin', 'dataMax']}
                                />
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
                                    itemStyle={{ color: '#f97316' }}
                                    formatter={(val: any) => [formatCurrency(Number(val)), 'Power']}
                                    labelFormatter={(label) => `Year ${label}`}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#f97316"
                                    strokeWidth={4}
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
