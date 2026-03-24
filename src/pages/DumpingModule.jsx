import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Camera, MapPin, ChevronUp } from 'lucide-react';
import { toast } from 'react-toastify';

const DumpingModule = () => {
  const [location, setLocation] = useState('');

  const [issues, setIssues] = useState([
    { id: 1, location: 'Behind City Mall, MG Road', votes: 124, status: 'Pending', time: '2 hours ago' },
    { id: 2, location: 'Empty Plot near Lake View', votes: 89, status: 'In Progress', time: '5 hours ago' },
    { id: 3, location: 'Corner of 4th Street, Sector 2', votes: 42, status: 'Pending', time: '1 day ago' },
  ]);

  const handleUpvote = (id) => {
    setIssues(issues.map(issue => {
      if (issue.id === id) {
        return { ...issue, votes: issue.votes + 1 };
      }
      return issue;
    }).sort((a, b) => b.votes - a.votes)); // Priority system: Sort by votes
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Dumping spot reported! It is now open for community priority voting.');
    const newIssue = {
      id: Date.now(),
      location: location || 'Current Location',
      votes: 1,
      status: 'Pending',
      time: 'Just now'
    };
    setIssues([newIssue, ...issues].sort((a, b) => b.votes - a.votes));
    setLocation('');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>Dumping Issues</h1>
        <p style={{ color: 'var(--text-muted)' }}>Report illegal garbage dumps and upvote existing issues to prioritize cleanup.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        
        {/* Report New */}
        <div className="glass-card" style={{ padding: '32px', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trash2 color="var(--primary-color)" /> Report Spot
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Upload Photo</label>
              <div className="glass-panel" style={{ borderStyle: 'dashed', borderWidth: '2px', padding: '32px', textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.5)' }}>
                <Camera size={32} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Upload evidence</p>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Location</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="text" className="glass-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Auto detecting..." />
                <button type="button" className="glass-button-outline" title="Use current location"><MapPin size={18} /></button>
              </div>
            </div>
            <button type="submit" className="glass-button" style={{ marginTop: '8px', width: '100%', padding: '12px' }}>
              Report Issue
            </button>
          </form>
        </div>

        {/* Community Priority Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
             <h2 style={{ fontSize: '1.5rem' }}>Community Priority Board</h2>
             <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Sorted by highest votes</span>
          </div>
          
          {issues.map((issue, i) => (
            <motion.div key={issue.id} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
              <div className="glass-card" style={{ padding: '20px', display: 'flex', gap: '24px', alignItems: 'center' }}>
                
                {/* Voting Block */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '12px', minWidth: '70px' }}>
                  <button onClick={() => handleUpvote(issue.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)' }}>
                    <ChevronUp size={28} />
                  </button>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{issue.votes}</span>
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Location: {issue.location}</h3>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <span>Reported {issue.time}</span>
                    <span style={{ 
                      color: issue.status === 'Pending' ? 'var(--warning-color)' : 'var(--primary-color)',
                      fontWeight: 600
                    }}>
                      • {issue.status}
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DumpingModule;
