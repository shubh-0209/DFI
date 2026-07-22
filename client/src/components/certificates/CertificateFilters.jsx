import React from 'react';
import { Filter } from 'lucide-react';

const CertificateFilters = ({ filter, sort, onFilterChange, onSortChange }) => {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card)', color: 'var(--color-body)' }}>
        <Filter size={16} />
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          style={{ background: 'transparent', border: 'none', outline: 'none', color: 'inherit', cursor: 'pointer' }}
          aria-label="Filter certificates"
        >
          <option value="all">All Certificates</option>
          <option value="pending">Issued</option>
          <option value="verified">Verified</option>
          <option value="revoked">Revoked</option>
        </select>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card)', color: 'var(--color-body)' }}>
        <span style={{ opacity: 0.7 }}>Sort:</span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          style={{ background: 'transparent', border: 'none', outline: 'none', color: 'inherit', cursor: 'pointer' }}
          aria-label="Sort certificates"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="program">Program Name</option>
        </select>
      </div>
    </div>
  );
};

export default CertificateFilters;
