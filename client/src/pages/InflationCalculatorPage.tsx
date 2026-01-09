import { Layout } from '../components/Layout';
import { InflationCalculator } from '../components/InflationCalculator';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const InflationCalculatorPage = () => {
    return (
        <Layout>
            <SEO
                title="Inflation Calculator | Stable Money"
                description="See how inflation erodes your purchasing power over time."
                keywords="inflation calculator, purchasing power, inflation India"
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
                        <h1 className="text-3xl font-display font-bold gradient-text">Inflation Calculator</h1>
                        <p className="text-gray-300 mt-1">Understand the impact of inflation on your wealth</p>
                    </div>
                </div>

                <InflationCalculator />
            </div>
        </Layout>
    );
};
