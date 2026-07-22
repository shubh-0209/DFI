import SimpleLoader from '../common/SimpleLoader';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Square } from 'lucide-react';

const CheckOutButton = ({ onCheckOut, checkInTime, loading = false, disabled = false }) => {
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  useEffect(() => {
    if (!checkInTime) return;
    
    // Parse checkInTime (assuming format "HH:MM AM/PM" or Date string)
    // For robust counter we need a real date object
    let startTime = new Date();
    if (typeof checkInTime === 'string') {
        const parts = checkInTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (parts) {
            let [_, hours, mins, ampm] = parts;
            hours = parseInt(hours);
            if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
            if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
            startTime.setHours(hours, parseInt(mins), 0, 0);
        } else {
            startTime = new Date(checkInTime);
            if (isNaN(startTime.getTime())) startTime = new Date();
        }
    } else if (checkInTime instanceof Date) {
        startTime = checkInTime;
    }

    const interval = setInterval(() => {
      const now = new Date();
      let diffSeconds = Math.floor((now - startTime) / 1000);
      if (diffSeconds < 0) diffSeconds = 0; // Prevent negative time
      
      const h = Math.floor(diffSeconds / 3600).toString().padStart(2, '0');
      const m = Math.floor((diffSeconds % 3600) / 60).toString().padStart(2, '0');
      const s = (diffSeconds % 60).toString().padStart(2, '0');
      
      setElapsedTime(`${h}:${m}:${s}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [checkInTime]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <motion.button
        onClick={onCheckOut}
        disabled={disabled || loading}
        whileHover={{ scale: (disabled || loading) ? 1 : 1.02 }}
        whileTap={{ scale: (disabled || loading) ? 1 : 0.98 }}
        className="check-out-hero"
        style={{
          opacity: (disabled || loading) ? 0.7 : 1,
          cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
          width: '100%',
          justifyContent: 'center'
        }}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <SimpleLoader />
              Checking out...
            </motion.div>
          ) : (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}>
                <Square size={14} fill="currentColor" />
              </div>
              Check Out
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {checkInTime && (
        <div style={{ 
          color: 'var(--color-heading)',
          backgroundColor: 'var(--color-bg)',
          padding: '0.5rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)' }}>
          {elapsedTime}
        </div>
      )}
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CheckOutButton;
