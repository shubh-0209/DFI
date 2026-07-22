import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, FileText, AlertTriangle } from 'lucide-react';

const PDFViewer = ({ isOpen, onClose, pdfUrl, title = 'PDF Preview' }) => {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !pdfUrl) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative', width: '90vw', height: '85vh',
          background: 'var(--color-card)', borderRadius: 'var(--radius-xl)',
          overflow: 'hidden', boxShadow: 'var(--shadow-xl)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--color-heading)' }}>
            <FileText size={18} style={{ color: 'var(--color-error)' }} /> {title}
          </span>
          <button type="button" onClick={onClose} aria-label="Close preview" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-body)', padding: '0.25rem', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          <iframe
            src={pdfUrl}
            title={title}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="fullscreen"
          />
          {!pdfUrl && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--color-body)' }}>
              <AlertTriangle size={32} />
              <p>No preview available. Use download instead.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PDFViewer;
