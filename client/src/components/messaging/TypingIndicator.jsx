import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = ({ users = [] }) => {
  if (!users || users.length === 0) return null;

  const names = users.map((u) => u.name || 'Someone').join(', ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        color: 'var(--color-body)' }}
    >
      <div style={{ display: 'flex', gap: 3 }}>
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
          style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--primary-blue)' }}
        />
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
          style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--primary-blue)' }}
        />
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
          style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--primary-blue)' }}
        />
      </div>
      <span>{names} is typing...</span>
    </motion.div>
  );
};

export default TypingIndicator;
