import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatMonthYear = (item) => {
  if (!item) return '';
  return `${MONTH_NAMES[item.month] || ''} ${item.year || ''}`.trim();
};

const ForecastTrendChart = ({ historicalData = [], predictions = [], dataKey = 'count', title = 'Trend & Forecast', color = 'var(--color-primary)' }) => {
  const chartData = useMemo(() => {
    const history = historicalData.map(item => ({
      ...item,
      label: formatMonthYear(item) || `${item.month}/${item.year}`,
      actual: item[dataKey] ?? item.total ?? item.active ?? 0,
      forecast: null,
    }));

    const forecast = predictions.map((pred, index) => {
      const d = new Date();
      d.setMonth(d.getMonth() + index + 1);
      return {
        year: d.getFullYear(),
        month: d.getMonth(),
        label: `${MONTH_NAMES[d.getMonth()] || ''} ${d.getFullYear()}`.trim(),
        actual: null,
        forecast: pred,
      };
    });

    return [...history, ...forecast];
  }, [historicalData, predictions, dataKey]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="card" style={{ padding: '1.5rem', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-body)' }}>
        No data available
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0, color: 'var(--color-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: color,
            display: 'inline-block' }} />
          {title}
        </h3>
        <span style={{ color: 'var(--color-body)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '12px', height: '3px', borderRadius: '2px', background: color, display: 'inline-block' }} />
          Actual
          <span style={{ width: '12px', height: '3px', borderRadius: '2px', background: 'var(--color-accent)', display: 'inline-block', marginLeft: '0.5rem' }} />
          Forecast
        </span>
      </div>
      <div style={{ padding: '1rem' }}>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`forecast-gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
              <linearGradient id={`forecast-line-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-body)' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-body)' }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div style={{
                      backgroundColor: 'var(--color-card)',
                      padding: '0.75rem 1rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: 'var(--shadow-md)' }}>
                      <div style={{ color: 'var(--color-heading)', marginBottom: '0.35rem' }}>{label}</div>
                      {payload.map((entry, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '0.2rem' }}>
                          <span style={{ color: entry.color }}>{entry.name}</span>
                          <span style={{ color: 'var(--color-heading)' }}>{entry.value?.toLocaleString?.() ?? entry.value}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="actual"
              stroke={color}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#forecast-gradient-forecast)"
              dot={{ r: 3, strokeWidth: 2, fill: 'var(--color-card)' }}
              activeDot={{ r: 5, strokeWidth: 0, fill: color }}
              name="Actual"
            />
            <Area
              type="monotone"
              dataKey="forecast"
              stroke="var(--color-accent)"
              strokeWidth={2.5}
              strokeDasharray="6 3"
              fillOpacity={0.15}
              fill="url(#forecast-line-forecast)"
              dot={{ r: 3, strokeWidth: 2, fill: 'var(--color-card)' }}
              activeDot={{ r: 5, strokeWidth: 0, fill: 'var(--color-accent)' }}
              name="Forecast"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ForecastTrendChart;
