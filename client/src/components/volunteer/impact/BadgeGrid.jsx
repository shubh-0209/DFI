import React from 'react';
import { motion } from 'framer-motion';

const BadgeGrid = ({ badges }) => {
  if (!badges || badges.length === 0) {
    return (
      <div style={{ background: 'white', borderRadius: 20, padding: '2rem', border: '1px solid #F0EDE8', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '0.75rem' }}>🎖</div>
        <h3 style={{ color: 'var(--color-heading)', margin: '0 0 0.5rem 0' }}>No Badges Yet</h3>
        <p style={{ color: 'var(--color-body)', margin: 0 }}>Keep contributing to earn badges and showcase your impact.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: 'white', borderRadius: 20, padding: '2rem', border: '1px solid #F0EDE8', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: '2rem' }}
    >
      <h3 style={{ color: 'var(--color-heading)', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        🎖 Badges Earned ({badges.length})
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {badges.map((badge, i) => {
          const icon = badge.icon || badge.badgeIcon || '🏅';
          const name = badge.name || badge.badgeName || 'Badge';
          const description = badge.description || badge.badgeDescription || '';
          const earnedAt = badge.earnedAt || badge.createdAt;
          return (
            <motion.div
              key={badge._id || badge.badgeId || i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
                borderRadius: 14, padding: '1.25rem', border: '1px solid #FDE68A',
                boxShadow: '0 2px 8px rgba(217,119,6,0.08)' }}
            >
              <div style={{ marginBottom: '0.5rem' }}>{icon}</div>
              <h4 style={{ color: 'var(--color-heading)', margin: '0 0 0.3rem 0' }}>{name}</h4>
              <p style={{ color: 'var(--color-body)', margin: '0 0 0.5rem 0' }}>{description}</p>
              {earnedAt && (
                <span style={{ color: '#D97706' }}>
                  Earned {new Date(earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BadgeGrid;
