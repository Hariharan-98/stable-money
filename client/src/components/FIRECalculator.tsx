import { useState, useMemo } from 'react';
import { CalculatorInput } from './CalculatorInput';
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



    return (
        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden text-slate-100 font-sans">
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-neon-amber/10 rounded-xl">
                        <Flame className="w-6 h-6 text-neon-amber" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-display font-bold text-white tracking-tight">FIRE Planner</h2>
                        <p className="text-sm text-gray-400">Financial Independence, Retire Early</p>
                    </div>
                </div>

                {/* FIRE Type Toggle */}
                <div className="flex bg-black/40 backdrop-blur-md rounded-xl p-1 border border-white/10">
                    {(['lean', 'standard', 'fat'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFireType(type)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${fireType === type
                                ? 'bg-neon-amber text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                : 'text-gray-500 hover:text-white'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Inputs */}
                <div className="lg:col-span-4 p-6 border-r border-white/10 bg-white/5 overflow-y-auto max-h-[800px] custom-scrollbar">

                    <div className="mb-8">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 border-l-4 border-neon-amber pl-3">Current Status</h3>
                        <CalculatorInput label="Current Age" value={currentAge} setValue={setCurrentAge} min={18} max={60} step={1} suffix="Years" icon={Calendar} iconClass="text-neon-cyan" />
                        <CalculatorInput label="Annual Inflation" value={inflationRate} setValue={setInflationRate} min={2} max={12} step={0.5} suffix="%" icon={TrendingUp} iconClass="text-neon-orange" />
                        <CalculatorInput label="Monthly Expenses" value={monthlyExpenses} setValue={setMonthlyExpenses} min={10000} max={500000} step={5000} icon={IndianRupee} iconClass="text-neon-cyan" />
                        <CalculatorInput label="Current Savings" value={currentSavings} setValue={setCurrentSavings} min={0} max={10000000} step={50000} icon={ShieldCheck} iconClass="text-neon-green" />
                    </div>

                    <div className="mb-4">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 border-l-4 border-neon-green pl-3">Wealth Engine</h3>
                        <CalculatorInput label="Monthly SIP" value={monthlyInvestment} setValue={setMonthlyInvestment} min={0} max={500000} step={1000} icon={Target} iconClass="text-neon-purple" />
                        <CalculatorInput label="Annual Step-Up" value={stepUpSIP} setValue={setStepUpSIP} min={0} max={20} step={1} suffix="%" icon={TrendingUp} iconClass="text-neon-amber" />
                        <CalculatorInput label="Expected Return" value={returnRate} setValue={setReturnRate} min={4} max={18} step={0.5} suffix="%" icon={TrendingUp} iconClass="text-neon-green" />
                    </div>
                </div>

                {/* Results */}
                <div className="lg:col-span-8 p-6 lg:p-8 space-y-8 bg-slate-800/20">

                    {/* Hero Status Card */}
                    <div className="relative glass p-8 rounded-3xl border border-white/10 shadow-2xl overflow-hidden group">
                        {/* Background glow */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-neon-amber/10 rounded-full blur-[100px] -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-60"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-green/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>

                        <div className="relative z-10">
                            {fireAchievedAge ? (
                                <>
                                    <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-6 mb-6">
                                        <div>
                                            <h3 className="text-[10px] font-bold text-neon-amber uppercase tracking-[0.2em] mb-2">Projected FIRE Age</h3>
                                            <span className="text-7xl font-display font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{fireAchievedAge}</span>
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                                {yearsToFreedom} years to go
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-px bg-white/10 my-8 w-full" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-1">
                                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Required Corpus</p>
                                            <p className="text-3xl font-display font-black text-white">{formatCurrency(fireCorpusNeed)}</p>
                                        </div>
                                        <div className="space-y-1 md:text-right">
                                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Current Freedom Savings</p>
                                            <p className={`text-3xl font-display font-black ${Number(currentFreedomYears) > 5 ? 'text-neon-green' : 'text-white'}`}>
                                                {currentFreedomYears} Years
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-xl font-display font-medium text-gray-400">Your FIRE path is being forged. Increase your SIP to see local magic happen.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="h-[450px] w-full glass rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest underline decoration-neon-amber decoration-4 underline-offset-8">Wealth vs Freedom Target</h4>
                            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-tighter">
                                <span className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-neon-green ring-4 ring-neon-green/20"></div>
                                    <span className="text-white">Projected Wealth</span>
                                </span>
                                <span className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-neon-amber ring-4 ring-neon-amber/20"></div>
                                    <span className="text-white">FIRE Target</span>
                                </span>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height="85%">
                            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.05} />
                                <XAxis
                                    dataKey="age"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }}
                                />
                                <YAxis
                                    hide
                                    domain={['dataMin', 'auto']}
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
                                    itemStyle={{ color: '#ffffff' }}
                                    formatter={(val: any) => [formatCurrency(Number(val)), '']}
                                    labelFormatter={(age) => `Age ${age}`}
                                />
                                <Area
                                    type="monotone"
                                    name="Projected Wealth"
                                    dataKey="wealth"
                                    stroke="#10b981"
                                    strokeWidth={4}
                                    fill="url(#colorWealth)"
                                    fillOpacity={1}
                                />
                                <Area
                                    type="monotone"
                                    name="FIRE Target"
                                    dataKey="target"
                                    stroke="#f59e0b"
                                    strokeDasharray="8 8"
                                    strokeWidth={2}
                                    fill="url(#colorTarget)"
                                    fillOpacity={1}
                                />
                                {fireAchievedAge && (
                                    <ReferenceLine
                                        x={fireAchievedAge}
                                        stroke="#ffffff"
                                        strokeWidth={1}
                                        strokeDasharray="4 4"
                                        label={{
                                            value: 'FREEDOM',
                                            position: 'top',
                                            fill: '#ffffff',
                                            fontSize: 10,
                                            fontWeight: 'black',
                                            letterSpacing: '0.1em'
                                        }}
                                    />
                                )}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </div>
        </div>
    );
};
