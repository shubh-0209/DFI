import React from 'react';
import PropTypes from 'prop-types';

const DashboardCard = ({ icon, label, value, note, color = 'var(--primary-blue)', bg = 'var(--background)', onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-card)',
        padding: '1.25rem 1.5rem',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'var(--transition-fast)',
        boxShadow: 'var(--shadow-sm)' }}
      onMouseEnter={e => {
        if (onClick) e.currentTarget.style.boxShadow = 'var(--card-shadow)';
      }}
      onMouseLeave={e => {
        if (onClick) e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: bg,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ color: 'var(--color-body)', marginBottom: '0.2rem' }}>
          {label}
        </div>
        <div style={{
          color: 'var(--color-heading)',
          marginBottom: '0.15rem' }}>
          {value}
        </div>
        {note && (
          <div style={{ color: color }}>
            {note}
          </div>
        )}
      </div>
    </div>
  );
};

DashboardCard.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  note: PropTypes.string,
  color: PropTypes.string,
  bg: PropTypes.string,
  onClick: PropTypes.func,
};

export default DashboardCard;