import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AttendanceChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-body)' }}>No attendance data available</p>
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
          <p style={{ margin: 0, color: 'var(--color-heading)', marginBottom: '0.75rem' }}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '0.25rem' }}>
              <span style={{ color: entry.color, textTransform: 'capitalize' }}>{entry.name}</span>
              <span style={{ color: 'var(--color-heading)' }}>{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-body)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: entry.color }} />
            <span style={{ textTransform: 'capitalize' }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Attendance Overview</h3>
      
      <div style={{ flex: 1, minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-body)' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-body)' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37, 99, 235, 0.05)' }} />
            <Legend content={renderLegend} />
            <Bar dataKey="present" name="Present" fill="var(--color-success)" radius={[4, 4, 0, 0]} maxBarSize={30} />
            <Bar dataKey="absent" name="Absent" fill="var(--color-error)" radius={[4, 4, 0, 0]} maxBarSize={30} />
            <Bar dataKey="late" name="Late" fill="var(--color-accent)" radius={[4, 4, 0, 0]} maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceChart;
