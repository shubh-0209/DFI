import React, { useState, useCallback } from 'react';
import { Check, CheckCheck, Pin, PinOff, Edit3, Trash2, RefreshCcw, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MessageBubble = React.memo(({ message, isOwn, onPin, onUnpin, onDelete, onEdit, isPinned, onRetry, extraActions }) => {
  const [showActions, setShowActions] = useState(false);
  const isFailed = message.status === 'failed';

  const formatTime = useCallback((dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  const handlePinClick = useCallback(() => {
    if (isPinned) {
      onUnpin?.(message._id);
    } else {
      onPin?.(message._id);
    }
  }, [isPinned, onPin, onUnpin, message._id]);

  const handleEditClick = useCallback(() => {
    onEdit?.(message);
  }, [onEdit, message]);

  const handleDeleteClick = useCallback(() => {
    onDelete?.(message._id);
  }, [onDelete, message._id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex',
        flexDirection: isOwn ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: '0.5rem',
        marginBottom: '0.75rem',
        position: 'relative' }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      role="listitem"
      aria-label={`${isOwn ? 'You' : message.senderId?.name || 'Unknown'}: ${message.content || 'Attachment'}${isFailed ? ' (failed)' : ''}`}
    >
      <div
        style={{
          maxWidth: '70%',
          padding: '0.75rem 1rem',
          borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          backgroundColor: isFailed ? '#FEE2E2' : isOwn ? 'var(--primary-blue)' : '#F3F4F6',
          color: isFailed ? '#991B1B' : isOwn ? 'white' : '#1F2937',
          position: 'relative',
          wordBreak: 'break-word',
          boxShadow: isFailed ? '0 0 0 1px rgba(220,38,38,0.25)' : isOwn ? '0 2px 8px rgba(211,84,0,0.15)' : '0 1px 3px rgba(0,0,0,0.05)' }}
      >
        {!isOwn && !isFailed && (
          <div style={{ marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
            {message.senderId?.name || 'Unknown'}
          </div>
        )}

        {isFailed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Failed to send
          </div>
        )}

        {message.content && <p style={{ margin: 0 }}>{message.content}</p>}

        {message.attachments?.length > 0 && !isFailed && (
          <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {message.attachments.map((att, idx) => (
              <a
                key={idx}
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: isOwn ? '#FEF3C7' : 'var(--primary-blue)',
                  textDecoration: 'underline' }}
              >
                {att.type === 'image' ? '🖼️' : '📎'} {att.name}
              </a>
            ))}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            marginTop: '0.25rem',
            justifyContent: isOwn ? 'flex-end' : 'flex-start',
            opacity: 0.7,
            flexWrap: 'wrap' }}
        >
          <span >{formatTime(message.createdAt)}</span>
          {message.isEdited && <span style={{ opacity: 0.8 }}>(edited)</span>}
          {isOwn && !isFailed && <span >{message.status === 'sending' ? <Clock size={12} /> : message.status === 'read' ? <CheckCheck size={12} color="#60A5FA" /> : message.status === 'delivered' ? <CheckCheck size={12} /> : <Check size={12} />}</span>}
        </div>
      </div>

      <AnimatePresence>
        {showActions && !isFailed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              display: 'flex',
              gap: '0.25rem',
              backgroundColor: 'white',
              borderRadius: 8,
              padding: '0.25rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              position: 'absolute',
              top: -32,
              ...(isOwn ? { right: 0 } : { left: 0 }),
              zIndex: 10 }}
          >
            <button
              onClick={handlePinClick}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                color: '#4A5568' }}
              aria-label={isPinned ? 'Unpin message' : 'Pin message'}
            >
              {isPinned ? <PinOff size={14} /> : <Pin size={14} />}
            </button>
            {isOwn && (
              <>
                <button
                  onClick={handleEditClick}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    color: '#4A5568' }}
                  aria-label="Edit message"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={handleDeleteClick}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    color: '#E74C3C' }}
                  aria-label="Delete message"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isFailed && showActions && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            display: 'flex',
            gap: '0.25rem',
            backgroundColor: 'white',
            borderRadius: 8,
            padding: '0.25rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            position: 'absolute',
            top: -32,
            right: 0,
            zIndex: 10 }}
        >
          <button
            onClick={onRetry}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              color: 'var(--primary-blue)' }}
            aria-label="Retry sending message"
          >
            <RefreshCcw size={14} />
          </button>
          <button
            onClick={handleDeleteClick}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              color: '#E74C3C' }}
            aria-label="Delete message"
          >
            <Trash2 size={14} />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
});

MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;
