import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Award, Calendar, Clock, Shield } from 'lucide-react';

const CertificatePreview = ({ certificate, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!certificate) return null;

  const cert = certificate;
  const volunteerName = cert.user?.name || 'Volunteer';
  const programTitle = cert.program?.title || 'Program Completion';
  const issueDate = new Date(cert.issuedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15,23,42,0.5)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          maxWidth: 780,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative' }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.05)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-body)', zIndex: 10 }}
          aria-label="Close preview"
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-purple)', marginBottom: '1rem' }}>
            <Award size={32} />
          </div>
          <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-heading)' }}>
            Certificate of Completion
          </h2>
          <p style={{ color: 'var(--color-body)', margin: 0 }}>
            This certifies that
          </p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem', padding: '1.5rem', background: 'linear-gradient(135deg, rgba(211,84,0,0.05), rgba(139,92,246,0.05))', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ color: 'var(--color-primary)', margin: '0 0 1rem 0' }}>
            {volunteerName}
          </h3>
          <p style={{ color: 'var(--color-body)', margin: '0 0 0.5rem 0' }}>
            has successfully completed the program
          </p>
          <h4 style={{ color: 'var(--color-heading)', margin: '0 0 1.5rem 0' }}>
            {programTitle}
          </h4>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-body)' }}>
              <Calendar size={16} />
              <span>Issued: {issueDate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-body)' }}>
              <Clock size={16} />
              <span>{cert.volunteerHours} Hours</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-body)' }}>
              <Shield size={16} />
              <span>#{cert.certificateNumber}</span>
            </div>
          </div>
        </div>

        {cert.qrCode && (
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img src={cert.qrCode} alt="Certificate QR Code" style={{ width: 120, height: 120, margin: '0 auto', display: 'block', borderRadius: 'var(--radius-md)' }} />
            <p style={{ color: 'var(--color-body)', marginTop: '0.5rem' }}>
              Scan to verify this certificate
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.button
            onClick={() => setIsFlipped(!isFlipped)}
            className="btn btn-primary"
            style={{ gap: '0.5rem' }}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.95 }}
          >
            <Shield size={16} /> Verify Authenticity
          </motion.button>
          <a
            href={cert.verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ gap: '0.5rem', textDecoration: 'none' }}
          >
            <ExternalLink size={16} /> Verification Page
          </a>
        </div>

        <AnimatePresence>
          {isFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'var(--color-bg)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)' }}
            >
              <h4 style={{ margin: '0 0 1rem 0' }}>
                Certificate Details
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <p style={{ color: 'var(--color-body)', margin: '0 0 0.25rem 0', textTransform: 'uppercase' }}>Volunteer</p>
                  <p style={{ margin: 0 }}>{volunteerName}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--color-body)', margin: '0 0 0.25rem 0', textTransform: 'uppercase' }}>Program</p>
                  <p style={{ margin: 0 }}>{programTitle}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--color-body)', margin: '0 0 0.25rem 0', textTransform: 'uppercase' }}>Organization</p>
                  <p style={{ margin: 0 }}>{cert.organization}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--color-body)', margin: '0 0 0.25rem 0', textTransform: 'uppercase' }}>Status</p>
                  <p style={{ margin: 0, color: cert.status === 'revoked' ? 'var(--color-error)' : 'var(--color-secondary)' }}>
                    {cert.status?.toUpperCase()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default CertificatePreview;
