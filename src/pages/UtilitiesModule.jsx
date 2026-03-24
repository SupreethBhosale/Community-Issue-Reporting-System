import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Lightbulb, MapPin, CheckCircle, Navigation } from 'lucide-react';
import { toast } from 'react-toastify';
import { createIssue, listenToIssuesByCategory } from '../services/firestore';

const UtilitiesModule = () => {
  const routerLocation = useLocation();
  const searchParams = new URLSearchParams(routerLocation.search);

  const [issueType, setIssueType] = useState('Streetlight Issues');
  const [location, setLocation] = useState('');
  const [pincode, setPincode] = useState('');
  const [latitude, setLatitude] = useState(searchParams.get('lat') ? parseFloat(searchParams.get('lat')) : null);
  const [longitude, setLongitude] = useState(searchParams.get('lng') ? parseFloat(searchParams.get('lng')) : null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [trackedIssues, setTrackedIssues] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (latitude && longitude) {
      toast.success(`Coordinates loaded from map: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    const unsubscribe = listenToIssuesByCategory('Utilities', setTrackedIssues);
    return () => unsubscribe();
  }, []);

  const handleGetCurrentLocation = () => {
    setLocationLoading(true);
    setLocationError('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          toast.success('Location fetched successfully');
          setLocationLoading(false);
        },
        (error) => {
          setLocationLoading(false);
          if (error.code === 1) {
            setLocationError("Location permission denied. Please allow access in browser settings.");
            toast.error("Location permission denied. Please allow access.");
          } else if (error.code === 2) {
            setLocationError("Location unavailable. Try again.");
            toast.error("Location unavailable. Try again.");
          } else if (error.code === 3) {
            setLocationError("Location request timed out.");
            toast.error("Location request timed out.");
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      toast.error('Geolocation not supported.');
      setLocationLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmation(false);
    setLoading(true);
    try {
      await createIssue({
        category: 'Utilities',
        type: issueType,
        location,
        pincode,
        latitude,
        longitude
      });
      toast.success('Public utility issue reported successfully!');
      setIssueType('Streetlight Issues');
      setLocation('');
      setPincode('');
      setLatitude(null);
      setLongitude(null);
    } catch (error) {
      toast.error('Failed to submit request');
    }
    setLoading(false);
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
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                <input type="text" className="glass-input" style={{ paddingLeft: '40px' }} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Landmark or Street Name" required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {latitude && longitude ? `📍 ${latitude.toFixed(4)}, ${longitude.toFixed(4)}` : 'No coordinates attached'}
                  </span>
                  <button type="button" disabled={locationLoading} onClick={handleGetCurrentLocation} className="glass-button-outline" style={{ padding: '4px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {locationLoading ? <span style={{ width: '12px', height: '12px', border: '2px solid var(--primary-color)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <Navigation size={14} />} 
                    {locationLoading ? 'Fetching...' : 'Get GPS'}
                  </button>
                </div>
                {locationError && (
                  <div style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', borderRadius: '4px', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{locationError}</span>
                    <button type="button" onClick={handleGetCurrentLocation} style={{ background: 'none', border: 'none', color: 'var(--danger-color)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Retry</button>
                  </div>
                )}
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
            {Array.isArray(trackedIssues) && trackedIssues.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No issues reported yet.</p>}
            {Array.isArray(trackedIssues) && trackedIssues.map(issue => (
               <div key={String(issue?.id || Math.random())} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                   <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{String(issue?.type || issue?.category || 'Unknown Type')}</h3>
                   <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{String(issue?.location || 'Unknown Location')} &bull; {issue?.createdAt?.seconds ? new Date(issue.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</p>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                   <span style={{ 
                     display: 'inline-block',
                     padding: '4px 12px', 
                     borderRadius: '12px', 
                     fontSize: '0.75rem', 
                     fontWeight: 600,
                     background: issue?.status === 'Resolved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                     color: issue?.status === 'Resolved' ? 'var(--success-color)' : 'var(--warning-color)'
                   }}>
                     {String(issue?.status || 'Pending')}
                   </span>
                   <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{String(issue?.id || '').slice(0, 8)}</p>
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
              <button disabled={loading} onClick={() => setShowConfirmation(false)} className="glass-button-outline" style={{ flex: 1, borderColor: '#d1d5db', color: 'var(--text-main)' }}>Cancel</button>
              <button disabled={loading} onClick={confirmSubmit} className="glass-button" style={{ flex: 1 }}>{loading ? 'Submitting...' : 'Submit'}</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default UtilitiesModule;
