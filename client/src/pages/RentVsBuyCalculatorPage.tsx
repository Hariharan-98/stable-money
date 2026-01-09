import { Layout } from '../components/Layout';
import { RentVsBuyCalculator } from '../components/RentVsBuyCalculator';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const RentVsBuyCalculatorPage = () => {
    return (
        <Layout>
            <SEO
                title="Rent vs Buy Calculator | Stable Money"
                description="Make informed housing decisions with our comprehensive rent vs buy calculator."
                keywords="rent vs buy, housing calculator, real estate India"
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
                        <h1 className="text-3xl font-display font-bold gradient-text">Rent vs Buy Calculator</h1>
                        <p className="text-gray-300 mt-1">Make the right choice for your dream home</p>
                    </div>
                </div>

                <RentVsBuyCalculator />
            </div>
        </Layout>
    );
};
