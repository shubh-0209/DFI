import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const LeaderboardCard = ({ rank, topVolunteers, stats }) => {
  const currentRank = rank || stats?.rank || null;
  const topCategory = stats?.topCategory || 'Community Service';
  const countryRank = stats?.countryRank || currentRank;
  const cityRank = stats?.cityRank || currentRank;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: 'white', borderRadius: 20, padding: '2rem', border: '1px solid #F0EDE8', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: '2rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trophy size={20} />
          </div>
          <h3 style={{ margin: 0, color: 'var(--color-heading)' }}>Leaderboard Summary</h3>
        </div>
        <Link to="/leaderboard" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          Open Leaderboard <ExternalLink size={13} />
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ background: '#FFFBEB', borderRadius: 12, padding: '1rem', textAlign: 'center', border: '1px solid #FDE68A' }}>
          <div style={{ color: '#92400E', textTransform: 'uppercase' }}>Current Rank</div>
          <div style={{ color: '#B45309' }}>
            {currentRank ? `#${currentRank}` : '--'}
          </div>
        </div>
        <div style={{ background: '#F0FDF4', borderRadius: 12, padding: '1rem', textAlign: 'center', border: '1px solid #BBF7D0' }}>
          <div style={{ color: '#166534', textTransform: 'uppercase' }}>City Rank</div>
          <div style={{ color: '#059669' }}>
            {cityRank ? `#${cityRank}` : '--'}
          </div>
        </div>
        <div style={{ background: '#EFF6FF', borderRadius: 12, padding: '1rem', textAlign: 'center', border: '1px solid #BFDBFE' }}>
          <div style={{ color: '#1E40AF', textTransform: 'uppercase' }}>Country Rank</div>
          <div style={{ color: '#2563eb' }}>
            {countryRank ? `#${countryRank}` : '--'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: '#FAFAF8', borderRadius: 10, border: '1px solid #F0EDE8', marginBottom: '1rem' }}>
        <TrendingUp size={16} color="var(--primary-blue)" />
        <span style={{ color: 'var(--color-heading)' }}>Top Category: </span>
        <span style={{ color: 'var(--color-body)' }}>{topCategory}</span>
      </div>

      {topVolunteers && topVolunteers.length > 0 && (
        <div>
          <h4 style={{ color: 'var(--color-heading)', margin: '0 0 0.75rem 0' }}>Top Volunteers</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {topVolunteers.slice(0, 5).map((vol, idx) => (
              <div key={vol.userId || vol._id || idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: idx < Math.min(topVolunteers.length, 5) - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: idx === 0 ? '#FEF3C7' : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: idx === 0 ? '#D97706' : 'var(--color-body)' }}>
                  {idx + 1}
                </div>
                <div style={{ flex: 1, color: 'var(--color-heading)' }}>{vol.name || 'Anonymous'}</div>
                <div style={{ color: 'var(--color-body)' }}>{vol.totalHours || vol.coins || vol.points || 0} pts</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default LeaderboardCard;
