import { useState, useMemo } from 'react';
import {
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { IndianRupee, Home, Percent, Calendar, TrendingUp, DollarSign, Info } from 'lucide-react';
import { trackSliderInteraction } from '../utils/analytics';

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
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(Math.round(val));
    };

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
    const InputSlider = ({ label, value, setValue, min, max, step, suffix, icon: Icon }: any) => (
        <div className="mb-5">
            <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                    {Icon && <Icon className="w-3 h-3" />}
                    {label}
                </label>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    {typeof value === 'number' && !suffix?.includes('Years') && !suffix?.includes('%') ? formatCurrency(value) : value} {suffix}
                </span>
            </div>
            <input
                type="range"
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                onMouseUp={() => trackSliderInteraction('Rent vs Buy Calculator')}
                onTouchEnd={() => trackSliderInteraction('Rent vs Buy Calculator')}
            />
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                    <Home className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Rent vs Buy Calculator</h2>
                </div>
                <p className="text-sm text-gray-500">Compare long-term wealth creation between renting with investments and buying a home.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Inputs Column */}
                <div className="lg:col-span-4 max-h-[800px] overflow-y-auto p-6 border-r border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 custom-scrollbar">

                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-blue-500 pl-2">General Settings</h3>
                        <InputSlider label="Time Horizon" value={timeHorizon} setValue={setTimeHorizon} min={1} max={30} step={1} suffix="Years" icon={Calendar} />
                    </div>

                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-green-500 pl-2">Renting Scenario</h3>
                        <InputSlider label="Monthly Rent" value={monthlyRent} setValue={setMonthlyRent} min={5000} max={200000} step={1000} icon={IndianRupee} />
                        <InputSlider label="Annual Rent Increase" value={rentIncrease} setValue={setRentIncrease} min={0} max={15} step={0.5} suffix="%" icon={TrendingUp} />
                        <InputSlider label="Investment Returns" value={investmentReturn} setValue={setInvestmentReturn} min={1} max={20} step={0.5} suffix="%" icon={Percent} />
                    </div>

                    <div className="mb-0">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-indigo-500 pl-2">Buying Scenario</h3>
                        <InputSlider label="Property Price" value={propertyPrice} setValue={setPropertyPrice} min={1000000} max={50000000} step={500000} icon={Home} />
                        <InputSlider label="Down Payment" value={downPaymentPercent} setValue={setDownPaymentPercent} min={5} max={80} step={5} suffix="%" icon={Percent} />
                        <InputSlider label="Loan Interest Rate" value={loanInterest} setValue={setLoanInterest} min={4} max={15} step={0.1} suffix="%" icon={Percent} />
                        <InputSlider label="Loan Tenure" value={loanTenure} setValue={setLoanTenure} min={5} max={30} step={1} suffix="Years" icon={Calendar} />
                        <InputSlider label="Appreciation Rate" value={appreciation} setValue={setAppreciation} min={0} max={15} step={0.5} suffix="%" icon={TrendingUp} />
                        <InputSlider label="Monthly Maintenance" value={maintenance} setValue={setMaintenance} min={500} max={10000} step={100} icon={IndianRupee} />
                        <InputSlider label="Buying Costs" value={buyingCosts} setValue={setBuyingCosts} min={1} max={15} step={1} suffix="%" icon={Info} />
                    </div>
                </div>

                {/* Results Column */}
                <div className="lg:col-span-8 p-6 lg:p-8 space-y-8 bg-white dark:bg-gray-900">

                    {/* Recommendation Card */}
                    <div className={`p-6 rounded-xl border-l-8 shadow-sm ${isBuyingBetter ? 'bg-indigo-50 border-indigo-600 dark:bg-indigo-900/20' : 'bg-green-50 border-green-600 dark:bg-green-900/20'}`}>
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-full ${isBuyingBetter ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
                                {isBuyingBetter ? <Home className="w-8 h-8" /> : <DollarSign className="w-8 h-8" />}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                    {isBuyingBetter ? 'Buying is More Profitable' : 'Renting is More Profitable'}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    After <strong>{timeHorizon} years</strong>, {isBuyingBetter ? 'buying' : 'renting'} will leave you richer by approximately <span className="font-bold text-gray-900 dark:text-white text-lg">{formatLakhs(wealthDifference)}</span>.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Comparison Chart */}
                    <div className="h-80 w-full relative">
                        <h4 className="text-sm font-bold text-gray-500 uppercase mb-4">Net Wealth Projection (Adjusted for Inflation)</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={yearlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1f2937', color: '#fff' }}
                                    formatter={(val: any) => formatLakhs(Number(val))}
                                />
                                <Legend verticalAlign="top" height={36} />
                                <Area type="monotone" name="Renting Net Wealth" dataKey="rentingWealth" stroke="#10b981" fillOpacity={1} fill="url(#colorRent)" strokeWidth={3} />
                                <Area type="monotone" name="Buying Net Wealth" dataKey="buyingWealth" stroke="#6366f1" fillOpacity={1} fill="url(#colorBuy)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Detailed Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Rent Stats */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                            <h4 className="text-green-600 font-bold mb-4 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" /> Renting Strategy
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Final Portfolio Value</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{formatLakhs(summary.finalRentingWealth)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Total Rent Paid</span>
                                    <span className="text-gray-900 dark:text-white">{formatLakhs(summary.totalRentPaid)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Buy Stats */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                            <h4 className="text-indigo-600 font-bold mb-4 flex items-center gap-2">
                                <Home className="w-4 h-4" /> Buying Strategy
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Final Property Value</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{formatLakhs(summary.finalPropertyValue)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Outstanding Loan</span>
                                    <span className="text-red-500">-{formatLakhs(summary.outstandingLoan)}</span>
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-600 my-2 pt-2 flex justify-between">
                                    <span className="text-gray-500">Net Equity</span>
                                    <span className="font-bold text-indigo-600">{formatLakhs(summary.finalBuyingWealth)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
