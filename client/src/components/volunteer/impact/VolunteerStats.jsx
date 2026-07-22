import React from 'react';
import { motion } from 'framer-motion';

const StatItem = ({ label, value, icon, color, bg, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    style={{
      background: 'white', borderRadius: 16, padding: '1.25rem 1.5rem',
      border: '1px solid #F0EDE8', display: 'flex', alignItems: 'center', gap: '1rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.25s' }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'none'; }}
  >
    <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <div style={{ color: 'var(--color-body)', marginBottom: '0.2rem' }}>{label}</div>
      <div style={{ color: 'var(--color-heading)', marginBottom: '0.1rem' }}>{value}</div>
    </div>
  </motion.div>
);

const VolunteerStats = ({ stats }) => {
  if (!stats) return null;

  const items = [
    { label: 'Approved Contributions', value: stats.approvedContributions ?? 0, icon: '📝', color: '#059669', bg: '#D1FAE5' },
    { label: 'Pending Contributions', value: stats.pendingContributions ?? 0, icon: '⏳', color: '#D97706', bg: '#FEF3C7' },
    { label: 'Hours Contributed', value: stats.hoursContributed ?? 0, icon: '⏱', color: 'var(--primary-blue)', bg: '#EDE9FE' },
    { label: 'Coins Earned', value: stats.coinsEarned ?? 0, icon: '🪙', color: 'var(--primary-blue)', bg: '#FFF3ED' },
    { label: 'Coins Redeemed', value: stats.coinsRedeemed ?? 0, icon: '🎁', color: '#BE185D', bg: '#FCE7F3' },
    { label: 'Featured Contributions', value: stats.featuredContributions ?? 0, icon: '⭐', color: '#0369A1', bg: '#E0F2FE' },
    { label: 'Certificates Earned', value: stats.certificatesEarned ?? 0, icon: '🏆', color: '#B45309', bg: '#FEF3C7' },
    { label: 'Badges Earned', value: stats.badgesEarned ?? 0, icon: '🎖', color: '#4338CA', bg: '#EEF2FF' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: '1rem', marginBottom: '2rem' }}>
      {items.map((item, i) => (
        <StatItem key={item.label} {...item} delay={i * 0.05} />
      ))}
    </div>
  );
};

export default VolunteerStats;
