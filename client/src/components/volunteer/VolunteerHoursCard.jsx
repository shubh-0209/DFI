import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import HoursCounter from './HoursCounter';

const VolunteerHoursCard = ({ period = 'today', hours = 0, trend, icon: Icon }) => {
  const getPeriodLabel = () => {
    switch (period) {
      case 'today': return "Today's Hours";
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      case 'lifetime': return 'Lifetime Hours';
      case 'streak': return 'Current Streak';
      default: return 'Hours';
    }
  };

  const getGradient = () => {
    switch (period) {
      case 'lifetime': return 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(139, 92, 246, 0.1))';
      case 'streak': return 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(239, 68, 68, 0.1))';
      case 'today': return 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))';
      default: return 'var(--color-card)';
    }
  };

  const isGradientBg = period === 'lifetime' || period === 'streak' || period === 'today';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card"
      style={{
        background: getGradient(),
        border: isGradientBg ? '1px solid transparent' : '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
          backgroundColor: isGradientBg ? '#fff' : 'var(--color-bg)',
          color: period === 'streak' ? 'var(--color-accent)' : period === 'lifetime' ? 'var(--color-purple)' : 'var(--color-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isGradientBg ? 'var(--shadow-sm)' : 'none'
        }}>
          {Icon && <Icon size={20} />}
        </div>
        
        {trend && (
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '0.25rem',
            padding: '0.25rem 0.5rem', borderRadius: '99px',
            backgroundColor: trend > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: trend > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
            {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <span style={{ color: 'var(--color-body)', marginBottom: '0.25rem' }}>
          {getPeriodLabel()}
        </span>
        <HoursCounter 
          value={hours} 
          suffix={period === 'streak' ? 'days' : 'hrs'} 
          size={period === 'lifetime' || period === 'streak' ? 'lg' : 'md'} 
        />
      </div>

      {/* Decorative background element */}
      {isGradientBg && (
        <div style={{ 
          position: 'absolute', right: '-20px', bottom: '-20px', 
          opacity: 0.1, transform: 'rotate(-15deg)', pointerEvents: 'none',
          color: period === 'streak' ? 'var(--color-accent)' : period === 'lifetime' ? 'var(--color-purple)' : 'var(--color-primary)'
        }}>
          {Icon && <Icon size={120} />}
        </div>
      )}
    </motion.div>
  );
};

export default VolunteerHoursCard;
