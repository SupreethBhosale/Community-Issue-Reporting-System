import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, MapPin, AlertCircle, Camera, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const TransportModule = () => {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState('Bus');
  const [issue, setIssue] = useState('Traffic');
  const [severity, setSeverity] = useState('Medium');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Transport delay reported successfully!');
    navigate('/transport/track');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>Transport System</h1>
          <p style={{ color: 'var(--text-muted)' }}>Report and track vehicle delays and road blocks.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="glass-button" style={{ cursor: 'default' }}>Report Delay</button>
          <Link to="/transport/track" className="glass-button-outline">Track Delays</Link>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle color="var(--primary-color)" /> Report New Delay
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Vehicle Type</label>
              <select className="glass-input" value={vehicle} onChange={(e) => setVehicle(e.target.value)} required>
                {['Bus', 'Metro', 'E-Rickshaw', 'Cab', 'Road Issues'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Issue Type</label>
              <select className="glass-input" value={issue} onChange={(e) => setIssue(e.target.value)} required>
                {['Traffic', 'Crowd', 'Road Block', 'Heavy Rain', 'Infrastructure'].map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Description</label>
            <textarea className="glass-input" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide additional details..." required></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Severity</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Low', 'Medium', 'High'].map(s => (
                  <button type="button" key={s} onClick={() => setSeverity(s)} className={severity === s ? 'glass-button' : 'glass-button-outline'} style={{ flex: 1, padding: '8px' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Location</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="text" className="glass-input" placeholder="Fetching location..." defaultValue="12.9716° N, 77.5946° E" />
                <button type="button" className="glass-button-outline" title="Auto detect location"><MapPin size={18} /></button>
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Upload Image</label>
            <div className="glass-panel" style={{ borderStyle: 'dashed', borderWidth: '2px', padding: '32px', textAlign: 'center', cursor: 'pointer' }}>
              <Camera size={32} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Click to upload or drag and drop</p>
            </div>
          </div>

          <button type="submit" className="glass-button" style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>
            <CheckCircle size={20} /> Submit Report
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default TransportModule;
