import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ icon, value, label, trend, color = 'primary', suffix = '' }) => {
  const getColorValue = () => {
    const colors = {
      primary: 'rgba(211, 84, 0, 0.12)',
      secondary: 'rgba(5, 150, 105, 0.12)',
      accent: 'rgba(217, 119, 17, 0.12)',
      purple: 'rgba(124, 58, 246, 0.12)',
      error: 'rgba(220, 38, 38, 0.1)',
      success: 'rgba(5, 150, 105, 0.12)',
      warning: 'rgba(217, 119, 17, 0.12)',
      info: 'rgba(37, 99, 235, 0.12)',
    };
    return colors[color] || colors.primary;
  };

  const getTextColorValue = () => {
    const colors = {
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      accent: 'var(--color-accent)',
      purple: 'var(--color-purple)',
      error: 'var(--color-error)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      info: 'var(--color-info)',
    };
    return colors[color] || colors.primary;
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
    >
      <div style={{
        padding: '0.75rem',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: getColorValue(),
        color: getTextColorValue(),
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

          {trend && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                color: trend.direction === 'up' ? 'var(--color-success)' : 'var(--color-error)' }}
              aria-label={`${trend.value} ${trend.direction === 'up' ? 'increase' : 'decrease'}`}
            >
              {trend.direction === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {trend.value}
            </span>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StatCard;
