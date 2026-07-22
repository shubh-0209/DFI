import React from 'react';
import { motion } from 'framer-motion';

const SimpleLoader = ({ text = 'Loading...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        width: '100%',
        minHeight: '200px',
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '3px solid rgba(11, 76, 163, 0.1)',
          borderTopColor: '#0B4CA3',
          marginBottom: '1rem',
        }}
      />
      {text && (
        <span
          style={{
            color: 'var(--color-body)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
          }}
        >
          {text}
        </span>
      )}
    </div>
  );
};

export default SimpleLoader;
