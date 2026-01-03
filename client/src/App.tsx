import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/currency-converter" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/currencies" element={<Currencies />} />

            <Route path="/calculator" element={
              <>
                <Navbar />
                <div className="pt-24 pb-12 container mx-auto px-4">
                  <StepUpSIPCalculator />
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
