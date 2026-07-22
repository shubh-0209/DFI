import React from 'react';

const CollaborationSkeleton = ({ count = 6 }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="card"
          style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            height: '100%' }}
        >
          <div className="skeleton" style={{ height: '4px', width: '100%', borderRadius: 'var(--radius-md)', marginTop: '-0.5rem', marginBottom: '0.5rem' }} />
          <div className="skeleton" style={{ height: '24px', width: '70%', borderRadius: 'var(--radius-sm)' }} />
          <div className="skeleton" style={{ height: '16px', width: '40%', borderRadius: 'var(--radius-sm)' }} />
          <div className="skeleton" style={{ height: '40px', width: '100%', borderRadius: 'var(--radius-md)', marginTop: '0.5rem' }} />
        </div>
      ))}
    </div>
  );
};

export default CollaborationSkeleton;
