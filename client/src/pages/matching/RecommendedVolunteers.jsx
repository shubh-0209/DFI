import SimpleLoader from '../../components/common/SimpleLoader';
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getVolunteerRecommendations } from '../../services/matchingService';
import MatchScoreCard from '../../components/matching/MatchScoreCard';
import SearchFilter from '../../components/volunteer/SearchFilter';

import EmptyState from '../../components/volunteer/EmptyState';
import RecommendationDetails from '../../components/matching/RecommendationDetails';

const RecommendedVolunteers = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState({ page: '1', limit: '12' });
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [programId, setProgramId] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get('programId');
    if (pid) setProgramId(pid);
  }, []);

  const filters = [
    {
      key: 'minScore',
      label: 'Min Score',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: '50', label: '50%+' },
        { value: '70', label: '70%+' },
        { value: '85', label: '85%+' },
      ],
    },
  ];

  const queryParams = {
    programId: programId || '',
    search,
    ...(activeFilters.minScore && { minScore: activeFilters.minScore }),
    page: activeFilters.page || '1',
    limit: activeFilters.limit || '12',
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['volunteer-recommendations', user?.id, programId, queryParams],
    queryFn: async () => {
      const res = await getVolunteerRecommendations(queryParams);
      if (res.success) return res.data;
      throw new Error(res.message || 'Failed to load volunteer recommendations');
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!programId,
  });

  const recommendations = data?.recommendations || [];
  const pagination = data?.pagination || {};

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setActiveFilters({ page: '1', limit: '12' });
    setSearch('');
  };

  const hasActiveFilters = Object.values(activeFilters).some(val => val !== '' && val !== 'all') || !!search;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ color: 'var(--color-heading)', margin: '0 0 0.4rem 0' }}>
          Recommended Volunteers
        </h1>
        <p style={{ color: 'var(--color-body)', margin: 0 }}>
          Volunteers matched for the selected program based on skills, experience, and availability.
        </p>
      </div>

      {!programId && (
        <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div>
            <h4 style={{ color: '#92400E', margin: '0 0 0.25rem 0' }}>Program ID Required</h4>
            <p style={{ color: '#A16207', margin: 0 }}>
              Pass a <code style={{ background: '#FDE68A', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>?programId=&lt;id&gt;</code> query parameter to view volunteers for a specific program.
            </p>
          </div>
        </div>
      )}

      {programId && (
        <>
          <SearchFilter
            searchValue={search}
            onSearchChange={setSearch}
            filters={filters}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            placeholder="Search volunteers..."
          />

          {hasActiveFilters && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-body)' }}>Active filters:</span>
              {Object.entries(activeFilters)
                .filter(([_, val]) => val && val !== 'all')
                .map(([key, val]) => (
                  <span key={key} style={{ padding: '0.25rem 0.6rem', background: 'rgba(37,99,235,0.08)', color: 'var(--color-primary)', borderRadius: '999px' }}>
                    {key}: {val} <button onClick={() => handleFilterChange(key, '')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, marginLeft: '0.25rem' }}><X size={10} /></button>
                  </span>
                ))}
            </div>
          )}

          {isLoading ? (
            <SimpleLoader />
          ) : isError ? (
            <EmptyState
              type="search"
              title="Couldn't load volunteers"
              description={error?.message || 'Something went wrong while fetching volunteer recommendations.'}
              action={{ label: 'Try Again', onClick: () => refetch() }}
            />
          ) : recommendations.length === 0 ? (
            <EmptyState
              type="search"
              title="No volunteers found"
              description="Try adjusting your filters or check back later."
            />
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recommendations.map((rec, idx) => (
                  <motion.div
                    key={rec.volunteerId || rec._id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.25 }}
                  >
                    <MatchScoreCard recommendation={rec} onClick={() => setSelectedRecommendation(rec)} />
                  </motion.div>
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => handleFilterChange('page', String(pagination.page - 1))}
                    style={{ padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'white', color: 'var(--color-heading)', cursor: pagination.page > 1 ? 'pointer' : 'not-allowed', opacity: pagination.page > 1 ? 1 : 0.5 }}
                  >
                    Previous
                  </button>
                  <span style={{ color: 'var(--color-body)' }}>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => handleFilterChange('page', String(pagination.page + 1))}
                    style={{ padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'white', color: 'var(--color-heading)', cursor: pagination.page < pagination.totalPages ? 'pointer' : 'not-allowed', opacity: pagination.page < pagination.totalPages ? 1 : 0.5 }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {selectedRecommendation && (
        <RecommendationDetails
          recommendation={selectedRecommendation}
          onClose={() => setSelectedRecommendation(null)}
        />
      )}
    </div>
  );
};

export default RecommendedVolunteers;
