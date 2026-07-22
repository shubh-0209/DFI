import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { ArrowLeft, Pin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { getMessages, sendMessage, pinMessage, unpinMessage, deleteMessage, updateMessage } from '../../services/messagesService';
import { getConversation } from '../../services/conversationsService';
import { MessagingSkeletons, ErrorState } from './MessagingSkeletons';
import useSocket from '../../hooks/useSocket';
import { generateUUID } from '../../utils/uuid';

const MessageWindow = React.memo(({ conversationId, onBack, currentUserId }) => {
  const [cursor, setCursor] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [showPinned, setShowPinned] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const topRef = useRef(null);
  const queryClient = useQueryClient();
  const sendingRef = useRef(new Set());

  const currentUserIdRef = useRef(currentUserId);
  const readSentinelRef = useRef(null);

  useEffect(() => { currentUserIdRef.current = currentUserId; }, [currentUserId]);

  const {
    joinConversation,
    leaveConversation,
    sendTypingEvent,
    sendStopTypingEvent,
    onNewMessage,
    onTyping,
    onStopTyping,
    onMessageRead,
    onMessageDelivered,
    markMessageAsDelivered,
    markMessageAsRead,
  } = useSocket();

  const { data: conversationData, isLoading: conversationLoading, isError: conversationError, refetch: refetchConversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      const res = await getConversation(conversationId);
      return res.conversation;
    },
    enabled: !!conversationId,
  });

  const { data: messagesData, isLoading: messagesLoading, isError: messagesError, refetch: refetchMessages, hasNextPage, isFetchingNextPage } = useQuery({
    queryKey: ['messages', conversationId, cursor],
    queryFn: async () => {
      const res = await getMessages(conversationId, { cursor, limit: 50 });
      return res;
    },
    enabled: !!conversationId,
    keepPreviousData: true,
  });

  const rawMessages = useMemo(() => {
    const arr = messagesData?.messages || [];
    const map = new Map();
    for (const msg of arr) {
      if (!map.has(msg._id)) map.set(msg._id, msg);
    }
    return Array.from(map.values());
  }, [messagesData?.messages]);

  const messages = useMemo(() => {
    return rawMessages.map((msg) => {
      if (msg._id?.startsWith?.('temp-')) return msg;
      if (msg.status === 'sent' || msg.status === 'sending') {
        return { ...msg, status: 'delivered' };
      }
      return msg;
    });
  }, [rawMessages]);

  const otherUser = conversationData?.participants?.find((p) => p._id !== currentUserId);

  const sendMutation = useMutation({
    mutationFn: ({ content, attachments = [], clientMessageId }) =>
      sendMessage(conversationId, { content, attachments, clientMessageId }),
    onMutate: async (data) => {
      await queryClient.cancelQueries(['messages', conversationId]);
      const clientMessageId = data.clientMessageId || generateUUID();
      const optimisticMessage = {
        _id: clientMessageId,
        content: data.content,
        attachments: data.attachments || [],
        senderId: { _id: currentUserId },
        createdAt: new Date().toISOString(),
        status: 'sending',
        clientMessageId,
        _optimistic: true,
      };

      sendingRef.current.add(clientMessageId);

      queryClient.setQueryData(['messages', conversationId], (oldData) => {
        if (!oldData || !oldData.messages) {
          return { messages: [optimisticMessage], pagination: {} };
        }
        if (oldData.messages.some((m) => m._id === clientMessageId)) return oldData;
        return {
          ...oldData,
          messages: [...oldData.messages, optimisticMessage],
        };
      });

      return { clientMessageId };
    },
    onError: (err, variables, context) => {
      if (context?.clientMessageId) {
        sendingRef.current.delete(context.clientMessageId);
        queryClient.setQueryData(['messages', conversationId], (oldData) => {
          if (!oldData?.messages) return oldData;
          const updated = oldData.messages.map((m) =>
            m._id === context.clientMessageId ? { ...m, status: 'failed' } : m
          );
          return { ...oldData, messages: updated };
        });
      }
    },
    onSuccess: (res, variables, context) => {
      if (context?.clientMessageId) {
        sendingRef.current.delete(context.clientMessageId);
      }
      const realMessage = res?.message;
      if (!realMessage) {
        queryClient.invalidateQueries(['messages', conversationId]);
        return;
      }

      queryClient.setQueryData(['messages', conversationId], (oldData) => {
        if (!oldData?.messages) {
          return oldData ? { ...oldData, messages: [{ ...realMessage, _optimistic: false }] } : oldData;
        }
        const hasReal = oldData.messages.some((m) => m._id === realMessage._id);
        if (hasReal) {
          return {
            ...oldData,
            messages: oldData.messages.map((m) =>
              m._id === realMessage._id ? { ...realMessage, _optimistic: false } : m
            ),
          };
        }
        const cleaned = context?.clientMessageId
          ? oldData.messages.filter((m) => m._id !== context.clientMessageId)
          : oldData.messages;
        return {
          ...oldData,
          messages: [...cleaned, { ...realMessage, _optimistic: false }],
        };
      });
    },
  });

  const retryMessage = useCallback((message) => {
    if (!message?.content && (!message?.attachments || message.attachments.length === 0)) return;
    if (sendingRef.current.has(message._id)) return;

    queryClient.setQueryData(['messages', conversationId], (oldData) => {
      if (!oldData?.messages) return oldData;
      const updated = oldData.messages.map((m) =>
        m._id === message._id ? { ...m, status: 'sending' } : m
      );
      return { ...oldData, messages: updated };
    });

    sendMutation.mutate({
      content: message.content,
      attachments: message.attachments || [],
      clientMessageId: message.clientMessageId || message._id,
    });
  }, [conversationId, queryClient, sendMutation]);

  const handleSend = useCallback((data) => {
    if (editingMessage) {
      editMutation.mutate({ messageId: editingMessage._id, content: data.content });
    } else {
      const clientMessageId = generateUUID();
      sendMutation.mutate({ content: data.content, attachments: data.attachments || [], clientMessageId });
    }
  }, [editingMessage, sendMutation, editMutation]);

  const deleteMutation = useMutation({
    mutationFn: (messageId) => deleteMessage(conversationId, messageId),
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', conversationId]);
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ messageId, content }) => updateMessage(conversationId, messageId, content),
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', conversationId]);
      setEditingMessage(null);
    },
  });

  const pinMutation = useMutation({
    mutationFn: ({ messageId, shouldPin }) => (shouldPin ? pinMessage(conversationId, messageId) : unpinMessage(conversationId, messageId)),
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', conversationId]);
    },
  });

  const handleNewMessage = useCallback((data) => {
    if (data.conversationId !== conversationId) return;
    const incoming = data.message;
    if (!incoming || !incoming._id) return;

    queryClient.setQueryData(['messages', conversationId], (oldData) => {
      if (!oldData?.messages) return oldData;
      const exists = oldData.messages.some(
        (m) => m._id === incoming._id || m.clientMessageId === incoming.clientMessageId
      );
      if (exists) return oldData;
      const merged = [...oldData.messages, incoming];
      return { ...oldData, messages: merged };
    });

    const me = currentUserIdRef.current;
    const senderId = incoming.senderId?._id || incoming.senderId;
    if (senderId !== me) {
      markMessageAsDelivered(conversationId, incoming._id);
    }
  }, [conversationId, queryClient, markMessageAsDelivered]);

  const handleTyping = useCallback((data) => {
    if (data.conversationId !== conversationId || data.userId === currentUserId) return;
    setTypingUsers((prev) => {
      if (prev.some((u) => u.userId === data.userId)) return prev;
      return [...prev, { userId: data.userId, name: data.name || 'Someone' }];
    });
  }, [conversationId, currentUserId]);

  const handleStopTyping = useCallback((data) => {
    if (data.conversationId !== conversationId) return;
    setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
  }, [conversationId]);

  const handleMessageRead = useCallback((data) => {
    if (data.conversationId !== conversationId) return;
    queryClient.setQueryData(['messages', conversationId], (oldData) => {
      if (!oldData?.messages) return oldData;
      const updated = oldData.messages.map((m) => {
        if (m._id === data.messageId || m.status === 'delivered') {
          return {
            ...m,
            status: 'read',
            isRead: true,
            readBy: [...(m.readBy || []), { userId: data.userId, readAt: new Date() }],
          };
        }
        return m;
      });
      return { ...oldData, messages: updated };
    });
  }, [conversationId, queryClient]);

  const handleMessageDelivered = useCallback((data) => {
    if (data.conversationId !== conversationId) return;
    queryClient.setQueryData(['messages', conversationId], (oldData) => {
      if (!oldData?.messages) return oldData;
      const updated = oldData.messages.map((m) => {
        if (m._id === data.messageId && m.status !== 'read') {
          return { ...m, status: 'delivered' };
        }
        return m;
      });
      return { ...oldData, messages: updated };
    });
  }, [conversationId, queryClient]);

  useEffect(() => {
    const c1 = onNewMessage(handleNewMessage);
    const c2 = onTyping(handleTyping);
    const c3 = onStopTyping(handleStopTyping);
    const c4 = onMessageRead(handleMessageRead);
    const c5 = onMessageDelivered(handleMessageDelivered);

    return () => {
      c1();
      c2();
      c3();
      c4();
      c5();
    };
  }, [conversationId, onNewMessage, onTyping, onStopTyping, onMessageRead, onMessageDelivered, handleNewMessage, handleTyping, handleStopTyping, handleMessageRead, handleMessageDelivered]);

  useEffect(() => {
    joinConversation(conversationId);
    return () => {
      leaveConversation(conversationId);
    };
  }, [conversationId, joinConversation, leaveConversation]);

  useEffect(() => {
    if (!messages?.length || !currentUserId || !conversationId) return;
    const placeholder = 'temp-';
    const unreadMessages = messages.filter(
      (m) =>
        (m.senderId?._id !== currentUserId && m.senderId !== currentUserId) &&
        !m._id?.startsWith?.(placeholder) &&
        !m.readBy?.some((r) => r.userId === currentUserId)
    );

    if (!unreadMessages.length) return;
    const lastUnread = unreadMessages[unreadMessages.length - 1];
    if (readSentinelRef.current !== lastUnread._id) {
      readSentinelRef.current = lastUnread._id;
      markMessageAsRead(conversationId, lastUnread._id);
    }

    queryClient.setQueryData(['messages', conversationId], (oldData) => {
      if (!oldData?.messages) return oldData;
      const updated = oldData.messages.map((m) =>
        unreadMessages.some((u) => u._id === m._id)
          ? { ...m, status: 'read', isRead: true, readBy: [...(m.readBy || []), { userId: currentUserId, readAt: new Date() }] }
          : m
      );
      return { ...oldData, messages: updated };
    });
  }, [messages, currentUserId, conversationId, markMessageAsRead, queryClient]);

  const handleEdit = useCallback((message) => {
    setEditingMessage(message);
  }, []);

  const handleDelete = useCallback((messageId) => {
    if (window.confirm('Delete this message?')) {
      deleteMutation.mutate(messageId);
    }
  }, [deleteMutation]);

  const handlePinToggle = useCallback((messageId, isPinned) => {
    pinMutation.mutate({ messageId, shouldPin: !isPinned });
  }, [pinMutation]);

  const handleTypingStart = useCallback(() => {
    sendTypingEvent(conversationId);
  }, [sendTypingEvent, conversationId]);

  const handleTypingStop = useCallback(() => {
    sendStopTypingEvent(conversationId);
  }, [sendStopTypingEvent, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isFetchingNextPage]);

  const handleScroll = useCallback(() => {
    if (topRef.current && topRef.current.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      const nextCursor = messagesData?.pagination?.nextCursor;
      if (nextCursor) {
        setCursor(nextCursor);
      }
      const prevHeight = topRef.current.scrollHeight;
      setTimeout(() => {
        if (topRef.current) {
          topRef.current.scrollTop = topRef.current.scrollHeight - prevHeight;
        }
      }, 100);
    }
  }, [hasNextPage, isFetchingNextPage, messagesData?.pagination?.nextCursor]);

  const shouldShowEmpty = !messagesLoading && (!messages || messages.length === 0);
  const isDisabled = sendMutation.isPending || editMutation.isPending;

  const header = conversationData && (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', background: '#fff', borderRadius: '16px 16px 0 0' }}>
      {onBack && (
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4A5568' }} aria-label="Back to conversations">
          <ArrowLeft size={20} />
        </button>
      )}

      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: 'var(--primary-blue)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0 }}
        aria-hidden="true"
      >
        {otherUser?.name?.[0]?.toUpperCase() || '?'}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{otherUser?.name || 'Conversation'}</h4>
        <p style={{ margin: 0, color: 'var(--color-body)' }}>
          {conversationData.type === 'support' ? 'Support' : 'Private Chat'}
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowPinned(!showPinned)}
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: showPinned ? 'var(--primary-blue)' : '#F3F4F6',
          color: showPinned ? 'white' : '#4A5568',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center' }}
        aria-label="Show pinned messages"
        aria-pressed={showPinned}
      >
        <Pin size={16} />
      </motion.button>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FDFBF7', borderRadius: 16, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      {header}

      <div
        ref={topRef}
        onScroll={handleScroll}
        style={{ flex: 1, overflowY: 'auto', padding: '1rem', position: 'relative', display: 'flex', flexDirection: 'column' }}
        role="list"
        aria-label="Messages"
        aria-busy={messagesLoading}
      >
        {isFetchingNextPage && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem' }} aria-label="Loading more messages">
            <MessagingSkeletons type="message" count={2} />
          </div>
        )}

        {conversationLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem' }} aria-label="Loading conversation">
            <MessagingSkeletons type="message" count={4} />
          </div>
        ) : conversationError ? (
          <ErrorState message="Failed to load conversation" onRetry={refetchConversation} />
        ) : messagesLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem' }} aria-label="Loading messages">
            <MessagingSkeletons type="message" count={6} />
          </div>
        ) : messagesError ? (
          <ErrorState message="Failed to load messages" onRetry={refetchMessages} />
        ) : shouldShowEmpty ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '3rem 1.5rem' }}
            >
              <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h4 style={{ margin: '0 0 0.5rem', color: 'var(--color-heading)' }}>No messages yet</h4>
              <p style={{ margin: 0, color: 'var(--color-body)', maxWidth: 280 }}>
                Start the conversation by sending a message below.
              </p>
            </motion.div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const showDateDivider = index === 0 || new Date(msg.createdAt).toDateString() !== new Date(messages[index - 1].createdAt).toDateString();
              const isFailed = msg.status === 'failed' && !msg._id?.startsWith?.('temp-');
              return (
                <React.Fragment key={msg._id}>
                  {showDateDivider && (
                    <div style={{ textAlign: 'center', margin: '1rem 0', position: 'relative' }}>
                      <span style={{ background: '#FDFBF7', padding: '0.25rem 0.75rem', color: '#9CA3AF', position: 'relative', zIndex: 1, borderRadius: 12, border: '1px solid var(--color-border)' }}>
                        {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                  <MessageBubble
                    message={msg}
                    isOwn={msg.senderId?._id === currentUserId}
                    onPin={(id) => handlePinToggle(id, false)}
                    onUnpin={(id) => handlePinToggle(id, true)}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    isPinned={msg.isPinned}
                    onRetry={isFailed ? () => retryMessage(msg) : undefined}
                  />
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <TypingIndicator users={typingUsers} />

      <MessageInput
        onSend={handleSend}
        disabled={isDisabled}
        placeholder={editingMessage ? 'Edit message...' : 'Type a message...'}
        onCancelEdit={() => setEditingMessage(null)}
        isEditing={!!editingMessage}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
      />
    </div>
  );
});

MessageWindow.displayName = 'MessageWindow';

export default MessageWindow;
