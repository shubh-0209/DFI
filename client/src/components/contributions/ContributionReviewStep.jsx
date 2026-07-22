import React from 'react';
import { motion } from 'framer-motion';
import ContributionSummary from './ContributionSummary';
import SubmissionChecklist from './SubmissionChecklist';
import FileCard from './FileCard';
import SubmitButton from './SubmitButton';

const ContributionReviewStep = ({ data, onBack, onSubmit, loading = false }) => {
  const hasFiles = data.files && data.files.length > 0;
  const hasLinks = !!(data.githubUrl || data.figmaUrl || data.canvaUrl || data.googleDriveUrl);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <ContributionSummary data={data} />

      {(hasFiles || hasLinks) && (
        <div>
          <h4 style={{ color: 'var(--color-heading)', marginBottom: '1rem' }}>
            Attached Files & Links
          </h4>
          {hasFiles && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {data.files.map((file, index) => (
                <FileCard key={`${file.name}-${index}`} file={file} />
              ))}
            </div>
          )}
          {hasLinks && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.githubUrl && (
                <a href={data.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
                  GitHub: {data.githubUrl}
                </a>
              )}
              {data.figmaUrl && (
                <a href={data.figmaUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
                  Figma: {data.figmaUrl}
                </a>
              )}
              {data.canvaUrl && (
                <a href={data.canvaUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
                  Canva: {data.canvaUrl}
                </a>
              )}
              {data.googleDriveUrl && (
                <a href={data.googleDriveUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
                  Google Drive: {data.googleDriveUrl}
                </a>
              )}
            </div>
          )}
        </div>
      )}

      <div
        style={{
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem' }}
      >
        <SubmissionChecklist formData={data} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', paddingTop: '1rem' }}>
        <button type="button" onClick={onBack} className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
          Back
        </button>
        <SubmitButton onClick={onSubmit} loading={loading} />
      </div>
    </motion.div>
  );
};

export default ContributionReviewStep;
