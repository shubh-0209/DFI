import SimpleLoader from '../../components/common/SimpleLoader';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import ProfileHeader from '../../components/volunteer/impact/ProfileHeader';
import VolunteerStats from '../../components/volunteer/impact/VolunteerStats';
import WalletOverview from '../../components/volunteer/impact/WalletOverview';
import ContributionAnalytics from '../../components/volunteer/impact/ContributionAnalytics';
import BadgeGrid from '../../components/volunteer/impact/BadgeGrid';
import CertificateGrid from '../../components/volunteer/impact/CertificateGrid';
import RewardSection from '../../components/volunteer/impact/RewardSection';
import PortfolioPreview from '../../components/volunteer/impact/PortfolioPreview';
import LeaderboardCard from '../../components/volunteer/impact/LeaderboardCard';
import RecentActivity from '../../components/volunteer/impact/RecentActivity';
import QuickActions from '../../components/volunteer/impact/QuickActions';

import {
  getMyProfile,
  getVolunteerStatistics,
  getMyRank,
  getMyLevel,
  getMyBadges,
  getMyAchievements,
  getMyRewards,
  getRewardHistory,
  getMyCertificates,
  getMyContributions,
  getLeaderboardTop,
  getVolunteerAnalytics,
  getRecentActivity,
} from '../../services/volunteerImpactService';

const VolunteerImpactCenter = () => {
  const { user } = useAuth();

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['impact-profile'],
    queryFn: getMyProfile,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['impact-statistics'],
    queryFn: getVolunteerStatistics,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const { data: rankData } = useQuery({
    queryKey: ['impact-rank'],
    queryFn: getMyRank,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const { data: levelData } = useQuery({
    queryKey: ['impact-level'],
    queryFn: getMyLevel,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const { data: badgesData, isLoading: badgesLoading } = useQuery({
    queryKey: ['impact-badges'],
    queryFn: getMyBadges,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const { data: achievementsData } = useQuery({
    queryKey: ['impact-achievements'],
    queryFn: getMyAchievements,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const { data: rewardsData, isLoading: rewardsLoading } = useQuery({
    queryKey: ['impact-rewards'],
    queryFn: getMyRewards,
    staleTime: 0, // always fetch fresh so coins update immediately after approval
    refetchOnWindowFocus: true,
    enabled: !!user,
  });

  const { data: historyData } = useQuery({
    queryKey: ['impact-history'],
    queryFn: () => getRewardHistory({ limit: 10 }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const { data: certificatesData, isLoading: certificatesLoading } = useQuery({
    queryKey: ['impact-certificates'],
    queryFn: () => getMyCertificates({ limit: 6 }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const { data: contributionsData, isLoading: contributionsLoading } = useQuery({
    queryKey: ['impact-contributions'],
    queryFn: () => getMyContributions({ limit: 10 }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const { data: leaderboardData } = useQuery({
    queryKey: ['impact-leaderboard'],
    queryFn: () => getLeaderboardTop({ limit: 5 }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['impact-analytics'],
    queryFn: getVolunteerAnalytics,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['impact-activity'],
    queryFn: getRecentActivity,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const isLoading = profileLoading || statsLoading || badgesLoading || rewardsLoading || certificatesLoading || contributionsLoading || analyticsLoading || activityLoading;

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8F7F4', padding: 'clamp(1rem, 3vw, 2rem)' }}>
        <SimpleLoader />
      </div>
    );
  }

  const profile = profileData || user;
  const stats = statsData || {};
  const level = levelData || {};
  const badges = badgesData || [];
  const achievements = achievementsData || [];
  const rewards = rewardsData || {};
  const history = historyData || {};
  const certificates = certificatesData || [];
  const contributions = contributionsData || [];
  const leaderboard = leaderboardData || [];
  const analytics = analyticsData || {};
  const activities = activityData || [];

  const enhancedStats = {
    approvedContributions: stats.approvedContributions ?? contributions.filter(c => c.status === 'approved').length,
    pendingContributions: stats.pendingContributions ?? contributions.filter(c => c.status === 'pending' || c.status === 'under_review').length,
    completedMissions: stats.programsCompleted ?? 0,
    hoursContributed: stats.hoursCompleted ?? 0,
    coinsEarned: rewards.totalCoins ?? stats.currentCoins ?? 0,
    coinsRedeemed: rewards.redeemedCoins ?? 0,
    featuredContributions: stats.featuredContributions ?? contributions.filter(c => c.featured).length,
    certificatesEarned: stats.certificatesEarned ?? certificates.length,
    badgesEarned: stats.badgesEarned ?? badges.length,
    impactScore: stats.impactScore ?? 0,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8F7F4', padding: 'clamp(1rem, 3vw, 2rem) clamp(1rem, 3vw, 2rem) 3rem' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <ProfileHeader user={profile} level={level} rank={rankData} stats={enhancedStats} />

        <VolunteerStats stats={enhancedStats} />

        <QuickActions />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: '1.5rem' }}>
          <ContributionAnalytics analytics={analytics} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: '1.5rem' }}>
          <PortfolioPreview contributions={contributions} />
          <WalletOverview rewards={rewards} history={history} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: '1.5rem' }}>
          <BadgeGrid badges={badges} />
          <CertificateGrid certificates={certificates} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: '1.5rem' }}>
          <LeaderboardCard rank={rankData} topVolunteers={leaderboard} stats={stats} />
          <RewardSection rewards={rewards} history={history} />
        </div>

        <RecentActivity activities={activities} />

        {(achievements && achievements.length > 0) && (
          <div style={{ background: 'white', borderRadius: 20, padding: 'clamp(1rem, 3vw, 2rem)', border: '1px solid #F0EDE8', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--color-heading)', margin: '0 0 1rem 0' }}>Achievements ({achievements.length})</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {achievements.slice(0, 6).map((a, i) => (
                <div key={a._id || i} style={{ background: '#FAFAF8', borderRadius: 10, padding: '0.75rem 1rem', border: '1px solid #F0EDE8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>{a.icon || '🏅'}</span>
                  <span style={{ color: 'var(--color-heading)' }}>{a.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerImpactCenter;

