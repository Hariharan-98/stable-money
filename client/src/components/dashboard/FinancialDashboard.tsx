import { useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { Wallet, TrendingUp, AlertCircle } from 'lucide-react';
import { STORAGE_KEYS } from '../../utils/storageKeys';
import { DashboardWidgets } from './DashboardWidgets';

const COLORS = ['#10b981', '#6366f1', '#f59e0b']; // Emerald (Equity), Indigo (Real Estate), Amber (Other)

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
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Wallet className="w-8 h-8 text-blue-600" />
                        Financial Command Center
                    </h1>
                    <p className="text-gray-500 mt-2">Your personalized wealth roadmap based on saved inputs.</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Projected Net Worth (10Y)</p>
                    <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
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
                    <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-indigo-300" />
                            Smart Insight
                        </h3>
                        {data.emiMonthly > 20000 ? (
                            <p className="text-indigo-100 text-sm mb-4">
                                Your EMI is significant. Increasing it by just 5% can reduce your tenure by ~3 years.
                            </p>
                        ) : (
                            <p className="text-indigo-100 text-sm mb-4">
                                Great start! Consider stepping up your SIP by 10% next year to beat inflation.
                            </p>
                        )}
                        <button className="bg-white text-indigo-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors w-full">
                            View Optimization Plan
                        </button>
                    </div>
                </div>

                {/* Right Col: Visualizations */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Wealth Trend Chart */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 h-80">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                                10-Year Wealth Projection
                            </h3>
                            <select className="bg-gray-50 dark:bg-gray-700 border-none rounded-lg text-xs font-semibold px-2 py-1">
                                <option>Conservative (8%)</option>
                                <option>Balanced (12%)</option>
                                <option>Aggressive (15%)</option>
                            </select>
                        </div>
                        <ResponsiveContainer width="100%" height="80%">
                            <AreaChart data={[
                                { year: '2025', value: data.netWorth },
                                { year: '2026', value: data.netWorth * 1.12 },
                                { year: '2027', value: data.netWorth * 1.25 },
                                { year: '2028', value: data.netWorth * 1.40 },
                                { year: '2030', value: data.netWorth * 1.80 },
                                { year: '2035', value: data.projectedWealth },
                            ]}>
                                <defs>
                                    <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    formatter={(val: any) => [fmt(Number(val)), 'Wealth']}
                                />
                                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorWealth)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Asset Allocation */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Projected Asset Allocation</h3>
                        <div className="flex items-center gap-8">
                            <div className="h-40 w-40 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.assets}
                                            innerRadius={60}
                                            outerRadius={75}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {data.assets.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                    <span className="text-xs text-gray-400">Total</span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">100%</span>
                                </div>
                            </div>
                            <div className="space-y-3 flex-1">
                                {data.assets.map((asset, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                            <span className="text-gray-600 dark:text-gray-300">{asset.name}</span>
                                        </div>
                                        <span className="font-semibold text-gray-900 dark:text-white">{fmt(asset.value)}</span>
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
