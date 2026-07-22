import SimpleLoader from '../../common/SimpleLoader';
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FolderOpen, Coins, Award, MessageSquare, Star, Settings } from 'lucide-react';
import { getCategories, getCoinRules, getBadgeRules, getReviewTemplates, getFeaturedConfigs } from '../../../services/contributionConfigService';


const AdminOverview = () => {
  const { data: catData, isLoading: catLoading } = useQuery({
    queryKey: ['admin-config-categories-overview'],
    queryFn: () => getCategories({ limit: 1 }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: coinData, isLoading: coinLoading } = useQuery({
    queryKey: ['admin-config-coin-rules-overview'],
    queryFn: () => getCoinRules({ limit: 1 }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: badgeData, isLoading: badgeLoading } = useQuery({
    queryKey: ['admin-config-badge-rules-overview'],
    queryFn: () => getBadgeRules({ limit: 1 }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: templateData, isLoading: templateLoading } = useQuery({
    queryKey: ['admin-config-review-templates-overview'],
    queryFn: () => getReviewTemplates({ limit: 1 }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['admin-config-featured-overview'],
    queryFn: () => getFeaturedConfigs({ limit: 1 }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const isLoading = catLoading || coinLoading || badgeLoading || templateLoading || featuredLoading;

  const stats = useMemo(() => {
    const totalCategories = catData?.categories?.length || 0;
    const activeCoinRules = coinData?.rules?.filter(r => r.isActive).length || 0;
    const activeBadges = badgeData?.rules?.filter(r => r.isActive).length || 0;
    const activeTemplates = templateData?.templates?.filter(t => t.isActive).length || 0;
    const activeRewards = featuredData?.configs?.filter(c => c.isActive).length || 0;
    return [
      { label: 'Total Categories', value: totalCategories, icon: <FolderOpen size={22} />, color: 'var(--primary-blue)', bg: '#FFF3ED' },
      { label: 'Active Coin Rules', value: activeCoinRules, icon: <Coins size={22} />, color: 'var(--primary-blue)', bg: '#EDE9FE' },
      { label: 'Active Badges', value: activeBadges, icon: <Award size={22} />, color: '#059669', bg: '#D1FAE5' },
      { label: 'Active Reviewers', value: activeTemplates, icon: <MessageSquare size={22} />, color: '#F59E0B', bg: '#FEF3C7' },
      { label: 'Active Rewards', value: activeRewards, icon: <Star size={22} />, color: '#EC4899', bg: '#FCE7F3' },
      { label: 'Config Sections', value: '10', icon: <Settings size={22} />, color: '#D97706', bg: '#FEF3C7' },
    ];
  }, [catData, coinData, badgeData, templateData, featuredData]);

  if (isLoading) {
    return <SimpleLoader />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-heading)', margin: '0 0 0.25rem 0' }}>
          Configuration Overview
        </h2>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-body)', margin: 0 }}>
          Manage every aspect of the Contribution Hub without code changes.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1rem' }}>
        {stats.map((stat, i) => (
          <div
            key={i}
            className="card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              border: '1px solid var(--color-border)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-heading)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-body)', fontWeight: 500, marginTop: '0.25rem' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
