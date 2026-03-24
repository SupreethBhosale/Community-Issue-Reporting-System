import { NavLink, useLocation } from 'react-router-dom';
import { Home, Bus, Lightbulb, Trash2, MapPin, Activity, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');

  const navItems = isAdmin ? [
    { name: 'Admin Dashboard', path: '/admin', icon: <ShieldAlert size={20} /> },
  ] : [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'Transport System', path: '/transport', icon: <Bus size={20} /> },
    { name: 'Public Utilities', path: '/utilities', icon: <Lightbulb size={20} /> },
    { name: 'Dumping Issues', path: '/dumping', icon: <Trash2 size={20} /> },
  ];

  const cities = ['Bangalore', 'Mysore', 'Hubli', 'Dharwad', 'Goa', 'Chennai', 'Kerala', 'Telangana', 'Mumbai'];

  return (
    <div className="glass-panel" style={{ width: '280px', margin: '16px 0 16px 16px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 32px)', overflowY: 'auto' }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={24} />
          Menu
        </h2>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              fontWeight: 500,
              background: isActive ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
              color: isActive ? 'var(--primary-color)' : 'var(--text-main)',
              transition: 'all 0.2s ease',
            })}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}

        {!isAdmin && (
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', paddingLeft: '8px' }}>
              Service Areas
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {cities.map(city => (
                <span key={city} style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(0,0,0,0.05)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                  {city}
                </span>
              ))}
            </div>

            <div className="glass-card" style={{ marginTop: '20px', padding: '16px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <MapPin size={16} color="var(--primary-color)" />
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Live Tracking</span>
              </div>
              <div style={{ height: '100px', background: '#e5e7eb', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
                {/* Dummy Map UI */}
                <div style={{ position: 'absolute', inset: 0, opacity: 0.5, backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '12px', height: '12px', background: 'var(--primary-color)', borderRadius: '50%', boxShadow: '0 0 0 4px rgba(79, 70, 229, 0.3)' }} />
                <motion.div animate={{ x: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ position: 'absolute', top: '40%', left: '30%', width: '8px', height: '8px', background: 'var(--danger-color)', borderRadius: '50%' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
