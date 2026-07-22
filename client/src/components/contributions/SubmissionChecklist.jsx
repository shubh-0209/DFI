import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

const SubmissionChecklist = ({ formData }) => {
  const checks = [
    { label: 'Title is provided', valid: formData.title && formData.title.trim().length >= 3 },
    { label: 'Description is provided', valid: formData.description && formData.description.trim().length >= 20 },
    { label: 'Category is selected', valid: !!formData.category },
    { label: 'At least one file or external link', valid: (formData.files && formData.files.length > 0) || !!(formData.githubUrl || formData.figmaUrl || formData.canvaUrl || formData.googleDriveUrl) },
    { label: 'Hours worked is set', valid: formData.hoursWorked > 0 },
  ];

  const allValid = checks.every((c) => c.valid);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        {allValid ? (
          <CheckCircle2 size={20} style={{ color: 'var(--color-success)' }} />
        ) : (
          <AlertCircle size={20} style={{ color: 'var(--color-warning)' }} />
        )}
        <span style={{ color: 'var(--color-heading)' }}>Submission Checklist</span>
      </div>
      {checks.map((check, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: check.valid ? 'rgba(5, 150, 105, 0.06)' : 'rgba(217, 119, 17, 0.06)',
            border: `1px solid ${check.valid ? 'rgba(5, 150, 105, 0.15)' : 'rgba(217, 119, 17, 0.15)'}` }}
        >
          {check.valid ? (
            <CheckCircle2 size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
          ) : (
            <Circle size={18} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
          )}
          <span style={{ color: check.valid ? 'var(--color-heading)' : 'var(--color-body)' }}>
            {check.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default SubmissionChecklist;
