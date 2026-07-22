import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { MessageSquare, Plus, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import ConversationList from '../../components/messaging/ConversationList';
import MessageWindow from '../../components/messaging/MessageWindow';
import { getConversations, createConversation } from '../../services/conversationsService';
import { ErrorState } from '../../components/messaging/MessagingSkeletons';
import useSocket from '../../hooks/useSocket';

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();
  const { onUserOnline, onUserOffline, onNewMessage } = useSocket();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleUserOnline = (data) => {
      setOnlineUserIds((prev) => [...new Set([...prev, data.userId])]);
    };

    const handleUserOffline = (data) => {
      setOnlineUserIds((prev) => prev.filter((id) => id !== data.userId));
    };

    const cleanup1 = onUserOnline(handleUserOnline);
    const cleanup2 = onUserOffline(handleUserOffline);

    return () => {
      cleanup1();
      cleanup2();
    };
  }, [onUserOnline, onUserOffline]);

  useEffect(() => {
    const handleNewMessage = (data) => {
      queryClient.setQueryData(['conversations'], (oldData) => {
        if (!oldData?.conversations) return oldData;
        const exists = oldData.conversations.some((c) => c._id === data.conversationId);
        if (!exists) return oldData;

        const updated = oldData.conversations.map((c) => {
          if (c._id === data.conversationId) {
            return {
              ...c,
              lastMessageAt: data.message?.createdAt || c.lastMessageAt,
              lastMessagePreview: data.message?.content || data.message?.attachments?.length
                ? `${data.message.attachments.length} attachment(s)`
                : c.lastMessagePreview,
              unreadCount: c._id !== activeConversation
                ? (c.unreadCount || 0) + 1
                : c.unreadCount,
            };
          }
          return c;
        });

        return {
          ...oldData,
          conversations: updated.sort(
            (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
          ),
        };
      });
    };

    const cleanup = onNewMessage(handleNewMessage);
    return () => cleanup();
  }, [queryClient, activeConversation, onNewMessage]);

  const { data: conversationData, isLoading, isError, refetch } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await getConversations({ page: 1, limit: 50 });
      return res;
    },
    enabled: !loading && !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 30000,
  });

  const conversations = useMemo(() => {
    const list = conversationData?.conversations || [];
    return list.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
  }, [conversationData?.conversations]);

  const createMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: (res) => {
      const conversation = res?.conversation;
      if (conversation) {
        queryClient.setQueryData(['conversations'], (oldData) => {
          const list = oldData?.conversations || [];
          const exists = list.some((c) => c._id === conversation._id);
          if (exists) {
            return { ...oldData, conversations: list };
          }
          return {
            ...oldData,
            conversations: [conversation, ...list],
          };
        });
        setActiveConversation(conversation._id);
        setShowCreateModal(false);
        setSidebarOpen(false);
      }
    },
  });

  const handleSelectConversation = useCallback((conversation) => {
    setActiveConversation(conversation._id);
    setSidebarOpen(false);
  }, []);

  const handleBackToSidebar = useCallback(() => {
    setActiveConversation(null);
    setSidebarOpen(true);
  }, []);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isError && !conversations.length) {
    return (
      <div style={{ padding: '1.5rem', maxWidth: 1400, margin: '0 auto', height: 'calc(100vh - 120px)', minHeight: 600 }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <MessageSquare size={26} color="var(--primary-blue)" />
            Messages
          </h1>
        </div>
        <ErrorState message="Failed to load conversations" onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: 1400, margin: '0 auto', height: 'calc(100vh - 120px)', minHeight: 600 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isMobile && !activeConversation && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#F3F4F6',
                color: '#4A5568',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer' }}
              aria-label="Toggle conversations"
            >
              <Menu size={20} />
            </motion.button>
          )}
          <div>
            <h1 style={{ margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <MessageSquare size={26} color="var(--primary-blue)" />
              Messages
            </h1>
            <p style={{ margin: 0, color: 'var(--color-body)' }}>
              Chat with volunteers, organizations, and support team
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowCreateModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.1rem',
            borderRadius: 10,
            border: 'none',
            backgroundColor: 'var(--primary-blue)',
            color: 'white',
            cursor: 'pointer' }}
        >
          <Plus size={18} /> New Conversation
        </motion.button>
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', height: 'calc(100% - 80px)', minHeight: 520, position: 'relative' }}>
        <AnimatePresence>
          {(sidebarOpen || !isMobile) && (
            <motion.div
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                width: isMobile ? '100%' : 320,
                flexShrink: 0,
                position: isMobile ? 'absolute' : 'relative',
                inset: isMobile ? 0 : 'auto',
                zIndex: isMobile ? 10 : 'auto',
                background: isMobile ? '#fff' : 'transparent' }}
            >
              {isMobile && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: '#F3F4F6',
                      color: '#4A5568',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer' }}
                    aria-label="Close conversations"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              <ConversationList
                conversations={conversations}
                activeId={activeConversation}
                onSelect={handleSelectConversation}
                onCreateConversation={() => setShowCreateModal(true)}
                isLoading={isLoading}
                isError={isError}
                refetch={refetch}
                onlineUserIds={onlineUserIds}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ flex: 1, minWidth: 0 }}>
          <AnimatePresence mode="wait">
            {activeConversation ? (
              <motion.div
                key={activeConversation}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                style={{ height: '100%' }}
              >
                <MessageWindow
                  conversationId={activeConversation}
                  onBack={isMobile ? handleBackToSidebar : undefined}
                  currentUserId={user?._id}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  background: '#fff',
                  borderRadius: 16,
                  border: '1px solid var(--color-border)',
                  padding: '2rem',
                  textAlign: 'center' }}
              >
                <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <MessageSquare size={32} style={{ color: '#D1D5DB' }} />
                </div>
                <h3 style={{ color: 'var(--color-heading)', margin: '0 0 0.5rem' }}>Select a conversation</h3>
                <p style={{ color: 'var(--color-body)', maxWidth: 280, margin: 0 }}>
                  Choose a conversation from the list or start a new one to begin messaging.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showCreateModal && (
        <NewConversationModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(data) => createMutation.mutate(data)}
          isSubmitting={createMutation.isPending}
        />
      )}
    </div>
  );
};

const NewConversationModal = ({ onClose, onCreate, isSubmitting }) => {
  const [participantIds, setParticipantIds] = useState('');
  const [type, setType] = useState('private');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const ids = participantIds
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);

    if (ids.length === 0) {
      setError('Enter at least one volunteer ID or user ID.');
      return;
    }

    onCreate({ volunteerIds: ids, type });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15,23,42,0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 16,
          padding: '2rem',
          width: '100%',
          maxWidth: 480,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-conversation-title"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 id="new-conversation-title" style={{ margin: 0 }}>New Conversation</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4A5568' }} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Volunteer IDs (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              value={participantIds}
              onChange={(e) => {
                setParticipantIds(e.target.value);
                setError('');
              }}
              placeholder="e.g. DFI-000123, DFI-000456"
              required
            />
            {error && <p style={{ color: '#E74C3C', marginTop: '0.25rem' }}>{error}</p>}
            <p style={{ color: 'var(--color-body)', marginTop: '0.25rem' }}>
              Enter volunteer IDs like DFI-000123 or user IDs.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              className="form-control"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="private">Private</option>
              <option value="support">Support</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={isSubmitting}>
              Cancel
            </button>
            <motion.button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus size={18} />
              {isSubmitting ? 'Creating...' : 'Create Conversation'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Messages;
