import React from 'react';
import { motion } from 'framer-motion';

const ContributionEmptyState = ({ type = 'default', title, description, action }) => {
  const getIllustration = () => {
    switch (type) {
      case 'drafts':
        return (
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="80" height="80" rx="12" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="4"/>
            <rect x="40" y="45" width="40" height="8" rx="4" fill="var(--color-primary)" opacity="0.4"/>
            <rect x="40" y="65" width="24" height="8" rx="4" fill="var(--color-secondary)" opacity="0.4"/>
            <circle cx="90" cy="90" r="24" fill="var(--color-primary)" opacity="0.1"/>
          </svg>
        );
      case 'approved':
        return (
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="40" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="4"/>
            <path d="M45 60L55 70L75 50" stroke="var(--color-success)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'search':
      default:
        return (
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="30" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="4"/>
            <path d="M72 72L100 100" stroke="var(--color-border)" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="50" cy="50" r="15" fill="var(--color-purple)" opacity="0.1"/>
          </svg>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        backgroundColor: 'var(--color-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px dashed var(--color-border)',
        margin: '2rem 0' }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        {getIllustration()}
      </div>
      <h3 style={{ marginBottom: '0.75rem', color: 'var(--color-heading)' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--color-body)', maxWidth: '400px', marginBottom: '2rem' }}>
        {description}
      </p>
      {action && (
        <button onClick={action.onClick} className="btn btn-primary">
          {action.label}
        </button>
      )}
    </motion.div>
  );
};

export default ContributionEmptyState;
