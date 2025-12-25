import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Layout } from '../components/Layout';
import { Modal } from '../components/Modal';
import { ArrowUpRight, ArrowRight, Calculator, LineChart } from 'lucide-react';
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

    return (
        <Layout>
            <div className="space-y-6">
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Exchange Rates and Conversion</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time rates for {base}</p>
                    </div>
                    <select
                        value={base}
                        onChange={(e) => setBase(e.target.value)}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 font-medium max-h-60 overflow-y-auto"
                    >
                        {Object.entries(currencyList).length > 0 ? (
                            Object.entries(currencyList).map(([code, name]) => (
                                <option key={code} value={code}>{code} - {name}</option>
                            ))
                        ) : (
                            <>
                                <option value="USD">USD - US Dollar</option>
                                <option value="EUR">EUR - Euro</option>
                            </>
                        )}
                    </select>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {data && Object.entries(data.rates).map(([curr, val]: [string, any]) => {
                            const rate = val as number;
                            return (
                                <div
                                    key={curr}
                                    onClick={() => openConvertModal(curr)}
                                    className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{curr}</span>
                                        <span className={`flex items-center text-sm font-medium ${rate > 1 ? 'text-green-600' : 'text-blue-600'}`}>
                                            <ArrowUpRight className="w-4 h-4 mr-1" />
                                            {rate.toFixed(4)}
                                        </span>
                                    </div>
                                    <div className="mt-4 space-y-3">
                                        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                            1 {base} = {rate.toFixed(4)} {curr}
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    goToHistory(curr);
                                                }}
                                                className="flex-1 flex items-center justify-center space-x-1 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                <LineChart className="w-4 h-4" />
                                                <span>Rate History</span>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openConvertModal(curr);
                                                }}
                                                className="flex-1 flex items-center justify-center space-x-1 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                                            >
                                                <Calculator className="w-4 h-4" />
                                                <span>Convert</span>
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
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">{base}</span>
                                <input
                                    type="number"
                                    autoFocus
                                    value={convertAmount}
                                    onChange={(e) => setConvertAmount(Number(e.target.value))}
                                    className="w-full pl-12 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg p-3 text-lg font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <ArrowRight className="w-6 h-6 text-gray-400 transform rotate-90" />
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Converted Amount</p>
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {conversionResult?.toFixed(2)} <span className="text-xl">{selectedTarget}</span>
                            </div>
                            <p className="text-xs text-blue-400/70 mt-2">
                                Exchange Rate: 1 {base} = {data?.rates[selectedTarget!]?.toFixed(4)} {selectedTarget}
                            </p>
                        </div>

                        {historyData.length > 0 && (
                            <div className="h-48 w-full mt-4">
                                <p className="text-xs text-gray-400 mb-2">30 Day Trend</p>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={historyData}>
                                        <defs>
                                            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" hide />
                                        <YAxis domain={['auto', 'auto']} hide />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb', fontSize: '12px' }}
                                            itemStyle={{ color: '#f9fafb' }}
                                            labelStyle={{ display: 'none' }}
                                            formatter={(value: any) => [value.toFixed(4), 'Rate']}
                                        />
                                        <Area type="monotone" dataKey="rate" stroke="#2563eb" fillOpacity={1} fill="url(#colorRate)" />
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
