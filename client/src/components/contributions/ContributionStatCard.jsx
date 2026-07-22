import React from 'react';

const ContributionStatCard = ({ label, value, icon: Icon, color = 'primary', trend }) => {
  const colorMap = {
    primary: { bg: 'rgba(37, 99, 235, 0.10)', text: 'var(--color-primary)' },
    secondary: { bg: 'rgba(5, 150, 105, 0.10)', text: 'var(--color-secondary)' },
    accent: { bg: 'rgba(245, 158, 11, 0.10)', text: 'var(--color-accent)' },
    error: { bg: 'rgba(239, 68, 68, 0.10)', text: 'var(--color-error)' },
    purple: { bg: 'rgba(139, 92, 246, 0.10)', text: 'var(--color-purple)' },
    orange: { bg: 'rgba(217, 119, 17, 0.10)', text: 'var(--color-orange)' },
    slate: { bg: 'rgba(148, 163, 184, 0.10)', text: 'var(--color-slate)' },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <div className="card contribution-stat-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ padding: '0.75rem', borderRadius: '50%', background: c.bg, color: c.text, flexShrink: 0 }}>
        {Icon && <Icon size={24} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: 'var(--color-heading)' }}>{value ?? 0}</div>
        <div style={{ color: 'var(--color-body)' }}>{label}</div>
        {trend !== undefined && (
          <div style={{ color: trend >= 0 ? 'var(--color-success)' : 'var(--color-error)', marginTop: '0.25rem' }}>
            {trend >= 0 ? '+' : ''}{trend}% from last month
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributionStatCard;
