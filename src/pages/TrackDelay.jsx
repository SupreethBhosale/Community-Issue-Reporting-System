import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Clock, AlertTriangle } from 'lucide-react';

const TrackDelay = () => {
  const dummyDelays = [
    { id: 1, vehicle: 'Bus Route 201', cause: 'Heavy Traffic', severity: 'High', location: 'MG Road Junction', eta: '45 mins', time: '10 mins ago', color: 'var(--danger-color)' },
    { id: 2, vehicle: 'Metro Purple Line', cause: 'Crowd / Technical', severity: 'Medium', location: 'Indiranagar Station', eta: '15 mins', time: '1 hour ago', color: 'var(--warning-color)' },
    { id: 3, vehicle: 'Road Issues', cause: 'Road Block', severity: 'High', location: 'Koramangala 80ft Road', eta: 'Unknown', time: '2 hours ago', color: 'var(--danger-color)' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>Track Delays</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time updates on reported transport issues.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to="/transport" className="glass-button-outline">Back to Report</Link>
          <button className="glass-button" style={{ cursor: 'default' }}>Track Delays</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {dummyDelays.map((delay, index) => (
          <motion.div key={delay.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.1 }}>
            <div className="glass-card" style={{ padding: '24px', borderLeft: `4px solid ${delay.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0 }}>{delay.vehicle}</h3>
                <span className="glass-panel" style={{ padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, color: delay.color }}>
                  {delay.severity} Priority
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                  <AlertTriangle size={18} /> <span style={{ fontWeight: 500 }}>Cause:</span> {delay.cause}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                  <MapPin size={18} /> <span style={{ fontWeight: 500 }}>Location:</span> {delay.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                  <Clock size={18} /> <span style={{ fontWeight: 500 }}>Estimated Resolution:</span> {delay.eta}
                </div>
              </div>

              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)', fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                Reported {delay.time}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TrackDelay;
