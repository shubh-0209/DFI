import React from 'react';
import { CATEGORIES } from '../../services/contributionMyService';

const ContributionFilters = ({ filters, onChange }) => {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = filters.category || filters.sortBy !== 'createdAt';

  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <select
        value={filters.category || ''}
        onChange={(e) => handleChange('category', e.target.value)}
        aria-label="Filter by category"
        className="form-control"
        style={{ minWidth: '160px' }}
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <select
        value={filters.sortBy || 'createdAt'}
        onChange={(e) => handleChange('sortBy', e.target.value)}
        aria-label="Sort contributions"
        className="form-control"
        style={{ minWidth: '160px' }}
      >
        <option value="createdAt">Newest First</option>
        <option value="-createdAt">Oldest First</option>
        <option value="-totalCoinsAwarded">Most Coins</option>
        <option value="-hoursWorked">Most Hours</option>
        <option value="-updatedAt">Most Recently Updated</option>
      </select>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => onChange({ category: '', sortBy: 'createdAt' })}
          aria-label="Clear all filters"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-body)',
            cursor: 'pointer',
            textDecoration: 'underline' }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
};

export default ContributionFilters;
