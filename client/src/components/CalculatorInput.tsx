import { trackSliderInteraction } from '../utils/analytics';
import type { LucideIcon } from 'lucide-react';

interface CalculatorInputProps {
    label: string;
    value: number;
    setValue: (value: number) => void;
    min: number;
    max: number;
    step: number;
    icon?: LucideIcon;
    suffix?: string;
    bgClass?: string;
    iconClass?: string;
}

export const CalculatorInput = ({
    label,
    value,
    setValue,
    min,
    max,
    step,
    icon: Icon,
    suffix,
    bgClass = "",
    iconClass = "text-neon-cyan"
}: CalculatorInputProps) => {

    return (
        <div className={`glass-card p-5 mb-5 hover:border-neon-cyan/30 transition-all ${bgClass}`}>
            <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-white flex items-center gap-2">
                    {Icon && <Icon className={`w-4 h-4 ${iconClass}`} />}
                    {label}
                </label>
                <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20 hover:border-neon-cyan/50 hover:bg-white/10 transition-all shadow-lg">
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val)) {
                                setValue(val);
                            } else if (e.target.value === '') {
                                setValue(0);
                            }
                        }}
                        className="w-28 text-right bg-transparent border-none focus:ring-0 text-base font-bold text-white p-0 appearance-none no-spinner focus:text-neon-cyan transition-colors outline-none"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-300">{suffix}</span>
                </div>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                onMouseUp={() => trackSliderInteraction(label)}
                onTouchEnd={() => trackSliderInteraction(label)}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-cyan hover:accent-neon-purple transition-all"
                style={{
                    background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) 100%)`
                }}
            />
        </div>
    );
};
