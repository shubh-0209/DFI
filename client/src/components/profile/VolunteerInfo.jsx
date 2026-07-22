import React from 'react';

/**
 * Textarea for additional volunteer information.
 * Props:
 * - value: string
 * - onChange: (value:string)=>void
 */
const VolunteerInfo = ({ value, onChange }) => {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="volunteerInfo">Volunteer Information</label>
      <textarea
        id="volunteerInfo"
        className="form-control"
        rows={4}
        placeholder="Tell us about your volunteer experience, motivations, etc."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default VolunteerInfo;
