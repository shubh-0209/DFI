import React from 'react';
import { PackageSearch, Wallet, History, Inbox } from 'lucide-react';

const EmptyState = ({ type = 'rewards', onAction, actionLabel }) => {
  const configs = {
    rewards: {
      icon: <PackageSearch size={48} style={{ color: '#D1D5DB' }} />,
      title: 'No Rewards Found',
      description: 'No rewards match your current filters. Try adjusting your search or category selection.',
      actionLabel: actionLabel || 'Clear Filters',
    },
    history: {
      icon: <History size={48} style={{ color: '#D1D5DB' }} />,
      title: 'No Redemption History',
      description: 'You haven\'t redeemed any rewards yet. Explore the marketplace to find something you like!',
      actionLabel: actionLabel || 'Browse Rewards',
    },
    coins: {
      icon: <Wallet size={48} style={{ color: '#D1D5DB' }} />,
      title: 'Insufficient Coins',
      description: 'You don\'t have enough coins for this reward. Keep participating to earn more Disha Coins!',
      actionLabel: actionLabel || 'Earn Coins',
    },
    default: {
      icon: <Inbox size={48} style={{ color: '#D1D5DB' }} />,
      title: 'Nothing Here',
      description: 'There\'s nothing to show right now.',
      actionLabel: actionLabel || 'Refresh',
    },
  };

  const config = configs[type] || configs.default;

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '3rem 2rem',
        background: 'var(--color-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
    >
      <div style={{ margin: '0 auto 1rem' }}>{config.icon}</div>
      <h3 style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
        {config.title}
      </h3>
      <p style={{ color: 'var(--color-body)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>{config.description}</p>
      {onAction && (
        <button
          onClick={onAction}
          style={{
            padding: '0.625rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: 'var(--color-primary)',
            color: 'white',
            cursor: 'pointer',
            transition: 'var(--transition-fast)' }}
        >
          {config.actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
