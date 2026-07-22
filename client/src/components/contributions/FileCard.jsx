import React from 'react';
import { motion } from 'framer-motion';
import { File, Image, Video, FileText, X, CheckCircle2 } from 'lucide-react';

const FileCard = ({ file, onRemove, progress = 100, status = 'completed' }) => {
  const getFileIcon = () => {
    if (file.type?.startsWith('image/')) return <Image size={20} style={{ color: 'var(--color-secondary)' }} />;
    if (file.type?.startsWith('video/')) return <Video size={20} style={{ color: 'var(--color-purple)' }} />;
    if (file.type?.includes('pdf')) return <FileText size={20} style={{ color: 'var(--color-error)' }} />;
    return <File size={20} style={{ color: 'var(--color-primary)' }} />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const isUploading = status === 'uploading';
  const isError = status === 'error';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.875rem',
        padding: '0.875rem 1rem',
        backgroundColor: 'var(--color-card)',
        border: `1px solid ${isError ? 'var(--color-error)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-md)',
        transition: 'var(--transition-fast)' }}
    >
      <div
        style={{
          padding: '0.5rem',
          backgroundColor: 'var(--color-bg)',
          borderRadius: 'var(--radius-sm)',
          flexShrink: 0 }}
      >
        {getFileIcon()}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: 'var(--color-heading)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis' }}
        >
          {file.name}
        </div>
        <div style={{ color: 'var(--color-body)', marginTop: '0.15rem' }}>
          {formatFileSize(file.size)}
        </div>
        {isUploading && (
          <div
            style={{
              height: 4,
              background: 'var(--color-border)',
              borderRadius: 99,
              marginTop: '0.5rem',
              overflow: 'hidden' }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'var(--color-primary)',
                borderRadius: 99,
                transition: 'width 0.3s ease' }}
            />
          </div>
        )}
        {isError && (
          <div style={{ color: 'var(--color-error)', marginTop: '0.25rem' }}>
            Upload failed. Please try again.
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
        {status === 'completed' && <CheckCircle2 size={18} style={{ color: 'var(--color-success)' }} />}
        {status === 'error' && (
          <button
            onClick={() => onRemove?.(file)}
            style={{
              padding: '0.25rem',
              color: 'var(--color-error)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer' }}
            aria-label="Retry upload"
          >
            Retry
          </button>
        )}
        <button
          onClick={() => onRemove?.(file)}
          style={{
            padding: '0.25rem',
            color: 'var(--color-body)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-error)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-body)')}
          aria-label={`Remove ${file.name}`}
        >
          <X size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default FileCard;
