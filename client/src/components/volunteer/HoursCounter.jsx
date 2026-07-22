import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const HoursCounter = ({ value = 0, suffix = '', label, size = 'lg' }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const animation = animate(count, value, {
      duration: 1.5,
      ease: "easeOut"
    });

    return animation.stop;
  }, [value, count]);

  const fontSize = size === 'lg' ? '3rem' : '1.75rem';

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {label && <span style={{ color: 'var(--color-body)', marginBottom: '0.25rem' }}>{label}</span>}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
        <motion.span 
          className="hours-gradient-text"
          style={{ fontSize }}
        >
          {rounded}
        </motion.span>
        {suffix && (
          <span style={{ color: 'var(--color-body)' }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

export default HoursCounter;
