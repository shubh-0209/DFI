import React from 'react';
import { Search, X } from 'lucide-react';

const ContributionSearch = ({ value, onChange, placeholder = 'Search contributions...' }) => {
  return (
    <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
      <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)', pointerEvents: 'none' }}>
        <Search size={18} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="form-control"
        style={{ paddingLeft: '2.5rem', paddingRight: value ? '2.5rem' : undefined, width: '100%' }}
      />
      {value && (
        <button
          type="button"
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
            justifyContent: 'center' }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default ContributionSearch;
