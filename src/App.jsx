import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
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
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800);
    
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        {loading && <SplashScreen key="splash" />}
      </AnimatePresence>
      <div style={{ display: loading || !authChecked ? 'none' : 'block' }}>
        <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        
        {/* Authenticated Routes with Sidebar/Layout */}
        <Route element={user ? <Layout user={user} /> : <Navigate to="/" />}>
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/transport" element={<TransportModule user={user} />} />
          <Route path="/transport/track" element={<TrackDelay />} />
          <Route path="/utilities" element={<UtilitiesModule user={user} />} />
          <Route path="/dumping" element={<DumpingModule user={user} />} />
        </Route>

        {/* Dedicated Admin Route */}
        <Route path="/admin" element={user && user.email === 'admin@sevakendra.com' ? <AdminDashboard /> : <Navigate to="/dashboard" />} />
      </Routes>
      <ToastContainer position="bottom-right" theme="colored" />
      </div>
    </BrowserRouter>
  );
}

export default App;
