import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Layout } from '../components/Layout';

export const Currencies = () => {
    const [currencies, setCurrencies] = useState<Record<string, string>>({});

    useEffect(() => {
        api.getCurrencies().then(setCurrencies);
    }, []);

    return (
        <Layout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-display font-bold gradient-text">Supported Currencies</h1>
                    <p className="text-gray-300 mt-2 text-lg">Explore global exchange rates at your fingertips</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {Object.entries(currencies).map(([code, name]) => (
                        <div key={code} className="glass p-5 rounded-2xl flex flex-col items-center gap-3 border border-white/5 hover:border-neon-cyan/50 hover:bg-white/10 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-neon-cyan/5 rounded-full blur-xl -mr-8 -mt-8 group-hover:opacity-100 opacity-0 transition-opacity"></div>
                            <span className="font-display font-black text-2xl text-white group-hover:text-neon-cyan transition-colors">{code}</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center line-clamp-1">{name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};
