import React, { useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Users, Calendar, Clock, Activity, TrendingUp, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAdminDashboard, getLeaderboard } from '../../services/analyticsService';
import { getNotifications } from '../../services/notificationsService';
import { getAllPrograms } from '../../services/programsService';

import LeaderboardWidget from '../../components/LeaderboardWidget';
import NotificationWidget from '../../components/NotificationWidget';
import RecentAnnouncementsWidget from '../../components/announcements/RecentAnnouncementsWidget';

import { useAuth } from '../../context/AuthContext';
import useSocket from '../../hooks/useSocket';
import SimpleLoader from '../../components/common/SimpleLoader';

import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { on } = useSocket();

  // ── Socket subscriptions ─────────────────────────────────────────────────
  // Any program lifecycle event triggers an immediate refetch of all dashboard
  // queries so stat cards never show stale counts.
  useEffect(() => {
    const invalidateDashboard = () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['admin-programs-summary'] });
    };

    const unsubCreated = on('program-created', invalidateDashboard);
    const unsubPublished = on('program-published', invalidateDashboard);
    const unsubUpdated = on('program-updated', invalidateDashboard);
    const unsubDeleted = on('program-deleted', invalidateDashboard);
    const unsubArchived = on('program-archived', invalidateDashboard);
    const unsubStatus = on('program-status-updated', invalidateDashboard);

    return () => {
      unsubCreated();
      unsubPublished();
      unsubUpdated();
      unsubDeleted();
      unsubArchived();
      unsubStatus();
    };
  }, [on, queryClient]);

  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await getAdminDashboard();
      if (res?.success) return res.data?.admin;
      throw new Error(res?.message || 'Failed to load dashboard');
    },
    staleTime: 60 * 1000,        // 1 min — was 5 min
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,  // refetch when admin returns to tab
    enabled: !!user,
  });

  const { data: programsData } = useQuery({
    queryKey: ['admin-programs-summary'],
    queryFn: async () => {
      const res = await getAllPrograms({ limit: 100 });
      return res?.programs || [];
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    enabled: !!user,
  });

  const { data: leaderboardData, isLoading: leaderboardLoading } = useQuery({
    queryKey: ['admin-leaderboard', { limit: 5 }],
    queryFn: async () => {
      const res = await getLeaderboard({ limit: 5 });
      if (res?.success) return res.data?.leaderboardAnalytics?.topVolunteers || [];
      return [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const { data: notificationsData, isLoading: notificationsLoading } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const res = await getNotifications({ limit: 5 });
      if (res?.success) return res.data?.notifications || [];
      return [];
    },
    staleTime: 30 * 1000,        // 30 s — was 2 min
    refetchInterval: 60 * 1000,  // poll every 60 s for new admin notifications
    refetchOnWindowFocus: true,
    enabled: !!user,
  });

  const stats = useMemo(() => {
    if (!dashboardData) return null;
    // Use backend-aggregated counts as primary source of truth; fall back to
    // client-side list counts only when the analytics endpoint hasn't loaded yet.
    const clientActive = (programsData || []).filter(
      (p) => ['published', 'ongoing', 'registration_closed'].includes(p.status)
    ).length;
    return {
      totalVolunteers: dashboardData?.users?.totalVolunteers || 0,
      activeVolunteers: dashboardData?.users?.activeVolunteers || 0,
      // Prefer backend program stats; fall back to client list
      totalPrograms: dashboardData?.programs?.totalPrograms || (programsData || []).length,
      activePrograms: dashboardData?.programs?.activePrograms ?? clientActive,
      draftPrograms: dashboardData?.programs?.draftPrograms || 0,
      completedPrograms: dashboardData?.programs?.completedPrograms || 0,
      totalHours: dashboardData?.attendance?.totalAttendance || 0,
      newThisMonth: dashboardData?.users?.newVolunteersThisMonth || 0,
      pendingApps: dashboardData?.applications?.pending || 0,
      certificates: dashboardData?.certificates?.generated || 0,
      coinsDistributed: dashboardData?.rewards?.coinsDistributed || 0,
      organizations: dashboardData?.organizations?.totalOrganizations || 0,
      liveCheckedInCount: dashboardData?.attendance?.liveCheckedInCount || 0,
      todaysFlaggedCount: dashboardData?.attendance?.todaysFlaggedCount || 0,
    };
  }, [dashboardData, programsData]);

  const isLoading = dashboardLoading || leaderboardLoading || notificationsLoading;

  if (isLoading) {
    return <SimpleLoader />;
  }

  if (dashboardError) {
    return <div className="page-container admin-dashboard-page" style={{ color: '#dc2626' }}>{dashboardError.message}</div>;
  }

  const StatCard = ({ Icon, value, label, color = 'var(--color-primary)' }) => (
    <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div className="stat-card-icon" style={{ padding: '0.75rem', backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`, color, borderRadius: '50%', flexShrink: 0 }}>
        <Icon size={24} />
      </div>
      <div className="stat-card-content" style={{ overflow: 'hidden' }}>
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard-page">
      <div className="stats-grid">
        <StatCard Icon={Users} value={stats?.totalVolunteers || 0} label="Total Volunteers" color="var(--color-primary)" />
        <StatCard Icon={Calendar} value={stats?.activePrograms || 0} label="Active Programs" color="var(--color-success)" />
        <StatCard Icon={Clock} value={stats?.totalHours || 0} label="Hours Volunteered" color="var(--color-warning)" />
        <StatCard Icon={TrendingUp} value={stats?.newThisMonth || 0} label="Signups This Month" color="var(--color-primary)" />
      </div>

      {/* Secondary stats row */}
      <div className="stats-grid secondary-stats">
        <StatCard Icon={Calendar} value={stats?.totalPrograms || 0} label="Total Programs" color="var(--color-primary)" />
        <StatCard Icon={Calendar} value={stats?.draftPrograms || 0} label="Draft Programs" color="var(--color-warning)" />
        <StatCard Icon={Calendar} value={stats?.completedPrograms || 0} label="Completed Programs" color="var(--color-primary)" />
        <StatCard Icon={TrendingUp} value={stats?.pendingApps || 0} label="Pending Applications" color="var(--color-error)" />
      </div>

      {/* Attendance & Geofence warning stats */}
      <div className="stats-grid secondary-stats" style={{ marginTop: '1.25rem' }}>
        <StatCard Icon={Clock} value={stats?.liveCheckedInCount || 0} label="Volunteers Checked-In Now" color="var(--color-success)" />
        <StatCard Icon={Activity} value={stats?.todaysFlaggedCount || 0} label="Flagged Geofence Warnings" color="var(--color-error)" />
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-column left-column">
          <div className="card">
            <h3 className="card-heading">
              <Activity size={18} className="card-heading-icon" /> Platform Health
            </h3>
            <div className="health-status">
              <p className="health-status-text">System is running smoothly. All services operational.</p>
              <div className="health-status-indicators">
                <div><strong className="status-dot">●</strong> Database: Connected</div>
                <div><strong className="status-dot">●</strong> API: Online</div>
                <div><strong className="status-dot">●</strong> Cache: Active</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-heading">
              <Target size={18} className="card-heading-icon" /> Quick Actions
            </h3>
            <div className="quick-actions-grid">
              <button className="btn btn-secondary quick-action-btn" onClick={() => navigate('/admin/programs')}>
                <span className="btn-text-content">Manage Programs</span>
              </button>
              <button className="btn btn-secondary quick-action-btn" onClick={() => navigate('/admin/applications')}>
                <span className="btn-text-content">Review Applications</span>
              </button>
              <button className="btn btn-secondary quick-action-btn" onClick={() => navigate('/admin/attendance')}>
                <span className="btn-text-content">Mark Attendance</span>
              </button>
              <button className="btn btn-secondary quick-action-btn" onClick={() => navigate('/admin/insights')}>
                <span className="btn-text-content">Insights & Trends</span>
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-column right-column">
          <LeaderboardWidget
            topVolunteers={leaderboardData}
            loading={leaderboardLoading}
          />

          <NotificationWidget
            notifications={notificationsData}
            loading={notificationsLoading}
          />

          <RecentAnnouncementsWidget limit={4} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
