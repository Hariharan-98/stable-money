import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Facebook, Mail } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="relative bg-slate-900 border-t border-white/5 text-gray-400 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[120px] -mr-64 -mb-64 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-neon-purple/5 rounded-full blur-[100px] -ml-32 -mt-32 pointer-events-none"></div>

            <div className="container mx-auto px-6 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Column 1: Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3 text-white font-display font-black text-2xl tracking-tighter">
                            <div className="p-2 bg-neon-cyan/10 rounded-xl border border-neon-cyan/20 ring-4 ring-neon-cyan/5">
                                <img src="/logo.png" alt="Stable Money Logo" className="w-6 h-6 object-contain" />
                            </div>
                            <span className="gradient-text">STABLE MONEY</span>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-500 font-medium italic">
                            "Precision in every calculation. Intelligence in every investment. The future of personal finance is here."
                        </p>
                        <div className="flex space-x-5">
                            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-neon-cyan/10 hover:text-neon-cyan border border-white/5 hover:border-neon-cyan/20 transition-all"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-neon-cyan/10 hover:text-neon-cyan border border-white/5 hover:border-neon-cyan/20 transition-all"><Linkedin className="w-5 h-5" /></a>
                            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-neon-cyan/10 hover:text-neon-cyan border border-white/5 hover:border-neon-cyan/20 transition-all"><Facebook className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Column 2: Plan Your Growth */}
                    <div>
                        <h3 className="text-white font-display font-bold mb-6 text-xs uppercase tracking-[0.2em] border-l-2 border-neon-cyan pl-3">Plan Your Growth</h3>
                        <ul className="space-y-4 text-[13px] font-bold">
                            <li><Link to="/calculator" className="text-gray-500 hover:text-neon-cyan transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-neon-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div> SIP Calculator</Link></li>
                            <li><Link to="/fire-calculator" className="text-gray-500 hover:text-neon-cyan transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-neon-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div> FIRE Planner</Link></li>
                            <li><Link to="/inflation-calculator" className="text-gray-500 hover:text-neon-cyan transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-neon-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div> Inflation Check</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Manage Taxes & Debt */}
                    <div>
                        <h3 className="text-white font-display font-bold mb-6 text-xs uppercase tracking-[0.2em] border-l-2 border-neon-purple pl-3">Taxes & Debt</h3>
                        <ul className="space-y-4 text-[13px] font-bold">
                            <li><Link to="/tax-calculator" className="text-gray-500 hover:text-neon-purple transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-neon-purple rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div> Tax Optimizer</Link></li>
                            <li><Link to="/emi-calculator" className="text-gray-500 hover:text-neon-purple transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-neon-purple rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div> EMI Planner</Link></li>
                            <li><Link to="/rent-vs-buy" className="text-gray-500 hover:text-neon-purple transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-neon-purple rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div> Rent vs Buy</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h3 className="text-white font-display font-bold mb-6 text-xs uppercase tracking-[0.2em] border-l-2 border-neon-cyan pl-3">Stay Updated</h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter mb-4">Get the latest financial tips and updates.</p>
                        <div className="flex flex-col space-y-3">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-3 w-4 h-4 text-gray-600 group-focus-within:text-neon-cyan transition-colors" />
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-neon-cyan/50 focus:ring-4 focus:ring-neon-cyan/5 transition-all"
                                />
                            </div>
                            <button className="bg-neon-cyan text-slate-900 font-display font-black py-3 px-4 rounded-xl text-[10px] uppercase tracking-[0.2em] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
                                Subscribe Now
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest gap-4">
                    <p className="text-gray-600">&copy; {new Date().getFullYear()} Stable Money. Forge your future.</p>
                    <div className="flex space-x-8">
                        <a href="#" className="text-gray-600 hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="text-gray-600 hover:text-white transition-colors">Terms</a>
                        <a href="#" className="text-gray-600 hover:text-white transition-colors">Legal</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
