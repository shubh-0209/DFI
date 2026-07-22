import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const FeatureToggle = ({ isFeatured, onToggle, loading = false }) => {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      disabled={loading}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        borderRadius: 'var(--radius-md)',
        background: isFeatured ? 'rgba(245, 158, 11, 0.15)' : 'var(--color-card)',
        color: isFeatured ? 'var(--color-accent)' : 'var(--color-body)',
        border: `1px solid ${isFeatured ? 'var(--color-accent)' : 'var(--color-border)'}`,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
        fontWeight: 600,
        fontSize: 'var(--text-base)',
      }}
    >
      <Star size={18} fill={isFeatured ? 'currentColor' : 'none'} />
      {isFeatured ? 'Featured' : 'Feature Contribution'}
    </motion.button>
  );
};

export default FeatureToggle;
