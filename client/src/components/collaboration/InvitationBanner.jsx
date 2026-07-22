import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

const InvitationBanner = ({ invitations, onAccept, onDecline, loading }) => {
  if (!invitations || invitations.length === 0) return null;

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
          <CheckCircle size={18} style={{ color: 'var(--color-success)' }} aria-hidden="true" />
        </motion.div>
        Pending Invitations
        <span style={{
          padding: '0.2rem 0.6rem',
          borderRadius: '99px',
          background: 'rgba(16, 185, 129, 0.1)',
          color: 'var(--color-success)' }}>
          {invitations.length}
        </span>
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <AnimatePresence>
          {invitations.map((invitation) => (
            <motion.div
              key={invitation._id}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="card"
              style={{
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
                borderLeft: '4px solid var(--color-success)' }}
            >
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ color: 'var(--color-heading)', marginBottom: '0.25rem' }}>
                  {invitation.workspaceName || 'Workspace Invitation'}
                </div>
                <div style={{ color: 'var(--color-body)' }}>
                  You have been invited to join a workspace
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAccept(invitation)}
                  disabled={loading}
                  className="btn btn-success"
                  style={{
                    padding: '0.5rem 1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem' }}
                >
                  <CheckCircle size={14} aria-hidden="true" /> Accept
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDecline(invitation)}
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
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default InvitationBanner;
