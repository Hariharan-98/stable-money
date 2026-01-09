import { useState, useMemo } from 'react';
import { CalculatorInput } from './CalculatorInput';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { IndianRupee, Home, Percent, Calendar, TrendingUp, DollarSign, Info } from 'lucide-react';


export const RentVsBuyCalculator = () => {
    // --- State: General ---
    const [timeHorizon, setTimeHorizon] = useState<number>(10); // Years

    // --- State: Renting ---
    const [monthlyRent, setMonthlyRent] = useState<number>(25000);
    const [rentIncrease, setRentIncrease] = useState<number>(5); // %
    const [investmentReturn, setInvestmentReturn] = useState<number>(7); // % (Returns on saved capital)

    // --- State: Buying ---
    const [propertyPrice, setPropertyPrice] = useState<number>(5000000); // 50L
    const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20); // %
    const [loanInterest, setLoanInterest] = useState<number>(8.5); // %
    const [loanTenure, setLoanTenure] = useState<number>(20); // Years
    const [appreciation, setAppreciation] = useState<number>(6); // %
    const [buyingCosts, setBuyingCosts] = useState<number>(7); // % (Registration, Stamp Duty etc)
    const [maintenance, setMaintenance] = useState<number>(2000); // Monthly

    // --- Helpers ---


    const formatLakhs = (val: number) => {
        const lakhs = val / 100000;
        return `₹${lakhs.toFixed(2)} L`;
    };

    // --- Simulation Engine ---
    const simulation = useMemo(() => {
        const months = timeHorizon * 12;
        const initialDownPayment = propertyPrice * (downPaymentPercent / 100);
        const initialBuyingCosts = propertyPrice * (buyingCosts / 100);
        const loanAmount = propertyPrice - initialDownPayment;

        // EMI Calculation
        const r = loanInterest / 12 / 100;
        const n = loanTenure * 12;
        const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

        // Renting Initial Corpus (Money that WOULD have been DownPayment + BuyingCosts)
        let rentCorpus = initialDownPayment + initialBuyingCosts;

        let currentPropValue = propertyPrice;
        let currentRent = monthlyRent;
        let outstandingLoan = loanAmount;
        let currentMaintenance = maintenance;

        const yearlyData = [];

        // Totals for summary
        let totalRentPaid = 0;
        let totalEMIPaid = 0;
        let totalMaintenancePaid = 0;

        for (let m = 1; m <= months; m++) {
            // --- Buying Scenario ---
            // Pay EMI
            const interestComponent = outstandingLoan * r;
            const principalComponent = emi - interestComponent;

            if (m <= n) {
                outstandingLoan -= principalComponent;
                totalEMIPaid += emi;
            } else {
                outstandingLoan = 0; // Loan paid off
            }

            // Maintenance
            totalMaintenancePaid += currentMaintenance;

            // Property Appreciation (Monthly compounding approximation)
            currentPropValue = currentPropValue * (1 + (appreciation / 100 / 12));


            // --- Renting Scenario ---
            totalRentPaid += currentRent;

            // Wealth Logic:
            // "Cost of Buying" monthly outflow = EMI + Maintenance
            // "Cost of Renting" monthly outflow = Rent
            // The difference is invested/withdrawn from the Rent Corpus

            const buyingOutflow = (m <= n ? emi : 0) + currentMaintenance;
            const rentingOutflow = currentRent;
            const surplus = buyingOutflow - rentingOutflow; // If +ve, Renter saves. If -ve, Renter pays extra from corpus.

            // Grow Corpus (Monthly return)
            rentCorpus = rentCorpus * (1 + (investmentReturn / 100 / 12));
            // Add Surplus
            rentCorpus += surplus;


            // --- Annual Adjustments ---
            if (m % 12 === 0) {
                currentRent = currentRent * (1 + (rentIncrease / 100));
                currentMaintenance = currentMaintenance * (1 + 0.04); // Assume 4% inflation on maintenance

                yearlyData.push({
                    year: m / 12,
                    buyingWealth: Math.round(currentPropValue - outstandingLoan),
                    rentingWealth: Math.round(rentCorpus),
                    propertyValue: Math.round(currentPropValue),
                    outstandingLoan: Math.round(outstandingLoan),
                    rentCorpus: Math.round(rentCorpus)
                });
            }
        }

        const finalBuyingWealth = currentPropValue - outstandingLoan;
        const finalRentingWealth = rentCorpus;

        return {
            yearlyData,
            summary: {
                finalBuyingWealth,
                finalRentingWealth,
                totalRentPaid,
                totalEMIPaid,
                totalMaintenancePaid,
                finalPropertyValue: currentPropValue,
                outstandingLoan: outstandingLoan > 0 ? outstandingLoan : 0
            }
        };

    }, [
        timeHorizon, monthlyRent, rentIncrease, investmentReturn,
        propertyPrice, downPaymentPercent, loanInterest, loanTenure, appreciation, buyingCosts, maintenance
    ]);

    const { summary, yearlyData } = simulation;
    const isBuyingBetter = summary.finalBuyingWealth > summary.finalRentingWealth;
    const wealthDifference = Math.abs(summary.finalBuyingWealth - summary.finalRentingWealth);

    // --- UI Components ---


    return (
        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden text-slate-100 font-sans">
            <div className="p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3 mb-2">
                    <Home className="w-6 h-6 text-neon-cyan" />
                    <h2 className="text-2xl font-display font-bold text-white">Rent vs Buy Planner</h2>
                </div>
                <p className="text-sm text-gray-400">Compare long-term wealth creation between renting with investments and buying a home.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Inputs Column */}
                {/* Inputs Column */}
                <div className="lg:col-span-4 p-6 border-r border-white/10 bg-white/5">

                    <div className="mb-8">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 border-l-4 border-neon-cyan pl-3">General Settings</h3>
                        <CalculatorInput label="Time Horizon" value={timeHorizon} setValue={setTimeHorizon} min={1} max={30} step={1} suffix="Years" icon={Calendar} iconClass="text-neon-cyan" />
                    </div>

                    <div className="mb-10">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 border-l-4 border-neon-green pl-3">Renting Scenario</h3>
                        <CalculatorInput label="Monthly Rent" value={monthlyRent} setValue={setMonthlyRent} min={5000} max={200000} step={1000} icon={IndianRupee} iconClass="text-neon-green" />
                        <CalculatorInput label="Annual Increase" value={rentIncrease} setValue={setRentIncrease} min={0} max={15} step={0.5} suffix="%" icon={TrendingUp} iconClass="text-neon-amber" />
                        <CalculatorInput label="Return on Savings" value={investmentReturn} setValue={setInvestmentReturn} min={1} max={20} step={0.5} suffix="%" icon={Percent} iconClass="text-neon-cyan" />
                    </div>

                    <div className="mb-0">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 border-l-4 border-neon-purple pl-3">Buying Scenario</h3>
                        <CalculatorInput label="Property Price" value={propertyPrice} setValue={setPropertyPrice} min={1000000} max={50000000} step={500000} icon={Home} iconClass="text-neon-purple" />
                        <CalculatorInput label="Down Payment" value={downPaymentPercent} setValue={setDownPaymentPercent} min={5} max={80} step={5} suffix="%" icon={Percent} iconClass="text-neon-cyan" />
                        <CalculatorInput label="Loan Interest" value={loanInterest} setValue={setLoanInterest} min={4} max={15} step={0.1} suffix="%" icon={Percent} iconClass="text-neon-orange" />
                        <CalculatorInput label="Loan Tenure" value={loanTenure} setValue={setLoanTenure} min={5} max={30} step={1} suffix="Years" icon={Calendar} iconClass="text-neon-cyan" />
                        <CalculatorInput label="Appreciation" value={appreciation} setValue={setAppreciation} min={0} max={15} step={0.5} suffix="%" icon={TrendingUp} iconClass="text-neon-green" />
                        <CalculatorInput label="Maintenance" value={maintenance} setValue={setMaintenance} min={500} max={10000} step={100} icon={IndianRupee} iconClass="text-neon-purple" />
                        <CalculatorInput label="Buying Costs" value={buyingCosts} setValue={setBuyingCosts} min={1} max={15} step={1} suffix="%" icon={Info} iconClass="text-neon-cyan" />
                    </div>
                </div>

                {/* Results Column */}
                {/* Results Column */}
                <div className="lg:col-span-8 p-6 lg:p-8 space-y-8">

                    {/* Recommendation Card */}
                    <div className={`relative glass p-10 rounded-[2.5rem] border transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden group ${isBuyingBetter ? 'border-neon-purple/40 shadow-neon-purple/5' : 'border-neon-green/40 shadow-neon-green/5'}`}>
                        {/* Background glowing blobs */}
                        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] -mr-48 -mt-48 transition-opacity opacity-40 group-hover:opacity-60 ${isBuyingBetter ? 'bg-neon-purple/30' : 'bg-neon-green/30'}`}></div>
                        <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[100px] -ml-32 -mb-32 transition-opacity opacity-20 ${isBuyingBetter ? 'bg-neon-purple/20' : 'bg-neon-green/20'}`}></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                            <div className={`p-8 rounded-[2rem] shadow-2xl ring-1 transition-transform group-hover:scale-110 duration-500 ${isBuyingBetter ? 'bg-neon-purple/10 text-neon-purple ring-neon-purple/30 glow-purple' : 'bg-neon-green/10 text-neon-green ring-neon-green/30 glow-green'}`}>
                                {isBuyingBetter ? <Home className="w-14 h-14" /> : <TrendingUp className="w-14 h-14" />}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-gray-500">Stable Money Verdict</p>
                                <h4 className={`text-4xl md:text-5xl font-display font-black mb-6 tracking-tighter ${isBuyingBetter ? 'text-white' : 'text-white'}`}>
                                    {isBuyingBetter ? 'Buy the Home' : 'Rent & Invest'}
                                </h4>
                                <div className="space-y-4">
                                    <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-xl">
                                        Over <span className="text-white font-bold">{timeHorizon} years</span>, {isBuyingBetter ? 'home ownership' : 'renting with aggressive investing'} creates <span className={`font-black underline decoration-4 underline-offset-8 ${isBuyingBetter ? 'text-neon-purple decoration-neon-purple/30' : 'text-neon-green decoration-neon-green/30'}`}>{formatLakhs(wealthDifference)}</span> more wealth.
                                    </p>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                                        <div className="bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Total Net Wealth</p>
                                            <p className={`text-2xl font-display font-black ${isBuyingBetter ? 'text-neon-purple' : 'text-neon-green'}`}>
                                                {formatLakhs(Math.max(summary.finalBuyingWealth, summary.finalRentingWealth))}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comparison Chart */}
                    <div className="h-96 w-full glass rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8">Wealth Accumulation Gap</h4>
                        <ResponsiveContainer width="100%" height="80%">
                            <AreaChart data={yearlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.05} />
                                <XAxis
                                    dataKey="year"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                        borderColor: 'rgba(255, 255, 255, 0.1)',
                                        color: '#ffffff',
                                        borderRadius: '12px',
                                        backdropFilter: 'blur(8px)',
                                        fontSize: '11px',
                                        fontWeight: 'bold'
                                    }}
                                    itemStyle={{ color: '#ffffff' }}
                                    formatter={(val: any) => [formatLakhs(Number(val)), 'Net Wealth']}
                                    labelFormatter={(year) => `Year ${year}`}
                                />
                                <Area type="monotone" name="Renting" dataKey="rentingWealth" stroke="#10b981" fillOpacity={1} fill="url(#colorRent)" strokeWidth={4} />
                                <Area type="monotone" name="Buying" dataKey="buyingWealth" stroke="#a855f7" fillOpacity={1} fill="url(#colorBuy)" strokeWidth={4} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Detailed Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Rent Stats */}
                        <div className="glass rounded-2xl p-6 border border-white/10 shadow-lg group">
                            <h4 className="text-neon-green text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" /> Renting Scenario
                            </h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Final Portofolio</span>
                                    <span className="font-display font-black text-xl text-white group-hover:text-neon-green transition-colors">{formatLakhs(summary.finalRentingWealth)}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Rent Paid</span>
                                    <span className="text-sm font-bold text-gray-400">{formatLakhs(summary.totalRentPaid)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Buy Stats */}
                        <div className="glass rounded-2xl p-6 border border-white/10 shadow-lg group">
                            <h4 className="text-neon-purple text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Home className="w-4 h-4" /> Buying Scenario
                            </h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Property Value</span>
                                    <span className="font-display font-black text-xl text-white group-hover:text-neon-purple transition-colors">{formatLakhs(summary.finalPropertyValue)}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Debt Left</span>
                                    <span className="text-sm font-bold text-neon-orange">-{formatLakhs(summary.outstandingLoan)}</span>
                                </div>
                                <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Net Equity</span>
                                    <span className="font-display font-black text-xl text-neon-purple">{formatLakhs(summary.finalBuyingWealth)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
