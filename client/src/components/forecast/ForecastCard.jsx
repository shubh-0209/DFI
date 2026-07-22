import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp, Target, Award } from 'lucide-react';

const TREND_CONFIG = {
  up: { color: 'var(--color-success)', icon: <ArrowUpRight size={16} />, label: 'Upward' },
  down: { color: 'var(--color-error)', icon: <ArrowDownRight size={16} />, label: 'Downward' },
  stable: { color: 'var(--color-body)', icon: <Minus size={16} />, label: 'Stable' },
  volatile: { color: 'var(--color-warning)', icon: <TrendingUp size={16} />, label: 'Volatile' },
};

const CONFIDENCE_CONFIG = {
  high: { color: 'var(--color-success)', bg: 'rgba(5,150,105,0.10)', label: 'High' },
  medium: { color: 'var(--color-warning)', bg: 'rgba(217,119,17,0.10)', label: 'Medium' },
  low: { color: 'var(--color-error)', bg: 'rgba(220,38,38,0.10)', label: 'Low' },
};

const ForecastCard = ({ title, currentValue, forecastValue, growth, trend = 'stable', confidence = 'medium', recommendation, icon: Icon, color = 'var(--color-primary)', predictions = [], loading = false }) => {
  const trendInfo = TREND_CONFIG[trend] || TREND_CONFIG.stable;
  const confidenceInfo = CONFIDENCE_CONFIG[confidence] || CONFIDENCE_CONFIG.medium;

  if (loading) {
    return (
      <div className="card" style={{ padding: '1.5rem', minHeight: '200px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-border)', animation: 'pulse 1.5s infinite' }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: '14px', width: '60%', borderRadius: '4px', background: 'var(--color-border)', marginBottom: '0.5rem', animation: 'pulse 1.5s infinite' }} />
            <div style={{ height: '10px', width: '40%', borderRadius: '4px', background: 'var(--color-border)', animation: 'pulse 1.5s infinite' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1, height: '48px', borderRadius: '8px', background: 'var(--color-border)', animation: 'pulse 1.5s infinite' }} />
          <div style={{ flex: 1, height: '48px', borderRadius: '8px', background: 'var(--color-border)', animation: 'pulse 1.5s infinite' }} />
        </div>
        <div style={{ height: '12px', width: '100%', borderRadius: '4px', background: 'var(--color-border)', animation: 'pulse 1.5s infinite' }} />
      </div>
    );
  }

  const isPositiveGrowth = growth >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        borderTop: `3px solid ${color}`,
        height: '100%' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            padding: '0.65rem',
            borderRadius: '10px',
            backgroundColor: `${color}18`,
            color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center' }}>
            {Icon ? <Icon size={22} /> : <Target size={22} />}
          </div>
          <h3 style={{ margin: 0, color: 'var(--color-heading)' }}>{title}</h3>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.6rem',
            borderRadius: '999px',
            backgroundColor: confidenceInfo.bg,
            color: confidenceInfo.color }}>
            <Award size={12} />
            {confidenceInfo.label} confidence
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '0.875rem', borderRadius: '8px', backgroundColor: 'var(--color-bg)' }}>
          <span style={{ color: 'var(--color-body)', textTransform: 'uppercase' }}>
            Current
          </span>
          <div style={{ color: 'var(--color-heading)', marginTop: '0.25rem' }}>
            {typeof currentValue === 'number' ? currentValue.toLocaleString() : currentValue ?? '—'}
          </div>
        </div>
        <div style={{ padding: '0.875rem', borderRadius: '8px', backgroundColor: 'var(--color-bg)' }}>
          <span style={{ color: 'var(--color-body)', textTransform: 'uppercase' }}>
            Forecast
          </span>
          <div style={{ color: 'var(--color-primary)', marginTop: '0.25rem' }}>
            {typeof forecastValue === 'number' ? forecastValue.toLocaleString() : forecastValue ?? '—'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <motion.span
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: trendInfo.color }}
          >
            {trendInfo.icon}
            {isPositiveGrowth ? '+' : ''}{typeof growth === 'number' ? growth.toFixed(1) : '0.0'}%
          </motion.span>
          <span style={{ color: 'var(--color-body)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={13} />
            {trendInfo.label} trend
          </span>
        </div>

        {(predictions && predictions.length > 0) && (
          <div style={{ color: 'var(--color-body)' }}>
            {predictions.length}-month horizon
          </div>
        )}
      </div>

      {recommendation && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '6px',
          backgroundColor: `${color}08`,
          borderLeft: `3px solid ${color}`,
          color: 'var(--color-body)',
          marginTop: '0.25rem' }}>
          <strong style={{ color: 'var(--color-heading)', display: 'block', marginBottom: '0.25rem' }}>Recommendation</strong>
          {recommendation}
        </div>
      )}
    </motion.div>
  );
};

export default ForecastCard;
