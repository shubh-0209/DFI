import SimpleLoader from '../common/SimpleLoader';
import React from 'react';

const SkeletonLoader = ({ type = 'grid', count = 8 }) => {
  if (type === 'grid') {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.25rem' }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div className="skeleton" style={{ width: '100%', height: '180px', borderRadius: 0 }} />
            <div style={{ padding: '1.25rem' }}>
              <div className="skeleton" style={{ height: '14px', width: '60%', borderRadius: '4px', marginBottom: '0.5rem' }} />
              <div className="skeleton" style={{ height: '10px', width: '40%', borderRadius: '4px', marginBottom: '1rem' }} />
              <div className="skeleton" style={{ height: '32px', width: '100%', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }} />
              <div className="skeleton" style={{ height: '32px', width: '100%', borderRadius: 'var(--radius-md)' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: '14px', width: '50%', borderRadius: '4px', marginBottom: '0.5rem' }} />
              <div className="skeleton" style={{ height: '10px', width: '30%', borderRadius: '4px' }} />
            </div>
            <div className="skeleton" style={{ width: '80px', height: '32px', borderRadius: 'var(--radius-md)' }} />
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
