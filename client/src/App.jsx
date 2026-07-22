import React, { useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { VolunteerProvider } from './context/VolunteerContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardErrorBoundary from './components/DashboardErrorBoundary';
import GlobalLoaderFallback from './components/common/GlobalLoaderFallback';
import DashboardLoader from './components/common/DashboardLoader';
import { LoaderProvider } from './context/LoaderContext';

import { lazy } from 'react';

// Pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Programs = lazy(() => import('./pages/Programs'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Certificates = lazy(() => import('./pages/certificates/Certificates'));
const CertificateDetails = lazy(() => import('./pages/certificates/CertificateDetails'));
const Announcements = lazy(() => import('./pages/announcements/Announcements'));
const AnnouncementDetails = lazy(() => import('./pages/announcements/AnnouncementDetails'));
const NotificationCenter = lazy(() => import('./pages/notifications/NotificationCenter'));
const ProfileSetup = lazy(() => import('./pages/ProfileSetup'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const VerifyCertificate = lazy(() => import('./pages/VerifyCertificate'));
const MyProfile = lazy(() => import('./pages/profile/MyProfile'));
const Settings = lazy(() => import('./pages/settings/Settings'));

// Volunteer Pages
const ApplicationForm = lazy(() => import('./pages/applications/ApplicationForm'));
const MyApplications = lazy(() => import('./pages/applications/MyApplications'));
const ApplicationDetails = lazy(() => import('./pages/applications/ApplicationDetails'));
const MyPrograms = lazy(() => import('./pages/programs/MyPrograms'));
const ProgramDetail = lazy(() => import('./pages/programs/ProgramDetail'));
const AttendanceDashboard = lazy(() => import('./pages/attendance/AttendanceDashboard'));
const CheckIn = lazy(() => import('./pages/attendance/CheckIn'));
const CheckOut = lazy(() => import('./pages/attendance/CheckOut'));
const AttendanceHistory = lazy(() => import('./pages/attendance/AttendanceHistory'));
const VolunteerHours = lazy(() => import('./pages/attendance/VolunteerHours'));
const Messages = lazy(() => import('./pages/messages/Messages'));
const Support = lazy(() => import('./pages/support/Support'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminPrograms = lazy(() => import('./pages/admin/AdminPrograms'));
const AdminApplications = lazy(() => import('./pages/admin/AdminApplications'));
const AdminAttendance = lazy(() => import('./pages/admin/AdminAttendance'));
const AdminInsights = lazy(() => import('./pages/admin/AdminInsights'));
const Reports = lazy(() => import('./pages/admin/Reports'));
const SuperAdminDashboard = lazy(() => import('./pages/admin/SuperAdminDashboard'));
const AdminAnnouncementDashboard = lazy(() => import('./pages/admin/AdminAnnouncementDashboard'));
const AdminCertificates = lazy(() => import('./pages/admin/AdminCertificates'));
const AdminAnnouncementCreate = lazy(() => import('./pages/admin/AdminAnnouncementCreate'));
const AdminReviewDashboard = lazy(() => import('./pages/admin/AdminReviewDashboard'));
const ContributionAdminConsole = lazy(() => import('./pages/admin/ContributionAdminConsole'));
const AdminRedemptions = lazy(() => import('./pages/admin/AdminRedemptions'));

// Volunteer Analytics / Marketplace
const VolunteerAnalytics = lazy(() => import('./pages/volunteer/VolunteerAnalytics'));
const VolunteerImpactCenter = lazy(() => import('./pages/volunteer/VolunteerImpactCenter'));
const Contributions = lazy(() => import('./pages/contributions/Contributions'));
const ContributionWizard = lazy(() => import('./components/contributions/ContributionWizard'));
const MyContributions = lazy(() => import('./pages/contributions/MyContributions'));
const ContributionDetailPage = lazy(() => import('./pages/contributions/ContributionDetailPage'));
const Marketplace = lazy(() => import('./pages/marketplace/Marketplace'));

// Matching Pages
const RecommendedPrograms = lazy(() => import('./pages/matching/RecommendedPrograms'));
const RecommendedVolunteers = lazy(() => import('./pages/matching/RecommendedVolunteers'));
const SavedRecommendations = lazy(() => import('./pages/recommendations/SavedRecommendations'));
const RecommendationHistory = lazy(() => import('./pages/recommendations/RecommendationHistory'));

// Guard for auth pages
const RedirectIfAuthenticated = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    const token = localStorage.getItem('authToken');
    if (token && !user) {
      return (
        <DashboardLoader />
      );
    }
    return children;
  }

  if (user) {
    const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'COORDINATOR'];
    if (adminRoles.includes(user?.role?.toUpperCase())) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AuthExpiredHandler = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handler = () => {
      if (!user) {
        navigate('/login?expired=true', { replace: true });
      }
    };
    window.addEventListener('auth-expired', handler);
    return () => window.removeEventListener('auth-expired', handler);
  }, [navigate, user]);

  return null;
};

function App() {
  return (
    <LoaderProvider>
      <AuthProvider>
        <VolunteerProvider>
          <SocketProvider>
            <BrowserRouter>
              <AuthExpiredHandler />
              <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="programs" element={<Programs />} />
                  <Route path="programs/:id" element={<ProgramDetail />} />
                  <Route path="leaderboard" element={<Leaderboard />} />
                  <Route path="login" element={
                    <RedirectIfAuthenticated>
                      <Login />
                    </RedirectIfAuthenticated>
                  } />
                  <Route path="register" element={
                    <RedirectIfAuthenticated>
                      <Register />
                    </RedirectIfAuthenticated>
                  } />
                  <Route path="forgot-password" element={
                    <RedirectIfAuthenticated>
                      <ForgotPassword />
                    </RedirectIfAuthenticated>
                  } />
                  <Route path="reset-password" element={<ResetPassword />} />
                  <Route path="unauthorized" element={<Unauthorized />} />
                  <Route path="verify/:id" element={<VerifyCertificate />} />
                </Route>

                {/* Protected Volunteer Routes */}
                <Route element={
                  <ProtectedRoute allowedRoles={['VOLUNTEER', 'COORDINATOR', 'ADMIN', 'SUPER_ADMIN']}>
                    <NotificationsProvider>
                      <DashboardErrorBoundary>
                        <DashboardLayout />
                      </DashboardErrorBoundary>
                    </NotificationsProvider>
                  </ProtectedRoute>
                }>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="opportunities" element={<Programs />} />
                  <Route path="opportunities/:id" element={<ProgramDetail />} />
                  <Route path="programs/:id" element={<ProgramDetail />} />
                  <Route path="notifications" element={<NotificationCenter />} />
                  <Route path="announcements" element={<Announcements />} />
                  <Route path="announcements/:id" element={<AnnouncementDetails />} />
                  <Route path="certificates" element={<Certificates />} />
                  <Route path="certificates/:id" element={<CertificateDetails />} />
                  <Route path="profile" element={<MyProfile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="profile/setup" element={<ProfileSetup />} />
                  <Route path="applications" element={<MyApplications />} />
                  <Route path="applications/:id" element={<ApplicationDetails />} />
                  <Route path="programs/:programId/apply" element={<ApplicationForm />} />
                  <Route path="my-programs" element={<MyPrograms />} />
                  <Route path="attendance" element={<AttendanceDashboard />} />
                  <Route path="attendance/check-in" element={<CheckIn />} />
                  <Route path="attendance/checkout" element={<CheckOut />} />
                  <Route path="attendance/history" element={<AttendanceHistory />} />
                  <Route path="attendance/hours" element={<VolunteerHours />} />
                  <Route path="messages" element={<Messages />} />
                  <Route path="support" element={<Support />} />
                  <Route path="matching/programs" element={<RecommendedPrograms />} />
                  <Route path="recommendations/saved" element={<SavedRecommendations />} />
                  <Route path="recommendations/history" element={<RecommendationHistory />} />
                </Route>

                {/* Protected Admin Routes */}
                <Route element={
                  <ProtectedRoute allowedRoles={['COORDINATOR', 'ADMIN', 'SUPER_ADMIN']}>
                    <NotificationsProvider>
                      <DashboardLayout />
                    </NotificationsProvider>
                  </ProtectedRoute>
                }>
                  <Route path="admin/dashboard" element={<AdminDashboard />} />
                  <Route path="admin/announcements" element={<AdminAnnouncementDashboard />} />
                  <Route path="admin/announcements/create" element={<AdminAnnouncementCreate />} />
                  <Route path="admin/analytics" element={<Navigate to="/admin/insights" replace />} />
                  <Route path="admin/forecast" element={<Navigate to="/admin/insights" replace />} />
                  <Route path="admin/insights" element={<AdminInsights />} />
                  <Route path="admin/reports" element={<Reports />} />
                  <Route path="admin/programs" element={<AdminPrograms />} />
                  <Route path="admin/applications" element={<AdminApplications />} />
                  <Route path="admin/attendance" element={<AdminAttendance />} />
                  <Route path="admin/certificates" element={<AdminCertificates />} />
                  <Route path="admin/messages" element={<Messages />} />
                  <Route path="admin/support" element={<Support />} />
                  <Route path="admin/contributions" element={<AdminReviewDashboard />} />
                  <Route path="admin/contributions/config" element={<ContributionAdminConsole />} />
                  <Route path="admin/redemptions" element={<AdminRedemptions />} />
                  <Route path="matching/volunteers" element={<RecommendedVolunteers />} />
                </Route>

                {/* Protected Super Admin Routes */}
                <Route element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                    <NotificationsProvider>
                      <DashboardLayout />
                    </NotificationsProvider>
                  </ProtectedRoute>
                }>
                  <Route path="super-admin/dashboard" element={<SuperAdminDashboard />} />
                </Route>

                {/* Protected Volunteer Analytics */}
                <Route element={
                  <ProtectedRoute allowedRoles={['VOLUNTEER', 'COORDINATOR', 'ADMIN', 'SUPER_ADMIN']}>
                    <NotificationsProvider>
                      <DashboardLayout />
                    </NotificationsProvider>
                  </ProtectedRoute>
                }>
                  <Route path="volunteer/analytics" element={<VolunteerAnalytics />} />
                  <Route path="volunteer/impact-center" element={<VolunteerImpactCenter />} />
                  <Route path="contributions" element={<Contributions />} />
                  <Route path="contributions/new" element={<ContributionWizard />} />
                  <Route path="my-contributions" element={<MyContributions />} />
                  <Route path="contributions/:id" element={<ContributionDetailPage />} />
                  <Route path="contributions/:id/edit" element={<ContributionWizard />} />
                  <Route path="marketplace" element={<Marketplace />} />
                </Route>

                {/* Global 404 - placed last so it only matches when nothing else does */}
                <Route path="*" element={<NotFound />} />
              </Routes>
          </BrowserRouter>
        </SocketProvider>
      </VolunteerProvider>
    </AuthProvider>
    </LoaderProvider>
  );
}

export default App;
