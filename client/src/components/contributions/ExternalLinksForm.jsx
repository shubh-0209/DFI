import React from 'react';
import { Link } from 'lucide-react';

const ExternalLinksForm = ({ values, onChange, errors = {} }) => {
  const handleChange = (field, value) => {
    onChange({ ...values, [field]: value });
  };

  const linkFields = [
    { key: 'githubUrl', label: 'GitHub Repository', placeholder: 'https://github.com/username/repo', Icon: Link },
    { key: 'figmaUrl', label: 'Figma Design', placeholder: 'https://figma.com/...', Icon: Link },
    { key: 'canvaUrl', label: 'Canva Design', placeholder: 'https://canva.com/...', Icon: Link },
    { key: 'googleDriveUrl', label: 'Google Drive', placeholder: 'https://drive.google.com/...', Icon: Link },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {linkFields.map(({ key, label, placeholder, Icon }) => (
        <div key={key} className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Icon size={16} style={{ color: 'var(--color-primary)' }} />
            {label}
          </label>
          <input
            id={key}
            type="url"
            value={values[key] || ''}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder={placeholder}
            className="form-control"
            style={{ paddingLeft: '2.75rem' }}
          />
          {errors[key] && (
            <span style={{ color: 'var(--color-error)', marginTop: '0.25rem', display: 'block' }}>
              {errors[key]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExternalLinksForm;
