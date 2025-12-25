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
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rate History</h1>

                    <div className="flex gap-4">
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">Base Currency</label>
                            <select
                                value={base}
                                onChange={(e) => setBase(e.target.value)}
                                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                                {Object.entries(currencyList).map(([code, name]) => (
                                    <option key={code} value={code}>{code}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center pt-5">
                            <span className="text-gray-400 font-medium">vs</span>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">Target Currency</label>
                            <select
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                                {Object.entries(currencyList).map(([code, name]) => (
                                    <option key={code} value={code}>{code}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-[400px]">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 text-center">
                        {base} to {target} (Last 30 Days)
                    </h2>
                    <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }}
                                itemStyle={{ color: '#f9fafb' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="rate"
                                stroke="#2563eb"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Layout>
    );
};
