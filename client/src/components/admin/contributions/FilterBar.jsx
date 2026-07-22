import React from 'react';
import { ChevronDown, X } from 'lucide-react';

const FilterSelect = ({ label, value, onChange, options }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
    {label && (
      <label style={{ color: 'var(--color-heading)', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
        {label}
      </label>
    )}
    <div style={{ position: 'relative' }}>
      <select
        className="form-control"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        style={{ padding: '0.5rem 2.25rem 0.5rem 0.875rem', width: 'auto', minWidth: '155px', appearance: 'none', backgroundColor: '#ffffff', border: '1px solid #d9e6f5', borderRadius: '12px' }}
      >
        <option value="">{label === 'Sort By' ? 'Newest First' : 'All'}</option>
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <ChevronDown size={14} style={{ position: 'absolute', right: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)', pointerEvents: 'none' }} aria-hidden="true" />
    </div>
  </div>
);

const FilterBar = ({ filters, onChange }) => {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = filters.status || filters.category || filters.sortBy !== 'createdAt';

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'needs_changes', label: 'Needs Changes' },
    { value: 'archived', label: 'Archived' },
  ];

  const categoryOptions = [
    { value: 'graphic_design', label: 'Graphic Design' },
    { value: 'content_writing', label: 'Content Writing' },
    { value: 'digital_marketing', label: 'Digital Marketing' },
    { value: 'photography', label: 'Photography' },
    { value: 'videography', label: 'Videography' },
    { value: 'teaching', label: 'Teaching' },
    { value: 'web_development', label: 'Web Development' },
    { value: 'ui_ux', label: 'UI/UX Design' },
    { value: 'event_management', label: 'Event Management' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'research', label: 'Research' },
    { value: 'other', label: 'Other' },
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: '-createdAt', label: 'Oldest First' },
    { value: '-totalCoinsAwarded', label: 'Most Coins' },
    { value: '-hoursWorked', label: 'Most Hours' },
    { value: 'title', label: 'Alphabetical' },
  ];

  return (
    <>
      <FilterSelect label="Status" value={filters.status} onChange={(v) => handleChange('status', v)} options={statusOptions} />
      <FilterSelect label="Category" value={filters.category} onChange={(v) => handleChange('category', v)} options={categoryOptions} />
      <FilterSelect label="Sort By" value={filters.sortBy} onChange={(v) => handleChange('sortBy', v)} options={sortOptions} />
      
      {hasActiveFilters && (
        <button
          onClick={() => onChange({ status: '', category: '', sortBy: 'createdAt' })}
          style={{ color: 'var(--color-body)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.5rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', height: '38px' }}
          aria-label="Clear all filters"
        >
          <X size={14} /> Clear all
        </button>
      )}
    </>
  );
};

export default FilterBar;
