import React from 'react';
import { motion } from 'framer-motion';

const ContributionStatsCard = ({ icon, value, label, color = 'primary', suffix = '' }) => {
  const getBgColor = () => {
    const map = {
      primary: 'rgba(211, 84, 0, 0.10)',
      secondary: 'rgba(5, 150, 105, 0.10)',
      accent: 'rgba(217, 119, 17, 0.10)',
      purple: 'rgba(124, 58, 246, 0.10)',
      success: 'rgba(5, 150, 105, 0.10)',
      warning: 'rgba(217, 119, 17, 0.10)',
      info: 'rgba(37, 99, 235, 0.10)',
    };
    return map[color] || map.primary;
  };

  const getTextColor = () => {
    const map = {
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      accent: 'var(--color-accent)',
      purple: 'var(--color-purple)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      info: 'var(--color-info)',
    };
    return map[color] || map.primary;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.25rem' }}
      tabIndex={0}
      role="group"
      aria-label={`${label}: ${value}${suffix}`}
      onKeyDown={handleKeyDown}
    >
      <div style={{
        padding: '0.75rem',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: getBgColor(),
        color: getTextColor(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ color: 'var(--color-body)', textTransform: 'uppercase' }}>
          {label}
        </span>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}
        >
          <span style={{ color: 'var(--color-heading)', margin: 0 }}>
            {value}{suffix}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContributionStatsCard;
