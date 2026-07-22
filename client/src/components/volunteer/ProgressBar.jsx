import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ value = 0, label, color = 'primary', showPercent = true, height = 8 }) => {
  const getColorValue = () => {
    switch (color) {
      case 'primary': return 'var(--color-primary)';
      case 'secondary': return 'var(--color-secondary)';
      case 'accent': return 'var(--color-accent)';
      case 'purple': return 'var(--color-purple)';
      default: return 'var(--color-primary)';
    }
  };

  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div style={{ width: '100%' }}>
      {(label || showPercent) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          {label && <span style={{ color: 'var(--color-heading)' }}>{label}</span>}
          {showPercent && <span style={{ color: getColorValue() }}>{Math.round(clampedValue)}%</span>}
        </div>
      )}
      <div style={{ width: '100%', height: `${height}px`, backgroundColor: 'var(--color-border)', borderRadius: '99px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            height: '100%',
            backgroundColor: getColorValue(),
            borderRadius: '99px'
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
