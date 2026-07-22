import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const CollaborationEmptyState = ({ title = 'No workspaces found', description = 'Create your first workspace to start collaborating with your team.', action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(3rem, 6vw, 5rem) clamp(1rem, 3vw, 2rem)',
        textAlign: 'center',
        backgroundColor: 'var(--color-card)',
        borderRadius: 'var(--radius-xl)',
        border: '2px dashed var(--color-border)',
        margin: '2rem 0',
        position: 'relative',
        overflow: 'hidden' }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ marginBottom: '1.5rem' }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="20" y="30" width="80" height="60" rx="12" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="4" />
          <rect x="35" y="45" width="50" height="8" rx="4" fill="var(--color-primary)" opacity="0.4" />
          <rect x="35" y="60" width="30" height="8" rx="4" fill="var(--color-secondary)" opacity="0.4" />
          <circle cx="90" cy="90" r="20" fill="var(--color-primary)" opacity="0.1" />
        </svg>
      </motion.div>
      <h3 style={{
        marginBottom: '0.75rem',
        color: 'var(--color-heading)' }}>
        {title}
      </h3>
      <p style={{
        color: 'var(--color-body)',
        maxWidth: '420px',
        marginBottom: '2rem' }}>
        {description}
      </p>
      {action && (
        <motion.button
          onClick={action.onClick}
          className="btn btn-primary"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} aria-hidden="true" />
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
};

export default CollaborationEmptyState;
