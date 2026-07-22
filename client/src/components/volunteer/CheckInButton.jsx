import SimpleLoader from '../common/SimpleLoader';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Check } from 'lucide-react';

const CheckInButton = ({ onCheckIn, disabled = false, alreadyCheckedIn = false, program, loading = false, checkInTime }) => {
  
  if (alreadyCheckedIn) {
    return (
      <div 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1.25rem 3rem',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-heading)' }}
      >
        <div style={{ 
          width: '24px', height: '24px', borderRadius: '50%', 
          backgroundColor: 'var(--color-success)', color: '#fff', 
          display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          <Check size={14} strokeWidth={3} />
        </div>
        Checked In {checkInTime ? `at ${checkInTime}` : ''}
      </div>
    );
  }

  return (
    <motion.button
      onClick={onCheckIn}
      disabled={disabled || loading}
      whileHover={{ scale: (disabled || loading) ? 1 : 1.02 }}
      whileTap={{ scale: (disabled || loading) ? 1 : 0.98 }}
      className="check-in-hero"
      style={{
        opacity: (disabled || loading) ? 0.7 : 1,
        cursor: (disabled || loading) ? 'not-allowed' : 'pointer'
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
            Checking in...
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
              <Play size={16} fill="currentColor" />
            </div>
            Check In Now
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.button>
  );
};

export default CheckInButton;
