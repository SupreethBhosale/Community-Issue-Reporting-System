import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Trash2, Camera, MapPin, ChevronUp, Navigation } from 'lucide-react';
import { toast } from 'react-toastify';
import { createIssue, listenToIssuesByCategory, upvoteIssue } from '../services/firestore';
import { uploadImage } from '../services/storage';

const DumpingModule = ({ user }) => {
  const routerLocation = useLocation();
  const searchParams = new URLSearchParams(routerLocation.search);

  const [locationStr, setLocationStr] = useState('');
  const [latitude, setLatitude] = useState(searchParams.get('lat') ? parseFloat(searchParams.get('lat')) : null);
  const [longitude, setLongitude] = useState(searchParams.get('lng') ? parseFloat(searchParams.get('lng')) : null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    if (latitude && longitude) {
      toast.success(`Coordinates loaded from map: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    const unsubscribe = listenToIssuesByCategory('Dumping', setIssues);
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

  const handleUpvote = async (id) => {
    try {
      if (user) {
        await upvoteIssue(id, user.uid);
      } else {
        toast.info('Please log in to upvote issues.');
      }
    } catch (error) {
      toast.error('Failed to upvote');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = null;
      if (file) {
        imageUrl = await uploadImage(file, 'dumping_issues');
      }

      await createIssue({
        category: 'Dumping',
        location: locationStr || 'Current Location',
        latitude,
        longitude,
        imageUrl
      });

      toast.success('Dumping spot reported! It is now open for community priority voting.');
      setLocationStr('');
      setLatitude(null);
      setLongitude(null);
      setFile(null);
    } catch (error) {
      toast.error('Failed to report issue');
    }
    setLoading(false);
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
              <div className="glass-panel" style={{ position: 'relative', borderStyle: 'dashed', borderWidth: '2px', padding: '32px', textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.5)' }}>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                <Camera size={32} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{file ? file.name : 'Upload evidence'}</p>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Location Details</label>
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                <input type="text" className="glass-input" style={{ paddingLeft: '40px' }} value={locationStr} onChange={(e) => setLocationStr(e.target.value)} placeholder="Landmark or Street Name" required />
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
            <button disabled={loading} type="submit" className="glass-button" style={{ marginTop: '8px', width: '100%', padding: '12px' }}>
              {loading ? 'Submitting...' : 'Report Issue'}
            </button>
          </form>
        </div>

        {/* Community Priority Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
             <h2 style={{ fontSize: '1.5rem' }}>Community Priority Board</h2>
             <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Sorted by highest votes</span>
          </div>
          
          {Array.isArray(issues) && issues.map((issue, i) => (
            <motion.div key={String(issue?.id || Math.random())} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
              <div className="glass-card" style={{ padding: '20px', display: 'flex', gap: '24px', alignItems: 'center' }}>
                
                {/* Voting Block */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '12px', minWidth: '70px' }}>
                  <button onClick={() => handleUpvote(issue.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)' }}>
                    <ChevronUp size={28} />
                  </button>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{Number(issue?.votes || 0)}</span>
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Location: {String(issue?.location || 'Unknown')}</h3>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <span>Reported {issue?.createdAt?.seconds ? new Date(issue.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</span>
                    <span style={{ 
                      color: issue?.status === 'Pending' ? 'var(--warning-color)' : 'var(--primary-color)',
                      fontWeight: 600
                    }}>
                      • {String(issue?.status || 'Pending')}
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
