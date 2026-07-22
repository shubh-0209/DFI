/**
 * Dashboard.jsx  –  Volunteer Personal Homepage
 *
 * Eight sections, all conditionally rendered:
 *  1. Welcome & Progress  (hero)
 *  2. My Progress         (4 stat cards)
 *  3. Continue Journey    (single smart CTA)
 *  4. My Impact           (impact metrics grid)
 *  5. Recommended Opps    (hidden when empty)
 *  6. Upcoming Events     (hidden when empty)
 *  7. Updates             (unified feed)
 *  8. Quick Actions       (shortcut grid)
 */

import React, { useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, Clock, Briefcase, Award,
  TrendingUp, ChevronRight, ArrowUpRight,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { getVolunteerDashboard, getMyRank, getLeaderboard } from '../services/analyticsService';
import { getMyLevel, getMyBadges, getMyRewards } from '../services/gamificationService';
import { getMyPrograms } from '../services/programsService';
import { getNotifications } from '../services/notificationsService';
import { getAnnouncements } from '../services/announcementsService';
import { getUserRecentActivity } from '../services/collaborationService';
import { getMyContributions } from '../services/volunteerImpactService';
import { getAttendanceDashboard } from '../services/attendanceService';
import { getProgramRecommendations } from '../services/matchingService';


const DashboardMyImpact = React.lazy(() => import('../components/dashboard/DashboardMyImpact'));
const DashboardContinueJourney = React.lazy(() => import('../components/dashboard/DashboardContinueJourney'));
const DashboardQuickActions = React.lazy(() => import('../components/dashboard/DashboardQuickActions'));
const RecommendationsWidget = React.lazy(() => import('../components/dashboard/RecommendationsWidget'));

// Lightweight fallback for lazy components
const WidgetFallback = () => (
  <div style={{ height: 200, background: '#e5e7eb', borderRadius: '16px', animation: 'pulse 1.5s infinite' }} />
);

/* ─── greeting helper ─────────────────────────────────────────────────────── */

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

/* ─── leaderboard standing helper ────────────────────────────────────────── */

/**
 * Given the volunteer's rank and the total leaderboard entries,
 * returns a motivational string like "You're ahead of 74% of volunteers".
 * Returns null when data is unavailable.
 */
function standingMessage(rank, totalOnLeaderboard) {
  if (!rank || !totalOnLeaderboard || totalOnLeaderboard < 2) return null;
  const pct = Math.round(((totalOnLeaderboard - rank) / totalOnLeaderboard) * 100);
  if (pct <= 0) return null;
  return `You're ahead of ${pct}% of volunteers this month.`;
}

/* ─── section wrapper ─────────────────────────────────────────────────────── */

const Section = ({ children, style }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    style={style}
  >
    {children}
  </motion.div>
);

/* ─── stat card ───────────────────────────────────────────────────────────── */

const StatCard = ({ label, value, icon, color, bg, note, onClick, loading }) => (
  <div
    className="dashboard-stat-card"
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onClick={onClick}
    onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    style={{
      background: 'white',
      borderRadius: 12,
      padding: '0.875rem 1rem',
      border: '1px solid #F0EDE8',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.22s',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
    }}
    onMouseEnter={(e) => {
      if (onClick) {
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
      e.currentTarget.style.transform = 'none';
    }}
  >
    <div className="stat-card-icon-wrapper" style={{
      width: 40, height: 40, borderRadius: 10,
      background: bg, color, display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      {icon}
    </div>
    <div>
      <div style={{ color: 'var(--color-body)', marginBottom: '0.2rem' }}>
        {label}
      </div>
      <div style={{ color: 'var(--color-heading)', marginBottom: '0.15rem' }}>
        {loading ? (
          <div style={{
            height: 20, width: '60%', background: 'rgba(0,0,0,0.06)',
            borderRadius: 4, animation: 'pulse 1.5s infinite'
          }} />
        ) : (
          value
        )}
      </div>
      <div style={{ color }}>{note}</div>
    </div>
  </div>
);

/* ─── upcoming events section ─────────────────────────────────────────────── */

const UpcomingEvents = ({ programs }) => {
  const upcoming = (programs || []).filter(
    (p) => p.status === 'upcoming' || p.status === 'scheduled'
  ).slice(0, 3);

  if (upcoming.length === 0) return null;

  return (
    <Section>
      <div style={{ marginBottom: '0.875rem' }}>
        <h2 style={{ color: 'var(--color-heading)', margin: 0 }}>
          Upcoming Events
        </h2>
        <p style={{ color: 'var(--color-body)', margin: '0.2rem 0 0 0' }}>
          Your next scheduled program sessions.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {upcoming.map((prog) => (
          <div
            key={prog._id || prog.id}
            className="dashboard-card"
            style={{
              background: 'white', borderRadius: 12, padding: '1rem 1.25rem',
              border: '1px solid #FDE68A', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{ flex: 1, minWidth: 0, paddingRight: '1rem' }}>
              <h4 style={{
                color: 'var(--color-heading)', margin: '0 0 0.25rem 0',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
              }}>
                {prog.title || prog.programTitle}
              </h4>
              <span style={{
                padding: '0.2rem 0.6rem', borderRadius: 999,
                background: '#FEF3C7', color: '#D97706'
              }}>
                Upcoming
              </span>
            </div>
            <Link
              to="/my-programs"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--color-primary)',
                textDecoration: 'none'
              }}
            >
              Details <ArrowUpRight size={13} />
            </Link>
          </div>
        ))}
      </div>
    </Section>
  );
};

/* ─── main component ──────────────────────────────────────────────────────── */

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  /* ── data fetching ────────────────────────────────────────────────────── */

  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useQuery({
    queryKey: ['volunteer-dashboard'],
    queryFn: async () => {
      const res = await getVolunteerDashboard();
      if (res.success) return res.data?.volunteer || null;
      throw new Error(res.message || 'Failed to load dashboard');
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const { data: rankData, isLoading: rankLoading } = useQuery({
    queryKey: ['my-rank'],
    queryFn: async () => {
      const res = await getMyRank();
      if (res.success) return res.data?.rank || null;
      return null;
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    enabled: !!user,
  });

  const { data: leaderboardData } = useQuery({
    queryKey: ['leaderboard-count'],
    queryFn: async () => {
      const res = await getLeaderboard({ limit: 100 });
      if (res.success) return res.data?.leaderboardAnalytics?.topVolunteers || [];
      return [];
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const { data: gamificationData, isLoading: gamificationLoading } = useQuery({
    queryKey: ['gamification'],
    queryFn: async () => {
      const [levelRes, badgesRes, pointsRes] = await Promise.all([
        getMyLevel(), getMyBadges(), getMyRewards(),
      ]);
      return {
        points: pointsRes.success ? (pointsRes.data?.totalPoints || 0) : 0,
        level: levelRes.success ? (levelRes.data?.currentLevel?.name || 'Beginner') : 'Beginner',
        xpToNext: levelRes.success ? (levelRes.data?.xpToNextLevel ?? null) : null,
        badges: badgesRes.success ? (badgesRes.data?.badges || []) : [],
        coins: pointsRes.success ? (pointsRes.data?.currentCoins || 0) : 0,
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const { data: programsData, isLoading: programsLoading } = useQuery({
    queryKey: ['my-programs'],
    queryFn: async () => {
      const res = await getMyPrograms();
      if (res.success) return res.data?.programs || res.programs || [];
      return [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    enabled: !!user,
  });

  const { data: contributionsData, isLoading: contribLoading } = useQuery({
    queryKey: ['my-contributions-dashboard'],
    queryFn: async () => {
      const items = await getMyContributions({ limit: 20 });
      return Array.isArray(items) ? items : [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    enabled: !!user,
  });

  const { data: attendanceData, isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance-dashboard'],
    queryFn: async () => {
      const res = await getAttendanceDashboard();
      if (res.success) return res.data || null;
      return null;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    enabled: !!user,
  });

  const { data: notificationsData, isLoading: notifLoading } = useQuery({
    queryKey: ['notifications-dashboard'],
    queryFn: async () => {
      const res = await getNotifications({ limit: 8 });
      if (res.success) return res.data?.notifications || [];
      return [];
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const { data: announcementsData, isLoading: annLoading } = useQuery({
    queryKey: ['announcements-dashboard'],
    queryFn: async () => {
      const res = await getAnnouncements({ page: 1, limit: 5, sortBy: 'createdAt', order: 'desc' });
      if (res.success) return res.data?.announcements || [];
      return [];
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['activity-dashboard'],
    queryFn: async () => {
      const res = await getUserRecentActivity();
      if (res.success) return res.data?.activities || [];
      return [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const { data: recommendationsData } = useQuery({
    queryKey: ['recommendations-dashboard'],
    queryFn: async () => {
      const res = await getProgramRecommendations({ page: '1', limit: '3' });
      if (res.success) return res.data?.recommendations || [];
      return [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  /* ── derived values ───────────────────────────────────────────────────── */

  const displayName = user?.name || 'Volunteer';
  const firstName = displayName.split(' ')[0];
  const profileCompletion = user?.profileCompletion ?? null;
  const points = gamificationData?.points || 0;
  const level = gamificationData?.level || 'Beginner';
  const xpToNext = gamificationData?.xpToNext ?? null;
  const badgesCount = (gamificationData?.badges || []).length;

  const stats = useMemo(() => {
    if (!dashboardData) return null;
    return {
      totalHours: dashboardData.totalHours ?? 0,
      programsJoined: dashboardData.totalProgramsJoined ?? 0,
      activePrograms: dashboardData.activePrograms ?? 0,
      certificates: dashboardData.certificatesEarned ?? 0,
    };
  }, [dashboardData]);

  const totalLeaderboard = (leaderboardData || []).length;
  const standing = standingMessage(rankData, totalLeaderboard);

  // Primary CTA in hero: if any active program, show "Continue Journey"; else "Explore Opportunities"
  const programs = programsData || [];
  const hasActiveProgram = programs.some((p) => p.status === 'active' || p.status === 'ongoing');
  const heroCta = hasActiveProgram
    ? { label: 'Continue Journey', to: '/my-programs' }
    : { label: 'Explore Opportunities', to: '/opportunities' };

  const contributions = contributionsData || [];
  const submittedContributions = contributions.filter(
    (c) => c.status === 'approved' || c.status === 'pending' || c.status === 'under_review'
  ).length;

  const feedLoading = notifLoading || annLoading || activityLoading;

  /* ── loading & error states ───────────────────────────────────────────── */

  if (dashboardError) {
    return (
      <div style={{ padding: '2rem', color: 'var(--color-error)' }}>
        Failed to load dashboard. Please try again later.
      </div>
    );
  }

  /* ── render ───────────────────────────────────────────────────────────── */

  return (
    <div className="volunteer-dashboard-page" style={{
      minHeight: '100vh',
      background: '#F8F7F4',
      padding: '0 clamp(1rem, 4vw, 2rem)', // Added side padding for mobile
    }}>
      <div className="dashboard-content-wrapper" style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '1rem 0 2rem 0', // Reduced top padding
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem', // Reduced gap for a tighter layout
      }}>

        {/* ── SECTION 1: Welcome & Progress ─────────────────────────────── */}
        <Section>
          <div className="dashboard-hero-card" style={{
            background: 'var(--primary-blue)',
            borderRadius: 16,
            padding: '1.25rem 1.5rem', // Reduced padding to make hero compact
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(211,84,0,0.15)'
          }}>
            <div style={{ position: 'relative', zIndex: 2 }}>

              {/* Greeting */}
              <h2 style={{
                color: 'white', margin: '0 0 0.25rem 0', fontSize: '1.5rem'
              }}>
                {getGreeting()}, {firstName}! 👋
              </h2>

              {/* Standing message — only when leaderboard data is available */}
              {standing && (
                <p style={{
                  color: 'rgba(255,255,255,0.92)',
                  margin: '0 0 0.5rem 0',
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  fontSize: '0.9rem'
                }}>
                  <TrendingUp size={14} />
                  {standing}
                </p>
              )}

              {/* Level + XP row */}
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
                alignItems: 'center', marginBottom: '1rem', fontSize: '0.875rem'
              }}>
                <span style={{
                  padding: '0.2rem 0.75rem', borderRadius: 999,
                  background: 'rgba(255,255,255,0.22)',
                  border: '1px solid rgba(255,255,255,0.35)'
                }}>
                  {gamificationLoading ? (
                    <div style={{ width: 60, height: 14, background: 'rgba(255,255,255,0.3)', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                  ) : (
                    `⚡ ${level}`
                  )}
                </span>
                {(rankData || rankLoading) && (
                  <span style={{
                    padding: '0.2rem 0.75rem', borderRadius: 999,
                    background: 'rgba(255,255,255,0.22)',
                    border: '1px solid rgba(255,255,255,0.35)'
                  }}>
                    {rankLoading ? (
                      <div style={{ width: 80, height: 14, background: 'rgba(255,255,255,0.3)', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                    ) : (
                      `🏆 Rank #${rankData}`
                    )}
                  </span>
                )}
                {(xpToNext !== null || gamificationLoading) && (
                  <span style={{
                    padding: '0.2rem 0.75rem', borderRadius: 999,
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.25)'
                  }}>
                    {gamificationLoading ? (
                      <div style={{ width: 100, height: 14, background: 'rgba(255,255,255,0.2)', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                    ) : (
                      `${xpToNext.toLocaleString()} XP to next level`
                    )}
                  </span>
                )}
              </div>
              {/* Primary CTA */}
              <div>
                <Link
                  to={heroCta.to}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '0.5rem 1rem', borderRadius: 6,
                    background: 'white', color: 'var(--color-primary)',
                    textDecoration: 'none', transition: 'all 0.2s',
                    fontSize: '0.875rem', fontWeight: 600
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                >
                  {heroCta.label} <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* decorative icon */}
            <div style={{
              position: 'absolute', right: '-10px', bottom: '-20px',
              opacity: 0.1, transform: 'rotate(-15deg)'
            }}>
              <Sparkles size={140} />
            </div>
          </div>
        </Section>

        {/* ── SECTION 2: My Progress (stat cards) ───────────────────────── */}
        <Section>
          <div className="stat-card-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
            gap: '1rem'
          }}>

            <StatCard
              label="XP Points" value={points}
              icon={<Sparkles size={18} />}
              color="var(--primary-blue)" bg="#FFF3ED" note="Earned"
              loading={dashboardLoading}
            />
            <StatCard
              label="Hours Served" value={stats?.totalHours ?? 0}
              icon={<Clock size={18} />}
              color="#059669" bg="#D1FAE5" note="Lifetime"
              onClick={() => navigate('/attendance/hours')}
              loading={dashboardLoading}
            />
            <StatCard
              label="Programs" value={stats?.programsJoined ?? 0}
              icon={<Briefcase size={18} />}
              color="var(--primary-blue)" bg="#EDE9FE"
              note={`${stats?.activePrograms ?? 0} Active`}
              onClick={() => navigate('/my-programs')}
              loading={dashboardLoading}
            />
            <StatCard
              label="Certificates" value={stats?.certificates ?? 0}
              icon={<Award size={18} />}
              color="#D97706" bg="#FEF3C7" note="Verified"
              onClick={() => navigate('/certificates')}
              loading={dashboardLoading}
            />
            <StatCard
              label="Profile" value={`${profileCompletion ?? 0}%`}
              icon={<Award size={18} />}
              color="#2563EB" bg="#DBEAFE" note="Completed"
              onClick={() => navigate('/profile/setup')}
              loading={dashboardLoading}
            />
          </div>
        </Section>

        {/* ── SECTION 3: Continue Journey ──────────────────────────────── */}
        <Section>
          <React.Suspense fallback={<WidgetFallback />}>
            <DashboardContinueJourney
              programs={programsData}
              contributions={contributionsData}
              attendanceDashboard={attendanceData}
              profileCompletion={profileCompletion}
              loading={dashboardLoading || programsLoading || contribLoading || attendanceLoading}
            />
          </React.Suspense>
        </Section>

        <div className="dashboard-two-column-impact">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* ── SECTION 4: My Impact ──────────────────────────────────────── */}
            <React.Suspense fallback={<WidgetFallback />}>
              <DashboardMyImpact
                totalHours={stats?.totalHours}
                programsJoined={stats?.programsJoined}
                contributionsCount={submittedContributions}
                certificatesEarned={stats?.certificates}
                coinsEarned={gamificationData?.coins}
                badgesEarned={badgesCount}
                loading={dashboardLoading}
              />
            </React.Suspense>

            {/* ── SECTION 8: Quick Actions ───────────────────────────────────── */}
            <Section>
              <React.Suspense fallback={<WidgetFallback />}>
                <DashboardQuickActions profileCompletion={profileCompletion} />
              </React.Suspense>
            </Section>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: 0 }}>
            {/* ── SECTION 5: Recommended Opportunities ──────────────────────── */}
            {(recommendationsData && recommendationsData.length > 0) ? (
              <Section>
                <React.Suspense fallback={<WidgetFallback />}>
                  <RecommendationsWidget />
                </React.Suspense>
              </Section>
            ) : (
              <div /> // Empty placeholder for the right column if no recommendations
            )}

          </div>
        </div>

        {/* ── SECTION 6: Upcoming Events ─────────────────────────────────── */}
        <UpcomingEvents programs={programs} />

      </div>
    </div>
  );
};

export default Dashboard;
