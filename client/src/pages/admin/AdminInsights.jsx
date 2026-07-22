import SimpleLoader from '../../components/common/SimpleLoader';
import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { 
  Users, 
  Calendar, 
  Clock, 
  Award, 
  TrendingUp, 
  Target, 
  Gift, 
  Building2, 
  Download,
  Search,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getAdminDashboard,
  getVolunteerAnalytics,
  getProgramAnalytics,
  getApplicationAnalytics,
  getAttendanceAnalytics,
  getCertificateAnalytics,
  getRewardAnalytics,
  getLeaderboardAnalytics,
  getOrganizationAnalytics,
} from '../../services/analyticsService';
import { 
  getForecastDashboard, 
  getVolunteerForecast, 
  getProgramForecast, 
  getAttendanceForecast, 
  getRewardForecast 
} from '../../services/forecastService';

import StatCard from '../../components/volunteer/StatCard';
import ForecastCard from '../../components/forecast/ForecastCard';
import ForecastTrendChart from '../../components/forecast/ForecastTrendChart';
import { AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DATE_RANGES = [
  { value: '', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'last_3_months', label: 'Last 3 Months' },
  { value: 'last_6_months', label: 'Last 6 Months' },
  { value: 'last_year', label: 'Last Year' },
];

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const exportToCSV = (data, filename) => {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).map(v => `"${v}"`).join(','));
  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const ChartCard = ({ title, children, actions, loading = false }) => (
  <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--color-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {title}
      </h3>
      {actions && <div style={{ display: 'flex', gap: '0.5rem' }}>{actions}</div>}
    </div>
    <div style={{ padding: '1rem', flex: 1 }}>
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        </div>
      ) : children}
    </div>
  </div>
);

const GrowthChart = ({ data, dataKey, title, color = 'var(--color-primary)' }) => {
  if (!data || data.length === 0) {
    return (
      <ChartCard title={title}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-body)' }}>
          No data available
        </div>
      </ChartCard>
    );
  }

  const chartData = data.map(item => ({
    ...item,
    monthName: `${MONTH_NAMES[item.month] || ''} ${item.year}`,
  })).slice(-12);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'var(--color-card)', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
          <p style={{ margin: 0, color: color }}>{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard title={<><LineChart size={18} />{title}</>}>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
          <XAxis dataKey="monthName" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#gradient-${title})`} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

const PieChartComponent = ({ data, title, nameKey, valueKey, colors }) => {
  if (!data || data.length === 0) {
    return (
      <ChartCard title={<><PieChart size={18} />{title}</>}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-body)' }}>
          No data available
        </div>
      </ChartCard>
    );
  }

  const chartData = data.map((item) => ({
    name: item[nameKey],
    value: item[valueKey],
    percentage: item.percentage,
  }));

  const COLORS = colors || ['var(--color-primary)', 'var(--color-success)', 'var(--color-accent)', 'var(--color-warning)', 'var(--color-error)'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      return (
        <div style={{ backgroundColor: 'var(--color-card)', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>{entry.name}</p>
          <p style={{ margin: 0 }}>{entry.value} ({entry.payload.percentage || 0}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard title={<><PieChart size={18} />{title}</>}>
      <ResponsiveContainer width="100%" height={250}>
        <RePieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} label={({ percentage }) => `${percentage || 0}%`}>
            {chartData.map((_, i) => (
              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </RePieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

const AdminInsights = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Dashboard Overview Queries
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await getAdminDashboard();
      return res?.success ? res.data?.admin : null;
    },
  });

  const { data: forecastDashboard, isLoading: forecastDashboardLoading } = useQuery({
    queryKey: ['forecast-dashboard'],
    queryFn: async () => {
      const res = await getForecastDashboard();
      return res?.success ? res.data : null;
    }
  });

  // 2. Tab Specific Queries
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['admin-analytics', activeTab, dateRange],
    queryFn: async () => {
      let res;
      switch (activeTab) {
        case 'volunteers': res = await getVolunteerAnalytics(dateRange || null); break;
        case 'programs': res = await getProgramAnalytics(dateRange || null); break;
        case 'attendance': res = await getAttendanceAnalytics(dateRange || null); break;
        case 'rewards': res = await getRewardAnalytics(dateRange || null); break;
        case 'leaderboard': res = await getLeaderboardAnalytics(10); break;
        case 'organizations': res = await getOrganizationAnalytics(dateRange || null); break;
        default: return null;
      }
      return res?.success ? res.data : null;
    },
    enabled: activeTab !== 'overview',
    placeholderData: keepPreviousData,
  });

  const { data: forecast, isLoading: forecastLoading } = useQuery({
    queryKey: ['admin-forecast', activeTab],
    queryFn: async () => {
      let res;
      switch (activeTab) {
        case 'volunteers': res = await getVolunteerForecast(); break;
        case 'programs': res = await getProgramForecast(); break;
        case 'attendance': res = await getAttendanceForecast(); break;
        case 'rewards': res = await getRewardForecast(); break;
        default: return null;
      }
      return res?.success ? res.data : null;
    },
    enabled: ['volunteers', 'programs', 'attendance', 'rewards'].includes(activeTab),
    placeholderData: keepPreviousData,
  });

  const loading = dashboardLoading || forecastDashboardLoading || (activeTab !== 'overview' && (analyticsLoading || forecastLoading));

  const handleExport = useCallback((data, filename) => {
    exportToCSV(data, filename);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', Icon: BarChart3 },
    { id: 'volunteers', label: 'Volunteers', Icon: Users },
    { id: 'programs', label: 'Programs', Icon: Calendar },
    { id: 'attendance', label: 'Attendance', Icon: Clock },
    { id: 'rewards', label: 'Rewards', Icon: Gift },
    { id: 'leaderboard', label: 'Leaderboard', Icon: TrendingUp },
    { id: 'organizations', label: 'Organizations', Icon: Building2 },
  ];

  const filteredStates = useMemo(() => {
    const list = analytics?.volunteerAnalytics?.volunteersByState || [];
    if (!searchQuery) return list;
    return list.filter(s => s.state.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [analytics?.volunteerAnalytics?.volunteersByState, searchQuery]);

  const filteredCities = useMemo(() => {
    return analytics?.volunteerAnalytics?.volunteersByCity || [];
  }, [analytics?.volunteerAnalytics?.volunteersByCity]);

  if (loading) {
    return <div className="page-container" style={{ padding: '0.5rem 0 2rem 0' }}><SimpleLoader /></div>;
  }

  return (
    <div className="page-container" style={{ padding: '0.5rem 0 2rem 0' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
            className={activeTab === tab.id ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <tab.Icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && dashboardData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Main Stat Cards */}
          <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
            <StatCard icon={<Users size={24} />} value={dashboardData?.users?.totalVolunteers || 0} label="Total Volunteers" color="primary" />
            <StatCard icon={<Users size={24} />} value={dashboardData?.users?.activeVolunteers || 0} label="Active Volunteers" color="secondary" />
            <StatCard icon={<Calendar size={24} />} value={dashboardData?.programs?.activePrograms || 0} label="Active Programs" color="accent" />
            <StatCard icon={<Clock size={24} />} value={dashboardData?.attendance?.totalAttendance || 0} label="Total Attendance" color="success" />
          </div>

          <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
            <StatCard icon={<Award size={24} />} value={dashboardData?.certificates?.generated || 0} label="Certificates Issued" color="warning" />
            <StatCard icon={<Gift size={24} />} value={dashboardData?.rewards?.coinsIssued || 0} label="Coins Distributed" color="primary" />
            <StatCard icon={<Clock size={24} />} value={dashboardData?.attendance?.hoursServed || 0} label="Total Hours Served" color="secondary" />
          </div>

          {/* Forecast Cards on Overview */}
          {forecastDashboard?.forecasts && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--color-primary)" /> Predictive Forecasts Overview
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <ForecastCard
                  title="Volunteer Growth"
                  {...forecastDashboard.forecasts.volunteers}
                  icon={Users}
                  color="var(--color-primary)"
                />
                <ForecastCard
                  title="Program Demand"
                  {...forecastDashboard.forecasts.programs}
                  icon={Calendar}
                  color="var(--color-success)"
                />
                <ForecastCard
                  title="Attendance Trends"
                  {...forecastDashboard.forecasts.attendance}
                  icon={Clock}
                  color="var(--color-accent)"
                />
                <ForecastCard
                  title="Reward Redemption"
                  {...forecastDashboard.forecasts.rewards}
                  icon={Gift}
                  color="var(--color-warning)"
                />
              </div>
            </div>
          )}

          {/* Charts on Overview */}
          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <ChartCard title="Historical Volunteer Growth">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={dashboardData?.volunteersJoinedPerMonth?.map(m => ({
                  ...m,
                  monthName: `${MONTH_NAMES[m.month] || ''} ${m.year}`.trim(),
                })) || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="volunteerGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="monthName" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#volunteerGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <PieChartComponent 
              data={dashboardData?.stateDistribution || []}
              title="Volunteers State Distribution"
              nameKey="state"
              valueKey="count"
            />
          </div>
        </div>
      )}

      {/* OTHER TABS */}
      {activeTab !== 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Controls */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {activeTab !== 'leaderboard' && (
              <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="form-input"
                  aria-label="Select date range"
                >
                  {DATE_RANGES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
            )}
            
            {['volunteers', 'programs'].includes(activeTab) && (
              <div style={{ flex: '2 1 300px', minWidth: '250px', position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)' }} />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  aria-label={`Search ${activeTab}`}
                />
              </div>
            )}
          </div>

          {/* VOLUNTEERS TAB */}
          {activeTab === 'volunteers' && analytics?.volunteerAnalytics && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
                <StatCard icon={<Users size={24} />} value={analytics.volunteerAnalytics.totalVolunteers || 0} label="Total Volunteers" color="primary" />
                <StatCard icon={<Users size={24} />} value={analytics.volunteerAnalytics.activeVolunteers || 0} label="Active Volunteers" color="secondary" />
                <StatCard icon={<Users size={24} />} value={analytics.volunteerAnalytics.inactiveVolunteers || 0} label="Inactive" color="error" />
                <StatCard icon={<TrendingUp size={24} />} value={`${analytics.volunteerAnalytics.growthRate?.rate || 0}%`} label="Growth Rate" color="accent" />
              </div>

              {/* Forecast + Chart */}
              {forecast && (
                <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                  <ForecastCard
                    title="Predictive Volunteer Growth"
                    {...forecast}
                    icon={Users}
                    color="var(--color-primary)"
                  />
                  {forecast.historicalData && (
                    <ForecastTrendChart
                      title="Volunteer Trend Timeline"
                      historicalData={forecast.historicalData}
                      predictions={forecast.predictions?.map(p => typeof p.value === 'number' ? p.value : 0)}
                      dataKey="total"
                      color="var(--color-primary)"
                    />
                  )}
                </div>
              )}

              {/* State & City Distribution */}
              <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                <ChartCard title="Volunteers by State">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto' }}>
                    {filteredStates.slice(0, 16).map((item, i) => (
                      <div key={i} style={{ flex: '1 1 120px', padding: '0.75rem', backgroundColor: 'var(--color-bg)', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-base)' }}>{item.state}</div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-body)' }}>{item.count} ({item.percentage}%)</div>
                      </div>
                    ))}
                    {filteredStates.length === 0 && <p style={{ color: 'var(--color-body)' }}>No states match search query</p>}
                  </div>
                </ChartCard>

                <ChartCard title="Volunteers by City">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto' }}>
                    {filteredCities.slice(0, 16).map((item, i) => (
                      <div key={i} style={{ flex: '1 1 120px', padding: '0.75rem', backgroundColor: 'var(--color-bg)', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-base)' }}>{item.city}</div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-body)' }}>{item.count} ({item.percentage}%)</div>
                      </div>
                    ))}
                  </div>
                </ChartCard>
              </div>
            </div>
          )}

          {/* PROGRAMS TAB */}
          {activeTab === 'programs' && analytics?.programAnalytics && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
                <StatCard icon={<Calendar size={24} />} value={analytics.programAnalytics.totalPrograms || 0} label="Total Programs" color="primary" />
                <StatCard icon={<Calendar size={24} />} value={analytics.programAnalytics.activePrograms || 0} label="Active Programs" color="secondary" />
                <StatCard icon={<Calendar size={24} />} value={analytics.programAnalytics.completedPrograms || 0} label="Completed" color="success" />
                <StatCard icon={<Calendar size={24} />} value={analytics.programAnalytics.cancelledPrograms || 0} label="Cancelled" color="error" />
              </div>

              {/* Forecast + Trend */}
              {forecast && (
                <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                  <ForecastCard
                    title="Predictive Program Demand"
                    {...forecast}
                    icon={Calendar}
                    color="var(--color-success)"
                  />
                  {forecast.historicalData && (
                    <ForecastTrendChart
                      title="Program Trend Timeline"
                      historicalData={forecast.historicalData}
                      predictions={forecast.predictions?.map(p => typeof p.value === 'number' ? p.value : 0)}
                      dataKey="count"
                      color="var(--color-success)"
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* ATTENDANCE TAB */}
          {activeTab === 'attendance' && analytics?.attendanceAnalytics && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
                <StatCard icon={<Clock size={24} />} value={analytics.attendanceAnalytics.totalAttendance || 0} label="Total Clock-Ins" color="primary" />
                <StatCard icon={<Clock size={24} />} value={analytics.attendanceAnalytics.hoursServed || 0} label="Total Hours Served" color="secondary" />
                <StatCard icon={<TrendingUp size={24} />} value={`${analytics.attendanceAnalytics.attendanceRate || 0}%`} label="Attendance Rate" color="success" />
              </div>

              {forecast && (
                <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                  <ForecastCard
                    title="Attendance Trends Forecast"
                    {...forecast}
                    icon={Clock}
                    color="var(--color-accent)"
                  />
                  {forecast.historicalData && (
                    <ForecastTrendChart
                      title="Attendance Growth Timeline"
                      historicalData={forecast.historicalData}
                      predictions={forecast.predictions?.map(p => typeof p.value === 'number' ? p.value : 0)}
                      dataKey="count"
                      color="var(--color-accent)"
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* REWARDS TAB */}
          {activeTab === 'rewards' && analytics?.rewardAnalytics && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
                <StatCard icon={<Gift size={24} />} value={analytics.rewardAnalytics.coinsIssued || 0} label="Coins Distributed" color="primary" />
                <StatCard icon={<Gift size={24} />} value={analytics.rewardAnalytics.badgesAwarded || 0} label="Badges Earned" color="secondary" />
                <StatCard icon={<TrendingUp size={24} />} value={analytics.rewardAnalytics.activeClaimers || 0} label="Active Claimers" color="success" />
              </div>

              {forecast && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
                  <ForecastCard
                    title="Redemption Forecast"
                    {...forecast.redemption}
                    icon={Gift}
                    color="var(--color-warning)"
                  />
                  <ForecastCard
                    title="Coin Supply Forecast"
                    {...forecast.coinDistribution}
                    icon={Award}
                    color="var(--color-primary)"
                  />
                </div>
              )}
            </div>
          )}

          {/* LEADERBOARD TAB */}
          {activeTab === 'leaderboard' && analytics?.leaderboard && (
            <ChartCard title="Platform Top Volunteers">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {analytics.leaderboard.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: 'var(--color-bg)', borderRadius: '8px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--color-primary)', width: '20px' }}>#{idx + 1}</span>
                      <span style={{ fontWeight: 600 }}>{item.name}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>{item.points} pts</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}

          {/* ORGANIZATIONS TAB */}
          {activeTab === 'organizations' && analytics?.organizationAnalytics && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                <StatCard icon={<Building2 size={24} />} value={analytics.organizationAnalytics.totalOrgs || 0} label="Total Organizations" color="primary" />
                <StatCard icon={<Building2 size={24} />} value={analytics.organizationAnalytics.activeOrgs || 0} label="Active Partners" color="success" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminInsights;
