import { useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { Wallet, TrendingUp } from 'lucide-react';
import { STORAGE_KEYS } from '../../utils/storageKeys';
import { DashboardWidgets } from './DashboardWidgets';

const COLORS = ['#10b981', '#a855f7', '#f59e0b']; // Neon Green, Neon Purple, Neon Amber

export const FinancialDashboard = () => {
    // --- Data Aggregation ---
    const data = useMemo(() => {
        if (typeof window === 'undefined') return null;

        // SIP Data
        const sipMonthly = Number(localStorage.getItem(STORAGE_KEYS.SIP_MONTHLY_INVESTMENT) || 0);
        const sipReturn = Number(localStorage.getItem(STORAGE_KEYS.SIP_RETURN_RATE) || 12);
        const sipYears = Number(localStorage.getItem(STORAGE_KEYS.SIP_TIME_PERIOD) || 10);

        // EMI Data
        const loanAmount = Number(localStorage.getItem(STORAGE_KEYS.EMI_LOAN_AMOUNT) || 0);
        const emiInterest = Number(localStorage.getItem(STORAGE_KEYS.EMI_INTEREST_RATE) || 8.5);
        const emiTenure = Number(localStorage.getItem(STORAGE_KEYS.EMI_TENURE) || 20);

        // Calculate EMI roughly if not stored? 
        // Ideally we store the EMI value itself, but for now re-calc:
        const r = emiInterest / 12 / 100;
        const n = emiTenure * 12;
        const emiMonthly = loanAmount > 0 ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;

        // Projections
        const futureValueSIP = sipMonthly * 12 * ((Math.pow(1 + sipReturn / 100, sipYears) - 1) / (sipReturn / 100)); // Simplified FV

        // Asset Allocation (Rough Estimate)
        // Equity = Future Value of SIP (Projected) OR Just Total Invested? Let's use Projected for "Wealth Potential"
        // Real Estate = Loan Amount (assuming property value ~= loan amount initially)

        return {
            sipMonthly,
            sipYears,
            emiMonthly,
            emiTenure,
            taxSavings: 0, // Placeholder until tax calc integration
            netWorth: (sipMonthly * 12 * sipYears) + (loanAmount * 0.4), // Very rough "Equity Built"
            projectedWealth: futureValueSIP + loanAmount, // SIP + Property Value
            assets: [
                { name: 'Equity (SIP)', value: Math.round(futureValueSIP) },
                { name: 'Real Estate', value: loanAmount },
                { name: 'Liquid/Other', value: Math.round(futureValueSIP * 0.1) } // Dummy buffer
            ]
        };
    }, []);

    if (!data) return null;

    const fmt = (val: number) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(val);

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">

            {/* Header / Wealth Summary */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 rounded-full blur-[80px] -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-60"></div>

                <div>
                    <h1 className="text-4xl font-display font-black text-white flex items-center gap-4">
                        <div className="p-3 bg-neon-cyan/10 rounded-2xl border border-neon-cyan/20 ring-4 ring-neon-cyan/5">
                            <Wallet className="w-8 h-8 text-neon-cyan" />
                        </div>
                        <span className="gradient-text">Command Center</span>
                    </h1>
                    <p className="text-gray-500 mt-4 font-medium uppercase tracking-[0.2em] text-[10px]">Strategic Wealth Architecture & Analysis</p>
                </div>
                <div className="text-right relative z-10">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Projected Net Worth (10Y)</p>
                    <p className="text-5xl font-display font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        {fmt(data.projectedWealth)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Col: Widgets & Actions */}
                <div className="space-y-6">
                    {/* 2x2 Grid */}
                    <DashboardWidgets data={data} />

                    {/* Next Step / Insight Card */}
                    <div className="relative glass p-8 rounded-3xl border border-neon-purple/20 shadow-2xl overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:opacity-100 opacity-60 transition-opacity"></div>

                        <h3 className="text-[10px] font-black text-neon-purple uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> Strategic Insight
                        </h3>
                        {data.emiMonthly > 20000 ? (
                            <p className="text-gray-400 text-sm mb-6 leading-relaxed font-medium">
                                Your loan liability is significant. A <span className="text-white font-bold">5% increase</span> in EMI could liquidate your debt <span className="text-neon-cyan">3 years faster</span>.
                            </p>
                        ) : (
                            <p className="text-gray-400 text-sm mb-6 leading-relaxed font-medium">
                                Optimization complete. Step up your SIP by <span className="text-white font-bold">10% annually</span> to maintain purchasing power parity.
                            </p>
                        )}
                        <button className="bg-neon-purple text-slate-900 font-display font-black py-3 px-4 rounded-xl text-[10px] uppercase tracking-[0.2em] w-full hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">
                            Initialize Strategy
                        </button>
                    </div>
                </div>

                {/* Right Col: Visualizations */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Wealth Trend Chart */}
                    <div className="glass p-8 rounded-[32px] border border-white/10 h-80 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple opacity-40 group-hover:opacity-100 transition-opacity"></div>

                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2 underline decoration-neon-green decoration-4 underline-offset-8">
                                Wealth Projection Matrix
                            </h3>
                            <div className="px-3 py-1 glass rounded-lg text-[10px] font-bold text-neon-green uppercase tracking-widest bg-neon-green/5 border border-neon-green/10">
                                Balanced (12%)
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height="75%">
                            <AreaChart data={[
                                { year: '2025', value: data.netWorth },
                                { year: '2026', value: data.netWorth * 1.12 },
                                { year: '2027', value: data.netWorth * 1.25 },
                                { year: '2028', value: data.netWorth * 1.40 },
                                { year: '2030', value: data.netWorth * 1.80 },
                                { year: '2035', value: data.projectedWealth },
                            ]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.03} />
                                <XAxis
                                    dataKey="year"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                        borderColor: 'rgba(255, 255, 255, 0.1)',
                                        color: '#ffffff',
                                        borderRadius: '16px',
                                        backdropFilter: 'blur(12px)',
                                        fontSize: '11px',
                                        fontWeight: 'bold'
                                    }}
                                    formatter={(val: any) => [fmt(Number(val)), 'Net Wealth']}
                                />
                                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#colorWealth)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Asset Allocation */}
                    <div className="glass p-8 rounded-[32px] border border-white/10 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-neon-purple/5 rounded-full blur-[80px] -mr-24 -mt-24"></div>
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-10 flex items-center gap-2">
                            Projected Allocation Spectrum
                        </h3>
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="h-48 w-48 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.assets}
                                            innerRadius={65}
                                            outerRadius={85}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {data.assets.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#0f172a',
                                                borderColor: 'rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                fontSize: '11px',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Portfolio</span>
                                    <span className="text-xl font-display font-black text-white">CORE</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 flex-1 w-full">
                                {data.assets.map((asset, index) => (
                                    <div key={index} className="flex justify-between items-center group/item transition-all hover:bg-white/5 p-3 rounded-xl border border-transparent hover:border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: COLORS[index], color: COLORS[index] }}></div>
                                            <span className="text-xs font-bold text-gray-400 group-hover/item:text-white transition-colors">{asset.name}</span>
                                        </div>
                                        <span className="font-display font-black text-white text-lg">{fmt(asset.value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
