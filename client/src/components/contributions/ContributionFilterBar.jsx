import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

const ContributionFilterBar = ({ filters, onFilterChange, categories = [] }) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.75rem',
      alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-body)' }}>
        <SlidersHorizontal size={16} />
        <span>Filters</span>
      </div>

      <select
        value={filters.status || ''}
        onChange={(e) => handleChange('status', e.target.value || undefined)}
        aria-label="Filter by status"
        className="form-control"
        style={{ padding: '0.5rem 2rem 0.5rem 0.75rem', minWidth: '140px', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center' }}
      >
        <option value="">All Statuses</option>
        <option value="approved">Approved</option>
        <option value="pending">Pending</option>
        <option value="under_review">Under Review</option>
        <option value="rejected">Rejected</option>
        <option value="needs_changes">Needs Changes</option>
      </select>

      <select
        value={filters.category || ''}
        onChange={(e) => handleChange('category', e.target.value || undefined)}
        aria-label="Filter by category"
        className="form-control"
        style={{ padding: '0.5rem 2rem 0.5rem 0.75rem', minWidth: '160px', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center' }}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
    </div>
  );
};

export default ContributionFilterBar;
