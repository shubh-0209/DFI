import React from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle2, Coins, Award, Gift, FileText, Clock } from 'lucide-react';

const activityConfig = {
  contribution_approved: { icon: <CheckCircle2 size={16} color="#059669" />, label: 'Contribution Approved', color: '#059669', bg: '#D1FAE5' },
  coins_awarded: { icon: <Coins size={16} color="var(--primary-blue)" />, label: 'Coins Awarded', color: 'var(--primary-blue)', bg: '#FFF3ED' },
  badge_earned: { icon: <Award size={16} color="#D97706" />, label: 'Badge Earned', color: '#D97706', bg: '#FEF3C7' },
  certificate_issued: { icon: <FileText size={16} color="#2563eb" />, label: 'Certificate Issued', color: '#2563eb', bg: '#DBEAFE' },
  reward_redeemed: { icon: <Gift size={16} color="#BE185D" />, label: 'Reward Redeemed', color: '#BE185D', bg: '#FCE7F3' },
  attendance: { icon: <Clock size={16} color="var(--primary-blue)" />, label: 'Attendance Marked', color: 'var(--primary-blue)', bg: '#EDE9FE' },
};

const RecentActivity = ({ activities }) => {
  const items = activities || [];

  if (!items.length) {
    return (
      <div style={{ background: 'white', borderRadius: 20, padding: '2rem', border: '1px solid #F0EDE8', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '0.75rem' }}>📋</div>
        <h3 style={{ color: 'var(--color-heading)', margin: '0 0 0.5rem 0' }}>No Recent Activity</h3>
        <p style={{ color: 'var(--color-body)', margin: 0 }}>Your activity timeline will appear here as you contribute.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: 'white', borderRadius: 20, padding: '2rem', border: '1px solid #F0EDE8', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: '2rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: '#EEF2FF', color: '#4338CA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Activity size={20} />
        </div>
        <h3 style={{ margin: 0, color: 'var(--color-heading)' }}>Recent Activity</h3>
      </div>
      <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
        <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 2, background: '#E5E7EB' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.slice(0, 8).map((activity, i) => {
            const key = activity._id || activity.activityId || i;
            const type = activity.type || activity.activityType || '';
            const config = activityConfig[type] || activityConfig.contribution_approved;
            const title = activity.title || activity.description || config.label;
            const timestamp = activity.createdAt || activity.timestamp;
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ position: 'relative', display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}
              >
                <div style={{ position: 'absolute', left: '-1.35rem', top: 4, width: 12, height: 12, borderRadius: '50%', background: config.color, border: '2px solid white', boxShadow: '0 0 0 2px ' + config.color, zIndex: 2 }} />
                <div style={{ flex: 1, background: '#FAFAF8', borderRadius: 10, padding: '0.75rem 1rem', border: '1px solid #F0EDE8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ width: 22, height: 22, borderRadius: 6, background: config.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      {config.icon}
                    </span>
                    <span style={{ color: 'var(--color-heading)' }}>{title}</span>
                  </div>
                  {timestamp && (
                    <span style={{ color: 'var(--color-body)', marginLeft: '1.75rem' }}>
                      {new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default RecentActivity;
