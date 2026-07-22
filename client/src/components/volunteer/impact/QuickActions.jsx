import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Wallet, Briefcase, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  const actions = [
    { label: 'Submit Contribution', icon: <FileText size={18} />, path: '/contributions/new', color: '#2563eb', bg: '#DBEAFE' },
    { label: 'Browse Contribution Hub', icon: <Briefcase size={18} />, path: '/contributions', color: '#7c3aed', bg: '#F3E8FF' },
    { label: 'Open Wallet', icon: <Wallet size={18} />, path: '/marketplace', color: '#D35400', bg: '#FFF3ED' },
    { label: 'Open Portfolio', icon: <FileText size={18} />, path: '/my-contributions', color: '#059669', bg: '#D1FAE5' },
    { label: 'View Certificates', icon: <Award size={18} />, path: '/certificates', color: '#D97706', bg: '#FEF3C7' },
    { label: 'Leaderboard', icon: <Award size={18} />, path: '/leaderboard', color: '#4338CA', bg: '#EEF2FF' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: 'white', borderRadius: 20, padding: '2rem', border: '1px solid #F0EDE8', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: '2rem' }}
    >
      <h3 style={{ color: 'var(--color-heading)', margin: '0 0 1.25rem 0' }}>Quick Actions</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
        {actions.map((action, i) => (
          <Link
            key={action.label}
            to={action.path}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
              padding: '1.25rem 1rem', borderRadius: 14, background: action.bg,
              color: action.color, textDecoration: 'none',
              border: `1px solid ${action.color}20`, transition: 'all 0.25s', textAlign: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            {action.icon}
            {action.label}
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;
