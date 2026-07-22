import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, ExternalLink, Tag, Calendar } from 'lucide-react';

const categoryStyles = {
  application: { bg: '#EFF6FF', color: '#2563EB', icon: '📋' },
  program: { bg: '#FDF2F8', color: '#DB2777', icon: '📅' },
  attendance: { bg: '#ECFDF5', color: '#059669', icon: '✓' },
  certificate: { bg: '#FFFBEB', color: '#D97706', icon: '🏆' },
  reward: { bg: '#F5F3FF', color: 'var(--primary-blue)', icon: '🎁' },
  leaderboard: { bg: '#FFF7ED', color: '#EA580C', icon: '🏅' },
  announcement: { bg: '#F8FAFC', color: '#475569', icon: '📢' },
  security: { bg: '#FEF2F2', color: '#DC2626', icon: '🔒' },
  account: { bg: '#F0FDF4', color: '#16A34A', icon: '👤' },
  system: { bg: '#F1F5F9', color: '#64748B', icon: '⚙' },
  message: { bg: '#EFF6FF', color: '#3B82F6', icon: '💬' },
};

const priorityBorder = {
  low: '#94A3B8',
  medium: '#F59E0B',
  high: 'var(--primary-blue)',
  critical: '#EF4444',
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diff = (now - date) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const NotificationCard = React.memo(({
  notification,
  onMarkRead,
  onDelete,
  onClick,
  showActions = true,
  compact = false,
}) => {
  const category = useMemo(() => categoryStyles[notification.category] || categoryStyles.announcement, [notification.category]);
  const isUnread = !notification.isRead;
  const border = priorityBorder[notification.priority] || priorityBorder.medium;

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  }, [onClick]);

  const handleMarkRead = useCallback((e) => {
    e.stopPropagation();
    onMarkRead?.(notification.id);
  }, [onMarkRead, notification.id]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    onDelete?.(notification.id);
  }, [onDelete, notification.id]);

  if (!notification) return null;

  return (
    <motion.div
      className={`notif-card ${compact ? 'notif-card-compact' : ''}`}
      role="article"
      aria-label={`${isUnread ? 'Unread' : 'Read'} notification: ${notification.title}`}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!notification.isDeleted ? { y: -3, boxShadow: '0 10px 28px rgba(0,0,0,0.09)' } : undefined}
      whileTap={!notification.isDeleted ? { scale: 0.985 } : undefined}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 16,
        backgroundColor: isUnread ? '#FFFDF5' : 'var(--color-card)',
        borderLeft: `4px solid ${border}`,
        border: `1px solid ${isUnread ? '#FDE68A' : 'var(--color-border)'}`,
        overflow: 'hidden',
        cursor: notification.isDeleted ? 'not-allowed' : 'pointer',
        opacity: notification.isDeleted ? 0.6 : 1,
        outline: 'none' }}
      onFocus={(e)  => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--color-primary)'; }}
      onBlur={(e)   => { e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* ── Body ─────────────────────────────────────────────────── */}
      <div style={{
        padding: compact ? '0.625rem 0.875rem' : '1.125rem 1.125rem 0.875rem',
        display: 'flex', flexDirection: 'column', gap: compact ? '0.35rem' : '0.7rem', flex: 1 }}>

        {/* Badges row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {/* Category */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            padding: compact ? '0.2rem 0.5rem' : '0.22rem 0.6rem', borderRadius: 999,
            background: category.bg, color: category.color,
            fontSize: compact ? '0.7rem' : '0.75rem',
            textTransform: 'capitalize' }}>
            <Tag size={10} aria-hidden="true" />
            {category.icon} {notification.category}
          </span>

          {/* Unread dot */}
          {isUnread && (
            <span
              aria-label="Unread"
              style={{
                marginLeft: 'auto', flexShrink: 0,
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--color-primary)' }}
            />
          )}
        </div>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          <h3 className="notif-title-wrap" style={{
            color: 'var(--color-heading)', margin: 0,
            fontSize: compact ? '0.9375rem' : '1.125rem',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {notification.title}
          </h3>
          {notification.actionUrl && (
            <ExternalLink size={14} style={{ color: 'var(--color-body)', flexShrink: 0, marginTop: compact ? 2 : 4 }} aria-hidden="true" />
          )}
        </div>

        {/* Message excerpt */}
        {!compact && (
          <p className="notif-message-wrap" style={{ color: 'var(--color-body)',
            margin: 0, flex: 1,
            fontSize: '0.875rem',
            display: '-webkit-box', WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {notification.message}
          </p>
        )}
      </div>

      {/* ── Footer ───────────────────────────────────────────────── */}
      {!compact && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.6rem 1.125rem',
          borderTop: '1px solid var(--color-border)', color: '#94A3B8', gap: '0.5rem', flexWrap: 'wrap',
          background: 'var(--color-bg)' }}>
          
          <time
            dateTime={notification.createdAt || notification.sentAt}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8125rem' }}
          >
            <Calendar size={10} aria-hidden="true" />
            {formatTime(notification.createdAt || notification.sentAt)}
          </time>

          {showActions && !notification.isDeleted && (
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {isUnread && (
                <button
                  onClick={handleMarkRead}
                  title="Mark as read"
                  className="btn btn-secondary"
                  style={{ padding: '0.2rem 0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
                >
                  <Check size={12} /> Read
                </button>
              )}
              <button
                onClick={handleDelete}
                title="Delete"
                className="btn btn-danger"
                style={{ padding: '0.2rem 0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
});

NotificationCard.displayName = 'NotificationCard';

export default NotificationCard;
