import SimpleLoader from '../common/SimpleLoader';
import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard = ({ delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay }}
    className="card"
    style={{
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.875rem',
      borderLeft: '4px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)' }}
  >
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <div className="skeleton" style={{ height: 22, width: 72, borderRadius: 999 }} />
      <div className="skeleton" style={{ height: 22, width: 84, borderRadius: 999 }} />
      <div className="skeleton" style={{ height: 22, width: 64, borderRadius: 999 }} />
    </div>
    <div className="skeleton" style={{ height: 26, width: '78%', borderRadius: 6 }} />
    <div className="skeleton" style={{ height: 15, width: '100%', borderRadius: 4 }} />
    <div className="skeleton" style={{ height: 15, width: '100%', borderRadius: 4 }} />
    <div className="skeleton" style={{ height: 15, width: '58%', borderRadius: 4 }} />
  </motion.div>
);

const AnnouncementSkeleton = ({ count = 3 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
    {Array.from({ length: count }).map((_, i) => (
      <SimpleLoader />
    ))}
  </div>
);

export default AnnouncementSkeleton;
