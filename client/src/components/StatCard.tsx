import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: LucideIcon;
    gradient: 'pink-purple' | 'cyan-blue' | 'purple-pink' | 'cyan-purple';
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    gradient,
    trend
}: StatCardProps) => {
    const gradientClasses = {
        'pink-purple': 'bg-gradient-pink-purple',
        'cyan-blue': 'bg-gradient-cyan-blue',
        'purple-pink': 'bg-gradient-purple-pink',
        'cyan-purple': 'bg-gradient-cyan-purple',
    };

    return (
        <div className={`${gradientClasses[gradient]} rounded-2xl p-6 shadow-2xl hover:scale-105 transition-transform duration-300 relative overflow-hidden group`}>
            {/* Animated background blob */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-white/80 uppercase tracking-wide">{title}</h3>
                    {Icon && <Icon className="w-5 h-5 text-white/60" />}
                </div>

                <div className="flex items-baseline gap-3">
                    <p className="text-4xl font-bold text-white font-display">{value}</p>
                    {subtitle && <span className="text-lg text-white/70">{subtitle}</span>}
                </div>

                {trend && (
                    <div className={`mt-3 flex items-center gap-1 text-sm ${trend.isPositive ? 'text-green-300' : 'text-red-300'}`}>
                        <span>{trend.isPositive ? '↑' : '↓'}</span>
                        <span>{Math.abs(trend.value)}%</span>
                        <span className="text-white/60 ml-1">vs last month</span>
                    </div>
                )}
            </div>
        </div>
    );
};
