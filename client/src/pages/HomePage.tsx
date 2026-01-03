import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { FinancialDashboard } from '../components/dashboard/FinancialDashboard';
import {
    Search, ArrowRight, TrendingUp, Calculator,
    Home, Flame, FileText,
    PieChart, ArrowUpRight, ArrowRightLeft, TrendingDown
} from 'lucide-react';

export const HomePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showDashboard, setShowDashboard] = useState(false);

    useEffect(() => {
        const hasData = localStorage.getItem('user_has_financial_data');
        if (hasData === 'true') {
            setShowDashboard(true);
        }
    }, []);

    const tools = [
        {
            title: "Currency Converter",
            desc: "Real-time exchange rates for 150+ global currencies.",
            icon: ArrowRightLeft,
            path: "/currency-converter",
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-900/20"
        },
        {
            title: "SIP Calculator",
            desc: "Calculate future wealth with Step-Up SIPs.",
            icon: TrendingUp,
            path: "/calculator",
            color: "text-green-500",
            bg: "bg-green-50 dark:bg-green-900/20"
        },
        {
            title: "EMI Calculator",
            desc: "Plan loans with smart prepayment options.",
            icon: Calculator,
            path: "/emi-calculator",
            color: "text-indigo-500",
            bg: "bg-indigo-50 dark:bg-indigo-900/20"
        },
        {
            title: "Rent vs Buy",
            desc: "Make the right choice for your dream home.",
            icon: Home,
            path: "/rent-vs-buy",
            color: "text-purple-500",
            bg: "bg-purple-50 dark:bg-purple-900/20"
        },
        {
            title: "FIRE Planner",
            desc: "Map your journey to early financial freedom.",
            icon: Flame,
            path: "/fire-calculator",
            color: "text-amber-500",
            bg: "bg-amber-50 dark:bg-amber-900/20"
        },
        {
            title: "Tax Optimizer",
            desc: "Compare Old vs New Regime for maximum savings.",
            icon: FileText,
            path: "/tax-calculator",
            color: "text-slate-500",
            bg: "bg-slate-50 dark:bg-slate-900/20"
        },
        {
            title: "Inflation check",
            desc: "See how inflation erodes your purchasing power.",
            icon: TrendingDown,
            path: "/inflation-calculator",
            color: "text-orange-500",
            bg: "bg-orange-50 dark:bg-orange-900/20"
        }
    ];

    const filteredTools = tools.filter(tool =>
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex flex-col font-sans">
            <SEO
                title="Stable Money | Smart Financial Calculators & Wealth Tools"
                description="Calculate SIP returns, Tax savings (Old vs New), Loan EMIs, and Inflation impacts with Stable Money. Precise tools for your financial independence."
                keywords="SIP calculator, Income Tax calculator FY 2025-26, Loan EMI calculator, Inflation calculator India, FIRE calculator"
                canonical="https://stablemoney.com/"
            />

            {/* Note: Layout usually wraps content, but here we want full control so we might use Navbar directly or assume Layout is just Navbar + Content container. 
                 Looking at Layout.tsx, it wraps children in a container. For Homepage we want full width Hero.
                 So we will USE Navbar separately if needed, OR just use Layout and accept container? 
                 The User asked for specific Sticky Navbar. Let's use Layout but maybe we need to adjust Layout to allow full width? 
                 Actually, looking at previous files, Layout.tsx has `container mx-auto px-4 py-8`.
                 We might want to NOT use Layout for the Homepage to have full width hero, but we need the Navbar.
                 Let's stick to using Layout for consistency but maybe we make the hero break out or just be inside container.
                 Actually, a contained Hero is fine too.
                 Wait, let's verify Layout.tsx content.
             */}

            {/* Custom Navbar placement if not using Layout, but existing pages use Layout. 
                Let's use Layout for now but we might want to refactor Layout later if we want full-width backgrounds.
                For now, I will assume I can put the Hero inside the container or I will refactor Layout.
                Actually, usually Homepage has full width Hero. 
                Let's import Navbar directly and make a custom page layout for Home.
            */}

            {/* Header / Navbar is handled by App.tsx usually? No, pages wrap themselves in Layout. 
                So I will import Navbar here directly to have full control of the page structure (Full width hero).
            */}

            {/* We need Navbar to be sticky as per requirement. I will handle that in Navbar.tsx update later. */}
            <div className="sticky top-0 z-50">
                {/* I will just render a placeholder here or rely on the updated Navbar component later. 
                     Actually, code in App.tsx doesn't render Navbar, pages do via Layout.
                     So I will use the Navbar component directly.
                 */}
                {/* Import Navbar dynamically or just use the one we have */}
            </div>

            {/* Let's construct the page content assuming we will modify App.tsx to potentially render Navbar globally or we just include it here. 
                 Previous pages used <Layout>. I will use <Navbar> + <main> + <Footer>.
             */}

            {/* Navbar is strictly imported in the real file, I need to add import */}

            {/* Dashboard or Hero Logic */}
            {showDashboard ? (
                <FinancialDashboard />
            ) : (
                /* Hero Section (Onboarding) */
                <header className="bg-white dark:bg-gray-800 pt-8 pb-16 lg:pt-16 lg:pb-24 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
                            {/* Text Content */}
                            <div className="flex-1 space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    Financial Tools Suite
                                </div>
                                <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                                    Master Your Money, <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">Build Your Wealth.</span>
                                </h1>
                                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                    Professional-grade financial calculators and currency tools designed to help you make smarter decisions. Free, fast, and privacy-focused.
                                </p>

                                {/* Search Bar */}
                                <div className="max-w-md mx-auto lg:mx-0 relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-4 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-all"
                                        placeholder="Search for a tool (e.g., 'SIP', 'Tax', 'EMI')..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <div className="pt-4 flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-slate-500">
                                    <span>Popular:</span>
                                    <button onClick={() => setSearchQuery('SIP')} className="hover:text-emerald-600 underline decoration-dotted">SIP Calculator</button>
                                    <button onClick={() => setSearchQuery('Tax')} className="hover:text-emerald-600 underline decoration-dotted">Income Tax</button>
                                    <button onClick={() => setSearchQuery('Rent')} className="hover:text-emerald-600 underline decoration-dotted">Rent vs Buy</button>
                                </div>
                            </div>

                            {/* Abstract Hero Image */}
                            <div className="flex-1 w-full max-w-lg lg:max-w-none">
                                <div className="relative">
                                    {/* Abstract SVG Representation of Growth */}
                                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-2xl text-emerald-500">
                                        <defs>
                                            <linearGradient id="growthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                                                <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                                            </linearGradient>
                                        </defs>
                                        <path fill="url(#growthGradient)" d="M45.7,-76.3C58.9,-69.3,69.1,-55.6,76.5,-41.2C83.9,-26.8,88.5,-11.7,85.6,2.2C82.7,16.1,72.3,28.8,61.7,39.6C51.1,50.4,40.3,59.3,28.1,66.3C15.9,73.3,2.3,78.3,-10.8,77.4C-23.9,76.5,-36.5,69.7,-47.3,60.2C-58.1,50.7,-67.1,38.5,-72.6,25.1C-78.1,11.7,-80.1,-2.9,-75.7,-16.1C-71.3,-29.3,-60.5,-41.1,-48.8,-48.6C-37.1,-56.1,-24.5,-59.3,-11.2,-61.2C2.1,-63.1,15.4,-63.7,32.5,-83.3" transform="translate(100 100) scale(1.1)" opacity="0.1" />
                                        <path d="M100,150 L140,110 L160,130 L190,80" fill="none" stroke="url(#growthGradient)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="100" cy="150" r="4" fill="#3b82f6" />
                                        <circle cx="140" cy="110" r="4" fill="#3b82f6" />
                                        <circle cx="160" cy="130" r="4" fill="#3b82f6" />
                                        <circle cx="190" cy="80" r="6" fill="#10b981" />
                                    </svg>

                                    {/* Floating Cards */}
                                    <div className="absolute top-1/4 -left-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 animate-bounce" style={{ animationDuration: '3s' }}>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-100 p-2 rounded-lg"><ArrowUpRight className="w-5 h-5 text-green-600" /></div>
                                            <div>
                                                <p className="text-xs text-slate-500">Total Savings</p>
                                                <p className="font-bold text-slate-900 dark:text-white">₹12.5L</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-1/4 -right-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 animate-bounce" style={{ animationDuration: '4s' }}>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-100 p-2 rounded-lg"><PieChart className="w-5 h-5 text-blue-600" /></div>
                                            <div>
                                                <p className="text-xs text-slate-500">Asset Allocation</p>
                                                <p className="font-bold text-slate-900 dark:text-white">Optimized</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            )}
            {/* Tools Grid */}
            <main className="container mx-auto px-4 py-16 flex-grow">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Financial Calculators</h2>
                    <p className="text-slate-600 dark:text-slate-400">Everything you need to plan your future.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTools.map((tool, index) => (
                        <Link
                            to={tool.path}
                            key={index}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-slate-200 dark:border-slate-700 group"
                        >
                            <div className={`${tool.bg} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}>
                                <tool.icon className={`w-7 h-7 ${tool.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">{tool.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                                {tool.desc}
                            </p>
                            <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                                Calculate Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredTools.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-500">No tools found matching "{searchQuery}". Try 'SIP' or 'EMI'.</p>
                    </div>
                )}
            </main>

            {/* Trust Bar */}
            <section className="bg-white dark:bg-slate-800 py-12 border-y border-slate-200 dark:border-slate-700">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Trusted by smart investors everywhere</p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
                        {/* Placeholder Logos (Just text for now styled to look like logos) */}
                        <span className="text-2xl font-bold text-slate-400">FINTECH</span>
                        <span className="text-2xl font-bold text-slate-400">InvestEasy</span>
                        <span className="text-2xl font-bold text-slate-400">WealthGrow</span>
                        <span className="text-2xl font-bold text-slate-400">TaxSaver</span>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};



