import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const CertificateShare = ({ certificate, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!certificate) return null;

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/verify/${certificate.certificateNumber}` : '';
  const shareText = `I earned a certificate for "${certificate.program?.title || 'Program Completion'}" on Disha for India!`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  const handleLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

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
          padding: '2rem',
          maxWidth: 480,
          width: '100%',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative' }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.05)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-body)' }}
          aria-label="Close share dialog"
        >
          <X size={18} />
        </button>

        <h3 style={{ margin: '0 0 0.5rem 0' }}>Share Certificate</h3>
        <p style={{ color: 'var(--color-body)', margin: '0 0 1.5rem 0' }}>
          Share your achievement with the world
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <motion.button
            onClick={handleLinkedIn}
            className="btn btn-secondary"
            style={{ flex: 1, gap: '0.5rem', justifyContent: 'center', backgroundColor: '#0077B5', color: 'white', border: 'none' }}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.95 }}
          >
            <LinkedInIcon /> LinkedIn
          </motion.button>
          <motion.button
            onClick={handleTwitter}
            className="btn btn-secondary"
            style={{ flex: 1, gap: '0.5rem', justifyContent: 'center', backgroundColor: '#1DA1F2', color: 'white', border: 'none' }}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.95 }}
          >
            <TwitterIcon /> Twitter
          </motion.button>
          <motion.button
            onClick={handleWhatsApp}
            className="btn btn-secondary"
            style={{ flex: 1, gap: '0.5rem', justifyContent: 'center', backgroundColor: '#25D366', color: 'white', border: 'none' }}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </motion.button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            readOnly
            value={shareUrl}
            style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', color: 'var(--color-heading)', backgroundColor: 'var(--color-bg)' }}
            aria-label="Certificate share link"
          />
          <motion.button
            onClick={handleCopy}
            className="btn btn-primary"
            style={{ gap: '0.5rem', whiteSpace: 'nowrap' }}
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CertificateShare;
