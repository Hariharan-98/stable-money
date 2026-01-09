import { Layout } from '../components/Layout';
import { FIRECalculator } from '../components/FIRECalculator';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const FIRECalculatorPage = () => {
    return (
        <Layout>
            <SEO
                title="FIRE Calculator | Stable Money"
                description="Map your journey to financial independence and early retirement."
                keywords="FIRE calculator, financial independence, early retirement"
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
                        <h1 className="text-3xl font-display font-bold gradient-text">FIRE Calculator</h1>
                        <p className="text-gray-300 mt-1">Map your journey to financial independence</p>
                    </div>
                </div>

                <FIRECalculator />
            </div>
        </Layout>
    );
};
