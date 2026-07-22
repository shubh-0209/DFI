import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { RefreshCw, Gift, ChevronRight } from 'lucide-react';
import { getRewardsRecommendations } from '../../services/recommendationService';
import { useAuth } from '../../context/AuthContext';

const SuggestedRewards = ({ compact = false }) => {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard-rewards-recommendations', user?.id],
    queryFn: async () => {
      const res = await getRewardsRecommendations({ limit: 5 });
      if (res.success) return res.data;
      return { recommendations: [], pagination: { total: 0 } };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const recommendations = data?.recommendations || [];

  const renderList = (items) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      {items.map((rec) => (
        <Link
          key={rec.rewardId}
          to={`/marketplace?rewardId=${rec.rewardId}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.5rem 0.625rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #F0EDE8',
            background: '#FDFBF7',
            textDecoration: 'none',
            transition: 'all 0.2s' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#F0FDF4';
            e.currentTarget.style.borderColor = '#D1FAE5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#FDFBF7';
            e.currentTarget.style.borderColor = '#F0EDE8';
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ color: 'var(--color-heading)', margin: '0 0 0.15rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {rec.title}
            </p>
            <p style={{ color: 'var(--color-body)', margin: 0 }}>{rec.description}</p>
          </div>
          <span style={{ color: '#059669', marginLeft: '0.75rem', flexShrink: 0 }}>{rec.points} pts</span>
        </Link>
      ))}
    </div>
  );

  if (compact) {
    return (
      <div style={{ background: 'white', borderRadius: 15.36, padding: '1.25rem 1.5rem', border: '1px solid #F0EDE8', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
          <h3 style={{ color: 'var(--color-heading)', margin: 0 }}>
            Top Rewards
          </h3>
          <Link to="/marketplace" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
            View All <ChevronRight size={14} />
          </Link>
        </div>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '18px', width: '100%', borderRadius: '4px' }} />
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <p style={{ color: 'var(--color-body)', margin: 0 }}>No reward recommendations available.</p>
        ) : (
          renderList(recommendations.slice(0, 3))
        )}
        <div style={{ marginTop: '0.875rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => refetch()}
            style={{
              padding: '0.35rem 0.625rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'white',
              color: 'var(--color-heading)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem' }}
          >
            <RefreshCw size={12} /> Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'white', borderRadius: 15.36, padding: '1.5rem', border: '1px solid #F0EDE8', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Gift size={18} color="var(--primary-blue)" />
          <h3 style={{ color: 'var(--color-heading)', margin: 0 }}>
            Suggested Rewards
          </h3>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={() => refetch()} style={{
            padding: '0.35rem 0.625rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'white',
            color: 'var(--color-heading)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem' }}>
            <RefreshCw size={12} /> Refresh
          </button>
          <Link to="/marketplace" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
            View All <ChevronRight size={14} />
          </Link>
        </div>
      </div>
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '18px', width: '100%', borderRadius: '4px' }} />
          ))}
        </div>
      )}
      {isError && <p style={{ color: 'var(--color-error)', margin: 0 }}>Could not load reward recommendations.</p>}
      {!isLoading && !isError && recommendations.length === 0 && (
        <p style={{ color: 'var(--color-body)', margin: 0 }}>No reward recommendations at this time.</p>
      )}
      {!isLoading && !isError && recommendations.length > 0 && renderList(recommendations.slice(0, 5))}
    </div>
  );
};

export default SuggestedRewards;
