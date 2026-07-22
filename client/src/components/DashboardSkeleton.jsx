import SimpleLoader from './common/SimpleLoader';
import React from 'react';

const DashboardSkeleton = ({ type = 'dashboard', count = 4 }) => {
  const renderSkeleton = (index) => {
    switch (type) {
      case 'card':
        return (
          <div key={index} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="skeleton" style={{ width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: '12px', width: '60%', borderRadius: '4px', marginBottom: '0.5rem' }} />
              <div className="skeleton" style={{ height: '24px', width: '40%', borderRadius: '4px', marginBottom: '0.25rem' }} />
              <div className="skeleton" style={{ height: '10px', width: '30%', borderRadius: '4px' }} />
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div key={index} style={{ width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="card" style={{ height: '80px', animation: 'shimmer 1.5s infinite' }} />
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
              <div className="card" style={{ height: '400px', animation: 'shimmer 1.5s infinite' }} />
              <div className="card" style={{ height: '400px', animation: 'shimmer 1.5s infinite' }} />
            </div>
          </div>
        );

      case 'list':
        return (
          <div key={index} className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
            <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '8px', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: '16px', width: '50%', borderRadius: '4px', marginBottom: '0.5rem' }} />
              <div className="skeleton" style={{ height: '12px', width: '30%', borderRadius: '4px' }} />
            </div>
          </div>
        );

      default:
        return <div key={index} className="skeleton" style={{ height: '80px', width: '100%', marginBottom: '1rem' }} />;
    }
  };

  if (type === 'dashboard') {
    return renderSkeleton(0);
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
      {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
    </div>
  );
};

export default DashboardSkeleton;