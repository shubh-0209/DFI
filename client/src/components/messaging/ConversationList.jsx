import React, { useState, useMemo, useCallback } from 'react';
import { Search, Plus, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConversationCard from './ConversationCard';
import { MessagingSkeletons, ErrorState } from './MessagingSkeletons';

const ConversationList = React.memo(({ conversations = [], activeId, onSelect, onCreateConversation, isLoading, isError, refetch, onlineUserIds = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredConversations = useMemo(() => {
    if (!conversations.length) return [];
    return conversations.filter((conv) => {
      const other = conv.participants?.find((p) => p._id !== conv._id) || conv.participants?.[0];
      const matchesSearch = other?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || conv.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [conversations, searchQuery, filterType]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleFilterChange = useCallback((type) => {
    setFilterType(type);
  }, []);

  const handleRetry = useCallback(() => {
    refetch?.();
  }, [refetch]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', borderRadius: 16, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ margin: 0 }}>Messages</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateConversation}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: 'var(--primary-blue)',
              color: 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer' }}
            aria-label="New Conversation"
          >
            <Plus size={18} />
          </motion.button>
        </div>

        <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem 0.6rem 2.25rem',
              borderRadius: 10,
              border: '1px solid var(--color-border)',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: 'var(--color-bg)',
              color: 'var(--color-heading)' }}
            aria-label="Search conversations"
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }} role="group" aria-label="Conversation type filter">
          {['all', 'private', 'support'].map((type) => (
            <button
              key={type}
              onClick={() => handleFilterChange(type)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: filterType === type ? 'var(--primary-blue)' : '#F3F4F6',
                color: filterType === type ? 'white' : '#4A5568',
                transition: 'all 0.2s' }}
              aria-pressed={filterType === type}
            >
              {type === 'all' ? 'All' : type === 'private' ? 'Private' : 'Support'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0.75rem', background: '#fff' }} role="list" aria-label="Conversation list">
        {isLoading ? (
          <MessagingSkeletons type="conversation" count={5} />
        ) : isError ? (
          <ErrorState message="Failed to load conversations" onRetry={handleRetry} />
        ) : filteredConversations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', padding: '3rem 1rem' }}
          >
            <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
              <Inbox size={28} style={{ color: '#D1D5DB' }} />
            </div>
            <p style={{ color: 'var(--color-heading)', margin: '0 0 0.25rem' }}>No conversations found</p>
            <p style={{ color: 'var(--color-body)', margin: 0 }}>Start a new conversation to begin messaging.</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {filteredConversations.map((conv) => (
              <motion.div
                key={conv._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                role="listitem"
              >
                <ConversationCard
                  conversation={conv}
                  isActive={conv._id === activeId}
                  onClick={() => onSelect(conv)}
                  onlineUsers={onlineUserIds}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
});

ConversationList.displayName = 'ConversationList';

export default ConversationList;
