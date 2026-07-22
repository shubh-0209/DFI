import React from 'react';
import { Wallet, TrendingUp, Clock, Star } from 'lucide-react';

const StatCard = ({ label, value, icon, iconBg, iconColor, loading }) => (
  <div
    className="wallet-stat-card"
    style={{
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border)',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      flex: 1,
      minWidth: 0,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
    }}
  >
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 'var(--radius-md)',
        background: iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: iconColor
      }}
    >
      {icon}
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{ color: 'var(--color-body)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
        {label}
      </div>
      {loading ? (
        <div className="skeleton" style={{ height: '1.5rem', width: '60px', borderRadius: '4px' }} />
      ) : (
        <div style={{ color: 'var(--color-heading)' }}>
          {value}
        </div>
      )}
    </div>
  </div>
);

const WalletSummary = ({ rewards, history, loading }) => {
  const currentCoins = rewards?.currentCoins ?? 0;
  const lifetimeCoins = rewards?.totalCoinsEarned ?? (rewards?.totalCoins ?? currentCoins);
  const redeemedCoins = rewards?.redeemedCoins ?? 0;
  const pendingCoins = rewards?.pendingCoins ?? 0;

  const stats = [
    {
      label: 'Current Coins',
      value: currentCoins.toLocaleString(),
      icon: <Wallet size={20} />,
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
    },
    {
      label: 'Lifetime Earned',
      value: lifetimeCoins.toLocaleString(),
      icon: <TrendingUp size={20} />,
      iconBg: '#D1FAE5',
      iconColor: '#059669',
    },
    {
      label: 'Redeemed',
      value: redeemedCoins.toLocaleString(),
      icon: <Star size={20} />,
      iconBg: '#EDE9FE',
      iconColor: '#7C3AED',
    },
    {
      label: 'Pending',
      value: pendingCoins.toLocaleString(),
      icon: <Clock size={20} />,
      iconBg: '#FEE2E2',
      iconColor: '#DC2626',
    },
  ];

  return (
    <div
      className="wallet-summary-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
        gap: '1rem'
      }}
      role="region"
      aria-label="Coin wallet summary"
    >
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} loading={loading} />
      ))}
    </div>
  );
};

export default WalletSummary;
