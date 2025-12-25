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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Supported Currencies</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(currencies).map(([code, name]) => (
                    <div key={code} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <span className="font-bold text-lg text-gray-900 dark:text-white">{code}</span>
                        <span className="text-gray-500 dark:text-gray-400">{name}</span>
                    </div>
                ))}
            </div>
        </Layout>
    );
};
