import SimpleLoader from '../../components/common/SimpleLoader';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, Target, Gift } from 'lucide-react';
import { getVolunteerDashboard } from '../../services/analyticsService';


const VolunteerAnalytics = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['volunteer-dashboard'],
    queryFn: async () => {
      const res = await getVolunteerDashboard();
      if (res?.success) return res.data?.volunteer;
      throw new Error(res?.message || 'Failed to load dashboard');
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div className="page-container" style={{ padding: '2rem' }}><SimpleLoader /></div>;
  if (error) return <div className="page-container" style={{ padding: '2rem', color: 'var(--color-error)' }}>{error.message}</div>;
  if (!stats) return null;

  const StatCard = ({ icon: Icon, value, label, color = 'var(--color-primary)' }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ padding: '0.75rem', backgroundColor: `${color}20`, color, borderRadius: '50%' }}>
        <Icon size={20} />
      </div>
      <div>
        <div style={{ color: 'var(--color-heading)' }}>{value}</div>
        <div style={{ color: 'var(--color-body)' }}>{label}</div>
      </div>
    </div>
  );

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-heading)' }}>My Dashboard Analytics</h1>
        <p style={{ color: 'var(--color-body)', margin: 0 }}>Your volunteering statistics and achievements.</p>
      </div>

      <div className="grid grid-cols-4" style={{ marginBottom: '2rem', gap: '1.5rem' }}>
        <StatCard Icon={Calendar} value={stats.totalProgramsJoined || 0} label="Programs Joined" color="var(--color-primary)" />
        <StatCard Icon={Clock} value={stats.totalHours || 0} label="Total Hours" color="var(--color-success)" />
        <StatCard Icon={Clock} value={stats.totalAttendance || 0} label="Attendance Records" color="var(--color-accent)" />
        <StatCard Icon={Gift} value={stats.currentCoins || 0} label="Coins Balance" color="var(--color-warning)" />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>My Applications</h2>
        <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
          <StatCard Icon={Target} value={stats.pendingApplications || 0} label="Pending" color="#8B5CF6" />
          <StatCard Icon={Target} value={stats.approvedApplications || 0} label="Approved" color="var(--color-success)" />
          <StatCard Icon={Target} value={stats.rejectedApplications || 0} label="Rejected" color="var(--color-error)" />
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Progress Summary</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Active Programs: {stats.activePrograms || 0}</span>
            <span>Completed Programs: {stats.completedPrograms || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerAnalytics;