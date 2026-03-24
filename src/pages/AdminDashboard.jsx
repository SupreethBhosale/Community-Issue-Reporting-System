import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Trash2, CheckCircle, Filter } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [filter, setFilter] = useState('All');

  const [issues, setIssues] = useState([
    { id: 'TR-492', category: 'Transport', description: 'Road Block on MG Road', priority: 'High', status: 'Pending', date: 'Oct 24, 2023' },
    { id: 'UT-193', category: 'Utilities', description: 'Broken Streetlight', priority: 'Low', status: 'Pending', date: 'Oct 23, 2023' },
    { id: 'DU-844', category: 'Dumping', description: 'Dump behind mall', priority: 'High', status: 'Pending', date: 'Oct 22, 2023' },
    { id: 'UT-190', category: 'Utilities', description: 'Sewage overflow', priority: 'Medium', status: 'Resolved', date: 'Oct 20, 2023' },
  ]);

  const handleResolve = (id) => {
    setIssues(issues.map(issue => issue.id === id ? { ...issue, status: 'Resolved' } : issue));
    toast.success(`Issue ${id} marked as resolved.`);
  };

  const handleDelete = (id) => {
    if(confirm('Are you sure you want to delete this issue record?')) {
      setIssues(issues.filter(issue => issue.id !== id));
      toast.info(`Issue ${id} deleted.`);
    }
  };

  const filteredIssues = filter === 'All' ? issues : issues.filter(i => i.category === filter);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldAlert size={32} /> Admin Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage and resolve all civic issues reported by citizens.</p>
        </div>
        
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px' }}>
          <Filter size={18} color="var(--text-muted)" />
          <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>Filter by:</span>
          <select className="glass-input" style={{ width: 'auto', padding: '6px 12px' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
            {['All', 'Transport', 'Utilities', 'Dumping'].map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.05)', borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>ID</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Category</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Description</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Priority</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((issue) => (
              <tr key={issue.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '16px 24px', fontWeight: 500 }}>{issue.id}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                    background: issue.category === 'Transport' ? 'rgba(59, 130, 246, 0.1)' : issue.category === 'Utilities' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: issue.category === 'Transport' ? '#3b82f6' : issue.category === 'Utilities' ? '#f59e0b' : '#ef4444'
                  }}>
                    {issue.category}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>{issue.description}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ color: issue.priority === 'High' ? 'var(--danger-color)' : issue.priority === 'Medium' ? 'var(--warning-color)' : 'var(--success-color)', fontWeight: 600 }}>
                    {issue.priority}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
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
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    {issue.status !== 'Resolved' && (
                      <button onClick={() => handleResolve(issue.id)} className="glass-button-outline" style={{ padding: '6px', color: 'var(--success-color)', borderColor: 'var(--success-color)' }} title="Mark Resolved">
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button onClick={() => handleDelete(issue.id)} className="glass-button-outline" style={{ padding: '6px', color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }} title="Delete Record">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredIssues.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No issues found for the selected filter.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
