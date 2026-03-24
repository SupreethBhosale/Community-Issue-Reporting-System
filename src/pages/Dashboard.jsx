import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bus, Lightbulb, Trash2, MapPin, AlertTriangle, Bell, PlusCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { listenToNotifications, listenToAllIssues } from '../services/firestore';
import MapComponent from '../components/MapComponent';

const Dashboard = ({ user }) => {
  const [locationPerm, setLocationPerm] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedCity = searchParams.get('city');

  useEffect(() => {
    // Ask for location permission popup mockup
    setTimeout(() => {
      if (confirm('Seva Kendra would like to access your location to provide better tracking.')) {
        setLocationPerm('granted');
        toast.success('Location access granted.', { position: 'top-center' });
      } else {
        setLocationPerm('denied');
        toast.warning('Location access denied. Manual entry required.', { position: 'top-center' });
      }
    }, 1000);

    const unsubNotifs = listenToNotifications(setNotifications);
    const unsubIssues = listenToAllIssues(setAllIssues);
    
    return () => {
      unsubNotifs();
      unsubIssues();
    };
  }, []);

  const modules = [
    {
      title: 'Transport System',
      description: 'Report or track delays for buses, metros, cabs, and road issues.',
      icon: <Bus size={48} />,
      path: '/transport',
      color: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    },
    {
      title: 'Public Utilities',
      description: 'Report issues regarding streetlights, electricity, and sewage.',
      icon: <Lightbulb size={48} />,
      path: '/utilities',
      color: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    },
    {
      title: 'Dumping Issues',
      description: 'Report illegal garbage dumping spots with upvote priorities.',
      icon: <Trash2 size={48} />,
      path: '/dumping',
      color: 'linear-gradient(135deg, #ef4444, #f87171)',
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>Welcome back, {user?.displayName || user?.name || 'User'}!</h1>
          <p style={{ color: 'var(--text-muted)' }}>Here is an overview of city civic services.</p>
        </div>
        {locationPerm && (
          <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {locationPerm === 'granted' ? (
              <><MapPin size={16} color="var(--success-color)" /> <span style={{ fontSize: '0.875rem' }}>Location Active</span></>
            ) : (
              <><AlertTriangle size={16} color="var(--warning-color)" /> <span style={{ fontSize: '0.875rem' }}>Location Disabled</span></>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {modules.map((mod, i) => (
          <motion.div
            key={mod.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={mod.path} style={{ display: 'block', textDecoration: 'none' }}>
              <div className="glass-card" style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ background: mod.color, width: '80px', height: '80px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '24px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                  {mod.icon}
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--text-main)' }}>{mod.title}</h2>
                <p style={{ color: 'var(--text-muted)', flex: 1, marginBottom: '24px' }}>{mod.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary-color)', fontWeight: 600 }}>
                  Open Module &rarr;
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Map Section */}
      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={24} color="var(--primary-color)" /> Live City Map
          </h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Click anywhere on the map to report an issue</span>
        </div>
        <div className="glass-card" style={{ height: '500px', padding: '16px', position: 'relative' }}>
          <MapComponent 
            issues={allIssues} 
            showNearbyAlerts={locationPerm === 'granted'} 
            onLocationSelect={(loc) => setSelectedLocation(loc)}
            selectedCity={selectedCity}
          />
          {selectedLocation && (
            <div className="glass-panel" style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', padding: '16px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '250px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <PlusCircle size={16} /> Report Here
                </h4>
                <button onClick={() => setSelectedLocation(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lat: {selectedLocation.lat.toFixed(4)}, Lng: {selectedLocation.lng.toFixed(4)}</p>
              <select className="glass-input" style={{ width: '100%', padding: '8px' }} onChange={(e) => e.target.value && navigate(`${e.target.value}?lat=${selectedLocation.lat}&lng=${selectedLocation.lng}`)}>
                <option value="">Select Category...</option>
                <option value="/transport">🚌 Transport</option>
                <option value="/utilities">💡 Utilities</option>
                <option value="/dumping">🗑️ Dumping</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={24} color="var(--primary-color)" /> Recent Notifications
        </h2>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {notifications.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No recent notifications.</p>}
          {notifications.map((notif, idx) => (
             <motion.div key={String(notif?.id || Math.random())} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} style={{ padding: '16px', background: 'rgba(255,255,255,0.4)', borderRadius: '12px', borderLeft: `4px solid ${notif.type === 'success' ? 'var(--success-color)' : 'var(--primary-color)'}` }}>
               <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-main)' }}>{String(notif?.message || 'New notification')}</p>
               <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{notif?.createdAt?.seconds ? new Date(notif.createdAt.seconds * 1000).toLocaleString() : 'Just now'}</span>
             </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
