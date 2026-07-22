import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const { user, loading } = useAuth();
  const socketRef = useRef(null);
  const statusRef = useRef(connectionStatus);
  const reconnectAttemptRef = useRef(0);
  const userId = user?.id;

  const updateStatus = useCallback((status) => {
    setConnectionStatus(status);
    statusRef.current = status;
  }, []);

  useEffect(() => {
    if (loading) return;

    const token = localStorage.getItem('authToken');
    if (!userId || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocket(null);
      updateStatus('disconnected');
      return;
    }

    if (socketRef.current) {
      return;
    }

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
    });

    const handleConnect = () => {
      updateStatus('connected');
      reconnectAttemptRef.current = 0;
    };

    const handleDisconnect = (reason) => {
      updateStatus('disconnected');
    };

    const handleConnectError = (err) => {
      updateStatus('error');
    };

    const handleReconnect = (attempt) => {
      updateStatus('connected');
      reconnectAttemptRef.current = attempt || 0;
    };

    newSocket.on('connect', handleConnect);
    newSocket.on('disconnect', handleDisconnect);
    newSocket.on('connect_error', handleConnectError);
    newSocket.on('reconnect', handleReconnect);

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.off('connect', handleConnect);
      newSocket.off('disconnect', handleDisconnect);
      newSocket.off('connect_error', handleConnectError);
      newSocket.off('reconnect', handleReconnect);
      newSocket.disconnect();
      socketRef.current = null;
      setSocket(null);
      updateStatus('disconnected');
    };
  }, [userId, loading, updateStatus]);

  return (
    <SocketContext.Provider value={{ socket, connectionStatus, setConnectionStatus, updateStatus, statusRef, socketRef, reconnectAttemptRef }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within SocketProvider');
  }
  return context;
};

export default SocketContext;
