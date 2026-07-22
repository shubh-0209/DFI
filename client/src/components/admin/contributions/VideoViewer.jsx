import SimpleLoader from '../../common/SimpleLoader';
import React, { useEffect, useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Play, AlertTriangle } from 'lucide-react';

const VideoViewer = ({ isOpen, onClose, videoUrl, poster = '', title = 'Video Preview' }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      videoRef.current?.pause();
      onClose?.();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      setLoading(true);
      setError(false);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

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
          position: 'relative', width: '90vw',
          maxWidth: '1000px', background: 'var(--color-card)',
          borderRadius: 'var(--radius-xl)', overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)', maxHeight: '85vh',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--color-heading)' }}>
            <Play size={18} style={{ color: 'var(--color-purple)' }} /> {title}
          </span>
          <button type="button" onClick={onClose} aria-label="Close preview" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-body)', padding: '0.25rem', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ position: 'relative', background: '#000', minHeight: '300px', maxHeight: '70vh' }}>
          {loading && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)' }}>
              <SimpleLoader />
            </div>
          )}

          {error && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>
              <AlertTriangle size={32} />
              <p>Unable to play video. Try downloading instead.</p>
            </div>
          )}

          {videoUrl && (
            <video
              ref={videoRef}
              key={videoUrl}
              controls
              poster={poster}
              style={{ width: '100%', maxHeight: '70vh', display: 'block' }}
              onLoadedData={() => setLoading(false)}
              onError={() => { setError(true); setLoading(false); }}
              preload="metadata"
            >
              <source src={videoUrl} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VideoViewer;
