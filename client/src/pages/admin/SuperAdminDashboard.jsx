import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Calendar, Clock, Award, Gift, Building2, Shield, Database, Activity, BarChart3, TrendingUp, Settings } from 'lucide-react';
import { getSuperAdminDashboard } from '../../services/analyticsService';



const SuperAdminDashboard = () => {
  const { data: dashboardStats, isLoading, error } = useQuery({
    queryKey: ['super-admin-dashboard'],
    queryFn: async () => {
      const res = await getSuperAdminDashboard();
      if (res?.success) return res.data?.superAdmin;
      throw new Error(res?.message || 'Failed to load dashboard');
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div className="page-container" style={{ padding: '0.5rem 0 2rem 0' }}><SimpleLoader /></div>;
  }

  if (error) {
    return <div className="page-container" style={{ padding: '0.5rem 0 2rem 0', color: 'var(--color-error)' }}>{error.message}</div>;
  }

  const StatCard = ({ Icon, value, label, color = 'var(--color-primary)' }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
      <div style={{ padding: '0.75rem', backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`, color, borderRadius: '50%' }}>
        <Icon size={24} />
      </div>
      <div>
        <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-heading)' }}>{value}</div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-body)' }}>{label}</div>
      </div>
    </div>
  );

  const stats = dashboardStats || {};

  return (
    <div className="page-container" style={{ padding: '0.5rem 0 2rem 0' }}>
      <div className="card" style={{ marginBottom: '2rem', border: '2px solid var(--color-secondary)', background: 'linear-gradient(135deg, var(--color-secondary), var(--color-bg))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Shield size={20} style={{ color: 'var(--color-primary)' }} />
          <h3 style={{ margin: 0 }}>Platform Health</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <StatCard Icon={Database} value={stats?.platform?.dbHealth || 'Unknown'} label="Database Status" color="var(--color-success)" />
          <StatCard Icon={Activity} value={stats?.platform?.version || '1.0.0'} label="Platform Version" color="var(--color-primary)" />
          <StatCard Icon={Users} value={stats?.platform?.totalAdmins || 0} label="Admin Users" color="var(--color-accent)" />
          <StatCard Icon={Settings} value={stats?.platform?.totalRoles || 0} label="Roles Defined" color="var(--color-warning)" />
          <StatCard Icon={Shield} value={stats?.platform?.totalPermissions || 0} label="Permissions" color="var(--color-primary)" />
        </div>
      </div>

      {/* User Statistics */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={20} className="text-primary" /> User Statistics
        </h2>
        <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
          <StatCard Icon={Users} value={stats?.users?.totalVolunteers || 0} label="Total Volunteers" color="var(--color-primary)" />
          <StatCard Icon={Users} value={stats?.users?.activeVolunteers || 0} label="Active Volunteers" color="var(--color-success)" />
          <StatCard Icon={TrendingUp} value={stats?.users?.newVolunteersThisMonth || 0} label="New This Month" color="var(--color-info)" />
          <StatCard Icon={Gift} value={stats?.rewards?.coinsDistributed || 0} label="Total Points" color="var(--color-warning)" />
        </div>
      </div>

      {/* Program Statistics */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} className="text-primary" /> Program Statistics
        </h2>
        <div className="grid grid-cols-5" style={{ gap: '1rem' }}>
          <StatCard Icon={Calendar} value={stats?.programs?.totalPrograms || 0} label="Total Programs" color="var(--color-primary)" />
          <StatCard Icon={Calendar} value={stats?.programs?.activePrograms || 0} label="Active Programs" color="var(--color-success)" />
          <StatCard Icon={Calendar} value={stats?.programs?.draftPrograms || 0} label="Draft Programs" color="var(--color-body)" />
          <StatCard Icon={Calendar} value={stats?.programs?.completedPrograms || 0} label="Completed" color="var(--color-info)" />
          <StatCard Icon={Calendar} value={stats?.programs?.cancelledPrograms || 0} label="Cancelled" color="var(--color-error)" />
        </div>
      </div>

      {/* Application Statistics */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={20} className="text-primary" /> Application Statistics
        </h2>
        <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
          <StatCard Icon={Award} value={stats?.applications?.total || 0} label="Total Applications" color="var(--color-primary)" />
          <StatCard Icon={Award} value={stats?.applications?.pending || 0} label="Pending" color="var(--color-warning)" />
          <StatCard Icon={Award} value={stats?.applications?.approved || 0} label="Approved" color="var(--color-success)" />
          <StatCard Icon={Award} value={stats?.applications?.rejected || 0} label="Rejected" color="var(--color-error)" />
        </div>
      </div>

      {/* Attendance Statistics */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} className="text-primary" /> Attendance Statistics
        </h2>
        <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
          <StatCard Icon={Clock} value={stats?.attendance?.totalAttendance || 0} label="Total Records" color="var(--color-primary)" />
          <StatCard Icon={Clock} value={stats?.attendance?.todaysAttendance || 0} label="Today's Attendance" color="var(--color-success)" />
          <StatCard Icon={BarChart3} value={`${stats?.attendance?.attendanceRate || 0}%`} label="Attendance Rate" color="var(--color-info)" />
        </div>
      </div>

      {/* Certificate & Reward Statistics */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Gift size={20} className="text-primary" /> Achievement Statistics
        </h2>
        <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
          <StatCard Icon={Award} value={stats?.certificates?.generated || 0} label="Certificates Issued" color="var(--color-primary)" />
          <StatCard Icon={Gift} value={stats?.rewards?.coinsDistributed || 0} label="Coins Distributed" color="var(--color-warning)" />
          <StatCard Icon={Gift} value={stats?.rewards?.badgesAwarded || 0} label="Badges Awarded" color="var(--color-accent)" />
          <StatCard Icon={Gift} value={stats?.rewards?.achievementsAwarded || 0} label="Achievements" color="var(--color-success)" />
        </div>
      </div>

      {/* Organization Statistics */}
      <div>
        <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building2 size={20} className="text-primary" /> Organization Statistics
        </h2>
        <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
          <StatCard Icon={Building2} value={stats?.organizations?.totalOrganizations || 0} label="Total Organizations" color="var(--color-primary)" />
          <StatCard Icon={Building2} value={stats?.organizations?.verifiedOrganizations || 0} label="Verified Organizations" color="var(--color-success)" />
          <StatCard Icon={Building2} value={stats?.organizations?.pendingOrganizations || 0} label="Pending Verification" color="var(--color-warning)" />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;