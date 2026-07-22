import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getVolunteerDashboard, getVolunteerRank } from '../services/analyticsService';
import { getMyPrograms } from '../services/programsService';
import { getAttendanceDashboard } from '../services/attendanceService';
import { getMarketplaceCatalog, getFeaturedRewards } from '../services/marketplaceService';
import { getMyCertificates, getMyContributions } from '../services/volunteerImpactService';
import { getConversations } from '../services/conversationsService';

export const useDashboardPrefetch = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Keep the initial background prefetch for core dashboard
  useEffect(() => {
    if (!user || (user.role && user.role.toUpperCase() !== 'VOLUNTEER')) return;

    const timer = setTimeout(() => {
      queryClient.prefetchQuery({
        queryKey: ['volunteer-dashboard'],
        queryFn: async () => {
          const res = await getVolunteerDashboard();
          return res.success ? (res.data?.volunteer || null) : null;
        },
        staleTime: 5 * 60 * 1000,
      });
      queryClient.prefetchQuery({
        queryKey: ['my-rank'],
        queryFn: async () => {
          const res = await getVolunteerRank();
          return res.success ? (res.data?.rank || 0) : 0;
        },
        staleTime: 5 * 60 * 1000,
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [user, queryClient]);

  // Expose a function to prefetch data based on the route path hovered
  const prefetchRouteData = (path) => {
    if (!user) return;

    if (path === '/dashboard') {
      // Handled by mount
    } else if (path === '/opportunities' || path === '/my-programs') {
      queryClient.prefetchQuery({
        queryKey: ['my-programs'],
        queryFn: async () => {
          const res = await getMyPrograms();
          if (res.success) return res.data?.programs || res.programs || [];
          return [];
        },
        staleTime: 5 * 60 * 1000,
      });
    } else if (path === '/attendance') {
      queryClient.prefetchQuery({
        queryKey: ['attendance-dashboard'],
        queryFn: async () => {
          const res = await getAttendanceDashboard();
          return res.success ? res.data : null;
        },
        staleTime: 5 * 60 * 1000,
      });
    } else if (path === '/marketplace') {
      queryClient.prefetchQuery({
        queryKey: ['marketplace-catalog', 'All', '', 'newest', false, 'all'],
        queryFn: () => getMarketplaceCatalog({ page: 1, limit: 24, sort: 'newest' }),
        staleTime: 5 * 60 * 1000,
      });
      queryClient.prefetchQuery({
        queryKey: ['featured-rewards'],
        queryFn: () => getFeaturedRewards(6),
        staleTime: 5 * 60 * 1000,
      });
    } else if (path === '/certificates') {
      queryClient.prefetchQuery({
        queryKey: ['my-certificates'],
        queryFn: () => getMyCertificates({ page: 1, limit: 20 }),
        staleTime: 5 * 60 * 1000,
      });
    } else if (path === '/contributions') {
      queryClient.prefetchQuery({
        queryKey: ['my-contributions-dashboard'],
        queryFn: () => getMyContributions({ limit: 20 }),
        staleTime: 5 * 60 * 1000,
      });
    } else if (path === '/messages') {
      queryClient.prefetchQuery({
        queryKey: ['conversations'],
        queryFn: async () => {
          const res = await getConversations({ limit: 20 });
          return res.conversations || [];
        },
        staleTime: 5 * 60 * 1000,
      });
    }
  };

  return { prefetchRouteData };
};
