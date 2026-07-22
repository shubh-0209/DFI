import React from 'react';

/**
 * Dropdown for volunteer availability.
 * Props:
 * - id: string – input id
 * - value: string – selected value
 * - onChange: (value: string) => void – callback when selection changes
 */
const AvailabilitySelect = ({ id, value, onChange }) => {
  const options = [
    { label: 'Full‑time', value: 'full-time' },
    { label: 'Part‑time', value: 'part-time' },
    { label: 'Weekend', value: 'weekend' },
    { label: 'Evenings', value: 'evenings' },
    { label: 'Custom', value: 'custom' },
  ];

  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>Availability</label>
      <select
        id={id}
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select availability…</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AvailabilitySelect;
