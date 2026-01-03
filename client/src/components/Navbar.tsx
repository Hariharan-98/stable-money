import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightLeft, Menu, X, TrendingUp, Calculator, TrendingDown, Home, Flame, FileText } from 'lucide-react';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/90 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-bold text-xl z-20">
                        <img src="/logo.png" alt="Stable Money Logo" className="w-12 h-12 object-contain" />
                        <span>Stable Money</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-1">
                        <NavLink to="/" icon={<Home className="w-4 h-4" />} text="Home" />
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2 self-center"></div>
                        <NavLink to="/currency-converter" icon={<ArrowRightLeft className="w-4 h-4" />} text="Converter" />
                        <NavLink to="/calculator" icon={<TrendingUp className="w-4 h-4 text-green-500" />} text="SIP" />
                        <NavLink to="/emi-calculator" icon={<Calculator className="w-4 h-4 text-indigo-500" />} text="EMI" />
                        <NavLink to="/rent-vs-buy" icon={<Home className="w-4 h-4 text-blue-500" />} text="Rent vs Buy" />
                        <NavLink to="/fire-calculator" icon={<Flame className="w-4 h-4 text-amber-500" />} text="FIRE" />
                        <NavLink to="/tax-calculator" icon={<FileText className="w-4 h-4 text-slate-500" />} text="Tax" />
                        <NavLink to="/inflation-calculator" icon={<TrendingDown className="w-4 h-4 text-orange-500" />} text="Inflation" />
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden z-20 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-white dark:bg-gray-800 z-10 pt-20 px-4 md:hidden">
                    <div className="flex flex-col space-y-4">
                        <MobileNavLink
                            to="/"
                            icon={<ArrowRightLeft className="w-5 h-5" />}
                            text="Currency Converter"
                            onClick={() => setIsOpen(false)}
                        />
                        <MobileNavLink
                            to="/calculator"
                            icon={<TrendingUp className="w-5 h-5 text-green-500" />}
                            text="SIP Calculator"
                            onClick={() => setIsOpen(false)}
                        />
                        <MobileNavLink
                            to="/emi-calculator"
                            icon={<Calculator className="w-5 h-5 text-indigo-500" />}
                            text="EMI Calculator"
                            onClick={() => setIsOpen(false)}
                        />
                        <MobileNavLink
                            to="/inflation-calculator"
                            icon={<TrendingDown className="w-5 h-5 text-orange-500" />}
                            text="Inflation"
                            onClick={() => setIsOpen(false)}
                        />
                        <MobileNavLink
                            to="/rent-vs-buy"
                            icon={<Home className="w-5 h-5 text-blue-500" />}
                            text="Rent vs Buy"
                            onClick={() => setIsOpen(false)}
                        />
                        <MobileNavLink
                            to="/fire-calculator"
                            icon={<Flame className="w-5 h-5 text-amber-500" />}
                            text="FIRE Calculator"
                            onClick={() => setIsOpen(false)}
                        />
                        <MobileNavLink
                            to="/tax-calculator"
                            icon={<FileText className="w-5 h-5 text-slate-500" />}
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
        className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
        {icon}
        <span>{text}</span>
    </Link>
);

const MobileNavLink = ({ to, icon, text, onClick }: { to: string, icon: React.ReactNode, text: string, onClick: () => void }) => (
    <Link
        to={to}
        onClick={onClick}
        className="flex items-center space-x-3 px-4 py-4 rounded-xl text-lg font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700 shadow-sm transition-all"
    >
        {icon}
        <span>{text}</span>
    </Link>
);
