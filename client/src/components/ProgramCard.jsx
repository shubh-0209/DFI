import React from 'react';
import { Link } from 'react-router-dom';

export const ProgramCard = ({ program }) => {
  const { title, description, category, city, state, startDate, slug } = program;
  const location = [city, state].filter(Boolean).join(', ');
  const badgeMap = {
    Education: 'badge-blue',
    Environment: 'badge-green',
    Health: 'badge-orange',
    Default: 'badge-purple',
  };
  const badgeClass = badgeMap[category] || badgeMap.Default;

  return (
    <div className="card">
      <span className={badgeClass} style={{ marginBottom: '0.75rem' }}>{category || 'General'}</span>
      <h4>{title || 'Untitled Program'}</h4>
      <p style={{ color: 'var(--color-body)', margin: '0.75rem 0' }}>{description || 'No description available.'}</p>
      <div style={{ color: 'var(--color-body)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg height="14" width="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg> {location || 'Location not specified'}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg height="14" width="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg> Starts: {startDate ? new Date(startDate).toLocaleDateString() : 'TBD'}
        </span>
      </div>
      <Link to={`/programs/${slug}`} className="btn btn-primary" style={{ width: '100%' }}>View Details</Link>
    </div>
  );
};
