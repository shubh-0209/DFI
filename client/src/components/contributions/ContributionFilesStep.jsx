import React, { useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, AlertCircle } from 'lucide-react';
import FileCard from './FileCard';
import ExternalLinksForm from './ExternalLinksForm';
import { MAX_FILES, MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '../../constants/contributionConstants';

const ContributionFilesStep = ({ data, onChange, errors = {} }) => {
  const files = data.files || [];
  const dataRef = useRef(data);
  const filesRef = useRef(files);

  dataRef.current = data;
  filesRef.current = files;

  const onDrop = useCallback((acceptedFiles) => {
    const currentFiles = filesRef.current || [];
    const remaining = MAX_FILES - currentFiles.length;
    if (remaining <= 0) {
      return;
    }
    const newFiles = acceptedFiles.slice(0, remaining).map((file) => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading',
    }));
    onChange({ ...dataRef.current, files: [...currentFiles, ...newFiles] });
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: MAX_FILE_SIZE,
    accept: ALLOWED_FILE_TYPES,
    disabled: files.length >= MAX_FILES,
  });

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    onChange({ ...data, files: updated });
  };

  const retryUpload = (index) => {
    const updated = [...files];
    updated[index] = { ...updated[index], status: 'uploading', progress: 0 };
    onChange({ ...data, files: updated });
    setTimeout(() => {
      const retried = [...data.files];
      retried[index] = { ...retried[index], status: 'completed', progress: 100 };
      onChange({ ...data, files: retried });
    }, 1500);
  };

  const handleLinksChange = (links) => {
    onChange({ ...data, ...links });
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <div>
        <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
          Upload Files <span style={{ color: 'var(--color-body)' }}>(optional)</span>
        </label>
        <div
          {...getRootProps()}
          style={{
            border: `2px dashed ${isDragActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
            backgroundColor: isDragActive ? 'rgba(37, 99, 235, 0.05)' : 'var(--color-card)',
            borderRadius: 'var(--radius-md)',
            padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 1.5rem)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: files.length >= MAX_FILES ? 'not-allowed' : 'pointer',
            transition: 'var(--transition-fast)',
            textAlign: 'center',
            opacity: files.length >= MAX_FILES ? 0.6 : 1 }}
          role="button"
          tabIndex={files.length >= MAX_FILES ? -1 : 0}
          aria-label="Upload files by clicking or dragging"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (files.length < MAX_FILES) {
                document.getElementById('file-upload-input')?.click();
              }
            }
          }}
        >
          <input {...getInputProps()} id="file-upload-input" />
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: isDragActive ? 'var(--color-primary)' : 'var(--color-bg)',
              color: isDragActive ? '#fff' : 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              transition: 'var(--transition-fast)' }}
          >
            <UploadCloud size={32} />
          </div>
          <p style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
            {isDragActive ? 'Drop files here...' : 'Click to upload or drag and drop'}
          </p>
          <p style={{ color: 'var(--color-body)' }}>
            PDF, DOC, DOCX, PPT, PPTX, Images, Videos, ZIP, RAR, 7Z (max {MAX_FILES} files, {formatFileSize(MAX_FILE_SIZE)} each)
          </p>
        </div>

        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              {files.map((file, index) => (
                <FileCard
                  key={`${file.name}-${index}`}
                  file={file}
                  onRemove={() => removeFile(index)}
                  onRetry={() => retryUpload(index)}
                  progress={file.progress || 100}
                  status={file.status || 'completed'}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {errors.files && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', color: 'var(--color-error)' }}>
            <AlertCircle size={16} /> {errors.files}
          </div>
        )}
      </div>

      <div>
        <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
          External Links <span style={{ color: 'var(--color-body)' }}>(optional)</span>
        </label>
        <ExternalLinksForm
          values={{
            githubUrl: data.githubUrl || '',
            figmaUrl: data.figmaUrl || '',
            canvaUrl: data.canvaUrl || '',
            googleDriveUrl: data.googleDriveUrl || '' }}
          onChange={handleLinksChange}
          errors={errors}
        />
      </div>
    </motion.div>
  );
};

export default ContributionFilesStep;
