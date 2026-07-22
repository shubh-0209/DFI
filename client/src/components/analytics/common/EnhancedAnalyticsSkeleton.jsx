import SimpleLoader from '../../common/SimpleLoader';
import React from 'react';
import { motion } from 'framer-motion';

const EnhancedAnalyticsSkeleton = ({ type = 'dashboard', count = 4 }) => {
  const shimmerVariants = {
    initial: { backgroundPosition: '200% 0' },
    animate: { backgroundPosition: '-200% 0', transition: { duration: 1.5, repeat: Infinity, ease: 'linear' } }
  };

  const renderStatCardSkeleton = (index) => (
    <motion.div
      key={index}
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
      className="card"
      style={{
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        background: 'linear-gradient(90deg, var(--color-bg) 25%, rgba(0,0,0,0.04) 50%, var(--color-bg) 75%)',
        backgroundSize: '200% 100%' }}
    >
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-border)',
        flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: '12px', width: '60%', borderRadius: '4px', marginBottom: '0.5rem', background: 'var(--color-border)' }} />
        <div style={{ height: '24px', width: '40%', borderRadius: '4px', marginBottom: '0.25rem', background: 'var(--color-border)' }} />
        <div style={{ height: '10px', width: '30%', borderRadius: '4px', background: 'var(--color-border)' }} />
      </div>
    </motion.div>
  );

  const renderChartSkeleton = (index) => (
    <motion.div
      key={index}
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
      className="card"
      style={{
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '300px',
        background: 'linear-gradient(90deg, var(--color-bg) 25%, rgba(0,0,0,0.04) 50%, var(--color-bg) 75%)',
        backgroundSize: '200% 100%' }}
    >
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ height: '16px', width: '120px', borderRadius: '4px', background: 'var(--color-border)' }} />
      </div>
      <div style={{ padding: '1rem', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', height: '200px', borderRadius: 'var(--radius-md)', background: 'var(--color-border)' }} />
      </div>
    </motion.div>
  );

  const renderDashboardSkeleton = () => (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[1, 2, 3, 4].map(renderStatCardSkeleton)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[1, 2].map(renderChartSkeleton)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {[1, 2].map(renderChartSkeleton)}
      </div>
    </div>
  );

  const renderTableSkeleton = (index) => (
    <motion.div
      key={index}
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
      className="card"
      style={{
        padding: 0,
        overflow: 'hidden',
        background: 'linear-gradient(90deg, var(--color-bg) 25%, rgba(0,0,0,0.04) 50%, var(--color-bg) 75%)',
        backgroundSize: '200% 100%' }}
    >
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ height: '16px', width: '100px', borderRadius: '4px', background: 'var(--color-border)' }} />
      </div>
      <div style={{ padding: '0.5rem' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-border)', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ height: '14px', width: '40%', borderRadius: '4px', background: 'var(--color-border)' }} />
              <div style={{ height: '12px', width: '30%', borderRadius: '4px', background: 'var(--color-border)' }} />
            </div>
            <div style={{ width: '80px', height: '24px', borderRadius: '99px', background: 'var(--color-border)' }} />
          </div>
        ))}
      </div>
    </motion.div>
  );

  switch (type) {
    case 'dashboard':
      return renderDashboardSkeleton();
    case 'stat-card':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {Array.from({ length: count }).map((_, i) => renderStatCardSkeleton(i))}
        </div>
      );
    case 'chart':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {Array.from({ length: count }).map((_, i) => renderChartSkeleton(i))}
        </div>
      );
    case 'table':
      return renderTableSkeleton(0);
    default:
      return <div className="skeleton" style={{ height: '80px', width: '100%' }} />;
  }
};

export default EnhancedAnalyticsSkeleton;