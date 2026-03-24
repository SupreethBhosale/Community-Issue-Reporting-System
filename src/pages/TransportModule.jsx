import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bus, MapPin, CheckCircle, Navigation } from 'lucide-react';
import { toast } from 'react-toastify';
import { createIssue } from '../services/firestore';
import { uploadImage } from '../services/storage';

const TransportModule = () => {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const searchParams = new URLSearchParams(routerLocation.search);

  const [vehicle, setVehicle] = useState('Bus');
  const [issueTitle, setIssueTitle] = useState('Traffic');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [locationStr, setLocationStr] = useState('');
  const [latitude, setLatitude] = useState(searchParams.get('lat') ? parseFloat(searchParams.get('lat')) : null);
  const [longitude, setLongitude] = useState(searchParams.get('lng') ? parseFloat(searchParams.get('lng')) : null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (latitude && longitude) {
      toast.success(`Coordinates loaded from URL: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    }
  }, [latitude, longitude]);

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

  const confirmSubmit = async () => {
    setShowConfirmation(false);
    setLoading(true);

    try {
      let imageUrl = null;
      if (file) {
        imageUrl = await uploadImage(file, 'transport_issues');
      }

      await createIssue({
        category: 'Transport',
        type: 'Delay',
        vehicle,
        issue: issueTitle,
        description,
        severity,
        location: locationStr,
        latitude,
        longitude,
        imageUrl,
      });

      toast.success('Transport issue reported successfully!');
      setVehicle('Bus');
      setIssueTitle('Traffic');
      setDescription('');
      setSeverity('Medium');
      setLocationStr('');
      setLatitude(null);
      setLongitude(null);
      setFile(null);
    } catch (error) {
      toast.error('Failed to report issue');
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>Transport System</h1>
          <p style={{ color: 'var(--text-muted)' }}>Report and track real-time delays across the city's transport network.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="glass-button" style={{ cursor: 'default' }}>Report Delay</button>
          <button onClick={() => navigate('/transport/track')} className="glass-button-outline">Track Delays</button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bus color="var(--primary-color)" /> Report New Delay
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Vehicle Type</label>
              <select className="glass-input" value={vehicle} onChange={(e) => setVehicle(e.target.value)} required>
                {['Bus', 'Metro', 'Cab', 'Personal Vehicle', 'Other'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Issue Type</label>
              <select className="glass-input" value={issueTitle} onChange={(e) => setIssueTitle(e.target.value)} required>
                {['Traffic', 'Crowd', 'Road Block', 'Heavy Rain', 'Infrastructure'].map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Description</label>
            <textarea className="glass-input" style={{ minHeight: '100px', resize: 'vertical' }} value={description} onChange={e => setDescription(e.target.value)} placeholder="Provide additional details..." required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div>
               <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Severity</label>
               <select className="glass-input" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                <option value="Low">Low - Minor inconvenience</option>
                <option value="Medium">Medium - Noticeable delay</option>
                <option value="High">High - Severe disruption</option>
               </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Location Details</label>
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                <input type="text" className="glass-input" style={{ paddingLeft: '40px' }} value={locationStr} onChange={(e) => setLocationStr(e.target.value)} placeholder="Landmark or Stop Name" required />
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
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button type="submit" className="glass-button">Review Report</button>
          </div>
        </form>
      </div>

      {showConfirmation && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card" style={{ background: 'white', padding: '32px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--success-color)' }}>
              <CheckCircle size={32} />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Confirm Report</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Are you sure you want to submit this transport delay report?</p>
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

export default TransportModule;
