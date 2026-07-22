import React, { useState, useMemo } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

const PERIODS = [
  { label: 'All Time', value: '' },
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'this_week' },
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'Last 3 Months', value: 'last_3_months' },
  { label: 'Last 6 Months', value: 'last_6_months' },
  { label: 'Last Year', value: 'last_year' },
];

const FilterBar = ({ onChange }) => {
  const [selected, setSelected] = useState('this_month');

  const handleSelect = (e) => {
    const value = e.target.value;
    setSelected(value);
    onChange({ period: value });
  };

  return (
    <div className="flex items-center gap-3 mb-4" style={{ flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '180px' }}>
        <Calendar size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)', pointerEvents: 'none', zIndex: 1 }} />
        <select
          value={selected}
          onChange={handleSelect}
          className="form-control"
          style={{ paddingLeft: '2.75rem', appearance: 'none', cursor: 'pointer' }}
          aria-label="Select date period for analytics"
        >
          {PERIODS.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        <ChevronDown size={16} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
};

export default FilterBar;
