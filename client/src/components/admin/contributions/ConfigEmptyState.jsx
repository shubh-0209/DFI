import React from 'react';
import { Inbox } from 'lucide-react';

const ConfigEmptyState = ({ type = 'default', title, description, actionLabel, onAction }) => {
  const configs = {
    default: { title: 'Nothing Here', description: 'There is nothing to display yet.' },
    categories: { title: 'No Categories', description: 'Create your first contribution category to get started.' },
    types: { title: 'No Contribution Types', description: 'Add contribution types like PDF, Image, Video to enable submissions.' },
    coinRules: { title: 'No Coin Rules', description: 'Set up coin rules to reward volunteers automatically.' },
    badgeRules: { title: 'No Badge Rules', description: 'Create badge rules to recognize outstanding contributions.' },
    reviewTemplates: { title: 'No Review Templates', description: 'Build reusable templates to speed up reviews.' },
    rewardCatalog: { title: 'No Rewards', description: 'Add rewards that volunteers can redeem with coins.' },
    uploadSettings: { title: 'No Upload Settings', description: 'Configure file type settings for contribution uploads.' },
    portfolioSettings: { title: 'No Portfolio Settings', description: 'Set up portfolio display preferences.' },
    automationSettings: { title: 'No Automation Rules', description: 'Enable automation to streamline workflows.' },
    generalSettings: { title: 'No General Settings', description: 'Configure global contribution hub settings.' },
  };

  const cfg = configs[type] || configs.default;
  const displayTitle = title || cfg.title;
  const displayDesc = description || cfg.description;

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '3rem 2rem',
        background: 'var(--color-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div style={{ margin: '0 auto 1rem', opacity: 0.3 }}><Inbox size={48} /></div>
      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>{displayTitle}</h4>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-body)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>{displayDesc}</p>
      {onAction && (
        <button
          onClick={onAction}
          style={{
            padding: '0.625rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: 'var(--color-primary)',
            color: 'white',
            fontSize: 'var(--text-base)',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
          }}
        >
          {actionLabel || 'Create'}
        </button>
      )}
    </div>
  );
};

export default ConfigEmptyState;
