import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import ContributionStatusBadge from './ContributionStatusBadge';

const ReviewHistory = ({ reviews = [] }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-body)' }}>
        <Clock size={32} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
        <p>No review history yet.</p>
      </div>
    );
  }

  const getActionIcon = (action) => {
    switch (action) {
      case 'approved': return <CheckCircle2 size={18} style={{ color: 'var(--color-success)' }} />;
      case 'rejected': return <XCircle size={18} style={{ color: 'var(--color-error)' }} />;
      case 'needs_changes': return <AlertCircle size={18} style={{ color: 'var(--color-accent)' }} />;
      default: return <Clock size={18} style={{ color: 'var(--color-body)' }} />;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h4 style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
        Review History
      </h4>
      {reviews.map((review, index) => (
        <motion.div
          key={review._id || index}
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
              {getActionIcon(review.action)}
              <ContributionStatusBadge status={review.action} />
            </div>
            <span style={{ color: 'var(--color-body)' }}>{formatDate(review.reviewedAt || review.createdAt)}</span>
          </div>
          {review.feedback && (
            <div style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
              {review.feedback}
            </div>
          )}
          {review.reason && (
            <div style={{ color: 'var(--color-body)', marginBottom: '0.5rem' }}>
              <strong>Reason:</strong> {review.reason.replace(/_/g, ' ')}
            </div>
          )}
          {review.coinsAwarded > 0 && (
            <div style={{ color: 'var(--color-success)' }}>
              +{review.coinsAwarded} coins awarded
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ReviewHistory;
