import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getProgramRecommendations } from '../../services/matchingService';
import MatchScoreCard from '../../components/matching/MatchScoreCard';
import SearchFilter from '../../components/volunteer/SearchFilter';
import EmptyState from '../../components/volunteer/EmptyState';
import RecommendationDetails from '../../components/matching/RecommendationDetails';

const RecommendedPrograms = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

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
    {
      key: 'programCategory',
      label: 'Category',
      type: 'select',
      options: [
        { value: '', label: 'All Categories' },
        { value: 'environment', label: 'Environment' },
        { value: 'education', label: 'Education' },
        { value: 'health', label: 'Health' },
        { value: 'community', label: 'Community' },
        { value: 'technology', label: 'Technology' },
      ],
    },
  ];

  const queryParams = {
    ...(search && { search }),
    page: activeFilters.page || '1',
    limit: activeFilters.limit || '12',
    ...(activeFilters.minScore && { minScore: activeFilters.minScore }),
    ...(activeFilters.programCategory && { programCategory: activeFilters.programCategory }),
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['program-recommendations', user?.id, queryParams],
    queryFn: async () => {
      const res = await getProgramRecommendations(queryParams);
      if (res.success) return res.data;
      throw new Error(res.message || 'Failed to load recommendations');
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const recommendations = data?.recommendations || [];
  const pagination = data?.pagination || {};

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearch('');
  };

  const hasActiveFilters = Object.values(activeFilters).some(val => val !== '' && val !== 'all');

  if (isLoading) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="skeleton" style={{ height: '28px', width: '260px', marginBottom: '0.5rem', borderRadius: '6px' }} />
          <div className="skeleton" style={{ height: '16px', width: '400px', borderRadius: '4px' }} />
        </div>
        <div className="skeleton" style={{ height: '48px', width: '100%', marginBottom: '1.5rem', borderRadius: 'var(--radius-md)' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '1.25rem', border: '1px solid #F0EDE8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div className="skeleton" style={{ height: '20px', width: '60%', borderRadius: '4px' }} />
                <div className="skeleton" style={{ height: '40px', width: '52px', borderRadius: 'var(--radius-md)' }} />
              </div>
              <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '0.5rem', borderRadius: '4px' }} />
              <div className="skeleton" style={{ height: '14px', width: '70%', marginBottom: '0.5rem', borderRadius: '4px' }} />
              <div className="skeleton" style={{ height: '36px', width: '100%', borderRadius: 'var(--radius-md)' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: '2rem' }}>
        <EmptyState
          type="search"
          title="Couldn't load recommendations"
          description={error?.message || 'Something went wrong while fetching your program recommendations.'}
          action={{ label: 'Try Again', onClick: () => refetch() }}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ color: 'var(--color-heading)', margin: '0 0 0.4rem 0' }}>
          Recommended Programs
        </h1>
        <p style={{ color: 'var(--color-body)', margin: 0 }}>
          Programs matched with your skills, interests, and location.
        </p>
      </div>

      <SearchFilter
        searchValue={search}
        onSearchChange={setSearch}
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        placeholder="Search program recommendations..."
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

      {recommendations.length === 0 ? (
        <EmptyState
          type="programs"
          title="No recommendations found"
          description="Try adjusting your filters or completing more of your profile to get better matches."
        />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {recommendations.map((rec, idx) => (
              <motion.div
                key={rec.programId || rec._id || idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.3 }}
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

      {selectedRecommendation && (
        <RecommendationDetails
          recommendation={selectedRecommendation}
          onClose={() => setSelectedRecommendation(null)}
        />
      )}
    </div>
  );
};

export default RecommendedPrograms;
