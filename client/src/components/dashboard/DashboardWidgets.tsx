import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, TrendingUp, Calculator, FileText } from 'lucide-react';

interface WidgetProps {
    title: string;
    value: string;
    subtext: string;
    icon: any;
    link: string;
    color: string;
    bg: string;
}

const Widget = ({ title, value, subtext, icon: Icon, link, color, bg }: WidgetProps) => (
    <Link to={link} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group">
        <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-lg ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
        </div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{title}</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">{value}</p>
        <p className="text-xs text-gray-500">{subtext}</p>
    </Link>
);

export const DashboardWidgets = ({ data }: { data: any }) => {
    // Formatting helper
    const fmt = (val: number) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(val);

    return (
        <div className="grid grid-cols-2 gap-4">
            <Widget
                title="SIP Monthly"
                value={fmt(data.sipMonthly)}
                subtext={`Goal: 1 Cr in ${data.sipYears} Yrs`}
                icon={TrendingUp}
                link="/calculator"
                color="text-emerald-600"
                bg="bg-emerald-50 dark:bg-emerald-900/20"
            />
            <Widget
                title="Loan EMI"
                value={fmt(data.emiMonthly)}
                subtext={`${data.emiTenure} Years remaining`}
                icon={Calculator}
                link="/emi-calculator"
                color="text-indigo-600"
                bg="bg-indigo-50 dark:bg-indigo-900/20"
            />
            <Widget
                title="Tax Savings"
                value={data.taxSavings > 0 ? fmt(data.taxSavings) : "₹0"}
                subtext={data.taxSavings > 0 ? "Potential Savings" : "Check New Regime"}
                icon={FileText}
                link="/tax-calculator"
                color="text-blue-600"
                bg="bg-blue-50 dark:bg-blue-900/20"
            />
            <Link to="/fire-calculator" className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-800 hover:shadow-md transition-shadow flex flex-col justify-center items-center text-center">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full mb-2">
                    <ArrowRight className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-sm font-bold text-amber-900 dark:text-amber-100">Plan FIRE</p>
                <p className="text-xs text-amber-600/80 dark:text-amber-400">Retire Early</p>
            </Link>
        </div>
    );
};
