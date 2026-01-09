import { Layout } from '../components/Layout';
import { TaxCalculator } from '../components/TaxCalculator';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const TaxCalculatorPage = () => {
    return (
        <Layout>
            <SEO
                title="Tax Calculator FY 2025-26 | Stable Money"
                description="Compare Old vs New tax regime and maximize your savings for FY 2025-26."
                keywords="income tax calculator, tax regime comparison, FY 2025-26"
            />
            <div className="space-y-8">
                <div className="flex items-center space-x-4">
                    <Link
                        to="/"
                        className="glass p-2 rounded-lg hover:bg-white/10 text-gray-200 hover:text-neon-cyan transition-all"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-display font-bold gradient-text">Tax Calculator</h1>
                        <p className="text-gray-300 mt-1">Compare tax regimes for FY 2025-26</p>
                    </div>
                </div>

                <TaxCalculator />
            </div>
        </Layout>
    );
};
