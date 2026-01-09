import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { FinancialDashboard } from '../components/dashboard/FinancialDashboard';
import {
    Search, ArrowRight, TrendingUp, Calculator,
    Home, Flame, FileText, TrendingDown, ArrowRightLeft
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
            title: "Currency Analytics",
            desc: "Precise real-time exchange rates for 150+ global assets.",
            icon: ArrowRightLeft,
            path: "/currency-converter",
            color: "text-neon-cyan",
            accent: "bg-neon-cyan/10",
            border: "hover:border-neon-cyan/50"
        },
        {
            title: "SIP Optimizer",
            desc: "Project future wealth with precision Step-Up growth.",
            icon: TrendingUp,
            path: "/calculator",
            color: "text-neon-green",
            accent: "bg-neon-green/10",
            border: "hover:border-neon-green/50"
        },
        {
            title: "EMI Planner",
            desc: "Smart debt management with prepayment strategies.",
            icon: Calculator,
            path: "/emi-calculator",
            color: "text-neon-purple",
            accent: "bg-neon-purple/10",
            border: "hover:border-neon-purple/50"
        },
        {
            title: "Rent vs Buy",
            desc: "Data-driven analysis for your property decisions.",
            icon: Home,
            path: "/rent-vs-buy",
            color: "text-neon-pink",
            accent: "bg-neon-pink/10",
            border: "hover:border-neon-pink/50"
        },
        {
            title: "FIRE Architect",
            desc: "Engineer your path to absolute financial freedom.",
            icon: Flame,
            path: "/fire-calculator",
            color: "text-neon-amber",
            accent: "bg-neon-amber/10",
            border: "hover:border-neon-amber/50"
        },
        {
            title: "Tax Optimizer",
            desc: "Algorithmic comparison for maximum tax savings.",
            icon: FileText,
            path: "/tax-calculator",
            color: "text-neon-blue",
            accent: "bg-neon-blue/10",
            border: "hover:border-neon-blue/50"
        },
        {
            title: "Inflation Guard",
            desc: "Quantify the erosion of your purchasing power.",
            icon: TrendingDown,
            path: "/inflation-calculator",
            color: "text-neon-orange",
            accent: "bg-neon-orange/10",
            border: "hover:border-neon-orange/50"
        }
    ];

    const filteredTools = tools.filter(tool =>
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col font-sans">
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
                <header className="relative pt-16 pb-24 overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-neon-cyan/10 rounded-full blur-[120px] -mr-96 -mt-96 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[100px] -ml-64 -mb-64 pointer-events-none"></div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            {/* Text Content */}
                            <div className="flex-1 space-y-10 text-center lg:text-left">
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border border-white/10 text-neon-cyan text-[10px] font-black uppercase tracking-[0.3em] ring-1 ring-neon-cyan/20">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
                                    </span>
                                    Stable Money OS v2.0
                                </div>
                                <h1 className="text-6xl lg:text-8xl font-display font-black text-white tracking-tighter leading-none">
                                    Engineering <br />
                                    <span className="gradient-text">Absolute Wealth.</span>
                                </h1>
                                <p className="text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                                    Access a professional-grade suite of financial intelligence tools designed to simulate, optimize, and secure your financial future.
                                </p>

                                {/* Search Bar */}
                                <div className="max-w-xl mx-auto lg:mx-0 relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-neon-cyan transition-colors">
                                        <Search className="h-6 w-6" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-14 pr-6 py-6 glass border border-white/10 rounded-[30px] leading-5 text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan/50 focus:ring-4 focus:ring-neon-cyan/5 shadow-2xl transition-all font-display text-lg"
                                        placeholder="Command search (e.g. 'FIRE', 'Debt')..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2">
                                        <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-gray-500 border border-white/5">⌘</div>
                                        <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-gray-500 border border-white/5">K</div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-8 justify-center lg:justify-start text-[10px] font-black uppercase tracking-[0.2em]">
                                    <span className="text-gray-600">Quick Access:</span>
                                    <button onClick={() => setSearchQuery('SIP')} className="text-gray-400 hover:text-white transition-colors border-b-2 border-transparent hover:border-neon-green">SIP Optimizer</button>
                                    <button onClick={() => setSearchQuery('Tax')} className="text-gray-400 hover:text-white transition-colors border-b-2 border-transparent hover:border-neon-blue">Tax Vault</button>
                                    <button onClick={() => setSearchQuery('FIRE')} className="text-gray-400 hover:text-white transition-colors border-b-2 border-transparent hover:border-neon-amber">FIRE Path</button>
                                </div>
                            </div>

                            {/* Abstract Visual Representation */}
                            <div className="flex-1 w-full relative group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-neon-cyan/20 to-neon-purple/20 rounded-[40px] blur-[100px] group-hover:opacity-100 opacity-60 transition-opacity"></div>
                                <div className="relative glass border border-white/10 p-10 rounded-[40px] shadow-3xl overflow-hidden">
                                    {/* Simple animated visualization inside glass card */}
                                    <div className="flex items-end justify-between gap-2 h-48 mb-8">
                                        {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                                            <div key={i} className="flex-1 bg-gradient-to-t from-neon-cyan to-transparent rounded-t-lg transition-all duration-1000" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                    <div className="space-y-6">
                                        <div className="h-4 w-3/4 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-neon-cyan w-2/3 shadow-[0_0_10px_rgba(6,182,212,1)]"></div>
                                        </div>
                                        <div className="h-4 w-1/2 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-neon-purple w-1/3 shadow-[0_0_10px_rgba(168,85,247,1)]"></div>
                                        </div>
                                    </div>

                                    {/* Overlapping Info Cards */}
                                    <div className="absolute top-8 right-8 glass p-4 rounded-2xl border border-white/20 shadow-xl animate-float">
                                        <p className="text-[10px] font-black text-neon-green uppercase mb-1">Growth</p>
                                        <p className="text-2xl font-display font-black text-white">+24.8%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            )}
            {/* Tools Grid */}
            <main className="container mx-auto px-6 py-24 flex-grow">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-sm font-black text-neon-cyan uppercase tracking-[0.4em] mb-4">Financial Core</h2>
                        <h3 className="text-4xl font-display font-black text-white">Algorithm Matrix</h3>
                    </div>
                    <p className="text-gray-500 font-medium max-w-sm text-right">
                        Explore our high-precision simulators for every stage of your financial lifecycle.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredTools.map((tool, index) => (
                        <Link
                            to={tool.path}
                            key={index}
                            className={`glass p-8 rounded-[30px] border border-white/5 ${tool.border} hover:bg-white/5 transition-all duration-500 group relative overflow-hidden flex flex-col h-full`}
                        >
                            {/* Decorative background glow */}
                            <div className={`absolute top-0 right-0 w-32 h-32 ${tool.accent} rounded-full blur-[80px] -mr-16 -mt-16 group-hover:opacity-100 opacity-0 transition-opacity`}></div>

                            <div className={`${tool.accent} w-16 h-16 rounded-[20px] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 ring-1 ring-white/5`}>
                                <tool.icon className={`w-8 h-8 ${tool.color}`} />
                            </div>

                            <h3 className="text-2xl font-display font-black text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-500 transition-all">
                                {tool.title}
                            </h3>

                            <p className="text-sm text-gray-500 mb-10 leading-relaxed font-medium flex-grow">
                                {tool.desc}
                            </p>

                            <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-neon-cyan transition-colors">
                                Init Simulation <ArrowRight className="w-3.5 h-3.5 ml-3 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredTools.length === 0 && (
                    <div className="text-center py-24 glass rounded-[40px] border border-white/5">
                        <p className="text-gray-500 font-display font-bold text-xl">No algorithms matched your query.</p>
                        <p className="text-sm text-gray-600 mt-2 uppercase tracking-widest">Try 'Tax', 'SIP', or 'Wealth'</p>
                    </div>
                )}
            </main>

            {/* Trust Bar */}
            <section className="relative overflow-hidden py-24">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-block px-6 py-2 glass rounded-full border border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-12">
                        Global Fintech Standards
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-20 grayscale brightness-200">
                        {/* More futuristic placeholder "logos" */}
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-3xl font-display font-black tracking-tighter">QUANTUM</span>
                            <span className="text-[8px] font-bold tracking-[0.5em]">FINANCE</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-3xl font-display font-black tracking-tighter underline decoration-4 underline-offset-4 decoration-white/20">VALOR</span>
                            <span className="text-[8px] font-bold tracking-[0.5em]">ASSET MGMT</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-3xl font-display font-black tracking-tighter">ZENITH</span>
                            <span className="text-[8px] font-bold tracking-[0.5em]">WEALTH OS</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-3xl font-display font-black tracking-tighter italic">NEXUS</span>
                            <span className="text-[8px] font-bold tracking-[0.5em]">TRADING</span>
                        </div>
                    </div>
                </div>
                {/* Background wash */}
                <div className="absolute inset-0 bg-white/2 backdrop-blur-3xl border-y border-white/5 pointer-events-none"></div>
            </section>

            <Footer />
        </div>
    );
};



