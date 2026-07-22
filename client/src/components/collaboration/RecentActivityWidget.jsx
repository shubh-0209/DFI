import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, ExternalLink } from 'lucide-react';

const RecentActivityWidget = ({ activities = [], loading }) => {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card"
        style={{ padding: '1.5rem' }}
      >
        <h3 style={{ marginBottom: '1rem', color: 'var(--color-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} aria-hidden="true" /> Recent Collaboration Activity
        </h3>
        {[1, 2, 3].map(i => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            style={{ padding: '0.75rem 0', borderBottom: i < 3 ? '1px solid var(--color-border)' : 'none' }}
          >
            <div className="skeleton" style={{ height: '14px', width: '80%', borderRadius: 4, marginBottom: '0.5rem' }} />
            <div className="skeleton" style={{ height: '12px', width: '40%', borderRadius: 4 }} />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card"
        style={{ padding: '1.5rem' }}
      >
        <h3 style={{ marginBottom: '1rem', color: 'var(--color-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} aria-hidden="true" /> Recent Collaboration Activity
        </h3>
        <div style={{
          textAlign: 'center',
          padding: '2rem 1rem',
          color: 'var(--color-body)' }}>
          <Activity size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} aria-hidden="true" />
          <p >No recent activity in your workspaces.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card"
      style={{ padding: '1.5rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ color: 'var(--color-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Activity size={18} aria-hidden="true" /> Recent Collaboration Activity
        </h3>
        <Link
          to="/collaboration/workspaces"
          style={{
            color: 'var(--color-primary)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            transition: 'var(--transition-fast)' }}
        >
          View All <ExternalLink size={14} aria-hidden="true" />
        </Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {activities.slice(0, 5).map((activity, idx) => (
          <motion.div
            key={activity._id || idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg)',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
              transition: 'var(--transition-fast)' }}
            whileHover={{ scale: 1.01 }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(211, 84, 0, 0.1)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0 }}>
              <Activity size={14} aria-hidden="true" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                color: 'var(--color-heading)',
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis' }}>
                {activity.action}
              </p>
              <div style={{
                color: 'var(--color-body)',
                marginTop: '0.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem' }}>
                <span style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '120px' }}>
                  {activity.workspaceName}
                </span>
                <span style={{ whiteSpace: 'nowrap' }}>
                  {new Date(activity.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentActivityWidget;
