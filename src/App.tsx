import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips';
import Fuel from './pages/Fuel';
import MapView from './pages/MapView';
import Profile from './pages/Profile';
import Expenses from './pages/Expenses';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/fuel" element={<Fuel />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/map" element={<MapView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
