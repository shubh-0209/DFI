import { useCallback, useRef } from 'react';
import { useSocketContext } from '../context/SocketContext';

export const useSocket = () => {
  const { socket, connectionStatus, setConnectionStatus, updateStatus, statusRef, socketRef, reconnectAttemptRef } = useSocketContext();
  const typingTimersRef = useRef(new Map());

  const on = useCallback((event, callback) => {
    const s = socketRef.current;
    if (s) {
      s.on(event, callback);
      return () => s.off(event, callback);
    }
    return () => {};
  }, []);

  const once = useCallback((event, callback) => {
    const s = socketRef.current;
    if (s) {
      s.once(event, callback);
      return () => s.off(event, callback);
    }
    return () => {};
  }, []);

  const sendTypingEvent = useCallback((conversationId) => {
    const s = socketRef.current;
    if (s && statusRef.current === 'connected') {
      s.emit('typing', { conversationId });
    }
  }, []);

  const sendStopTypingEvent = useCallback((conversationId) => {
    const s = socketRef.current;
    if (s && statusRef.current === 'connected') {
      s.emit('stop-typing', { conversationId });
    }
    const key = String(conversationId);
    const existing = typingTimersRef.current.get(key);
    if (existing) {
      clearTimeout(existing);
      typingTimersRef.current.delete(key);
    }
  }, []);

  const markMessageAsRead = useCallback((conversationId, messageId) => {
    const s = socketRef.current;
    if (s && statusRef.current === 'connected') {
      s.emit('message-read', { conversationId, messageId });
    }
  }, []);

  const markMessageAsDelivered = useCallback((conversationId, messageId) => {
    const s = socketRef.current;
    if (s && statusRef.current === 'connected') {
      s.emit('message-delivered', { conversationId, messageId });
    }
  }, []);

  const onNewMessage = useCallback((callback) => {
    const s = socketRef.current;
    if (s) {
      s.on('new-message', callback);
      return () => s.off('new-message', callback);
    }
    return () => {};
  }, []);

  const onTyping = useCallback((callback) => {
    const s = socketRef.current;
    if (s) {
      s.on('typing', callback);
      return () => s.off('typing', callback);
    }
    return () => {};
  }, []);

  const onStopTyping = useCallback((callback) => {
    const s = socketRef.current;
    if (s) {
      s.on('stop-typing', callback);
      return () => s.off('stop-typing', callback);
    }
    return () => {};
  }, []);

  const onMessageRead = useCallback((callback) => {
    const s = socketRef.current;
    if (s) {
      s.on('message-read', callback);
      return () => s.off('message-read', callback);
    }
    return () => {};
  }, []);

  const onMessageDelivered = useCallback((callback) => {
    const s = socketRef.current;
    if (s) {
      s.on('message-delivered', callback);
      return () => s.off('message-delivered', callback);
    }
    return () => {};
  }, []);

  const onUserOnline = useCallback((callback) => {
    const s = socketRef.current;
    if (s) {
      s.on('user-online', callback);
      return () => s.off('user-online', callback);
    }
    return () => {};
  }, []);

  const onUserOffline = useCallback((callback) => {
    const s = socketRef.current;
    if (s) {
      s.on('user-offline', callback);
      return () => s.off('user-offline', callback);
    }
    return () => {};
  }, []);

  return {
    socket,
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    joinConversation: (conversationId) => {
      const s = socketRef.current;
      if (s && conversationId) {
        s.emit('join-room', conversationId);
      }
    },
    leaveConversation: (conversationId) => {
      const s = socketRef.current;
      if (s && conversationId) {
        s.emit('leave-room', conversationId);
      }
    },
    sendTypingEvent,
    sendStopTypingEvent,
    markMessageAsRead,
    markMessageAsDelivered,
    onNewMessage,
    onTyping,
    onStopTyping,
    onMessageRead,
    onMessageDelivered,
    onUserOnline,
    onUserOffline,
    on,
    once,
    updateStatus,
    statusRef,
    socketRef,
    reconnectAttemptRef,
  };
};

export default useSocket;
