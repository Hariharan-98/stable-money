import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Dashboard } from './pages/Dashboard';
import { History } from './pages/History';
import { Currencies } from './pages/Currencies';

import { StepUpSIPCalculator } from './components/StepUpSIPCalculator';
import { EMICalculatorPage } from './pages/EMICalculatorPage';
import { InflationCalculatorPage } from './pages/InflationCalculatorPage';
import { RentVsBuyCalculatorPage } from './pages/RentVsBuyCalculatorPage';
import { FIRECalculatorPage } from './pages/FIRECalculatorPage';
import { TaxCalculatorPage } from './pages/TaxCalculatorPage';
import { HomePage } from './pages/HomePage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ArrowLeft } from 'lucide-react';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen gradient-bg transition-colors duration-300 font-sans">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/currency-converter" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/currencies" element={<Currencies />} />

            <Route path="/calculator" element={
              <>
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                  <div className="space-y-8">
                    <div className="flex items-center space-x-4">
                      <Link
                        to="/"
                        className="glass p-2 rounded-lg hover:bg-white/10 text-gray-200 hover:text-neon-cyan transition-all"
                      >
                        <ArrowLeft className="w-6 h-6" />
                      </Link>
                      <div>
                        <h1 className="text-3xl font-display font-bold gradient-text">SIP Calculator</h1>
                        <p className="text-gray-300 mt-1">Calculate future wealth with Step-Up SIPs</p>
                      </div>
                    </div>
                    <StepUpSIPCalculator />
                  </div>
                </div>
                <Footer />
              </>
            } />

            <Route path="/emi-calculator" element={<EMICalculatorPage />} />
            <Route path="/inflation-calculator" element={<InflationCalculatorPage />} />
            <Route path="/rent-vs-buy" element={<RentVsBuyCalculatorPage />} />
            <Route path="/fire-calculator" element={<FIRECalculatorPage />} />
            <Route path="/tax-calculator" element={<TaxCalculatorPage />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
