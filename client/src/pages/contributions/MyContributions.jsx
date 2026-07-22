import SimpleLoader from '../../components/common/SimpleLoader';
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Clock, Award, TrendingUp, Target, AlertCircle } from 'lucide-react';
import { useMyContributions, useDeleteDraft, MOCK_CONTRIBUTIONS } from '../../services/contributionMyService';
import ContributionStatCard from '../../components/contributions/ContributionStatCard';
import ContributionTabs from '../../components/contributions/ContributionTabs';
import ContributionSearch from '../../components/contributions/ContributionSearch';
import ContributionFilters from '../../components/contributions/ContributionFilters';
import ContributionCard from '../../components/contributions/ContributionCard';
import ContributionEmptyState from '../../components/contributions/ContributionEmptyState';


const tabs = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Drafts' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'needs_changes', label: 'Needs Changes' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'archived', label: 'Archived' },
];

const MyContributions = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ category: '', sortBy: 'createdAt' });
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useMyContributions({
    status: activeTab === 'all' ? '' : activeTab,
    page,
    limit: 12,
    sortBy: filters.sortBy,
    sortOrder: filters.sortBy.startsWith('-') ? 'asc' : 'desc',
    search: searchQuery,
    category: filters.category,
  });

  const deleteMutation = useDeleteDraft();

  const contributions = data?.contributions || [];
  const pagination = data?.pagination || {};

  const stats = useMemo(() => {
    const base = data?.contributions || MOCK_CONTRIBUTIONS;
    return {
      total: base.length,
      drafts: base.filter((c) => c.status === 'draft').length,
      pending: base.filter((c) => c.status === 'pending' || c.status === 'under_review').length,
      approved: base.filter((c) => c.status === 'approved').length,
      needsChanges: base.filter((c) => c.status === 'needs_changes').length,
      rejected: base.filter((c) => c.status === 'rejected').length,
      coins: base.reduce((sum, c) => sum + (c.totalCoinsAwarded || c.coins || 0), 0),
      hours: base.reduce((sum, c) => sum + (c.hoursWorked || 0), 0),
    };
  }, [data]);

  const handleViewDetails = (contribution) => {
    navigate(`/contributions/${contribution.contributionId || contribution._id}`);
  };

  const handleContinueEdit = (contribution) => {
    navigate(`/contributions/${contribution.contributionId || contribution._id}/edit`);
  };

  const handleDelete = async (contribution) => {
    if (window.confirm('Are you sure you want to delete this draft? This action cannot be undone.')) {
      await deleteMutation.mutateAsync(contribution._id);
    }
  };

  const counts = useMemo(() => ({
    all: data?.contributions?.length || MOCK_CONTRIBUTIONS.length,
    draft: stats.drafts,
    pending: stats.pending,
    approved: stats.approved,
    needs_changes: stats.needsChanges,
    rejected: stats.rejected,
    archived: (data?.contributions || MOCK_CONTRIBUTIONS).filter((c) => c.status === 'archived').length,
  }), [data, stats]);

  return (
    <div className="contributions-page-wrapper" style={{ padding: '0.5rem 0 3rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h1 className="page-title" style={{ color: 'var(--color-heading)', margin: 0 }}>
              My Contributions
            </h1>
            <p className="page-description" style={{ color: 'var(--color-body)', margin: '0.3rem 0 0' }}>
              Manage and track all your contributions.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/contributions/new')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> New Contribution
          </button>
        </div>
      </div>

      <div className="contributions-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', marginBottom: '1.5rem', gap: '1rem' }}>
        <ContributionStatCard label="Total" value={stats.total} icon={FileText} color="primary" />
        <ContributionStatCard label="Drafts" value={stats.drafts} icon={Clock} color="slate" />
        <ContributionStatCard label="Pending" value={stats.pending} icon={TrendingUp} color="accent" />
        <ContributionStatCard label="Approved" value={stats.approved} icon={Award} color="secondary" />
        <ContributionStatCard label="Needs Changes" value={stats.needsChanges} icon={Target} color="orange" />
        <ContributionStatCard label="Rejected" value={stats.rejected} icon={FileText} color="error" />
        <ContributionStatCard label="Coins Earned" value={stats.coins} icon={Award} color="purple" trend={12} />
        <ContributionStatCard label="Hours Contributed" value={stats.hours} icon={Clock} color="primary" />
      </div>

      <ContributionTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <ContributionSearch value={searchQuery} onChange={setSearchQuery} />
        <ContributionFilters filters={filters} onChange={setFilters} />
      </div>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', borderRadius: 'var(--radius-md)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span style={{ flex: 1 }}>{error.message || 'Failed to load contributions'}</span>
          <button onClick={() => window.location.reload()} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <SimpleLoader />
      ) : contributions.length > 0 ? (
        <>
          <div className="contributions-list-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {contributions.map((contrib) => (
              <ContributionCard
                key={contrib._id}
                contribution={contrib}
                onViewDetails={handleViewDetails}
                onContinueEdit={handleContinueEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn btn-secondary"
                style={{ opacity: page <= 1 ? 0.5 : 1, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </button>
              <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', color: 'var(--color-body)' }}>
                Page {pagination.page || 1} of {pagination.totalPages || 1}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages || 1, p + 1))}
                disabled={pagination.page >= pagination.totalPages}
                className="btn btn-secondary"
                style={{ opacity: (pagination.page || 1) >= (pagination.totalPages || 1) ? 0.5 : 1, cursor: (pagination.page || 1) >= (pagination.totalPages || 1) ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <ContributionEmptyState
          type={activeTab === 'draft' ? 'drafts' : activeTab === 'approved' ? 'approved' : 'search'}
          title={
            activeTab === 'draft' ? 'No drafts yet' :
              activeTab === 'approved' ? 'No approved contributions yet' :
                searchQuery ? 'No contributions found' : 'No contributions yet'
          }
          description={
            activeTab === 'draft' ? 'Start a new contribution and save it as a draft to continue later.' :
              activeTab === 'approved' ? 'Your approved contributions will appear here after review.' :
                searchQuery ? 'Try adjusting your search or filters.' : 'You have not submitted any contributions yet.'
          }
          action={
            activeTab === 'all' && !searchQuery ? { label: 'Create Contribution', onClick: () => navigate('/contributions/new') } : null
          }
        />
      )}
    </div>
  );
};

export default MyContributions;
