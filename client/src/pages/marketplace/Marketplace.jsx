import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { ShoppingBag, History } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import marketplaceService from '../../services/marketplaceService';
import { getMyRewards } from '../../services/gamificationService';
import SimpleLoader from '../../components/common/SimpleLoader';
import MarketplaceHero from '../../components/marketplace/MarketplaceHero';
import WalletSummary from '../../components/marketplace/WalletSummary';
import RewardCategoryTabs from '../../components/marketplace/RewardCategoryTabs';
import RewardSearch from '../../components/marketplace/RewardSearch';
import RewardFilters from '../../components/marketplace/RewardFilters';
import RewardGrid from '../../components/marketplace/RewardGrid';
import RewardDetailDrawer from '../../components/marketplace/RewardDetailDrawer';
import RedemptionHistory from '../../components/marketplace/RedemptionHistory';
import EmptyState from '../../components/marketplace/EmptyState';

import RedeemModal from '../../components/marketplace/RedeemModal';

const CATEGORIES = [
  'All',
  'Disha Merchandise',
  'Scholarships',
  'TalentGrow Coupons',
  'Learning Resources',
  'Certificates',
  'Partner Benefits',
  'Limited Time Rewards',
  'Digital Rewards',
  'Other',
];

// ─── Tab control bar ─────────────────────────────────────────────────────────

const TabBar = ({ showHistory, onShowHistory }) => {
  const tabs = [
    { id: false, label: 'Browse Rewards', icon: <ShoppingBag size={15} /> },
    { id: true, label: 'My Redemptions', icon: <History size={15} /> },
  ];

  return (
    <div
      style={{
        display: 'inline-flex',
        background: '#F0EEE9',
        borderRadius: '10px',
        padding: '0.25rem',
        gap: '0.25rem'
      }}
      role="tablist"
      aria-label="Marketplace navigation"
    >
      {tabs.map((tab) => {
        const active = showHistory === tab.id;
        return (
          <button
            key={String(tab.id)}
            role="tab"
            aria-selected={active}
            onClick={() => onShowHistory(tab.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1.125rem',
              borderRadius: '8px',
              border: 'none',
              background: active ? 'white' : 'transparent',
              color: active ? 'var(--color-primary)' : 'var(--color-body)',
              cursor: 'pointer',
              boxShadow: active ? '0 1px 4px rgba(0,0,0,0.09)' : 'none',
              transition: 'var(--transition-fast)'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

// ─── Featured reward mini-card ────────────────────────────────────────────────

const FeaturedCard = ({ reward, onClick }) => (
  <div
    onClick={() => onClick(reward)}
    role="button"
    tabIndex={0}
    aria-label={`View details for ${reward.name}`}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(reward); } }}
    style={{
      background: 'white',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'var(--transition-fast)'
    }}
    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
  >
    <div
      style={{
        width: '100%',
        height: '140px',
        background: reward.image
          ? `url(${reward.image}) center/cover no-repeat`
          : 'linear-gradient(135deg, #F8F7F4, #EDE9FE)',
        flexShrink: 0
      }}
    />
    <div style={{ padding: '0.875rem' }}>
      <h4 style={{ color: 'var(--color-heading)', margin: '0 0 0.3rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {reward.name}
      </h4>
      <span style={{ color: 'var(--color-primary)' }}>
        {reward.coinCost.toLocaleString()} coins
      </span>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const Marketplace = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const rewardIdParam = searchParams.get('rewardId');

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [coinRange, setCoinRange] = useState('all');
  const [selectedReward, setSelectedReward] = useState(rewardIdParam || null);
  const [redeemTarget, setRedeemTarget] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    if (rewardIdParam) setSelectedReward(rewardIdParam);
  }, [rewardIdParam]);

  // ── Queries ────────────────────────────────────────────────────────────────

  const { data: rewardsData, isLoading: rewardsLoading, error: rewardsError } = useQuery({
    queryKey: ['marketplace-catalog', selectedCategory, searchQuery, sortBy, inStockOnly, coinRange],
    queryFn: async () => {
      const params = {
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        search: searchQuery || undefined,
        sort: sortBy,
        inStock: inStockOnly || undefined,
        page: 1,
        limit: 24,
      };
      if (coinRange !== 'all') {
        if (coinRange === '0-500') { params.minCoins = 0; params.maxCoins = 500; }
        if (coinRange === '500-1000') { params.minCoins = 500; params.maxCoins = 1000; }
        if (coinRange === '1000-5000') { params.minCoins = 1000; params.maxCoins = 5000; }
        if (coinRange === '5000+') { params.minCoins = 5000; }
      }
      return marketplaceService.getMarketplaceCatalog(params);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    enabled: !showHistory,
  });

  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-rewards'],
    queryFn: () => marketplaceService.getFeaturedRewards(6),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !showHistory,
  });

  const { data: userRewards, isLoading: userRewardsLoading } = useQuery({
    queryKey: ['my-rewards'],
    queryFn: async () => {
      const res = await getMyRewards();
      return res?.success ? res.data : res;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['redemption-history'],
    queryFn: () => marketplaceService.getRedemptionHistory({ page: 1, limit: 20 }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    enabled: showHistory,
  });

  // ── Derived values ─────────────────────────────────────────────────────────

  const rewards = rewardsData?.items || [];
  const totalRewards = rewardsData?.total || 0;
  const userCoins = userRewards?.currentCoins ?? 0;
  const featuredRewards = featuredData || [];
  const isLoading = rewardsLoading || featuredLoading || userRewardsLoading || historyLoading;
  
  // Instead of a blocking loader, we allow the shell to render
  // and handle loading states internally.

  const showFeatured =
    featuredRewards.length > 0 && !searchQuery && selectedCategory === 'All' && !showHistory;

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleViewDetails = (reward) => {
    const id = reward._id || reward.id;
    setSelectedReward(id);
    setSearchParams({ rewardId: id }, { replace: true });
  };

  const handleRedeemSuccess = () => {
    setRedeemTarget(null);
    setSelectedReward(null);
    queryClient.invalidateQueries(['my-rewards']);
    queryClient.invalidateQueries(['marketplace-catalog']);
    toast.success('Redemption successful!');
  };

  const handleRedeem = async (quantity = 1, deliveryAddress = null, rewardType = 'physical') => {
    try {
      setRedeeming(true);
      const rewardId = redeemTarget?._id || redeemTarget?.id;
      const res = await marketplaceService.redeemReward(rewardId, quantity, deliveryAddress, rewardType);
      if (res) {
        toast.success('Reward redeemed successfully!');
        queryClient.invalidateQueries(['marketplace-catalog']);
        queryClient.invalidateQueries(['featured-rewards']);
        queryClient.invalidateQueries(['redemption-history']);
        queryClient.invalidateQueries(['my-rewards']);
        setRedeemTarget(null);
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to redeem reward');
    } finally {
      setRedeeming(false);
    }
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('newest');
    setInStockOnly(false);
    setCoinRange('all');
  };

  const scrollToCatalog = () => {
    document.getElementById('rewards-catalog-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className="marketplace-page-wrapper"
      style={{
        minHeight: '100vh',
        background: '#F8F7F4',
        padding: 'clamp(1rem, 3vw, 2rem) clamp(1rem, 3vw, 2rem) 3rem'
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* ── Hero ── */}
        <MarketplaceHero
          coins={userCoins}
          level={userRewards?.level || 'Beginner'}
          onBrowse={scrollToCatalog}
        />

        {/* ── Wallet stats row ── */}
        <WalletSummary rewards={userRewards} history={historyData} loading={userRewardsLoading} />

        {/* ── Catalog section ── */}
        <div id="rewards-catalog-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Control bar: tabs + filters in one white card */}
          <div
            className="marketplace-catalog-card"
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            {/* Row 1: tabs (left) + sort/filter controls (right) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
              <TabBar showHistory={showHistory} onShowHistory={setShowHistory} />

              {!showHistory && (
                <RewardFilters
                  categories={CATEGORIES}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  inStockOnly={inStockOnly}
                  onInStockChange={setInStockOnly}
                  coinRange={coinRange}
                  onCoinRangeChange={setCoinRange}
                />
              )}
            </div>

            {/* Row 2 + 3: search bar + category pills (browse mode only) */}
            {!showHistory && (
              <>
                <RewardSearch value={searchQuery} onChange={setSearchQuery} />
                <RewardCategoryTabs
                  categories={CATEGORIES}
                  selected={selectedCategory}
                  onChange={setSelectedCategory}
                />
              </>
            )}
          </div>

          {/* Content area */}
          {showHistory ? (
            /* ── Redemption history ── */
            <div
              className="marketplace-catalog-card"
              style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                padding: '1.5rem'
              }}
            >
              <RedemptionHistory history={historyData} loading={historyLoading} />
            </div>
          ) : (
            /* ── Browse rewards ── */
            <>
              {/* Featured section */}
              {showFeatured && (
                <div>
                  <h2
                    style={{
                      color: 'var(--color-heading)',
                      marginBottom: '1rem'
                    }}
                  >
                    Featured Rewards
                  </h2>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
                      gap: '1.125rem'
                    }}
                  >
                    {featuredLoading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} style={{ height: 200, background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', animation: 'pulse 1.5s infinite' }} />
                      ))
                    ) : (
                      featuredRewards.map((reward) => (
                        <FeaturedCard key={reward._id} reward={reward} onClick={handleViewDetails} />
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* All rewards section */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}
                >
                  <h2
                    style={{
                      color: 'var(--color-heading)',
                      margin: 0
                    }}
                  >
                    All Rewards
                  </h2>
                  {totalRewards > 0 && (
                    <span style={{ color: 'var(--color-body)' }}>
                      ({totalRewards})
                    </span>
                  )}
                </div>

                {rewardsLoading ? (
                  <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
                    <SimpleLoader />
                  </div>
                ) : rewardsError ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '3rem 2rem',
                      background: 'white',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    <p style={{ color: 'var(--color-error)', marginBottom: '1rem' }}>
                      Failed to load rewards. Please check your connection and try again.
                    </p>
                    <button
                      onClick={() => queryClient.invalidateQueries(['marketplace-catalog'])}
                      className="btn btn-primary"
                    >
                      Retry
                    </button>
                  </div>
                ) : rewards.length === 0 ? (
                  <EmptyState type="rewards" onAction={resetFilters} actionLabel="Clear Filters" />
                ) : (
                  <RewardGrid
                    rewards={rewards}
                    onViewDetails={handleViewDetails}
                    onRedeem={setRedeemTarget}
                    userCoins={userCoins}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Drawers / modals ── */}
      <RewardDetailDrawer
        rewardId={selectedReward}
        onClose={() => {
          setSelectedReward(null);
          if (searchParams.has('rewardId')) {
            const next = new URLSearchParams(searchParams);
            next.delete('rewardId');
            setSearchParams(next, { replace: true });
          }
        }}
        userCoins={userCoins}
        onRedeemSuccess={handleRedeemSuccess}
      />

      <RedeemModal
        open={!!redeemTarget}
        onClose={() => setRedeemTarget(null)}
        reward={redeemTarget}
        userCoins={userCoins}
        onConfirm={handleRedeem}
        loading={redeeming}
      />
    </div>
  );
};

export default Marketplace;
