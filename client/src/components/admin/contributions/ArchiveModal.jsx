import React from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

const ArchiveModal = ({ isOpen, onClose, onConfirm, loading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="modal"
        style={{
          background: 'var(--color-bg)', padding: '1.5rem', borderRadius: 'var(--radius-xl)',
          width: '90%', maxWidth: '420px', border: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} style={{ color: 'var(--color-accent)' }} /> Archive Contribution
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-body)', padding: '0.25rem', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>
        <p style={{ color: 'var(--color-body)', marginBottom: '1.5rem' }}>
          Are you sure you want to archive this contribution? It will be hidden from the review queue but can be restored later.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-primary" onClick={onConfirm} disabled={loading} style={{ background: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}>
            {loading ? 'Archiving...' : 'Archive'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ArchiveModal;
