import React, { useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCheck, ChevronRight, AlertCircle, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationSkeleton from './NotificationSkeleton';
import NotificationEmptyState from './NotificationEmptyState';
import './notificationDropdown.css';

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

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const drawerVariants = {
  hidden: { x: '100%', opacity: 0.8 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { x: '100%', opacity: 0.8, transition: { duration: 0.2 } },
};

const NotificationDrawer = React.memo(({
  open,
  onClose,
  notifications = [],
  unreadCount = 0,
  loading = false,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  onViewAll,
  error,
}) => {
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement;
      closeButtonRef.current?.focus();
    } else {
      previousFocusRef.current?.focus?.();
    }
  }, [open]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose?.();
    }
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  const hasNotifications = useMemo(() => notifications?.length > 0, [notifications?.length]);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15,23,42,0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 190
            }}
            aria-hidden="true"
          />

          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Notifications drawer"
            className="notif-dropdown-drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="notif-dropdown-header">
              <div className="notif-dropdown-title-group">
                <h3 className="notif-dropdown-title">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="notif-dropdown-unread">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <div className="notif-dropdown-actions">
                {unreadCount > 0 && onMarkAllRead && (
                  <button
                    onClick={onMarkAllRead}
                    title="Mark all as read"
                    aria-label="Mark all notifications as read"
                    className="notif-read-all-btn"
                  >
                    <CheckCheck size={14} aria-hidden="true" /> Read all
                  </button>
                )}
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  aria-label="Close notifications drawer"
                  className="notif-close-btn"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="notif-dropdown-body" role="list" aria-label="Notifications list">
              {error && (
                <div style={{
                  padding: '1rem',
                  borderRadius: 10,
                  backgroundColor: '#FEE2E2',
                  color: '#991B1B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }} role="alert">
                  <AlertCircle size={16} aria-hidden="true" />
                  {error}
                </div>
              )}

              {loading && <NotificationSkeleton count={5} compact />}

              {!loading && !error && !hasNotifications && (
                <NotificationEmptyState message="No notifications yet" description="You're all caught up!" />
              )}

              {!loading && notifications?.map((notification) => {
                const category = categoryStyles[notification.category] || categoryStyles.announcement;
                const isUnread = !notification.isRead;
                const border = priorityBorder[notification.priority] || priorityBorder.medium;

                return (
                  <motion.div
                    key={notification.id}
                    className="notif-dropdown-card"
                    role="article"
                    aria-label={`${isUnread ? 'Unread' : 'Read'} notification: ${notification.title}`}
                    tabIndex={0}
                    onClick={() => {
                      onClose();
                      if (!notification.isRead) onMarkRead?.(notification.id);
                      navigate('/notifications');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClose();
                        if (!notification.isRead) onMarkRead?.(notification.id);
                        navigate('/notifications');
                      }
                    }}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={!notification.isDeleted ? { y: -2, boxShadow: '0 6px 16px rgba(0,0,0,0.06)' } : undefined}
                    whileTap={!notification.isDeleted ? { scale: 0.985 } : undefined}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{
                      backgroundColor: isUnread ? '#FFFDF5' : 'var(--color-card)',
                      borderLeft: `3px solid ${border}`,
                      border: `1px solid ${isUnread ? '#FDE68A' : 'var(--color-border)'}`,
                      cursor: notification.isDeleted ? 'not-allowed' : 'pointer',
                      opacity: notification.isDeleted ? 0.6 : 1,
                    }}
                  >
                    <div className="notif-card-body">
                      <div className="notif-card-badge-row">
                        <span className="notif-card-category" style={{ background: category.bg, color: category.color }}>
                          <Tag size={10} aria-hidden="true" />
                          {category.icon} {notification.category}
                        </span>
                        {isUnread && (
                          <span aria-label="Unread" className="notif-card-unread-dot" />
                        )}
                      </div>

                      <div className="notif-card-title-row">
                        <h3 className="notif-card-title">
                          {notification.title}
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {hasNotifications && onViewAll && (
              <div className="notif-dropdown-footer">
                <button
                  onClick={onViewAll}
                  aria-label="View all notifications"
                  className="notif-view-all-btn"
                >
                  View All Notifications <ChevronRight size={16} aria-hidden="true" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

NotificationDrawer.displayName = 'NotificationDrawer';

export default NotificationDrawer;

