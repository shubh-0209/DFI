import React from 'react';

const ContributionTabs = ({ tabs, activeTab, onTabChange, counts = {} }) => {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }} role="tablist" aria-label="Contribution filters">
      {tabs.map((tab) => {
        const count = counts[tab.id] || 0;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-label={`${tab.label}${count > 0 ? `, ${count} items` : ''}${isActive ? ', selected' : ''}`}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '99px',
              backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-card)',
              color: isActive ? '#fff' : 'var(--color-heading)',
              border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
              whiteSpace: 'nowrap',
              transition: 'var(--transition-fast)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem' }}
          >
            {tab.label}
            {count > 0 && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '20px',
                  height: '20px',
                  padding: '0 6px',
                  borderRadius: '999px',
                  background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--color-bg)',
                  color: isActive ? '#fff' : 'var(--color-body)' }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ContributionTabs;
