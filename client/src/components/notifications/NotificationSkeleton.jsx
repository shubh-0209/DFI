import SimpleLoader from '../common/SimpleLoader';
import React from 'react';

const SkeletonCard = ({ compact }) => (
  <div
    className={`card skeleton notif-skeleton-card ${compact ? 'notif-card-compact' : ''}`}
    style={{
      padding: compact ? '0.875rem' : '1.125rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      borderLeft: '4px solid var(--color-border)',
      borderRadius: 16 }}
  >
    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
      <div className="skeleton" style={{ height: 20, width: 80, borderRadius: 999 }} />
      {!compact && <div className="skeleton" style={{ height: 20, width: 60, borderRadius: 999 }} />}
    </div>
    <div className="skeleton" style={{ height: 22, width: '80%', borderRadius: 6 }} />
    <div className="skeleton" style={{ height: 14, width: '100%', borderRadius: 4 }} />
    {!compact && <div className="skeleton" style={{ height: 14, width: '90%', borderRadius: 4 }} />}
    
    <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
      <div className="skeleton" style={{ height: 16, width: 90, borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 24, width: 60, borderRadius: 6 }} />
    </div>
  </div>
);

const NotificationSkeleton = ({ count = 6, compact = false }) => {
  return (
    <div style={{ 
      display: compact ? 'flex' : 'grid',
      flexDirection: compact ? 'column' : undefined,
      gridTemplateColumns: compact ? undefined : 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
      gap: compact ? '0.75rem' : '1.25rem' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <SimpleLoader />
      ))}
    </div>
  );
};

export default NotificationSkeleton;
