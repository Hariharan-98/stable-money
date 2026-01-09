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
    <Link to={link} className="glass p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden flex flex-col">
        <div className="flex justify-between items-start mb-6">
            <div className={`p-2.5 rounded-xl ${bg} ring-1 ring-white/5`}>
                <Icon className={`w-5 h-5 ${color} drop-shadow-[0_0_8px_currentColor]`} />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
        </div>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">{title}</p>
        <p className="text-xl font-display font-black text-white mb-2">{value}</p>
        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter italic">{subtext}</p>
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
                subtext={`Goal: 1 Cr Target`}
                icon={TrendingUp}
                link="/calculator"
                color="text-neon-green"
                bg="bg-neon-green/10"
            />
            <Widget
                title="Loan EMI"
                value={fmt(data.emiMonthly)}
                subtext={`${data.emiTenure}Y Duration`}
                icon={Calculator}
                link="/emi-calculator"
                color="text-neon-cyan"
                bg="bg-neon-cyan/10"
            />
            <Widget
                title="Tax Savings"
                value={data.taxSavings > 0 ? fmt(data.taxSavings) : "₹0"}
                subtext={data.taxSavings > 0 ? "Potential" : "Optimize Now"}
                icon={FileText}
                link="/tax-calculator"
                color="text-neon-blue"
                bg="bg-neon-blue/10"
            />
            <Link to="/fire-calculator" className="glass p-6 rounded-2xl border border-neon-amber/20 hover:bg-neon-amber/5 transition-all flex flex-col justify-center items-center text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-neon-amber/5 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
                <div className="bg-neon-amber/20 p-3 rounded-full mb-4 ring-1 ring-neon-amber/30 group-hover:rotate-12 transition-transform">
                    <ArrowRight className="w-5 h-5 text-neon-amber" />
                </div>
                <p className="text-sm font-display font-black text-white uppercase tracking-widest mb-1">Architect FIRE</p>
                <p className="text-[10px] font-bold text-neon-amber uppercase tracking-tighter group-hover:text-white transition-colors">Retire Early</p>
            </Link>
        </div>
    );
};
