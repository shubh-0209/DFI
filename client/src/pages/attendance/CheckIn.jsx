import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, CheckCircle2, AlertCircle, QrCode } from 'lucide-react';
import { useVolunteer } from '../../context/VolunteerContext';
import CheckInButton from '../../components/volunteer/CheckInButton';
import QrScannerModal from '../../components/volunteer/QrScannerModal';

const CheckIn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedProgramId = searchParams.get('program');
  
  const { joinedPrograms, joinedProgramsLoading, fetchJoinedPrograms, performCheckIn, checkInStatus } = useVolunteer();
  const [selectedProgram, setSelectedProgram] = useState(preselectedProgramId || '');
  const [location, setLocation] = useState(null);
  const [qrToken, setQrToken] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (joinedPrograms.length === 0 && !joinedProgramsLoading) {
      fetchJoinedPrograms();
    }
  }, [joinedPrograms, joinedProgramsLoading, fetchJoinedPrograms]);

  useEffect(() => {
    if (checkInStatus.checkedIn) {
      navigate('/attendance/checkout', { replace: true });
    }
  }, [checkInStatus.checkedIn, navigate]);

  const activePrograms = joinedPrograms.filter(
    (p) => p && (p.status === 'ongoing' || p.status === 'published' || p.status === 'active')
  );

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.error("Location error:", err);
          setError("Failed to get location. Please enable location services.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handleCheckIn = async () => {
    if (!selectedProgram) {
      setError("Please select a program");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await performCheckIn(
        selectedProgram,
        location ? { latitude: location.lat, longitude: location.lng } : null,
        qrToken
      );
      if (result?.success) {
        navigate('/attendance/checkout', { replace: true });
      } else {
        setError(result?.error || 'Failed to check in');
      }
    } catch (err) {
      setError(err.message || 'Failed to check in');
    } finally {
      setLoading(false);
    }
  };

  const selectedProgObj = activePrograms.find(
    (p) => (p.applicationId || p.id || p._id) === selectedProgram
  );

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371e3;
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) *
        Math.cos(phi2) *
        Math.sin(deltaLambda / 2) *
        Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const distanceFromVenue = location && selectedProgObj?.latitude && selectedProgObj?.longitude
    ? calculateDistance(location.lat, location.lng, selectedProgObj.latitude, selectedProgObj.longitude)
    : null;

  return (
    <div className="page-container" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '600px', marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate('/attendance')} 
          className="btn" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0, backgroundColor: 'transparent', color: 'var(--color-body)' }}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card glow-card"
        style={{ width: '100%', maxWidth: '600px', padding: '3rem 2rem' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Session Check-In</h1>
          <p style={{ color: 'var(--color-body)' }}>Select your program and verify via Location or QR Code scan.</p>
        </div>

        {error && (
          <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="form-group">
            <label className="form-label" >Select Program</label>
            <select 
              className="form-control" 
              style={{ padding: '1rem' }}
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
            >
              <option value="">-- Choose an active program --</option>
              {activePrograms.map(p => (
                <option key={p.applicationId || p.id || p._id} value={p.applicationId || p.id}>{p.programTitle || p.title}</option>
              ))}
            </select>
          </div>

          {selectedProgObj && (
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{selectedProgObj.programTitle || selectedProgObj.title}</div>
              <div style={{ color: 'var(--color-body)', fontSize: '0.9rem' }}>
                📍 Venue: {selectedProgObj.address ? `${selectedProgObj.address}, ` : ''}{selectedProgObj.city || 'On-site'} ({selectedProgObj.mode || 'offline'})
              </div>
              {selectedProgObj.latitude && selectedProgObj.longitude && (
                <div style={{ color: 'var(--color-body)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  🎯 Allowed Geofence: within {selectedProgObj.allowedRadiusMeters || 100}m of venue
                </div>
              )}
            </div>
          )}

          {/* QR Code Verification Section */}
          <div className="form-group">
            <label className="form-label" >QR Code Verification</label>
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: 'var(--color-bg)', 
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              {qrToken ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
                    <CheckCircle2 size={24} /> QR Code Attached
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>
                    Token: {qrToken.slice(0, 18)}...
                  </span>
                  <button onClick={() => setQrToken(null)} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', marginTop: '0.25rem' }}>
                    Rescan / Clear QR
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <QrCode size={24} />
                  </div>
                  <button onClick={() => setIsQrModalOpen(true)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <QrCode size={16} /> Scan Session QR Code
                  </button>
                  <span style={{ color: 'var(--color-body)', fontSize: '0.85rem' }}>Scan QR displayed by organizer or enter code</span>
                </>
              )}
            </div>
          </div>

          {/* Location Verification Section */}
          <div className="form-group">
            <label className="form-label" >Location Verification (GPS)</label>
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: 'var(--color-bg)', 
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              {location ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
                    <CheckCircle2 size={24} /> Location Captured
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>
                    GPS: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                  </span>
                  {distanceFromVenue !== null && (
                    <div style={{ 
                      padding: '0.4rem 0.8rem', 
                      borderRadius: 'var(--radius-sm)', 
                      fontSize: '0.85rem',
                      backgroundColor: distanceFromVenue <= (selectedProgObj?.allowedRadiusMeters || 100) ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: distanceFromVenue <= (selectedProgObj?.allowedRadiusMeters || 100) ? 'var(--color-success)' : 'var(--color-error)',
                      marginTop: '0.25rem'
                    }}>
                      {distanceFromVenue <= (selectedProgObj?.allowedRadiusMeters || 100) 
                        ? `✅ Within venue radius (${distanceFromVenue}m away)`
                        : `⚠️ ${distanceFromVenue}m away from venue (Allowed: max ${selectedProgObj?.allowedRadiusMeters || 100}m)`}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={24} />
                  </div>
                  <button onClick={handleGetLocation} className="btn btn-secondary">
                    Verify My Location
                  </button>
                  <span style={{ color: 'var(--color-body)', fontSize: '0.85rem' }}>Required for attendance tracking & venue geofencing</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CheckInButton 
            onCheckIn={handleCheckIn}
            disabled={!selectedProgram || (!location && !qrToken)}
            loading={loading}
          />
        </div>

      </motion.div>

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onScanSuccess={(scannedToken) => {
          setQrToken(scannedToken);
          setError(null);
        }}
        title="Scan Session Check-In QR"
      />
    </div>
  );
};

export default CheckIn;
