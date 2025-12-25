import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Layout } from '../components/Layout';

export const GoldRates = () => {
    const [goldData, setGoldData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await api.getGoldRates();
            // The API now returns { rates: {...}, timestamp: "..." }
            // Or if api.ts wraps it, let's just store the whole object which contains both
            if (data && data.rates) {
                setGoldData(data); // Store the entire response { rates, timestamp }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Helper to calculate price per ounce (approx) if format is unit/USD
    // MetalpriceAPI usually returns "Base": "USD", Rates: { "XAU": 0.00038... } (which means 1 USD = 0.00038 Oz)
    // Price of 1 Oz = 1 / Rate
    const getPrice = (rate: number) => (1 / rate).toFixed(2);

    return (
        <Layout>
            <div className="space-y-6">
                <header>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gold & Silver Rates</h1>
                    {goldData && goldData.timestamp && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Rates as of: {new Date(goldData.timestamp).toLocaleDateString()}
                        </p>
                    )}
                </header>

                {loading ? (
                    <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {goldData && goldData.rates && (
                            <>
                                <div className="bg-amber-100 dark:bg-amber-900/30 p-8 rounded-2xl border border-amber-200 dark:border-amber-700">
                                    <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-400 mb-2">Gold (XAU)</h2>
                                    <div className="text-4xl font-extrabold text-gray-900 dark:text-white">
                                        ${goldData.rates.XAU ? getPrice(goldData.rates.XAU) : '---'}
                                        <span className="text-lg font-medium text-gray-500 ml-2">/ oz</span>
                                    </div>
                                    <p className="text-sm text-amber-700/70 mt-4">1 USD = {goldData.rates.XAU?.toFixed(6)} XAU</p>
                                </div>

                                <div className="bg-slate-100 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-400 mb-2">Silver (XAG)</h2>
                                    <div className="text-4xl font-extrabold text-gray-900 dark:text-white">
                                        ${goldData.rates.XAG ? getPrice(goldData.rates.XAG) : '---'}
                                        <span className="text-lg font-medium text-gray-500 ml-2">/ oz</span>
                                    </div>
                                    <p className="text-sm text-slate-600/70 mt-4">1 USD = {goldData.rates.XAG?.toFixed(6)} XAG</p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};
