import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, Activity, Bus, Lightbulb, Trash2, 
  Bell, LogOut, CheckCircle, Clock, CheckCircle2, 
  XOctagon, Image as ImageIcon, MapPin 
} from 'lucide-react';
import { listenToAllIssues, updateIssueStatus, deleteIssue } from '../services/firestore';
import { signOut } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Issues');

  useEffect(() => {
    const unsubscribe = listenToAllIssues((data) => {
      setIssues(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.info('Admin signed out.');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out.');
    }
  };

  const handleResolve = async (id) => {
    try {
      await updateIssueStatus(id, 'Resolved');
      toast.success('Issue marked as resolved.');
    } catch (error) {
      toast.error('Failed to resolve issue.');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to permanently delete this issue?')) {
      try {
        await deleteIssue(id);
        toast.success('Issue deleted from database.');
      } catch (error) {
        toast.error('Failed to delete issue.');
      }
    }
  };

  // Derive Statistics
  const stats = useMemo(() => {
    const total = issues.length;
    const resolved = issues.filter(i => i.status === 'Resolved').length;
    const pending = total - resolved;
    return { total, resolved, pending };
  }, [issues]);

  // Filter Issues
  const filteredIssues = useMemo(() => {
    switch (activeTab) {
      case 'Transport Issues': return issues.filter(i => i.category === 'Transport');
      case 'Public Utilities': return issues.filter(i => i.category === 'Utilities');
      case 'Dumping Issues': return issues.filter(i => i.category === 'Dumping');
      case 'Notifications': return issues; // We don't have a notif view here yet, so default to all issues.
      default: return issues;
    }
  }, [issues, activeTab]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-main)', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Admin Sidebar */}
      <div className="glass-panel" style={{ width: '280px', margin: '16px', display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '24px', background: 'rgba(79, 70, 229, 0.1)', borderBottom: '1px solid var(--glass-border)' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <ShieldAlert size={24} />
            Admin Portal
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: 0 }}>City Operations Center</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '16px', flex: 1 }}>
          {[
            { name: 'All Issues', icon: <Activity size={20} /> },
            { name: 'Transport Issues', icon: <Bus size={20} /> },
            { name: 'Public Utilities', icon: <Lightbulb size={20} /> },
            { name: 'Dumping Issues', icon: <Trash2 size={20} /> },
          ].map(tab => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer',
                background: activeTab === tab.name ? 'var(--primary-color)' : 'transparent',
                color: activeTab === tab.name ? 'white' : 'var(--text-main)',
                transition: 'all 0.2s', textAlign: 'left'
              }}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid var(--glass-border)' }}>
           <button onClick={handleSignOut} className="glass-button-outline" style={{ width: '100%', borderColor: 'rgba(239, 68, 68, 0.3)', color: 'var(--danger-color)', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <LogOut size={18} /> Sign Out Admin
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '16px 32px 32px 0', display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        
        {/* Header Dashboard Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', marginTop: '8px' }}>
           <h1 style={{ fontSize: '2rem', margin: 0 }}>{activeTab}</h1>
        </div>

        {/* Statistics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '16px', borderRadius: '50%', color: '#3b82f6' }}>
              <Activity size={32} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 800 }}>{stats.total}</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Total Reports</p>
            </div>
          </motion.div>
          
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '16px', borderRadius: '50%', color: 'var(--warning-color)' }}>
              <Clock size={32} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 800 }}>{stats.pending}</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Pending Action</p>
            </div>
          </motion.div>

          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '50%', color: 'var(--success-color)' }}>
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 800 }}>{stats.resolved}</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Resolved Issues</p>
            </div>
          </motion.div>
        </div>

        {/* Data Grid */}
        <div className="glass-card" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ overflowX: 'auto', flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>ID / Date</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Details</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Severity</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Stats</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan="6" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading live data...</td></tr>}
                {!loading && filteredIssues.length === 0 && <tr><td colSpan="6" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>No issues found.</td></tr>}
                
                {!loading && Array.isArray(filteredIssues) && filteredIssues.map((issue, idx) => {
                  
                  // Clean String parsing
                  const id = String(issue?.id || '').slice(0, 8);
                  const title = String(issue?.title || issue?.issue || issue?.type || issue?.category || 'Untitled');
                  const category = String(issue?.category || 'Unknown');
                  const description = String(issue?.description || issue?.location || 'No details provided');
                  const loc = String(issue?.location || 'Unknown loc');
                  const votes = Number(issue?.votes || 1);
                  const status = String(issue?.status || 'Pending');
                  const date = issue?.createdAt?.seconds ? new Date(issue.createdAt.seconds * 1000).toLocaleDateString() : 'Just now';
                  
                  // Compute Severity
                  let severity = String(issue?.severity || issue?.priority || 'Normal');
                  if (category === 'Dumping') severity = votes > 5 ? 'High' : (votes > 2 ? 'Medium' : 'Low');

                  // Badges
                  let sevColor = 'var(--success-color)';
                  let sevBg = 'rgba(16, 185, 129, 0.1)';
                  if (severity === 'High') { sevColor = 'var(--danger-color)'; sevBg = 'rgba(239, 68, 68, 0.1)'; }
                  else if (severity === 'Medium') { sevColor = 'var(--warning-color)'; sevBg = 'rgba(245, 158, 11, 0.1)'; }

                  return (
                    <motion.tr 
                      key={String(issue?.id || Math.random())} 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                      style={{ borderBottom: '1px solid var(--glass-border)', background: 'white', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(79, 70, 229, 0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      {/* ID and Date */}
                      <td style={{ padding: '16px 24px', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{id}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{date}</div>
                      </td>

                      {/* Details */}
                      <td style={{ padding: '16px 24px', verticalAlign: 'top', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ 
                            padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase',
                            background: category === 'Transport' ? 'rgba(59, 130, 246, 0.1)' : category === 'Utilities' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: category === 'Transport' ? '#3b82f6' : category === 'Utilities' ? '#f59e0b' : '#ef4444'
                          }}>
                            {category}
                          </span>
                          <span style={{ fontWeight: 600 }}>{title}</span>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {description}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <MapPin size={12} /> {loc}
                        </div>
                      </td>

                      {/* Severity */}
                      <td style={{ padding: '16px 24px', verticalAlign: 'top' }}>
                        <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, background: sevBg, color: sevColor }}>
                          {severity}
                        </span>
                      </td>

                      {/* Stats */}
                      <td style={{ padding: '16px 24px', verticalAlign: 'top' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{votes} Votes</div>
                        {issue.imageUrl && (
                          <a href={issue.imageUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--primary-color)', marginTop: '4px', textDecoration: 'none' }}>
                            <ImageIcon size={12} /> View proof
                          </a>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px 24px', verticalAlign: 'top' }}>
                        <span style={{ 
                          display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                          background: status === 'Resolved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: status === 'Resolved' ? 'var(--success-color)' : 'var(--warning-color)'
                        }}>
                          {status === 'Resolved' ? <CheckCircle size={14} /> : <Clock size={14} />}
                          {status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 24px', verticalAlign: 'top', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          {status !== 'Resolved' && (
                            <button onClick={() => handleResolve(issue.id)} className="glass-button-outline" style={{ padding: '8px', color: 'var(--success-color)', borderColor: 'var(--success-color)' }} title="Mark as Resolved">
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button onClick={() => handleDelete(issue.id)} className="glass-button-outline" style={{ padding: '8px', color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }} title="Delete Record Forever">
                            <XOctagon size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
