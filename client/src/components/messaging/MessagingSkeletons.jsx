import React from 'react';
import { motion } from 'framer-motion';

const MessageSkeletonLine = ({ width = '100%', height = 12, radius = 6 }) => (
  <motion.div
    className="skeleton"
    animate={{ opacity: [0.4, 0.8, 0.4] }}
    transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
    style={{
      width,
      height,
      borderRadius: radius,
      backgroundColor: 'var(--color-border)' }}
  />
);

const ConversationSkeleton = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', marginBottom: '0.5rem' }}>
    <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'var(--color-border)', flexShrink: 0 }} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <MessageSkeletonLine width="60%" height={10} />
      <MessageSkeletonLine width="90%" height={10} />
    </div>
  </div>
);

const MessageBubbleSkeleton = ({ isOwn = false }) => (
  <div style={{ display: 'flex', flexDirection: isOwn ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: '0.5rem', marginBottom: '0.75rem' }}>
    <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'var(--color-border)', flexShrink: 0 }} />
    <div style={{ maxWidth: '70%', padding: '0.75rem 1rem', borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px', backgroundColor: 'var(--color-border)' }}>
      <MessageSkeletonLine width="100%" height={10} />
      <MessageSkeletonLine width="70%" height={10} />
    </div>
  </div>
);

const MessagingSkeletons = ({ type = 'conversation', count = 5 }) => {
  if (type === 'message') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {Array.from({ length: count }).map((_, idx) => (
          <MessageBubbleSkeleton key={idx} isOwn={idx % 2 === 0} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <ConversationSkeleton key={idx} />
      ))}
    </div>
  );
};

const ErrorState = ({ message = 'Something went wrong', onRetry, retryLabel = 'Retry' }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      textAlign: 'center',
      gap: '0.75rem' }}
    role="alert"
  >
    <div style={{
      width: 48,
      height: 48,
      borderRadius: '50%',
      backgroundColor: '#FEE2E2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '0.5rem' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <h4 style={{ margin: 0, color: 'var(--color-heading)' }}>{message}</h4>
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          marginTop: '0.5rem',
          padding: '0.5rem 1.25rem',
          borderRadius: 8,
          border: 'none',
          backgroundColor: 'var(--primary-blue)',
          color: 'white',
          cursor: 'pointer' }}
      >
        {retryLabel}
      </button>
    )}
  </motion.div>
);

export { MessagingSkeletons, ConversationSkeleton, MessageBubbleSkeleton, MessageSkeletonLine, ErrorState };
export default MessagingSkeletons;
