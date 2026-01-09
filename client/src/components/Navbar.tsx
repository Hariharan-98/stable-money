import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightLeft, Menu, X, TrendingUp, Calculator, TrendingDown, Home, Flame, FileText } from 'lucide-react';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 glass backdrop-blur-xl shadow-lg border-b border-white/10 transition-all duration-300">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2 font-display font-bold text-xl z-20 group">
                        <img src="/logo.png" alt="Stable Money Logo" className="w-12 h-12 object-contain transition-transform group-hover:scale-110" />
                        <span className="gradient-text">Stable Money</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-1">
                        <NavLink to="/" icon={<Home className="w-4 h-4" />} text="Home" />
                        <div className="h-6 w-px bg-white/20 mx-2 self-center"></div>
                        <NavLink to="/currency-converter" icon={<ArrowRightLeft className="w-4 h-4" />} text="Currency Converter" />
                        <NavLink to="/calculator" icon={<TrendingUp className="w-4 h-4 text-neon-cyan" />} text="SIP" />
                        <NavLink to="/emi-calculator" icon={<Calculator className="w-4 h-4 text-neon-purple" />} text="EMI" />
                        <NavLink to="/rent-vs-buy" icon={<Home className="w-4 h-4 text-neon-cyan" />} text="Rent vs Buy" />
                        <NavLink to="/fire-calculator" icon={<Flame className="w-4 h-4 text-neon-amber" />} text="FIRE" />
                        <NavLink to="/tax-calculator" icon={<FileText className="w-4 h-4 text-gray-300" />} text="Tax" />
                        <NavLink to="/inflation-calculator" icon={<TrendingDown className="w-4 h-4 text-neon-pink" />} text="Inflation" />
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden z-20 p-2 text-gray-200 hover:bg-white/10 rounded-lg transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 glass backdrop-blur-2xl z-10 pt-20 px-4 md:hidden">
                    <div className="flex flex-col space-y-4">
                        <MobileNavLink
                            to="/"
                            icon={<ArrowRightLeft className="w-5 h-5 text-neon-cyan" />}
                            text="Currency Converter"
                            onClick={() => setIsOpen(false)}
                        />
                        <MobileNavLink
                            to="/calculator"
                            icon={<TrendingUp className="w-5 h-5 text-neon-cyan" />}
                            text="SIP Calculator"
                            onClick={() => setIsOpen(false)}
                        />
                        <MobileNavLink
                            to="/emi-calculator"
                            icon={<Calculator className="w-5 h-5 text-neon-purple" />}
                            text="EMI Calculator"
                            onClick={() => setIsOpen(false)}
                        />
                        <MobileNavLink
                            to="/inflation-calculator"
                            icon={<TrendingDown className="w-5 h-5 text-neon-pink" />}
                            text="Inflation"
                            onClick={() => setIsOpen(false)}
                        />
                        <MobileNavLink
                            to="/rent-vs-buy"
                            icon={<Home className="w-5 h-5 text-neon-cyan" />}
                            text="Rent vs Buy"
                            onClick={() => setIsOpen(false)}
                        />
                        <MobileNavLink
                            to="/fire-calculator"
                            icon={<Flame className="w-5 h-5 text-neon-amber" />}
                            text="FIRE Calculator"
                            onClick={() => setIsOpen(false)}
                        />
                        <MobileNavLink
                            to="/tax-calculator"
                            icon={<FileText className="w-5 h-5 text-gray-400" />}
                            text="Tax Calculator"
                            onClick={() => setIsOpen(false)}
                        />
                    </div>
                </div>
            )}
        </nav>
    );
};

const NavLink = ({ to, icon, text }: { to: string, icon: React.ReactNode, text: string }) => (
    <Link
        to={to}
        className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:text-neon-cyan hover:bg-white/10 transition-all duration-200 group"
    >
        <span className="group-hover:scale-110 transition-transform">{icon}</span>
        <span>{text}</span>
    </Link>
);

const MobileNavLink = ({ to, icon, text, onClick }: { to: string, icon: React.ReactNode, text: string, onClick: () => void }) => (
    <Link
        to={to}
        onClick={onClick}
        className="flex items-center space-x-3 px-4 py-4 rounded-xl text-lg font-medium text-gray-200 hover:bg-white/10 border border-white/10 hover:border-neon-cyan/50 shadow-lg hover:shadow-neon-cyan/20 transition-all duration-200"
    >
        {icon}
        <span>{text}</span>
    </Link>
);
