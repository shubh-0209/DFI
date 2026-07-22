import React from 'react';
import { motion } from 'framer-motion';
import { SearchX, Plus } from 'lucide-react';

const AnnouncementEmptyState = ({ title = 'No announcements yet', description, onAction, actionLabel }) => (
  <motion.div
    initial={{ opacity: 0, y: 24, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(2.5rem, 5vw, 5rem) clamp(1rem, 3vw, 2.5rem)',
      textAlign: 'center',
      backgroundColor: 'var(--color-card)',
      borderRadius: 'var(--radius-xl)',
      border: '1px dashed var(--color-border)',
      margin: '2rem 0',
      gap: '0.75rem' }}
    role="status"
  >
    <div
      style={{
        width: 'clamp(80px, 12vw, 120px)',
        height: 'clamp(80px, 12vw, 120px)',
        borderRadius: '50%',
        background: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '3px solid var(--color-border)' }}
      aria-hidden="true"
    >
      <SearchX size={44} color="var(--color-body)" />
    </div>
    <h3 style={{ margin: 0, color: 'var(--color-heading)' }}>
      {title}
    </h3>
    <p style={{ color: 'var(--color-body)', maxWidth: '480px', margin: 0 }}>
      {description || 'There are no announcements available at the moment. Check back later for updates.'}
    </p>
    {onAction && actionLabel && (
      <button onClick={onAction} className="btn btn-primary" style={{ marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
        <Plus size={16} aria-hidden="true" /> {actionLabel}
      </button>
    )}
  </motion.div>
);

export default AnnouncementEmptyState;
