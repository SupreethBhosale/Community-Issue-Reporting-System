import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import TransportModule from './pages/TransportModule';
import UtilitiesModule from './pages/UtilitiesModule';
import DumpingModule from './pages/DumpingModule';
import AdminDashboard from './pages/AdminDashboard';
import TrackDelay from './pages/TrackDelay';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        {loading && <SplashScreen key="splash" />}
      </AnimatePresence>
      <div style={{ display: loading ? 'none' : 'block' }}>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Authenticated Routes with Sidebar/Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transport" element={<TransportModule />} />
          <Route path="/transport/track" element={<TrackDelay />} />
          <Route path="/utilities" element={<UtilitiesModule />} />
          <Route path="/dumping" element={<DumpingModule />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
      <ToastContainer position="bottom-right" theme="colored" />
      </div>
    </BrowserRouter>
  );
}

export default App;
