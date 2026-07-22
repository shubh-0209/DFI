import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCheck, ChevronLeft, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationCard from '../../components/notifications/NotificationCard';
import NotificationSkeleton from '../../components/notifications/NotificationSkeleton';
import NotificationEmptyState from '../../components/notifications/NotificationEmptyState';
import NotificationFilters from '../../components/notifications/NotificationFilters';
import {
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../../services/notificationsService';
import { useAuth } from '../../context/AuthContext';
import '../../components/notifications/NotificationResponsive.css';

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest First', dir: 'desc' },
  { value: 'createdAt', label: 'Oldest First', dir: 'asc' },
];

const NotificationCenter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [readStatus, setReadStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [error, setError] = useState(null);

  const params = useMemo(() => {
    const p = { page: 1, limit: 20, sortBy };
    if (category) p.category = category;
    if (priority) p.priority = priority;
    if (readStatus !== '') p.isRead = readStatus;
    return p;
  }, [category, priority, readStatus, sortBy]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['notifications', { category, priority, readStatus, sortBy, search }],
    queryFn: async () => {
      setError(null);
      const queries = [
        getNotifications(params),
      ];
      const [res] = await Promise.all(queries);
      if (res.success) return res.data?.notifications || [];
      throw new Error(res.message || 'Failed to load notifications');
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const notifications = data || [];

  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });

  const handleMarkRead = (id) => markReadMutation.mutate(id);
  const handleMarkAllRead = () => markAllMutation.mutate();
  const handleDelete = (id) => deleteMutation.mutate(id);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setPriority('');
    setReadStatus('');
    setSortBy('createdAt');
  };

  if (isLoading) {
    return (
      <div className="notif-page-container" style={{ padding: '0.5rem 0 3rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div className="skeleton" style={{ height: 36, width: 240, borderRadius: 8, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 20, width: 380, borderRadius: 8 }} />
        </div>
        <NotificationSkeleton count={8} />
      </div>
    );
  }

  return (
    <div className="notif-page-container" style={{ padding: '0.5rem 0 3rem' }}>
      {/* ── Header ───────────────────────────────────────────────── */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h1 className="page-title notif-heading" style={{ color: 'var(--color-heading)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={24} style={{ color: 'var(--color-primary)' }} />
              Notifications
            </h1>
            <p className="page-description notif-subheading" style={{ color: 'var(--color-body)', margin: '0.3rem 0 0' }}>
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'You are all caught up!'}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              className="btn btn-primary notif-mark-read-btn"
              onClick={handleMarkAllRead}
              disabled={markAllMutation.isPending}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '0.5rem 1rem',
                opacity: markAllMutation.isPending ? 0.7 : 1 }}
            >
              <CheckCheck size={16} /> Mark all read
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <NotificationFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          priority={priority}
          onPriorityChange={setPriority}
          readStatus={readStatus}
          onReadStatusChange={setReadStatus}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onClear={handleClearFilters}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(category || priority || readStatus || search) && (
            <span style={{ color: 'var(--color-body)' }}>
              Filters active — {notifications.length} result{notifications.length !== 1 ? 's' : ''}
            </span>
          )}
          {error && (
            <span style={{ marginLeft: 'auto', color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertCircle size={14} /> {error}
            </span>
          )}
        </div>

        {!isLoading && notifications.length === 0 && !error && (
          <NotificationEmptyState
            message="No notifications found"
            description="Try adjusting your filters or check back later."
          />
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
          gap: '1.25rem' }}>
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
              onClick={() => {
                if (!notification.isRead) handleMarkRead(notification.id);
                if (notification.actionUrl) navigate(notification.actionUrl);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
