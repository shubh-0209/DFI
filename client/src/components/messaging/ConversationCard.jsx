import React from 'react';
import { motion } from 'framer-motion';

const ConversationCard = ({ conversation, isActive, onClick, unreadCount, onlineUsers = [] }) => {
  const otherParticipant = conversation.participants?.find((p) => p._id !== conversation._id) || conversation.participants?.[0];
  const isOnline = onlineUsers.includes(otherParticipant?._id);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.875rem 1rem',
        borderRadius: 12,
        cursor: 'pointer',
        backgroundColor: isActive ? '#FFF3ED' : 'transparent',
        border: isActive ? '1px solid var(--primary-blue)' : '1px solid transparent',
        transition: 'all 0.2s',
        marginBottom: '0.5rem' }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = '#FDFBF7';
          e.currentTarget.style.borderColor = '#E8E3D9';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.borderColor = 'transparent';
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Conversation with ${otherParticipant?.name || 'Unknown'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          backgroundColor: isActive ? 'var(--primary-blue)' : '#E8E3D9',
          color: isActive ? 'white' : '#4A5568',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative' }}
      >
        {otherParticipant?.name?.[0]?.toUpperCase() || '?'}
        {isOnline && (
          <span style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981', border: '2px solid white' }} />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
          <span
            style={{
              color: 'var(--color-heading)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '60%' }}
          >
            {otherParticipant?.name || 'Unknown User'}
          </span>
          {(unreadCount > 0) && (
            <span
              style={{
                backgroundColor: 'var(--primary-blue)',
                color: 'white',
                padding: '0.15rem 0.5rem',
                borderRadius: 999,
                minWidth: 20,
                textAlign: 'center' }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <p
            style={{
              color: 'var(--color-body)',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1 }}
          >
            {conversation.lastMessagePreview || 'No messages yet'}
          </p>
          {isOnline && <span style={{ color: '#10B981' }}>Online</span>}
        </div>
      </div>
    </motion.div>
  );
};

export default ConversationCard;
