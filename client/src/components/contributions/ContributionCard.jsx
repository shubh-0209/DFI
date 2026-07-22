import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Tag, Coins, FolderOpen, Edit, Trash2, Eye, GitBranch } from 'lucide-react';
import ContributionStatusBadge from './ContributionStatusBadge';
import { getCategoryName } from '../../services/contributionMyService';

const ContributionCard = ({ contribution, onViewDetails, onContinueEdit, onDelete, _onDuplicate }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const canEdit = contribution.status === 'draft' || contribution.status === 'needs_changes';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="card contribution-item-card"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        height: '100%',
        cursor: 'pointer' }}
      onClick={() => onViewDetails?.(contribution)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onViewDetails?.(contribution); } }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${contribution.title}`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ color: 'var(--color-heading)', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {contribution.title}
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <ContributionStatusBadge status={contribution.status} />
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '9999px',
                background: 'var(--color-bg)',
                color: 'var(--color-body)',
                border: '1px solid var(--color-border)' }}
            >
              <FolderOpen size={12} /> {getCategoryName(contribution.category)}
            </span>
          </div>
        </div>
      </div>

      <p style={{ color: 'var(--color-body)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {contribution.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {(contribution.tags || []).slice(0, 4).map((tag) => (
          <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.5rem', borderRadius: '9999px', background: 'rgba(5, 150, 105, 0.08)', color: 'var(--color-secondary)' }}>
            <Tag size={10} /> {tag}
          </span>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', padding: '0.75rem 0', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-body)' }}>
          <Clock size={14} /> {contribution.hoursWorked || 0} hrs
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-body)' }}>
          <Coins size={14} /> {contribution.totalCoinsAwarded || contribution.coins || 0} coins
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-body)' }}>
          <GitBranch size={14} /> v{contribution.currentVersion?.versionNumber || contribution.versions?.length || 1}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', color: 'var(--color-body)' }}>
        <span>Updated {formatDate(contribution.updatedAt || contribution.createdAt)}</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onViewDetails?.(contribution); }}
            style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', display: 'flex' }}
            aria-label="View details"
          >
            <Eye size={16} />
          </button>
          {canEdit && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onContinueEdit?.(contribution); }}
              style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-secondary)', display: 'flex' }}
              aria-label="Continue editing"
            >
              <Edit size={16} />
            </button>
          )}
          {canEdit && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete?.(contribution); }}
              style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', display: 'flex' }}
              aria-label="Delete draft"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ContributionCard;
