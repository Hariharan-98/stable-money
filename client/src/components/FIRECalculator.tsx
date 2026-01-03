import { useState, useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { IndianRupee, Flame, TrendingUp, Calendar, Target, ShieldCheck } from 'lucide-react';
import { trackSliderInteraction } from '../utils/analytics';

export const FIRECalculator = () => {
    // --- Inputs ---
    const [currentAge, setCurrentAge] = useState<number>(25);
    const [monthlyExpenses, setMonthlyExpenses] = useState<number>(50000);
    const [currentSavings, setCurrentSavings] = useState<number>(500000);

    const [monthlyInvestment, setMonthlyInvestment] = useState<number>(20000);
    const [stepUpSIP, setStepUpSIP] = useState<number>(10); // % increase annually

    const [returnRate, setReturnRate] = useState<number>(12); // %
    const [inflationRate, setInflationRate] = useState<number>(6); // %

    const [fireType, setFireType] = useState<'lean' | 'standard' | 'fat'>('standard');

    // --- Logic ---
    const formatCurrency = (val: number) => {
        if (Math.abs(val) >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
        if (Math.abs(val) >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    };

    const simulation = useMemo(() => {
        const fireMultiplier = fireType === 'lean' ? 0.8 : fireType === 'fat' ? 2 : 1;
        const maxAge = 80;
        const yearsToProject = maxAge - currentAge;

        const annualExpensesCurrent = monthlyExpenses * 12 * fireMultiplier;
        const targetCorpusMultiple = 25; // 4% rule (100 / 4 = 25)

        const data = [];
        let wealth = currentSavings;
        let sip = monthlyInvestment;
        let fireAchievedAge = null;
        let fireCorpusNeed = 0;

        for (let i = 0; i <= yearsToProject; i++) {
            const year = i;
            const age = currentAge + i;

            // 1. Calculate Inflation Adjusted FIRE Target for this year
            // "If I retire NOW (at this age), I need this much."
            const expensesAtThisAge = annualExpensesCurrent * Math.pow(1 + inflationRate / 100, year);
            const targetCorpus = expensesAtThisAge * targetCorpusMultiple;

            // 2. Add data point
            data.push({
                age,
                year,
                wealth: Math.round(wealth),
                target: Math.round(targetCorpus),
                expenses: Math.round(expensesAtThisAge) // for tooltip
            });

            // Check if FIRE achieved
            if (fireAchievedAge === null && wealth >= targetCorpus) {
                fireAchievedAge = age;
                fireCorpusNeed = targetCorpus;
            }

            // 3. Grow Wealth for next year
            // Simple annual compounding for speed, monthly is better but this is sufficient for projection
            const annualInvestment = sip * 12;
            const interest = (wealth + annualInvestment) * (returnRate / 100);
            wealth = wealth + annualInvestment + interest;

            // Step up SIP
            sip = sip * (1 + stepUpSIP / 100);
        }

        return {
            data,
            fireAchievedAge,
            fireCorpusNeed,
            finalWealth: wealth
        };

    }, [currentAge, monthlyExpenses, currentSavings, monthlyInvestment, stepUpSIP, returnRate, inflationRate, fireType]);

    const { data, fireAchievedAge, fireCorpusNeed } = simulation;
    const yearsToFreedom = fireAchievedAge ? fireAchievedAge - currentAge : null;

    // Calculate "Years of Freedom" currently saved (Burn Rate)
    const currentAnnualExpenses = monthlyExpenses * 12 * (fireType === 'lean' ? 0.8 : fireType === 'fat' ? 2 : 1);
    const currentFreedomYears = (currentSavings / currentAnnualExpenses).toFixed(1);

    const InputControl = ({ label, value, setValue, min, max, step, suffix, icon: Icon }: any) => (
        <div className="mb-5">
            <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    {Icon && <Icon className="w-3 h-3 text-amber-500" />}
                    {label}
                </label>
                <div className="text-sm font-bold text-slate-200">
                    {typeof value === 'number' && !suffix?.includes('Years') && !suffix?.includes('%') && min > 100 ? formatCurrency(value) : value} {suffix}
                </div>
            </div>
            <input
                type="range"
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                onMouseUp={() => trackSliderInteraction('FIRE Calculator')}
                onTouchEnd={() => trackSliderInteraction('FIRE Calculator')}
            />
        </div>
    );

    return (
        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden text-slate-100 font-sans">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                        <Flame className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">FIRE Calculator</h2>
                        <p className="text-sm text-slate-400">Financial Independence, Retire Early</p>
                    </div>
                </div>

                {/* FIRE Type Toggle */}
                <div className="flex bg-slate-800 rounded-lg p-1">
                    {(['lean', 'standard', 'fat'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFireType(type)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${fireType === type
                                ? 'bg-amber-500 text-slate-900 shadow-lg'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)} FIRE
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Inputs */}
                <div className="lg:col-span-4 p-6 border-r border-slate-800 bg-slate-900/50 overflow-y-auto max-h-[800px] custom-scrollbar">

                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">Current Status</h3>
                        <InputControl label="Current Age" value={currentAge} setValue={setCurrentAge} min={18} max={60} step={1} suffix="Years" icon={Calendar} />
                        <InputControl label="Annual Inflation" value={inflationRate} setValue={setInflationRate} min={2} max={12} step={0.5} suffix="%" icon={TrendingUp} />
                        <InputControl label="Monthly Expenses" value={monthlyExpenses} setValue={setMonthlyExpenses} min={10000} max={500000} step={5000} icon={IndianRupee} />
                        <InputControl label="Current Savings" value={currentSavings} setValue={setCurrentSavings} min={0} max={10000000} step={50000} icon={ShieldCheck} />
                    </div>

                    <div className="mb-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 border-l-2 border-green-500 pl-2">Future Growth</h3>
                        <InputControl label="Monthly SIP" value={monthlyInvestment} setValue={setMonthlyInvestment} min={0} max={500000} step={1000} icon={Target} />
                        <InputControl label="Annual Step-Up" value={stepUpSIP} setValue={setStepUpSIP} min={0} max={20} step={1} suffix="%" icon={TrendingUp} />
                        <InputControl label="Expected Return" value={returnRate} setValue={setReturnRate} min={4} max={18} step={0.5} suffix="%" icon={TrendingUp} />
                    </div>
                </div>

                {/* Results */}
                <div className="lg:col-span-8 p-6 lg:p-8 space-y-8 bg-slate-800/20">

                    {/* Hero Status Card */}
                    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl overflow-hidden">
                        {/* Background glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

                        <div className="relative z-10">
                            {fireAchievedAge ? (
                                <>
                                    <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4 mb-2">
                                        <h3 className="text-sm font-medium text-amber-400 uppercase tracking-wider">Projected FIRE Age</h3>
                                        <span className="text-5xl font-extrabold text-white">{fireAchievedAge}</span>
                                        <span className="text-sm text-slate-400 mb-2">({yearsToFreedom} years from now)</span>
                                    </div>
                                    <div className="h-px bg-slate-700 my-4" />
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div>
                                            <p className="text-slate-400 text-xs mb-1">Estimated FIRE Corpus Needed</p>
                                            <p className="text-2xl font-bold text-white">{formatCurrency(fireCorpusNeed)}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-xs mb-1">Current Freedom Saved</p>
                                            <p className={`text-2xl font-bold ${Number(currentFreedomYears) > 5 ? 'text-green-400' : 'text-slate-200'}`}>
                                                {currentFreedomYears} Years
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-xl text-slate-300">Keep pushing! Adjust your investments to see when you can retire.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="h-96 w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-bold text-slate-400 uppercase">Wealth vs Freedom Target</h4>
                            <div className="flex gap-4 text-xs">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Projected Wealth</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> FIRE Target</span>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5} />
                                <XAxis
                                    dataKey="age"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    label={{ value: 'Age', position: 'insideBottomRight', offset: -5, fill: '#64748b' }}
                                />
                                <YAxis
                                    hide
                                    domain={['dataMin', 'auto']}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
                                    formatter={(val: any) => formatCurrency(Number(val))}
                                    labelFormatter={(age) => `Age ${age}`}
                                />
                                <Area
                                    type="monotone"
                                    name="Projected Wealth"
                                    dataKey="wealth"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fill="url(#colorWealth)"
                                />
                                <Area
                                    type="monotone"
                                    name="FIRE Target"
                                    dataKey="target"
                                    stroke="#f59e0b"
                                    strokeDasharray="5 5"
                                    strokeWidth={2}
                                    fill="url(#colorTarget)"
                                />
                                {fireAchievedAge && (
                                    <ReferenceLine x={fireAchievedAge} stroke="#fff" strokeDasharray="3 3" label={{ value: 'FIRE', position: 'top', fill: '#fbbf24', fontSize: 12 }} />
                                )}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </div>
        </div>
    );
};
