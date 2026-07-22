import React from 'react';
import { Bell } from 'lucide-react';

const NotificationEmptyState = ({ message = 'No notifications yet', description = 'You will see notifications here when they arrive.' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      textAlign: 'center',
      gap: '0.75rem' }}>
      <div className="notif-empty-icon" style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        backgroundColor: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '0.5rem' }}>
        <Bell size={24} style={{ color: '#D1D5DB' }} />
      </div>
      <h4 className="notif-empty-title" style={{
        margin: 0,
        color: 'var(--color-heading)' }}>
        {message}
      </h4>
      <p className="notif-empty-desc" style={{
        margin: 0,
        color: 'var(--color-body)',
        maxWidth: 280 }}>
        {description}
      </p>
    </div>
  );
};

export default NotificationEmptyState;
