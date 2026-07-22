import React from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

const CollaborationFilters = ({ search, onSearchChange, onClear }) => {
  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      alignItems: 'center' }}>
      <div style={{
        position: 'relative',
        flex: 1,
        minWidth: '280px',
        maxWidth: '600px' }}>
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-body)',
            pointerEvents: 'none' }}
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Search workspaces by name or description..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="form-control"
          style={{
            paddingLeft: '2.75rem',
            paddingRight: search ? '2.5rem' : '1rem',
            width: '100%',
            transition: 'var(--transition-fast)' }}
          aria-label="Search workspaces"
        />
        {search && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClear}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'var(--color-border)',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-body)',
              cursor: 'pointer',
              padding: 0 }}
            aria-label="Clear search"
          >
            <X size={14} aria-hidden="true" />
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default CollaborationFilters;
