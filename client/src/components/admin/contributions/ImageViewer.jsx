import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

const ImageViewer = ({ isOpen, onClose, images, currentIndex = 0, file = null, onNext, onPrev }) => {
  const imagesList = images?.length ? images : [file].filter(Boolean);
  const index = currentIndex < imagesList.length ? currentIndex : 0;

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose?.();
    if (e.key === 'ArrowRight' && imagesList.length > 1) {
      if (index < imagesList.length - 1) {
        const nextIdx = index + 1;
        onNext?.(nextIdx);
      }
    }
    if (e.key === 'ArrowLeft' && imagesList.length > 1) {
      if (index > 0) {
        const prevIdx = index - 1;
        onPrev?.(prevIdx);
      }
    }
  }, [onClose, index, imagesList.length, onNext, onPrev]);

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

  if (!isOpen || imagesList.length === 0) return null;

  const currentFile = imagesList[index];
  const src = currentFile?.publicUrl || currentFile?.previewUrl || currentFile?.thumbnailUrl || '';
  const alt = currentFile?.originalName || 'Image preview';

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
        style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          style={{
            position: 'absolute', top: -36, right: 0,
            background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.25rem',
            display: 'flex', alignItems: 'center',
          }}
        >
          <X size={24} />
        </button>

        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: '75vw', maxHeight: '85vh', objectFit: 'contain',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 24px 56px -12px rgba(0,0,0,0.35)',
          }}
        />

        {imagesList.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => { if (index > 0) onPrev?.(index - 1); }}
              disabled={index === 0}
              aria-label="Previous image"
              style={{
                position: 'absolute', left: -48, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
                width: 40, height: 40, borderRadius: '50%', cursor: index === 0 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: index === 0 ? 0.4 : 1,
                backdropFilter: 'blur(4px)',
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => { if (index < imagesList.length - 1) onNext?.(index + 1); }}
              disabled={index === imagesList.length - 1}
              aria-label="Next image"
              style={{
                position: 'absolute', right: -48, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
                width: 40, height: 40, borderRadius: '50%', cursor: index === imagesList.length - 1 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: index === imagesList.length - 1 ? 0.4 : 1,
                backdropFilter: 'blur(4px)',
              }}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <div style={{ position: 'absolute', bottom: -32, left: 0, color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ImageIcon size={16} /> {alt}{imagesList.length > 1 ? ` (${index + 1}/${imagesList.length})` : ''}
        </div>
      </motion.div>
    </div>
  );
};

export default ImageViewer;
