import React from 'react';
import { motion } from 'framer-motion';
import { Activity, FileText, Users, CheckCircle, Upload } from 'lucide-react';

const ActivityFeed = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          color: 'var(--color-body)',
          background: 'var(--color-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px dashed var(--color-border)' }}
      >
        <Activity size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} aria-hidden="true" />
        <p >No activity yet</p>
        <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>Activities will appear here as you collaborate</p>
      </motion.div>
    );
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'note_added': return <FileText size={16} aria-hidden="true" />;
      case 'file_added': return <Upload size={16} aria-hidden="true" />;
      case 'task_assigned':
      case 'task_updated': return <CheckCircle size={16} aria-hidden="true" />;
      case 'join':
      case 'leave':
      case 'invitation_sent':
      case 'invitation_accepted':
      case 'invitation_declined':
      case 'join_request_submitted':
      case 'join_request_approved':
      case 'join_request_declined':
      case 'role_updated': return <Users size={16} aria-hidden="true" />;
      default: return <Activity size={16} aria-hidden="true" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'note_added': return 'var(--color-primary)';
      case 'file_added': return 'var(--color-info)';
      case 'task_assigned':
      case 'task_updated': return 'var(--color-secondary)';
      case 'join':
      case 'join_request_approved': return 'var(--color-success)';
      case 'leave':
      case 'join_request_declined':
      case 'invitation_declined': return 'var(--color-error)';
      case 'invitation_sent':
      case 'invitation_accepted':
      case 'join_request_submitted': return 'var(--color-accent)';
      case 'role_updated': return 'var(--color-purple)';
      default: return 'var(--color-body)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {activities.map((activity, idx) => {
        const iconColor = getActivityColor(activity.metadata?.type);
        return (
          <motion.div
            key={activity._id || idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            style={{
              display: 'flex',
              gap: '1rem',
              padding: '1rem 0',
              borderBottom: idx < activities.length - 1 ? '1px solid var(--color-border)' : 'none' }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: `${iconColor}15`,
              color: iconColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: `2px solid ${iconColor}25` }}>
              {getActivityIcon(activity.metadata?.type)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                color: 'var(--color-heading)',
                margin: 0 }}>
                {activity.action}
              </p>
              <div style={{
                color: 'var(--color-body)',
                marginTop: '0.35rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem' }}>
                <span style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: iconColor,
                  flexShrink: 0 }} />
                {new Date(activity.createdAt).toLocaleString()}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ActivityFeed;
