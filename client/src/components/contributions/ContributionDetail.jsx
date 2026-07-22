import SimpleLoader from '../common/SimpleLoader';
import React from 'react';
import { motion } from 'framer-motion';
import { X, FolderOpen, Edit, Trash2 } from 'lucide-react';
import ContributionStatusBadge from './ContributionStatusBadge';
import ContributionTimeline from './ContributionTimeline';
import ReviewHistory from './ReviewHistory';
import VersionHistory from './VersionHistory';
import { useContributionDetail, useVersionHistory, useContributionReviews, useDeleteDraft, getCategoryName } from '../../services/contributionMyService';

const ContributionDetail = ({ contributionId, onClose, onContinueEdit }) => {
  const { data: detail, isLoading: detailLoading } = useContributionDetail(contributionId);
  const { data: versions } = useVersionHistory(contributionId);
  const { data: reviews } = useContributionReviews(contributionId);
  const deleteMutation = useDeleteDraft();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this draft? This action cannot be undone.')) {
      await deleteMutation.mutateAsync(contributionId);
      onClose?.();
    }
  };

  if (detailLoading) {
    return (
      <div style={{ padding: 'clamp(2rem, 5vw, 4rem)', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <SimpleLoader />
      </div>
    );
  }

  if (!detail) {
    return (
      <div style={{ padding: 'clamp(2rem, 5vw, 4rem)', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-body)', marginBottom: '1rem' }}>Contribution not found.</p>
        <button onClick={onClose} className="btn btn-secondary">Go Back</button>
      </div>
    );
  }

  const canEdit = detail.status === 'draft' || detail.status === 'needs_changes';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
            {detail.title}
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <ContributionStatusBadge status={detail.status} />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.6rem', borderRadius: '9999px', background: 'var(--color-bg)', color: 'var(--color-body)', border: '1px solid var(--color-border)' }}>
              <FolderOpen size={12} /> {getCategoryName(detail.category)}
            </span>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-body)', padding: '0.5rem', display: 'flex' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1rem' }}>
        <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)' }}>
          <div style={{ color: 'var(--color-body)', marginBottom: '0.25rem' }}>Hours Worked</div>
          <div style={{ color: 'var(--color-heading)' }}>{detail.hoursWorked || 0} hrs</div>
        </div>
        <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)' }}>
          <div style={{ color: 'var(--color-body)', marginBottom: '0.25rem' }}>Coins Earned</div>
          <div style={{ color: 'var(--color-heading)' }}>{detail.totalCoinsAwarded || detail.coins || 0}</div>
        </div>
      </div>

      <div>
        <h4 style={{ color: 'var(--color-heading)', marginBottom: '0.75rem' }}>Description</h4>
        <p style={{ color: 'var(--color-body)', whiteSpace: 'pre-wrap' }}>{detail.description}</p>
      </div>

      {(detail.skillsUsed?.length > 0 || detail.tags?.length > 0) && (
        <div>
          <h4 style={{ color: 'var(--color-heading)', marginBottom: '0.75rem' }}>Skills & Tags</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {detail.skillsUsed?.map((skill) => (
              <span key={skill} style={{ padding: '0.35rem 0.75rem', borderRadius: '9999px', background: 'rgba(211, 84, 0, 0.10)', color: 'var(--color-primary)' }}>{skill}</span>
            ))}
            {detail.tags?.map((tag) => (
              <span key={tag} style={{ padding: '0.35rem 0.75rem', borderRadius: '9999px', background: 'rgba(5, 150, 105, 0.10)', color: 'var(--color-secondary)' }}>{tag}</span>
            ))}
          </div>
        </div>
      )}

      <ContributionTimeline currentStatus={detail.status} />

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {canEdit && (
          <button onClick={() => onContinueEdit?.(detail)} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Edit size={16} /> Continue Editing
          </button>
        )}
        {canEdit && (
          <button onClick={handleDelete} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-error)' }}>
            <Trash2 size={16} /> Delete Draft
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '2rem' }}>
        <VersionHistory versions={versions} />
        <ReviewHistory reviews={reviews} />
      </div>
    </motion.div>
  );
};

export default ContributionDetail;
