import React from 'react';
import { Search, X } from 'lucide-react';

const RewardSearch = ({ value, onChange, placeholder = 'Search rewards...' }) => {
  return (
    <div style={{ position: 'relative' }}>
      <Search
        size={18}
        style={{
          position: 'absolute',
          left: '0.875rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-body)',
          pointerEvents: 'none'
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search rewards"
        style={{
          width: '100%',
          padding: '0.75rem 1rem 0.75rem 2.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          background: 'var(--color-card)',
          color: 'var(--color-heading)',
          outline: 'none',
          transition: 'var(--transition-fast)'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--color-primary)';
          e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--color-border)';
          e.target.style.boxShadow = 'none';
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--color-body)',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default RewardSearch;
