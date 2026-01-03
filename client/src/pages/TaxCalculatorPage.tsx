import { Layout } from '../components/Layout';
import { TaxCalculator } from '../components/TaxCalculator';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TaxCalculatorPage = () => {
    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Link
                        to="/"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tax Optimizer</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Compare Regimes for FY 2025-26</p>
                    </div>
                </div>

                <TaxCalculator />
            </div>
        </Layout>
    );
};
