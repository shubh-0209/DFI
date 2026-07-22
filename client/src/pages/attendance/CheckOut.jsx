import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Star, CheckCircle, QrCode } from 'lucide-react';
import { useVolunteer } from '../../context/VolunteerContext';
import CheckOutButton from '../../components/volunteer/CheckOutButton';
import HoursCounter from '../../components/volunteer/HoursCounter';
import QrScannerModal from '../../components/volunteer/QrScannerModal';

const CheckOut = () => {
  const navigate = useNavigate();
  const { checkInStatus, performCheckOut } = useVolunteer();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [qrToken, setQrToken] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const [notes, setNotes] = useState('');

  // Redirect if not checked in and no success data
  useEffect(() => {
    if (!checkInStatus.checkedIn && !successData && !loading) {
      navigate('/attendance');
    }
  }, [checkInStatus.checkedIn, successData, navigate, loading]);

  const handleCheckOut = async () => {
    setLoading(true);
    setError(null);

    const executeCheckOut = async (coords = null) => {
      try {
        const result = await performCheckOut(checkInStatus.currentAttendanceId, coords, qrToken);
        if (result?.success) {
          setSuccessData(result.data || { hoursWorked: 0, rewardPoints: 0 });
        } else {
          setError(result?.error || 'Failed to check out');
        }
      } catch (err) {
        setError(err.message || 'Failed to check out');
      } finally {
        setLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          executeCheckOut({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (err) => {
          console.error("Location error during checkout:", err);
          // Proceed without coordinates; server will fail validation if required
          executeCheckOut(null);
        }
      );
    } else {
      executeCheckOut(null);
    }
  };

  if (successData) {
    return (
      <div className="page-container" style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card"
          style={{ width: '100%', maxWidth: '500px', textAlign: 'center', padding: '3rem 2rem' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 0.2 }}
            style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto' }}
          >
            <CheckCircle size={40} />
          </motion.div>

          <h1 style={{ marginBottom: '1rem' }}>Session Complete!</h1>
          <p style={{ color: 'var(--color-body)', marginBottom: '2.5rem' }}>Thank you for your valuable contribution today.</p>

          <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={24} className="text-primary" />
              <div style={{ color: 'var(--color-body)' }}>Hours Logged</div>
              <HoursCounter value={successData.hoursWorked} size="md" />
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={24} className="text-accent" />
              <div style={{ color: 'var(--color-body)' }}>Points Earned</div>
              <HoursCounter value={successData.rewardPoints} size="md" />
            </div>
          </div>

          <button onClick={() => navigate('/attendance')} className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card glow-card"
        style={{ width: '100%', maxWidth: '600px', padding: '3rem 2rem' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Active Session</h1>
          <p style={{ color: 'var(--color-body)' }}>Finish your session to log your hours.</p>
        </div>

        {error && (
          <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
          <CheckOutButton 
            checkInTime={checkInStatus.checkInTime} 
            onCheckOut={handleCheckOut}
            loading={loading}
          />
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <button 
            type="button" 
            onClick={() => setIsQrModalOpen(true)} 
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <QrCode size={16} /> {qrToken ? '✅ QR Token Attached (Rescan)' : 'Scan Check-Out QR Code'}
          </button>
        </div>

        <div className="form-group">
          <label className="form-label" >Session Notes (Optional)</label>
          <textarea 
            className="form-control" 
            rows="3" 
            placeholder="What did you accomplish today?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={loading}
          />
        </div>

      </motion.div>

      <QrScannerModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onScanSuccess={(scannedToken) => {
          setQrToken(scannedToken);
          setError(null);
        }}
        title="Scan Session Check-Out QR"
      />
    </div>
  );
};

export default CheckOut;
