import SimpleLoader from '../common/SimpleLoader';
import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = (index) => {
    switch (type) {
      case 'card':
        return (
          <div key={index} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="skeleton" style={{ height: '140px', width: '100%', borderRadius: 'var(--radius-md)' }} />
            <div className="skeleton" style={{ height: '24px', width: '70%', borderRadius: '4px' }} />
            <div className="skeleton" style={{ height: '16px', width: '40%', borderRadius: '4px' }} />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem' }}>
              <div className="skeleton" style={{ height: '36px', width: '50%', borderRadius: 'var(--radius-md)' }} />
              <div className="skeleton" style={{ height: '36px', width: '50%', borderRadius: 'var(--radius-md)' }} />
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div key={index} style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="skeleton" style={{ height: '40px', width: '40px', borderRadius: '50%' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="skeleton" style={{ height: '16px', width: '30%', borderRadius: '4px' }} />
              <div className="skeleton" style={{ height: '14px', width: '20%', borderRadius: '4px' }} />
            </div>
            <div className="skeleton" style={{ height: '24px', width: '100px', borderRadius: '99px' }} />
          </div>
        );

      case 'list':
        return (
          <div key={index} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
            <div className="skeleton" style={{ height: '60px', width: '60px', borderRadius: 'var(--radius-sm)' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem' }}>
              <div className="skeleton" style={{ height: '20px', width: '40%', borderRadius: '4px' }} />
              <div className="skeleton" style={{ height: '14px', width: '60%', borderRadius: '4px' }} />
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div key={index} style={{ width: '100%' }}>
            <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="card skeleton" style={{ height: '120px' }} />
              ))}
            </div>
            <div className="grid grid-cols-2">
              <div className="card skeleton" style={{ height: '400px' }} />
              <div className="card skeleton" style={{ height: '400px' }} />
            </div>
          </div>
        );

      default:
        return <div key={index} className="skeleton" style={{ height: '100px', width: '100%', marginBottom: '1rem' }} />;
    }
  };

  if (type === 'dashboard') {
    return renderSkeleton(0);
  }

  const gridStyle = type === 'card' ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' } : {};

  return (
    <div style={gridStyle}>
      {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
    </div>
  );
};

export default SkeletonLoader;
