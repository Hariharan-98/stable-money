import { Layout } from '../components/Layout';
import { EMICalculator } from '../components/EMICalculator';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const EMICalculatorPage = () => {
    return (
        <Layout>
            <SEO
                title="EMI Calculator | Stable Money"
                description="Calculate your loan EMI with prepayment options. Plan your loans smartly."
                keywords="EMI calculator, loan calculator, prepayment calculator"
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
                        <h1 className="text-3xl font-display font-bold gradient-text">EMI Calculator</h1>
                        <p className="text-gray-300 mt-1">Plan your loans with smart prepayment options</p>
                    </div>
                </div>

                <EMICalculator />
            </div>
        </Layout>
    );
};
