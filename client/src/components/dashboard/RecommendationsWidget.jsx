import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { RefreshCw, Sparkles, ChevronRight } from 'lucide-react';
import RecommendationCard from './RecommendationCard';
import { getProgramRecommendations } from '../../services/matchingService';
import { useAuth } from '../../context/AuthContext';

const RecommendationsWidget = ({ compact = false, autoRefreshInterval = 0 }) => {
  const { user } = useAuth();
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(autoRefreshInterval > 0);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard-program-recommendations', user?.id],
    queryFn: async () => {
      const res = await getProgramRecommendations({ page: '1', limit: '5' });
      if (res.success) return res.data;
      return { recommendations: [], pagination: { total: 0 } };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!autoRefreshEnabled || autoRefreshInterval <= 0) return;
    const timer = setInterval(() => {
      refetch();
    }, autoRefreshInterval * 1000);
    return () => clearInterval(timer);
  }, [autoRefreshEnabled, autoRefreshInterval, refetch]);

  const recommendations = data?.recommendations || [];

  if (compact) {
    return (
      <div className="dashboard-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h3 style={{ color: 'var(--color-heading)', fontSize: 'var(--text-card-title)', margin: 0 }}>
            Top Recommendations
          </h3>
          <Link to="/matching/programs" style={{ color: 'var(--color-primary)', fontSize: 'var(--text-label)', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
            View All <ChevronRight size={16} />
          </Link>
        </div>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '18px', width: '100%', borderRadius: '4px' }} />
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <p style={{ color: 'var(--color-body)', margin: 0 }}>No recommendations available yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {recommendations.slice(0, 3).map((rec) => (
              <Link
                key={rec.programId}
                to={`/matching/programs?highlight=${rec.programId}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid #F0EDE8', textDecoration: 'none', background: '#FDFBF7', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#F0FDF4'; e.currentTarget.style.borderColor = '#D1FAE5'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#FDFBF7'; e.currentTarget.style.borderColor = '#F0EDE8'; }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ color: 'var(--color-heading)', margin: '0 0 0.15rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {rec.programTitle}
                  </p>
                  <p style={{ color: 'var(--color-body)', margin: 0 }}>
                    {rec.reasonForRecommendation?.split('; ')[0] || 'General match'}
                  </p>
                </div>
                <span style={{ color: '#059669', marginLeft: '0.75rem', flexShrink: 0 }}>
                  {rec.score}%
                </span>
              </Link>
            ))}
          </div>
        )}
        <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn"
            onClick={() => refetch()}
            style={{ height: '32px', background: 'white', border: '1px solid var(--border)' }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card" style={{ marginBottom: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', minWidth: '150px' }}>
          <Sparkles size={20} color="var(--primary-blue)" />
          <h3 style={{ color: 'var(--color-heading)', fontSize: 'var(--text-section-title)', margin: 0 }}>
            Recommended for You
          </h3>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
           {autoRefreshInterval > 0 && (
             <button
               onClick={() => setAutoRefreshEnabled((prev) => !prev)}
               style={{
                 height: '32px',
                 background: autoRefreshEnabled ? 'var(--primary-blue)' : 'white',
                 color: autoRefreshEnabled ? 'white' : 'var(--color-heading)',
                 border: '1px solid var(--border)',
               }}
             >
               <RefreshCw size={14} /> Auto
             </button>
           )}
          <button className="btn" onClick={() => refetch()} style={{ height: '32px', background: 'white', border: '1px solid var(--border)' }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <Link to="/matching/programs" style={{ color: 'var(--color-primary)', fontSize: 'var(--text-label)', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
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
      {isError && (
        <p style={{ color: 'var(--color-error)', margin: 0 }}>Could not load recommendations.</p>
      )}
      {!isLoading && !isError && recommendations.length === 0 && (
        <p style={{ color: 'var(--color-body)', margin: 0 }}>No recommendations available yet.</p>
      )}
      {!isLoading && !isError && recommendations.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {recommendations.slice(0, 3).map((rec) => (
          <RecommendationCard
            key={rec.programId}
            recommendation={{
              id: rec.programId,
              title: rec.programTitle,
              description: rec.reasonForRecommendation,
              reason: rec.reasonForRecommendation,
              priority: rec.priority || 'Medium',
              score: rec.score }}
            onSavedChange={(id, saved) => {
              refetch();
            }}
            onDismissed={(id) => {
              refetch();
            }}
          />
        ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsWidget;
