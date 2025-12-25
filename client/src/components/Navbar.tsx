import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Coins, ArrowRightLeft, Menu, X } from 'lucide-react';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-bold text-xl z-20">
                        <DollarSign className="w-6 h-6" />
                        <span>Stable Money</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-4">
                        <NavLink to="/" icon={<ArrowRightLeft className="w-4 h-4" />} text="Currency Converter" />
                        <NavLink to="/gold-rates" icon={<Coins className="w-4 h-4 text-amber-500" />} text="Gold and Silver Rates" />
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
                            to="/gold-rates"
                            icon={<Coins className="w-5 h-5 text-amber-500" />}
                            text="Gold and Silver Rates"
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
