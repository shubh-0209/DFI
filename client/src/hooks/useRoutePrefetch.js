import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const prefetchRouteChunk = (path) => {
  try {
    if (path.startsWith('/admin')) {
      if (path === '/admin/dashboard') import('../pages/admin/AdminDashboard');
      else if (path === '/admin/programs') import('../pages/admin/AdminPrograms');
      else if (path === '/admin/applications') import('../pages/admin/AdminApplications');
      else if (path === '/admin/attendance') import('../pages/admin/AdminAttendance');
      else if (path === '/admin/insights') import('../pages/admin/AdminInsights');
      else if (path === '/admin/reports') import('../pages/admin/Reports');
      else if (path === '/admin/announcements') import('../pages/admin/AdminAnnouncementDashboard');
      else if (path === '/admin/certificates') import('../pages/admin/AdminCertificates');
      else if (path === '/admin/review') import('../pages/admin/AdminReviewDashboard');
      else if (path === '/admin/contributions') import('../pages/admin/ContributionAdminConsole');
      else if (path === '/admin/redemptions') import('../pages/admin/AdminRedemptions');
    } else {
      if (path === '/dashboard') import('../pages/Dashboard');
      else if (path === '/marketplace') import('../pages/marketplace/Marketplace');
      else if (path === '/opportunities' || path === '/programs') import('../pages/Programs');
      else if (path === '/announcements') import('../pages/announcements/Announcements');
      else if (path === '/my-contributions') import('../pages/contributions/MyContributions');
      else if (path === '/certificates') import('../pages/certificates/Certificates');
      else if (path === '/profile') import('../pages/profile/MyProfile');
      else if (path === '/attendance') import('../pages/attendance/AttendanceDashboard');
      else if (path === '/messages') import('../pages/messages/Messages');
    }
  } catch (error) {
    console.warn('Route prefetch failed:', error);
  }
};

export const useRoutePrefetch = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const prefetchRoutes = () => {
      if (user.role && user.role.toUpperCase() === 'VOLUNTEER') {
        prefetchRouteChunk('/marketplace');
        prefetchRouteChunk('/opportunities');
        prefetchRouteChunk('/certificates');
        prefetchRouteChunk('/messages');
      }
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => prefetchRoutes(), { timeout: 2000 });
    } else {
      setTimeout(prefetchRoutes, 1500);
    }
  }, [user]);
};
