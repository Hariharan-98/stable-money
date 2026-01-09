import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Layout } from '../components/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSearchParams } from 'react-router-dom';

export const History = () => {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState<any[]>([]);
    const [base, setBase] = useState(searchParams.get('base') || 'USD');
    const [target, setTarget] = useState(searchParams.get('target') || 'EUR');
    const [currencyList, setCurrencyList] = useState<Record<string, string>>({});

    useEffect(() => {
        loadCurrencies();
    }, []);

    useEffect(() => {
        loadHistory();
    }, [base, target]);

    const loadCurrencies = async () => {
        try {
            const list = await api.getCurrencies();
            setCurrencyList(list);
        } catch (e) {
            console.error("Failed to load currencies", e);
        }
    };

    const loadHistory = async () => {
        const end = new Date().toISOString().split('T')[0];
        const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const res = await api.getHistory(start, end, base);

        // Transform data
        if (res && res.rates) {
            const chartData = Object.entries(res.rates).map(([date, rates]: [string, any]) => ({
                date,
                rate: rates[target]
            }));
            setData(chartData);
        }
    };

    return (
        <Layout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-display font-bold gradient-text">Rate History</h1>
                        <p className="text-gray-300 mt-2 text-lg">Track currency fluctuations over time</p>
                    </div>

                    <div className="flex items-center gap-4 glass p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:opacity-100 opacity-50 transition-opacity"></div>

                        <div className="flex flex-col min-w-[140px]">
                            <label className="text-[10px] font-black text-neon-cyan uppercase tracking-[0.2em] mb-3">Base Asset</label>
                            <select
                                value={base}
                                onChange={(e) => setBase(e.target.value)}
                                className="bg-white/5 border border-white/10 text-white rounded-xl p-3 focus:ring-4 focus:ring-neon-cyan/10 focus:border-neon-cyan/50 text-xs font-bold uppercase tracking-widest outline-none transition-all appearance-none cursor-pointer hover:bg-white/10"
                            >
                                {Object.entries(currencyList).map(([code]) => (
                                    <option key={code} value={code} className="bg-slate-900">{code}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center pt-8">
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-gray-600 uppercase">vs</div>
                        </div>

                        <div className="flex flex-col min-w-[140px]">
                            <label className="text-[10px] font-black text-neon-purple uppercase tracking-[0.2em] mb-3">Target Asset</label>
                            <select
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                className="bg-white/5 border border-white/10 text-white rounded-xl p-3 focus:ring-4 focus:ring-neon-purple/10 focus:border-neon-purple/50 text-xs font-bold uppercase tracking-widest outline-none transition-all appearance-none cursor-pointer hover:bg-white/10"
                            >
                                {Object.entries(currencyList).map(([code]) => (
                                    <option key={code} value={code} className="bg-slate-900">{code}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="glass rounded-[40px] p-10 h-[550px] relative overflow-hidden group border border-white/10 shadow-3xl">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-orange opacity-40 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em] flex items-center gap-6">
                            <span className="text-white bg-neon-cyan/20 px-4 py-1.5 rounded-full border border-neon-cyan/30 text-xs font-black ring-8 ring-neon-cyan/5">{base}</span>
                            <div className="w-12 h-px bg-white/10"></div>
                            <span className="text-white bg-neon-purple/20 px-4 py-1.5 rounded-full border border-neon-purple/30 text-xs font-black ring-8 ring-neon-purple/5">{target}</span>
                        </h2>
                        <div className="px-5 py-2 glass rounded-full border border-white/5 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white/5">
                            30d Performance Analytics
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height="80%">
                        <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.03} vertical={false} />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                                axisLine={false}
                                tickLine={false}
                                dy={15}
                            />
                            <YAxis
                                domain={['auto', 'auto']}
                                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                                axisLine={false}
                                tickLine={false}
                                dx={-10}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    color: '#ffffff',
                                    borderRadius: '16px',
                                    backdropFilter: 'blur(12px)',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    padding: '12px 16px'
                                }}
                                itemStyle={{ color: '#06b6d4' }}
                                cursor={{ stroke: 'rgba(6, 182, 212, 0.2)', strokeWidth: 2 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="rate"
                                stroke="#06b6d4"
                                strokeWidth={5}
                                dot={false}
                                activeDot={{ r: 8, fill: '#06b6d4', stroke: '#ffffff', strokeWidth: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Layout>
    );
};
