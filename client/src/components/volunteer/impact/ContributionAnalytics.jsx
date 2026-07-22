import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart as PieIcon, TrendingUp, Clock } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#2563eb', 'var(--primary-blue)', '#059669', 'var(--primary-blue)', '#D97706', '#BE185D', '#0369A1', '#4338CA'];

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatMonthYear = (item) => {
  if (!item) return '';
  return `${MONTH_NAMES[item.month] || ''} ${item.year || ''}`.trim();
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: 'var(--color-card)', padding: '0.75rem 1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ color: 'var(--color-heading)', marginBottom: '0.4rem' }}>{label}</div>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '0.2rem' }}>
            <span style={{ color: entry.color }}>{entry.name}</span>
            <span style={{ color: 'var(--color-heading)' }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const EmptyChartState = ({ height = 220 }) => (
  <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-body)', background: '#FAFAF8', borderRadius: 12 }}>
    No data available
  </div>
);

const CategoryBarChart = ({ data }) => {
  if (!data || data.length === 0) return <EmptyChartState />;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-body)' }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-body)' }} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37,99,235,0.05)' }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const MonthlyLineChart = ({ data, dataKey, label, color = '#2563eb' }) => {
  if (!data || data.length === 0) return <EmptyChartState />;
  const chartData = data.map(item => ({
    ...item,
    label: formatMonthYear(item) || item.month || '',
  }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-body)' }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-body)' }} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} dot={{ r: 3, strokeWidth: 2, fill: 'var(--color-card)' }} activeDot={{ r: 5, strokeWidth: 0, fill: color }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

const ContributionAnalytics = ({ analytics }) => {
  if (!analytics) return null;

  const categories = analytics.categories || analytics.contributionCategories || [];
  const monthlyContributions = analytics.monthlyContributions || analytics.contributionsPerMonth || [];
  const monthlyCoins = analytics.monthlyCoins || analytics.coinsPerMonth || [];
  const monthlyHours = analytics.monthlyHours || analytics.hoursPerMonth || [];
  const statusData = analytics.statusDistribution || [];

  const cardStyle = { background: 'white', borderRadius: 16, padding: '1.5rem', border: '1px solid #F0EDE8', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: '1.5rem' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={cardStyle}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: '#EEF2FF', color: '#4338CA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BarChart3 size={20} />
        </div>
        <div>
          <h3 style={{ margin: 0, color: 'var(--color-heading)' }}>Contribution Analytics</h3>
          <p style={{ color: 'var(--color-body)', margin: 0 }}>Your volunteering journey at a glance</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {categories.length > 0 && (
          <div>
            <h4 style={{ color: 'var(--color-heading)', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: 6 }}>
              <PieIcon size={15} /> Categories
            </h4>
            <CategoryBarChart data={categories} />
          </div>
        )}
        {monthlyContributions.length > 0 && (
          <div>
            <h4 style={{ color: 'var(--color-heading)', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrendingUp size={15} /> Monthly Contributions
            </h4>
            <MonthlyLineChart data={monthlyContributions} dataKey="count" label="Contributions" color="#2563eb" />
          </div>
        )}
        {monthlyCoins.length > 0 && (
          <div>
            <h4 style={{ color: 'var(--color-heading)', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: 6 }}>
              🪙 Coins Per Month
            </h4>
            <MonthlyLineChart data={monthlyCoins} dataKey="coins" label="Coins" color="var(--primary-blue)" />
          </div>
        )}
        {monthlyHours.length > 0 && (
          <div>
            <h4 style={{ color: 'var(--color-heading)', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={15} /> Hours Per Month
            </h4>
            <MonthlyLineChart data={monthlyHours} dataKey="hours" label="Hours" color="var(--primary-blue)" />
          </div>
        )}
        {statusData.length > 0 && (
          <div>
            <h4 style={{ color: 'var(--color-heading)', margin: '0 0 0.75rem 0' }}>Contribution Status</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="45%" outerRadius={70} dataKey="value" label={({ name, percent }) => percent > 0.1 ? `${name} ${(percent * 100).toFixed(0)}%` : ''} labelLine={false}>
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContributionAnalytics;
