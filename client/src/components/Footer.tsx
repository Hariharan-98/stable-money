import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Facebook, Mail } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Column 1: Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-white font-bold text-xl">
                            <img src="/logo.png" alt="Stable Money Logo" className="w-8 h-8 object-contain" />
                            <span>Stable Money</span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Empowering your financial journey with precise tools and clear insights. Master your money, plan your future, and grow your wealth.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-emerald-400 transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-emerald-400 transition-colors"><Linkedin className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-emerald-400 transition-colors"><Facebook className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Column 2: Plan Your Growth */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Plan Your Growth</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/calculator" className="hover:text-emerald-400 transition-colors">SIP Calculator</Link></li>
                            <li><Link to="/fire-calculator" className="hover:text-emerald-400 transition-colors">FIRE Calculator</Link></li>
                            <li><Link to="/inflation-calculator" className="hover:text-emerald-400 transition-colors">Inflation Check</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Manage Taxes & Debt */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Manage Taxes & Debt</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/tax-calculator" className="hover:text-emerald-400 transition-colors">Income Tax Optimizer</Link></li>
                            <li><Link to="/emi-calculator" className="hover:text-emerald-400 transition-colors">EMI Calculator</Link></li>
                            <li><Link to="/emi-calculator" className="hover:text-emerald-400 transition-colors">Loan Prepayment</Link></li>
                            <li><Link to="/rent-vs-buy" className="hover:text-emerald-400 transition-colors">Rent vs Buy</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Stay Updated</h3>
                        <p className="text-sm mb-4">Get the latest financial tips and tax updates delivered to your inbox monthly.</p>
                        <div className="flex flex-col space-y-2">
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
                    <p>&copy; {new Date().getFullYear()} Stable Money. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
