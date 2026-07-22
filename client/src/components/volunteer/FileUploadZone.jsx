import React, { useState, useRef } from 'react';
import { safeSlice } from '../../utils/safeSlice';
import { UploadCloud, File, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FileUploadZone = ({ onFilesSelected, maxFiles = 5, acceptedTypes = '.pdf,.doc,.docx,.jpg,.png', label = 'Upload Documents' }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles) => {
    const totalFiles = safeSlice([...files, ...newFiles], 0, maxFiles);
    setFiles(totalFiles);
    if (onFilesSelected) onFilesSelected(totalFiles);
  };

  const removeFile = (indexToRemove) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    if (onFilesSelected) onFilesSelected(updatedFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.includes('image')) return <ImageIcon size={20} style={{ color: 'var(--color-secondary)' }} />;
    return <File size={20} style={{ color: 'var(--color-primary)' }} />;
  };

  return (
    <div style={{ width: '100%', marginBottom: '1.25rem' }}>
      <label className="form-label">{label}</label>

      {/* Drop Zone */}
      <div 
        onDragEnter={handleDrag} 
        onDragLeave={handleDrag} 
        onDragOver={handleDrag} 
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
          backgroundColor: dragActive ? 'rgba(37, 99, 235, 0.05)' : 'var(--color-card)',
          borderRadius: 'var(--radius-md)',
          padding: '2.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'var(--transition-fast)',
          textAlign: 'center'
        }}
      >
        <input 
          ref={inputRef}
          type="file" 
          multiple 
          accept={acceptedTypes}
          onChange={handleChange} 
          style={{ display: 'none' }}
        />
        <div style={{ 
          width: '64px', height: '64px', borderRadius: '50%', 
          backgroundColor: dragActive ? 'var(--color-primary)' : 'var(--color-bg)',
          color: dragActive ? '#fff' : 'var(--color-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1rem', transition: 'var(--transition-fast)'
        }}>
          <UploadCloud size={32} />
        </div>
        <p style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
          Click to upload or drag and drop
        </p>
        <p style={{ color: 'var(--color-body)' }}>
          SVG, PNG, JPG, PDF or DOCX (max {maxFiles} files)
        </p>
      </div>

      {/* File List */}
      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <AnimatePresence>
          {files.map((file, index) => (
            <motion.div 
              key={`${file.name}-${index}`}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, height: 0, marginTop: 0 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', 
                padding: '0.75rem 1rem', 
                backgroundColor: 'var(--color-card)', 
                border: '1px solid var(--color-border)', 
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-sm)' }}>
                {getFileIcon(file.type)}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ color: 'var(--color-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {file.name}
                </div>
                <div style={{ color: 'var(--color-body)' }}>
                  {formatFileSize(file.size)}
                </div>
              </div>
              <CheckCircle size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
              <button 
                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                style={{ 
                  padding: '0.25rem', color: 'var(--color-body)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '50%', flexShrink: 0 
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-error)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-body)'}
              >
                <X size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FileUploadZone;
