import React from 'react';

const ContributionStatusBadge = ({ status }) => {
  const color = {
    draft: { bg: 'rgba(107, 114, 128, 0.10)', text: '#6B7280', border: 'rgba(107, 114, 128, 0.20)' },
    pending: { bg: 'rgba(245, 158, 11, 0.10)', text: '#D97706', border: 'rgba(245, 158, 11, 0.20)' },
    approved: { bg: 'rgba(5, 150, 105, 0.10)', text: '#059669', border: 'rgba(5, 150, 105, 0.20)' },
    needs_changes: { bg: 'rgba(217, 119, 17, 0.10)', text: '#D97706', border: 'rgba(217, 119, 17, 0.20)' },
    rejected: { bg: 'rgba(239, 68, 68, 0.10)', text: '#DC2626', border: 'rgba(239, 68, 68, 0.20)' },
    archived: { bg: 'rgba(148, 163, 184, 0.10)', text: '#64748B', border: 'rgba(148, 163, 184, 0.20)' },
    under_review: { bg: 'rgba(59, 130, 246, 0.10)', text: '#2563EB', border: 'rgba(59, 130, 246, 0.20)' },
  }[status] || { bg: 'rgba(107, 114, 128, 0.10)', text: '#6B7280', border: 'rgba(107, 114, 128, 0.20)' };

  const label = status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        background: color.bg,
        color: color.text,
        border: `1px solid ${color.border}`,
        textTransform: 'capitalize' }}
    >
      {label}
    </span>
  );
};

export default ContributionStatusBadge;
