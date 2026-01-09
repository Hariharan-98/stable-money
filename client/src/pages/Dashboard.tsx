import { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { Layout } from '../components/Layout';
import { Modal } from '../components/Modal';
import { StatCard } from '../components/StatCard';
import { ArrowUpRight, ArrowRight, Calculator, LineChart, TrendingUp, DollarSign, Globe } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
    const navigate = useNavigate();
    const [base, setBase] = useState('USD');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
    const [convertAmount, setConvertAmount] = useState<number>(1);
    const [conversionResult, setConversionResult] = useState<number | null>(null);
    const [historyData, setHistoryData] = useState<any[]>([]);

    const [currencyList, setCurrencyList] = useState<Record<string, string>>({});

    useEffect(() => {
        loadRates();
        loadCurrencies();
    }, [base]);

    // Calculate conversion instantly when amount changes
    useEffect(() => {
        if (selectedTarget && data?.rates[selectedTarget]) {
            setConversionResult(convertAmount * data.rates[selectedTarget]);
        }
    }, [convertAmount, selectedTarget, data]);

    useEffect(() => {
        if (selectedTarget) {
            loadHistory(selectedTarget);
        } else {
            setHistoryData([]);
        }
    }, [selectedTarget]);

    const loadHistory = async (targetCurr: string) => {
        const end = new Date().toISOString().split('T')[0];
        const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        try {
            const res = await api.getHistory(start, end, base);
            if (res && res.rates) {
                const chartData = Object.entries(res.rates).map(([date, rates]: [string, any]) => ({
                    date,
                    rate: rates[targetCurr]
                }));
                setHistoryData(chartData);
            }
        } catch (e) {
            console.error("Failed to load history", e);
        }
    };

    const loadCurrencies = async () => {
        try {
            const list = await api.getCurrencies();
            setCurrencyList(list);
        } catch (e) {
            console.error("Failed to load currencies", e);
        }
    };

    const loadRates = async () => {
        setLoading(true);
        try {
            const res = await api.getRates(base);
            setData(res);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const openConvertModal = (target: string) => {
        setSelectedTarget(target);
        setConvertAmount(1);
        setConversionResult(data.rates[target]);
    };

    const goToHistory = (targetCurr: string) => {
        navigate(`/history?base=${base}&target=${targetCurr}`);
    };

    // Calculate metrics for stat cards
    const metrics = useMemo(() => {
        if (!data?.rates) return null;

        const rates = Object.values(data.rates) as number[];
        const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
        const maxRate = Math.max(...rates);
        const minRate = Math.min(...rates);

        return {
            totalCurrencies: Object.keys(data.rates).length,
            avgRate: avgRate.toFixed(2),
            highestRate: maxRate.toFixed(2),
            lowestRate: minRate.toFixed(2),
        };
    }, [data]);

    return (
        <Layout>
            <div className="space-y-8">
                {/* Stats Overview */}
                {!loading && metrics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Currencies"
                            value={metrics.totalCurrencies}
                            icon={Globe}
                            gradient="cyan-blue"
                        />
                        <StatCard
                            title="Average Rate"
                            value={metrics.avgRate}
                            subtitle={base}
                            icon={TrendingUp}
                            gradient="pink-purple"
                        />
                        <StatCard
                            title="Highest Rate"
                            value={metrics.highestRate}
                            subtitle={base}
                            icon={ArrowUpRight}
                            gradient="purple-pink"
                        />
                        <StatCard
                            title="Lowest Rate"
                            value={metrics.lowestRate}
                            subtitle={base}
                            icon={DollarSign}
                            gradient="cyan-purple"
                        />
                    </div>
                )}

                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-display font-bold gradient-text">Exchange Rates</h1>
                        <p className="text-gray-300 mt-2">Real-time rates for {base}</p>
                    </div>
                    <select
                        value={base}
                        onChange={(e) => setBase(e.target.value)}
                        className="glass text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan font-medium max-h-60 overflow-y-auto transition-all"
                    >
                        {Object.entries(currencyList).length > 0 ? (
                            Object.entries(currencyList).map(([code, name]) => (
                                <option key={code} value={code} className="bg-space-900">{code} - {name}</option>
                            ))
                        ) : (
                            <>
                                <option value="USD" className="bg-space-900">USD - US Dollar</option>
                                <option value="EUR" className="bg-space-900">EUR - Euro</option>
                            </>
                        )}
                    </select>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-40 glass rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {data && Object.entries(data.rates).map(([curr, val]: [string, any]) => {
                            const rate = val as number;
                            return (
                                <div
                                    key={curr}
                                    onClick={() => openConvertModal(curr)}
                                    className="group glass-card p-6 hover:border-neon-cyan/50 hover:shadow-xl hover:shadow-neon-cyan/10 transition-all duration-300 cursor-pointer relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-3xl font-display font-bold gradient-text">{curr}</span>
                                        <span className={`flex items-center text-sm font-medium ${rate > 1 ? 'text-neon-cyan' : 'text-neon-purple'}`}>
                                            <ArrowUpRight className="w-4 h-4 mr-1" />
                                            {rate.toFixed(4)}
                                        </span>
                                    </div>
                                    <div className="mt-4 space-y-3">
                                        <div className="text-sm text-gray-300 font-medium">
                                            1 {base} = {rate.toFixed(4)} {curr}
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    goToHistory(curr);
                                                }}
                                                className="flex-1 flex items-center justify-center space-x-1 text-sm font-medium text-gray-200 glass px-3 py-2 rounded-lg hover:bg-white/10 hover:text-neon-cyan transition-all"
                                            >
                                                <LineChart className="w-4 h-4" />
                                                <span>History</span>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openConvertModal(curr);
                                                }}
                                                className="flex-1 flex items-center justify-center space-x-1 text-sm font-medium text-neon-cyan glass px-3 py-2 rounded-lg hover:bg-neon-cyan/10 hover:border-neon-cyan/50 transition-all"
                                            >
                                                <Calculator className="w-4 h-4" />
                                                <span>Convert</span>
                                            </button>
                                        </div>
                                        <div className="mt-2 text-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate('/calculator');
                                                }}
                                                className="text-xs font-bold text-neon-cyan/60 hover:text-neon-cyan transition-colors uppercase tracking-widest flex items-center justify-center gap-1 group/btn"
                                            >
                                                Try SIP Calculator
                                                <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                <Modal
                    isOpen={!!selectedTarget}
                    onClose={() => setSelectedTarget(null)}
                    title={`Convert ${base} to ${selectedTarget}`}
                >
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-cyan font-bold tracking-tight">{base}</span>
                                <input
                                    type="number"
                                    autoFocus
                                    value={convertAmount}
                                    onChange={(e) => setConvertAmount(Number(e.target.value))}
                                    className="w-full pl-16 bg-white/5 border border-white/20 text-white rounded-xl p-4 text-xl font-bold focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan outline-none transition-all shadow-lg group-hover:bg-white/10"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center -my-2">
                            <div className="bg-white/10 p-2 rounded-full border border-white/10">
                                <ArrowRight className="w-5 h-5 text-gray-400 rotate-90" />
                            </div>
                        </div>

                        <div className="glass p-5 rounded-2xl text-center border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/10 rounded-full blur-2xl -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50"></div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Converted Amount</p>
                            <div className="text-4xl font-display font-black text-white flex items-center justify-center gap-2">
                                <span className="gradient-text">{conversionResult?.toFixed(2)}</span>
                                <span className="text-xl font-bold text-gray-400">{selectedTarget}</span>
                            </div>
                            <p className="text-[10px] font-medium text-gray-500 mt-3 flex items-center justify-center gap-1.5 uppercase tracking-tighter">
                                <TrendingUp className="w-3 h-3 text-neon-cyan" />
                                Exchange Rate: 1 {base} = {data?.rates[selectedTarget!]?.toFixed(4)} {selectedTarget}
                            </p>
                        </div>

                        {historyData.length > 0 && (
                            <div className="h-52 w-full mt-4 glass p-4 rounded-2xl border border-white/10">
                                <div className="flex justify-between items-center mb-4 px-2">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">30 Day Rate Trend</p>
                                    <div className="flex items-center gap-1 text-[10px] text-neon-cyan font-bold uppercase">
                                        <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>
                                        Live
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height="80%">
                                    <AreaChart data={historyData}>
                                        <defs>
                                            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" hide />
                                        <YAxis domain={['auto', 'auto']} hide />
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
                                            itemStyle={{ color: '#06b6d4' }}
                                            labelStyle={{ display: 'none' }}
                                            formatter={(value: any) => [value.toFixed(4), 'Rate']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="rate"
                                            stroke="#06b6d4"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorRate)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        </Layout>
    );
};
