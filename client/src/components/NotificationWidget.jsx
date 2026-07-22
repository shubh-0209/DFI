import React from 'react';
import { Bell, Clock } from 'lucide-react';

const NotificationWidget = ({ notifications, loading, emptyMessage }) => {
  if (loading) {
    return (
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Bell size={18} className="text-primary" />
          <h3 style={{ margin: 0 }}>Recent Notifications</h3>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton" style={{ height: '60px', marginBottom: '0.5rem', borderRadius: '8px' }} />
        ))}
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <Bell size={32} style={{ margin: '0 auto 0.75rem', color: '#D1D5DB' }} />
        <p style={{ color: 'var(--color-body)' }}>
          {emptyMessage || 'No notifications yet. Check back later!'}
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Bell size={18} className="text-primary" />
        <h3 style={{ margin: 0 }}>Recent Notifications</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {notifications.slice(0, 5).map((notification, index) => (
          <div key={index} style={{
            padding: '0.75rem',
            borderLeft: '3px solid var(--color-primary)',
            backgroundColor: notification.read ? '#F9FAFB' : '#FEF3C7',
            borderRadius: '0 8px 8px 0' }}>
            <div style={{ marginBottom: '0.25rem' }}>
              {notification.title}
            </div>
            <div style={{ color: 'var(--color-body)' }}>
              {notification.message}
            </div>
            <div style={{ color: '#9CA3AF', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={12} />
              {new Date(notification.createdAt || notification.sentAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationWidget;