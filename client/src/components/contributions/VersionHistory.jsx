import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Calendar, FileText, ExternalLink } from 'lucide-react';

const VersionHistory = ({ versions = [] }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (!versions || versions.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-body)' }}>
        <GitBranch size={32} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
        <p>No version history yet.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h4 style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
        Version History
      </h4>
      {versions.map((version, index) => (
        <motion.div
          key={version._id || index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-card)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GitBranch size={16} style={{ color: 'var(--color-primary)' }} />
              <span style={{ color: 'var(--color-heading)' }}>Version {version.versionNumber}</span>
            </div>
            <span style={{ color: 'var(--color-body)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={14} /> {formatDate(version.createdAt)}
            </span>
          </div>
          {version.files && version.files.length > 0 && (
            <div style={{ color: 'var(--color-body)', marginBottom: '0.5rem' }}>
              <FileText size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
              {version.files.length} file{version.files.length !== 1 ? 's' : ''} included
            </div>
          )}
          {(version.githubUrl || version.figmaUrl || version.canvaUrl || version.googleDriveUrl) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {version.githubUrl && (
                <a href={version.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ExternalLink size={12} /> GitHub
                </a>
              )}
              {version.figmaUrl && (
                <a href={version.figmaUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ExternalLink size={12} /> Figma
                </a>
              )}
              {version.canvaUrl && (
                <a href={version.canvaUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ExternalLink size={12} /> Canva
                </a>
              )}
              {version.googleDriveUrl && (
                <a href={version.googleDriveUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ExternalLink size={12} /> Drive
                </a>
              )}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default VersionHistory;
