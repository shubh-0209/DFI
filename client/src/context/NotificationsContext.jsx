import React, { createContext, useContext, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  getUnreadNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../services/notificationsService';

const NotificationsContext = createContext(null);

export const NotificationsProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pageError, setPageError] = useState(null);

  const { data: unreadCountData } = useQuery({
    queryKey: ['unread-count'],
    queryFn: async () => {
      const res = await getUnreadNotificationCount();
      if (res.success) return res.data?.count || 0;
      return 0;
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
    retry: false,
  });

  const unreadCount = unreadCountData || 0;

  const { data: drawerNotifications = [], isLoading: drawerLoading } = useQuery({
    queryKey: ['notifications', { limit: 10 }],
    queryFn: async () => {
      const res = await getNotifications({ limit: 10 });
      if (res.success) return res.data?.notifications || [];
      return [];
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    enabled: drawerOpen,
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });

  const toggleDrawer = useCallback(() => {
    setDrawerOpen((prev) => !prev);
    setPageError(null);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const markRead = useCallback((id) => markReadMutation.mutate(id), [markReadMutation]);
  const markAllRead = useCallback(() => markAllMutation.mutate(), [markAllMutation]);
  const removeNotification = useCallback((id) => deleteMutation.mutate(id), [deleteMutation]);

  return (
    <NotificationsContext.Provider
      value={{
        unreadCount,
        drawerOpen,
        drawerNotifications,
        drawerLoading,
        pageError,
        setPageError,
        toggleDrawer,
        closeDrawer,
        markRead,
        markAllRead,
        delete: removeNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export default NotificationsContext;
