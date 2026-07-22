import React from 'react';

/**
 * Simple comma‑separated input for interests.
 * Props:
 * - id: string – input id
 * - value: string – current comma‑separated string
 * - onChange: (value: string) => void – callback when value changes
 */
const InterestsInput = ({ id, value, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>Interests (comma separated)</label>
      <input
        id={id}
        type="text"
        className="form-control"
        placeholder="Teaching, Public Speaking, Content Writing"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default InterestsInput;
