import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bus, Lightbulb, Trash2, MapPin, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [locationPerm, setLocationPerm] = useState(null);

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
          <h1 style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>Welcome back, User!</h1>
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
    </motion.div>
  );
};

export default Dashboard;
