import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { toast } from 'react-toastify';
import { createNotification } from '../services/firestore';
import { cityCoordinates } from '../utils/constants';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '16px'
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: false,
  fullscreenControl: true
};

// Haversine formula
function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

const MapComponent = ({ issues = [], onLocationSelect, showNearbyAlerts = false, selectedCity }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyD37i3gi2kIeNoqLPBf0oXQUBpM39knaZ0',
    libraries,
  });

  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const notifiedIssuesRef = useRef(new Set());
  
  const defaultCenter = useMemo(() => ({ lat: 12.9716, lng: 77.5946 }), []); // Bangalore default
  const mapCenter = userLocation || defaultCenter;

  const filteredIssues = useMemo(() => {
    if (!selectedCity || !cityCoordinates[selectedCity]) return issues;
    const center = cityCoordinates[selectedCity];
    return issues.filter(issue => {
      if (!issue.latitude || !issue.longitude) return false;
      return getDistanceInMeters(center.lat, center.lng, issue.latitude, issue.longitude) < 50000;
    });
  }, [issues, selectedCity]);

  useEffect(() => {
    if (map && selectedCity && cityCoordinates[selectedCity]) {
      map.panTo(cityCoordinates[selectedCity]);
      map.setZoom(13);
    }
  }, [map, selectedCity]);

  const handleGetLocation = () => {
    setLocationLoading(true);
    setLocationError('');
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ lat, lng });
        toast.success("Location fetched successfully");
        setLocationLoading(false);
      },
      (error) => {
        setLocationLoading(false);
        if (error.code === 1) {
          setLocationError("Location permission denied. Please allow access.");
          toast.error("Location permission denied. Please allow access.");
        } else if (error.code === 2) {
          setLocationError("Location unavailable. Try again.");
          toast.error("Location unavailable. Try again.");
        } else if (error.code === 3) {
          setLocationError("Location request timed out.");
          toast.error("Location request timed out.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // 500m proximity alerts
  useEffect(() => {
    if (!showNearbyAlerts || !userLocation || issues.length === 0) return;

    issues.forEach(issue => {
      // Must have valid lat/lng and pending status
      if (issue.latitude && issue.longitude && issue.status !== 'Resolved' && !notifiedIssuesRef.current.has(issue.id)) {
        const distance = getDistanceInMeters(userLocation.lat, userLocation.lng, issue.latitude, issue.longitude);
        if (distance <= 500) {
          notifiedIssuesRef.current.add(issue.id);
          const type = String(issue.category || issue.type || 'Hazard');
          const message = `Caution: There is a ${type} issue within 500m of your location.`;
          
          toast.warning(message, { position: 'top-right' });
          
          // Generate a notification record in the DB (only once per user per issue usually, 
          // but here we just write a global one or user-specific if we want to track it).
          // For now, we just push an info notification to the global feed.
          createNotification(message, 'warning');
        }
      }
    });
  }, [issues, userLocation, showNearbyAlerts]);

  const handleMapClick = useCallback((e) => {
    if (onLocationSelect) {
      onLocationSelect({
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      });
      // Temporarily set a dummy selected issue or marker
    }
  }, [onLocationSelect]);

  if (loadError) return <div className="glass-panel" style={{ padding: '24px', color: 'var(--danger-color)' }}>Error loading Maps</div>;
  if (!isLoaded) return <div className="glass-panel" style={{ padding: '24px', color: 'var(--text-muted)' }}>Loading Map...</div>;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {locationError && (
        <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10, padding: '12px', background: 'white', color: 'var(--danger-color)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '300px' }}>
          <div style={{ fontSize: '0.875rem' }}><strong>GPS Error:</strong> {locationError}</div>
          <button onClick={handleGetLocation} className="glass-button-outline" style={{ padding: '6px', fontSize: '0.75rem', borderColor: 'var(--danger-color)', color: 'var(--danger-color)' }}>
            Enable Location Again
          </button>
        </div>
      )}

      <button
        onClick={handleGetLocation}
        disabled={locationLoading}
        className="glass-button"
        style={{
          position: 'absolute', bottom: '24px', right: '24px', zIndex: 10,
          background: 'white', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: '24px'
        }}
      >
        {locationLoading ? (
          <span style={{ width: '16px', height: '16px', border: '2px solid var(--primary-color)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        ) : '📍'} 
        {locationLoading ? 'Fetching GPS...' : 'Get My Location'}
      </button>

      {selectedCity && (
        <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary-color)', color: 'white', padding: '8px 24px', borderRadius: '24px', zIndex: 10, fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', fontSize: '0.875rem' }}>
          Currently Viewing: {selectedCity}
        </div>
      )}

      {selectedCity && filteredIssues.length === 0 && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', padding: '24px', borderRadius: '16px', zIndex: 10, textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ margin: '0 0 8px', color: 'var(--text-main)' }}>No issues reported</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>There are currently no civic issues in {selectedCity}.</p>
        </div>
      )}

      <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={14}
      center={mapCenter}
      options={mapOptions}
      onClick={handleMapClick}
      onLoad={(m) => setMap(m)}
    >
      {/* User's Current Location Marker (Blue Dot) */}
      {userLocation && (
        <Marker 
          position={userLocation}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 2,
            scale: 8
          }}
          title="You are here"
        />
      )}
      {selectedCity && cityCoordinates[selectedCity] && (
        <Marker 
          position={cityCoordinates[selectedCity]}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#8b5cf6',
            fillOpacity: 0.8,
            strokeColor: 'white',
            strokeWeight: 2,
            scale: 10
          }}
          title={selectedCity}
        />
      )}

      {/* Issue Markers */}
      {filteredIssues.map(issue => {
        if (!issue.latitude || !issue.longitude) return null;
        
        let markerColor = '#ef4444'; // Red for dumping
        if (issue.category === 'Transport') markerColor = '#3b82f6';
        else if (issue.category === 'Utilities') markerColor = '#f59e0b';
        if (issue.status === 'Resolved') markerColor = '#10b981';

        return (
          <Marker
            key={String(issue.id)}
            position={{ lat: issue.latitude, lng: issue.longitude }}
            icon={{
              path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              fillColor: markerColor,
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: '#ffffff',
              scale: 6
            }}
            onClick={() => setSelectedIssue(issue)}
          />
        );
      })}

      {selectedIssue && (
        <InfoWindow
          position={{ lat: selectedIssue.latitude, lng: selectedIssue.longitude }}
          onCloseClick={() => setSelectedIssue(null)}
        >
          <div style={{ padding: '8px', maxWidth: '200px' }}>
            <h4 style={{ margin: '0 0 4px', fontSize: '1rem', color: '#111827' }}>
              {String(selectedIssue.category || selectedIssue.type || 'Issue')}
            </h4>
            <p style={{ margin: '0 0 8px', fontSize: '0.875rem', color: '#4b5563' }}>
              {String(selectedIssue.location || selectedIssue.description || 'No details')}
            </p>
            <span style={{ 
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              background: selectedIssue.status === 'Resolved' ? '#d1fae5' : '#fee2e2',
              color: selectedIssue.status === 'Resolved' ? '#065f46' : '#991b1b'
            }}>
              {String(selectedIssue.status || 'Pending')}
            </span>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
    </div>
  );
};

export default MapComponent;
