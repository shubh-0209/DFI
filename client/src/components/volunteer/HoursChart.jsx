import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HoursChart = ({ data = [], type = 'weekly', title }) => {
  
  if (!data || data.length === 0) {
    return (
      <div className="card" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-body)' }}>No data available for this period</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'var(--color-card)',
          padding: '1rem',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <p style={{ margin: 0, color: 'var(--color-heading)', marginBottom: '0.25rem' }}>{label}</p>
          <p style={{ margin: 0, color: 'var(--color-primary)' }}>
            {payload[0].value} <span style={{ color: 'var(--color-body)' }}>hours</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {title && <h3 style={{ marginBottom: '1.5rem' }}>{title}</h3>}
      
      <div style={{ flex: 1, minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === 'weekly' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-body)' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-body)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="hours" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-body)' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-body)' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37, 99, 235, 0.05)' }} />
              <Bar dataKey="hours" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HoursChart;
