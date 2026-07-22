import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, User } from 'lucide-react';

const JoinRequestBanner = ({ requests, onApprove, onDecline, loading }) => {
  if (!requests || requests.length === 0) return null;

  return (
    <motion.div
      layout
      style={{ marginBottom: '2rem' }}
    >
      <h3 style={{
        marginBottom: '1rem',
        color: 'var(--color-heading)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem' }}>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <User size={18} style={{ color: 'var(--color-accent)' }} aria-hidden="true" />
        </motion.div>
        Pending Join Requests
        <span style={{
          padding: '0.2rem 0.6rem',
          borderRadius: '99px',
          background: 'rgba(217, 119, 6, 0.1)',
          color: 'var(--color-accent)' }}>
          {requests.length}
        </span>
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {requests.map((request, idx) => (
          <motion.div
            key={request._id || idx}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: idx * 0.1, duration: 0.3 }}
            className="card"
            style={{
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              borderLeft: '4px solid var(--color-accent)' }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #D97706, #F59E0B)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0 }}>
              {(request.userId?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ color: 'var(--color-heading)', marginBottom: '0.25rem' }}>
                {request.userId?.name || 'Unknown User'}
              </div>
              <div style={{ color: 'var(--color-body)' }}>
                {request.userId?.email || ''} {request.message ? `• "${request.message}"` : ''}
              </div>
              <div style={{ color: 'var(--color-body)', marginTop: '0.35rem', opacity: 0.7 }}>
                Requested on {new Date(request.requestedAt).toLocaleDateString()}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onApprove(idx)}
                disabled={loading}
                className="btn btn-success"
                style={{
                  padding: '0.5rem 1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem' }}
              >
                <CheckCircle size={14} aria-hidden="true" /> Approve
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onDecline(idx)}
                disabled={loading}
                className="btn btn-secondary"
                style={{
                  padding: '0.5rem 1rem',
                  color: 'var(--color-error)',
                  borderColor: 'var(--color-error)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem' }}
              >
                <XCircle size={14} aria-hidden="true" /> Decline
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default JoinRequestBanner;
