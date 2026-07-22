import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Trash2, ExternalLink, RefreshCw, Calendar, Heart } from 'lucide-react';
import recommendationService from '../../services/recommendationService';

const SavedRecommendations = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['saved-recommendations', page],
    queryFn: async () => {
      const res = await recommendationService.getSavedRecommendations({ page, limit: 12 });
      if (res.success) return res.data;
      throw new Error(res.message || 'Failed to load saved recommendations');
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const unsaveMutation = useMutation({
    mutationFn: (id) => recommendationService.unsaveRecommendation(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['saved-recommendations']);
    },
  });

  const saved = data?.savedRecommendations || [];
  const pagination = data?.pagination || {};

  if (isLoading) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="skeleton" style={{ height: '28px', width: '260px', marginBottom: '0.5rem', borderRadius: '6px' }} />
          <div className="skeleton" style={{ height: '16px', width: '400px', borderRadius: '4px' }} />
        </div>
        <div className="skeleton" style={{ height: '48px', width: '100%', marginBottom: '1.5rem', borderRadius: 'var(--radius-md)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '1.25rem', border: '1px solid #F0EDE8' }}>
              <div className="skeleton" style={{ height: '20px', width: '60%', marginBottom: '0.75rem', borderRadius: '4px' }} />
              <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '0.5rem', borderRadius: '4px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <p style={{ color: '#991B1B', margin: 0 }}>{error?.message || 'Something went wrong while fetching saved recommendations.'}</p>
        </div>
        <button onClick={() => refetch()} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'white', color: 'var(--color-heading)', cursor: 'pointer' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: 'var(--color-heading)', margin: '0 0 0.4rem 0' }}>
            Saved Recommendations
          </h1>
          <p style={{ color: 'var(--color-body)', margin: 0 }}>
            Programs and volunteers you've saved for later.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={() => refetch()} style={{ padding: '0.45rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'white', color: 'var(--color-heading)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {saved.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 16, padding: '3rem 2rem', border: '1px solid #F0EDE8', textAlign: 'center' }}>
          <Heart size={32} style={{ color: '#D1D5DB', marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>No saved recommendations yet</h3>
          <p style={{ color: 'var(--color-body)', marginBottom: '1rem' }}>
            Save recommendations from your dashboard or matching pages to view them here.
          </p>
          <Link to="/matching/programs" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.5rem 1rem', borderRadius: 8, background: 'var(--color-primary)', color: 'white', textDecoration: 'none' }}>
            Explore Programs
          </Link>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {saved.map((item, idx) => (
              <div key={item._id || idx} style={{ background: 'white', borderRadius: 16, padding: '1.25rem 1.5rem', border: '1px solid #F0EDE8', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <h4 style={{ color: 'var(--color-heading)', margin: 0 }}>
                      {item.programTitle || item.volunteerName || 'Recommendation'}
                    </h4>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', background: item.programId ? 'rgba(37,99,235,0.08)' : 'rgba(11, 59, 145,0.08)', color: item.programId ? 'var(--color-primary)' : 'var(--primary-blue)' }}>
                      {item.programId ? 'Program' : 'Volunteer'}
                    </span>
                  </div>
                  <p style={{ color: 'var(--color-body)', margin: '0 0 0.35rem 0' }}>{item.reasonForRecommendation}</p>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: 'var(--color-body)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} /> {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                    </span>
                    <span style={{ color: '#059669' }}>{item.score}% match</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {item.programId && (
                    <Link to={`/matching/programs?highlight=${item.programId}`} style={{ padding: '0.45rem 0.75rem', borderRadius: 8, border: '1px solid var(--color-border)', color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      View <ExternalLink size={12} />
                    </Link>
                  )}
                  <button onClick={() => unsaveMutation.mutate(item._id)} disabled={unsaveMutation.isLoading} style={{ padding: '0.45rem 0.75rem', borderRadius: 8, border: '1px solid #FECACA', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}>
              <button disabled={pagination.page <= 1} onClick={() => setPage(String(pagination.page - 1))} style={{ padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'white', color: 'var(--color-heading)', cursor: pagination.page > 1 ? 'pointer' : 'not-allowed', opacity: pagination.page > 1 ? 1 : 0.5 }}>
                Previous
              </button>
              <span style={{ color: 'var(--color-body)' }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button disabled={pagination.page >= pagination.totalPages} onClick={() => setPage(String(pagination.page + 1))} style={{ padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'white', color: 'var(--color-heading)', cursor: pagination.page < pagination.totalPages ? 'pointer' : 'not-allowed', opacity: pagination.page < pagination.totalPages ? 1 : 0.5 }}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SavedRecommendations;
