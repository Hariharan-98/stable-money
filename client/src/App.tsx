import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { History } from './pages/History';
import { Currencies } from './pages/Currencies';

import { GoldRates } from './pages/GoldRates';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/currencies" element={<Currencies />} />
        <Route path="/gold-rates" element={<GoldRates />} />
      </Routes>
    </Router>
  );
}

export default App;
