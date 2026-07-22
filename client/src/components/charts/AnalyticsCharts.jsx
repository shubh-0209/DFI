import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = [
  'var(--color-primary)',
  'var(--color-secondary)',
  'var(--color-accent)',
  'var(--color-warning)',
  'var(--color-error)',
  'var(--color-purple)',
  'var(--color-info)',
  'var(--primary-blue)'
];

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatMonthYear = (item) => {
  if (!item) return '';
  return `${MONTH_NAMES[item.month] || ''} ${item.year || ''}`.trim();
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'var(--color-card)',
        padding: '0.875rem 1rem',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        boxShadow: 'var(--shadow-md)' }}>
        <div style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
          {label}
        </div>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.25rem' }}>
            <span style={{ color: entry.color }}>{entry.name}</span>
            <span style={{ color: 'var(--color-heading)' }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const EmptyChartState = ({ height = 250 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-body)' }}
  >
    No data available
  </motion.div>
);

export const LineChartCard = ({ data, dataKey, xAxisKey, height = 250 }) => {
  if (!data || data.length === 0) return <EmptyChartState height={height} />;

  const chartData = data.map(item => ({
    ...item,
    [xAxisKey]: formatMonthYear(item) || item[xAxisKey],
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fill: 'var(--color-body)' }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-body)' }} />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke="var(--color-primary)" 
          strokeWidth={2.5} 
          dot={{ r: 3, strokeWidth: 2, fill: 'var(--color-card)' }} 
          activeDot={{ r: 5, strokeWidth: 0, fill: 'var(--color-primary)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const BarChartCard = ({ data, dataKey, xAxisKey, height = 250 }) => {
  if (!data || data.length === 0) return <EmptyChartState height={height} />;

  const chartData = data.map(item => ({
    ...item,
    [xAxisKey]: formatMonthYear(item) || item[xAxisKey] || item[xAxisKey?.replace('year', '')?.replace('month', '')],
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fill: 'var(--color-body)' }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-body)' }} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37, 99, 235, 0.05)' }} />
        <Bar dataKey={dataKey} fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const PieChartCard = ({ data, dataKey, nameKey, height = 250 }) => {
  if (!data || data.length === 0) return <EmptyChartState height={height} />;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          labelLine={false}
          label={({ name, percent }) => percent > 5 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
          outerRadius={85}
          innerRadius={40}
          fill="var(--color-primary)"
          dataKey={dataKey}
          nameKey={nameKey}
          strokeWidth={2}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" iconSize={10} wrapperStyle={{}} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const AreaChartCard = ({ data, dataKey, xAxisKey, height = 250, color = 'var(--color-primary)' }) => {
  if (!data || data.length === 0) return <EmptyChartState height={height} />;

  const chartData = data.map(item => ({
    ...item,
    [xAxisKey]: formatMonthYear(item) || item[xAxisKey],
  }));

  const gradientId = `gradient-${dataKey.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fill: 'var(--color-body)' }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-body)' }} />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          strokeWidth={2.5} 
          fillOpacity={1} 
          fill={`url(#${gradientId})`} 
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const MultiBarChartCard = ({ data, bars, xAxisKey, height = 250 }) => {
  if (!data || data.length === 0) return <EmptyChartState height={height} />;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fill: 'var(--color-body)' }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-body)' }} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
        {bars.map((bar, index) => (
          <Bar key={bar.dataKey} dataKey={bar.dataKey} name={bar.name} fill={bar.color || COLORS[index % COLORS.length]} radius={[4, 4, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

const ChartExport = {
  LineChartCard,
  BarChartCard,
  PieChartCard,
  AreaChartCard,
  MultiBarChartCard,
};

export default ChartExport;