import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, MapPin, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const UtilitiesModule = () => {
  const [issueType, setIssueType] = useState('Streetlight');
  const [location, setLocation] = useState('');
  const [pincode, setPincode] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock tracking data
  const trackedIssues = [
    { id: '#UT-1042', type: 'Streetlight', location: 'Indiranagar 100ft Rd', status: 'Pending', date: 'Oct 24, 2023' },
    { id: '#UT-0931', type: 'Sewage', location: 'Koramangala 4th Block', status: 'Resolved', date: 'Oct 20, 2023' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const confirmSubmit = () => {
    setShowConfirmation(false);
    toast.success('Public utility issue reported successfully!');
    setIssueType('Streetlight');
    setLocation('');
    setPincode('');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>Public Utilities</h1>
        <p style={{ color: 'var(--text-muted)' }}>Report and track streetlight, electricity, and sewage issues.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Report Form */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb color="var(--primary-color)" /> Report Issue
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Issue Type</label>
              <select className="glass-input" value={issueType} onChange={(e) => setIssueType(e.target.value)} required>
                {['Streetlight Issues', 'Electricity Issues', 'Sewage Issues'].map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Location Details</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                <input type="text" className="glass-input" style={{ paddingLeft: '40px' }} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Landmark or Street Name" required />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Pincode</label>
              <input type="text" className="glass-input" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="e.g. 560001" pattern="[0-9]{6}" required />
            </div>
            <button type="submit" className="glass-button" style={{ marginTop: '8px', width: '100%', padding: '12px' }}>
              Submit Request
            </button>
          </form>
        </div>

        {/* Track Issues */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Your Reports</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {trackedIssues.map(issue => (
               <div key={issue.id} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                   <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{issue.type}</h3>
                   <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{issue.location} &bull; {issue.date}</p>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                   <span style={{ 
                     display: 'inline-block',
                     padding: '4px 12px', 
                     borderRadius: '12px', 
                     fontSize: '0.75rem', 
                     fontWeight: 600,
                     background: issue.status === 'Resolved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                     color: issue.status === 'Resolved' ? 'var(--success-color)' : 'var(--warning-color)'
                   }}>
                     {issue.status}
                   </span>
                   <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{issue.id}</p>
                 </div>
               </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card" style={{ background: 'white', padding: '32px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--success-color)' }}>
              <CheckCircle size={32} />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Confirm Submission</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Are you sure the details provided are correct? A team will be dispatched based on this report.</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => setShowConfirmation(false)} className="glass-button-outline" style={{ flex: 1, borderColor: '#d1d5db', color: 'var(--text-main)' }}>Cancel</button>
              <button onClick={confirmSubmit} className="glass-button" style={{ flex: 1 }}>Submit</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default UtilitiesModule;
