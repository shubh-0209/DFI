import React from 'react';
import PropTypes from 'prop-types';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

const LeaderboardWidget = ({ topVolunteers, loading, currentRank }) => {
  if (loading) {
    return (
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Trophy size={18} className="text-primary" />
          <h3 style={{ margin: 0 }}>Top Volunteers</h3>
        </div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="skeleton" style={{ height: '40px', marginBottom: '0.5rem', borderRadius: '8px' }} />
        ))}
      </div>
    );
  }

  if (!topVolunteers || topVolunteers.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <Trophy size={32} style={{ margin: '0 auto 0.75rem', color: '#D1D5DB' }} />
        <p style={{ color: 'var(--color-body)' }}>
          No leaderboard data available yet.
        </p>
      </div>
    );
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy size={16} style={{ color: '#F59E0B' }} />;
    if (rank === 2) return <Medal size={16} style={{ color: '#9CA3AF' }} />;
    if (rank === 3) return <Award size={16} style={{ color: '#D97706' }} />;
    return <span style={{ width: '16px', textAlign: 'center' }}>{rank}</span>;
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Trophy size={18} className="text-primary" />
          <h3 style={{ margin: 0 }}>Leaderboard</h3>
        </div>
        {currentRank && (
          <div style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            backgroundColor: 'rgba(11, 59, 145, 0.1)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem' }}>
            <TrendingUp size={12} />
            Your Rank: #{currentRank}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {topVolunteers.slice(0, 5).map((vol, index) => {
          const rank = index + 1;
          return (
            <div key={vol.userId || vol._id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 0',
              borderBottom: index < topVolunteers.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
              <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
                {getRankIcon(rank)}
              </div>
              <div style={{ flex: 1 }}>
                {vol.name}
              </div>
              <div style={{ color: 'var(--color-body)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {vol.totalHours || vol.coins || 0} {vol.totalHours ? 'hrs' : 'pts'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

LeaderboardWidget.propTypes = {
  topVolunteers: PropTypes.array,
  loading: PropTypes.bool,
  currentRank: PropTypes.number,
};

export default LeaderboardWidget;