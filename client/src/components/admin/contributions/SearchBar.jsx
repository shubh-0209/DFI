import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search contributions...' }) => {
  return (
    <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
      <Search size={17} style={{ position: 'absolute', left: '0.875rem', color: 'var(--color-body)', pointerEvents: 'none' }} />
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-control"
        style={{ paddingLeft: '2.5rem', paddingRight: value ? '2.25rem' : '1rem', backgroundColor: '#ffffff', height: '42px', width: '100%', border: '1px solid #d9e6f5', borderRadius: '12px' }}
        aria-label={placeholder}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          style={{ position: 'absolute', right: '0.625rem', color: 'var(--color-body)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
