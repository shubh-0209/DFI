import SimpleLoader from '../common/SimpleLoader';
import React from 'react';

const ContributionSkeleton = ({ count = 6, type = 'card' }) => {
  if (type === 'stats') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: '12px', width: '40%', borderRadius: '4px', marginBottom: '0.5rem' }} />
              <div className="skeleton" style={{ height: '20px', width: '60%', borderRadius: '4px' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'category') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1.5rem' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', textAlign: 'center' }}>
            <div className="skeleton" style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-lg)' }} />
            <div className="skeleton" style={{ height: '16px', width: '70%', borderRadius: '4px' }} />
            <div className="skeleton" style={{ height: '12px', width: '90%', borderRadius: '4px' }} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'featured') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="skeleton" style={{ height: '180px', width: '100%', borderRadius: 'var(--radius-md)' }} />
            <div className="skeleton" style={{ height: '16px', width: '60%', borderRadius: '4px' }} />
            <div className="skeleton" style={{ height: '12px', width: '40%', borderRadius: '4px' }} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'timeline') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingLeft: '2rem' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: '14px', width: '40%', borderRadius: '4px', marginBottom: '0.5rem' }} />
              <div className="skeleton" style={{ height: '10px', width: '60%', borderRadius: '4px' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.5rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="skeleton" style={{ height: '20px', width: '70%', borderRadius: '4px' }} />
          <div className="skeleton" style={{ height: '14px', width: '40%', borderRadius: '4px' }} />
          <div className="skeleton" style={{ height: '60px', width: '100%', borderRadius: 'var(--radius-md)' }} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div className="skeleton" style={{ height: '24px', width: '80px', borderRadius: '99px' }} />
            <div className="skeleton" style={{ height: '24px', width: '60px', borderRadius: '99px' }} />
          </div>
          <div className="skeleton" style={{ height: '36px', width: '100%', borderRadius: 'var(--radius-md)' }} />
        </div>
      ))}
    </div>
  );
};

export default ContributionSkeleton;
