import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Clock, AlertTriangle } from 'lucide-react';
import { listenToIssuesByCategory } from '../services/firestore';

const TrackDelay = () => {
  const [delays, setDelays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToIssuesByCategory('Transport', (data) => {
      setDelays(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'High': return 'var(--danger-color)';
      case 'Medium': return 'var(--warning-color)';
      default: return 'var(--success-color)';
    }
  };

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

      {loading && <p style={{ color: 'var(--text-muted)' }}>Loading live updates...</p>}
      {!loading && delays.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No delays reported currently.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {Array.isArray(delays) && delays.map((delay, index) => {
          const color = getSeverityColor(delay?.severity);
          return (
            <motion.div key={String(delay?.id || Math.random())} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.1 }}>
              <div className="glass-card" style={{ padding: '24px', borderLeft: `4px solid ${color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0 }}>{String(delay?.vehicle || delay?.type || 'Transport Issue')}</h3>
                  <span className="glass-panel" style={{ padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, color: color }}>
                    {String(delay?.severity || 'Normal')} Priority
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <AlertTriangle size={18} /> <span style={{ fontWeight: 500 }}>Cause:</span> {String(delay?.issue || delay?.description || 'Unknown')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <MapPin size={18} /> <span style={{ fontWeight: 500 }}>Location:</span> {String(delay?.location || 'Unknown location')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <Clock size={18} /> <span style={{ fontWeight: 500 }}>Status:</span> {String(delay?.status || 'Pending')}
                  </div>
                </div>

                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)', fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                  Reported {delay?.createdAt?.seconds ? new Date(delay.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default TrackDelay;
