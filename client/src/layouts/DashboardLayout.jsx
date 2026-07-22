import React, { useState, Suspense } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationsContext';
import {
  Shield, Home, Calendar, Award, Trophy, LogOut, Menu, X,
  LayoutDashboard, Users, ClipboardList, BarChart2, UserCheck, FileText, MessageSquare, HelpCircle, Bell, Megaphone, LineChart, Settings, Store, Gift,
  Sparkles, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationBell from '../components/notifications/NotificationBell';
import NotificationDrawer from '../components/notifications/NotificationDrawer';
import CreateTicketModal from '../pages/support/CreateTicketModal';
import DashboardBreadcrumb from '../components/common/DashboardBreadcrumb';
import { useDashboardPrefetch } from '../hooks/useDashboardPrefetch';
import { useRoutePrefetch, prefetchRouteChunk } from '../hooks/useRoutePrefetch';
import SimpleLoader from '../components/common/SimpleLoader';

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN', 'COORDINATOR'];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  const {
    unreadCount,
    drawerOpen,
    drawerNotifications,
    drawerLoading,
    toggleDrawer,
    closeDrawer,
    markRead,
    markAllRead,
    delete: deleteNotification,
  } = useNotifications();

  // Prefetch data and route chunks when layout mounts
  const { prefetchRouteData } = useDashboardPrefetch();
  useRoutePrefetch();

  const isAdmin = ADMIN_ROLES.includes(user?.role?.toUpperCase());

  const handleLogout = async () => {
    // Clear stored token on logout
    localStorage.removeItem('authToken');
    await logout();
    navigate('/');
  };

  const volunteerNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={18} /> },
    { name: 'Marketplace', path: '/marketplace', icon: <Store size={18} /> },
    { name: 'Announcements', path: '/announcements', icon: <Megaphone size={18} /> },
    { name: 'Opportunities', path: '/opportunities', icon: <Calendar size={18} /> },
    { name: 'Attendance', path: '/attendance', icon: <UserCheck size={18} /> },
    { name: 'My Contributions', path: '/my-contributions', icon: <FileText size={18} /> },
    { name: 'Certificates', path: '/certificates', icon: <Award size={18} /> },
    { name: 'Messages', path: '/messages', icon: <MessageSquare size={18} />, isComingSoon: true },
  ];

  // Routes that exist but are not in the sidebar (accessible via other UI entry points).
  // Kept here so the top-bar title resolves correctly when a volunteer navigates to them.
  const volunteerHiddenRoutes = [
    { name: 'Notifications', path: '/notifications' },
    { name: 'My Programs', path: '/my-programs' },
    { name: 'Support', path: '/support' },
    { name: 'My Profile', path: '/profile' },
  ];

  // Kept here so the top-bar title resolves correctly when an admin navigates to them.
  const adminHiddenRoutes = [
    { name: 'Notifications', path: '/notifications' },
    { name: 'Support', path: '/admin/support' },
    { name: 'My Profile', path: '/profile' },
  ];

  const adminNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Announcements', path: '/admin/announcements', icon: <Megaphone size={18} /> },
    { name: 'Programs', path: '/admin/programs', icon: <Calendar size={18} /> },
    { name: 'Applications', path: '/admin/applications', icon: <ClipboardList size={18} /> },
    { name: 'Attendance', path: '/admin/attendance', icon: <UserCheck size={18} /> },
    { name: 'Certificates', path: '/admin/certificates', icon: <Award size={18} /> },
    { name: 'Insights & Trends', path: '/admin/insights', icon: <Sparkles size={18} /> },
    { name: 'Reports', path: '/admin/reports', icon: <FileText size={18} /> },
    { name: 'Volunteers', path: '/admin/users', icon: <Users size={18} /> },
    { name: 'Contributions', path: '/admin/contributions', icon: <Settings size={18} /> },
    { name: 'Redemptions', path: '/admin/redemptions', icon: <Gift size={18} /> },
    { name: 'Messages', path: '/admin/messages', icon: <MessageSquare size={18} />, isComingSoon: true },
  ];

  const navItems = isAdmin ? adminNavItems : volunteerNavItems;

  const profileName = user?.name || 'Volunteer';
  const profileRole = user?.role || 'VOLUNTEER';
  const profilePoints = user?.points ?? 0;

  const SidebarContent = ({ onClose }) => (
    <>
      {/* Header/Logo */}
      <div style={{
        height: onClose ? 'auto' : 'var(--navbar-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: onClose ? '1.25rem' : '0 1.25rem',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', color: 'var(--primary-blue)', textDecoration: 'none' }}>
          <img src="/logo-nobg.png" alt="Disha For India Logo" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
          <span style={{ whiteSpace: 'nowrap', fontWeight: 700 }}>DISHA FOR INDIA</span>
        </Link>
        {onClose && (
          <button className="sidebar-close-btn" onClick={onClose} style={{ color: 'var(--color-heading)', display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        )}
      </div>

      {/* User Mini Profile */}
      <div className="sidebar-profile-section" style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--background)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
          <div className="sidebar-profile-avatar" style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--primary-blue)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center' }}>
            {profileName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="sidebar-profile-name" style={{ fontSize: 'var(--text-label)', fontWeight: 600, color: 'var(--color-heading)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
              {profileName}
            </div>
            <span className="sidebar-profile-role" style={{
              display: 'inline-block',
              padding: '0.15rem 0.5rem',
              borderRadius: '999px',
              background: 'rgba(11, 59, 145, 0.1)',
              color: 'var(--primary-blue)',
              fontSize: 'var(--text-caption)',
              fontWeight: 500,
              marginTop: '0.2rem'
            }}>
              {profileRole.replace('_', ' ')}
            </span>
          </div>
        </div>
        {!isAdmin && (
          <div className="sidebar-profile-score" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-body)' }}>
            <span>Score:</span>
            <strong style={{ color: 'var(--color-primary)' }}>{profilePoints} pts</strong>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: '1.5rem 0.75rem', display: 'flex', flexDirection: 'column', gap: isAdmin ? '0' : '0.25rem' }}>
        {navItems.map((item) => {
          const isActive = !item.isComingSoon && (location.pathname === item.path || location.pathname.startsWith(item.path + '/'));
          return (
            <Link
              key={item.name}
              className="sidebar-nav-link"
              to={item.isComingSoon ? '#' : item.path}
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (item.isComingSoon) {
                  e.preventDefault();
                  setShowMessagesModal(true);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: '0 var(--space-3)',
                height: isAdmin ? '36px' : '40px',
                borderRadius: '8px',
                color: isActive ? 'var(--color-primary)' : 'var(--color-body)',
                backgroundColor: isActive ? 'rgba(11, 59, 145, 0.08)' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: 'var(--text-label)',
                transition: 'all 0.2s ease',
                textDecoration: 'none' }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--background)';
                  e.currentTarget.style.color = 'var(--color-heading)';
                }
                if (!item.isComingSoon) {
                  prefetchRouteData(item.path);
                  prefetchRouteChunk(item.path);
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-body)';
                }
              }}
            >
              {React.cloneElement(item.icon, {
                size: 20,
                strokeWidth: isActive ? 2.5 : 2,
                style: { transition: 'all 0.2s ease' }
              })}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--color-border)' }}>
        <button
          className="sidebar-nav-link"
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            width: '100%',
            height: '40px',
            padding: '0 var(--space-3)',
            borderRadius: '8px',
            color: 'var(--color-error)',
            fontSize: 'var(--text-label)',
            fontWeight: 500,
            textAlign: 'left',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FEF2F2';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/super-admin');

  return (
    <div className={isAdminRoute ? 'admin-theme dashboard-layout' : 'dashboard-layout'} style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* Desktop Sidebar */}
      <aside style={{
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--color-card)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 90,
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollBehavior: 'smooth' }} className="desktop-sidebar">
        <SidebarContent />
      </aside>

      {/* Main Content Wrapper */}
      <div style={{
        flex: 1,
        marginLeft: 'var(--sidebar-width)',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0 }} className="main-content-wrapper">
        {/* Mobile Header */}
        <header className="glass dashboard-mobile-header" style={{
          height: 'var(--navbar-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 0,
          zIndex: 80 }}>
          <div className="navbar-left-section" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ display: 'none' }} className="mobile-menu-trigger">
              <button className="mobile-hamburger-btn" onClick={() => setMobileMenuOpen(true)} style={{ color: 'var(--color-heading)' }}>
                <Menu size={24} />
              </button>
            </div>

            <h2 className="navbar-page-title" style={{ margin: 0 }}>
              {[...navItems, ...(isAdmin ? adminHiddenRoutes : volunteerHiddenRoutes)].find((item) => location.pathname.startsWith(item.path))?.name || 'Dashboard'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="desktop-only"
              onClick={() => setShowCreateTicketModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                color: 'var(--color-heading)',
                backgroundColor: 'transparent',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.9rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--background)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <HelpCircle size={16} style={{ color: 'var(--primary-blue)' }} />
              Need Help
            </button>

            <NotificationBell unreadCount={unreadCount} onClick={toggleDrawer} loading={drawerLoading} />
            
            {/* Profile Avatar Dropdown */}
            <div style={{ position: 'relative' }}>
              <motion.button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'var(--primary-blue)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: 'none',
                  outline: 'none',
                  fontWeight: 600,
                  fontSize: 'var(--text-base)',
                  boxShadow: 'var(--shadow-sm)'
                }}
                aria-label="Profile Menu"
              >
                {profileName.charAt(0).toUpperCase()}
              </motion.button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <>
                    <div
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{ position: 'fixed', inset: 0, zIndex: 90 }}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 15 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                      style={{
                        position: 'absolute',
                        top: '120%',
                        right: 0,
                        width: '200px',
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-lg)',
                        zIndex: 100,
                        overflow: 'hidden',
                        padding: '0.4rem'
                      }}
                    >
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate(isAdmin ? '/admin/dashboard' : '/profile');
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.65rem 0.8rem',
                          borderRadius: '8px',
                          color: 'var(--color-heading)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'background-color var(--duration-fast) var(--ease-premium)',
                          backgroundColor: 'transparent',
                          border: 'none'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--background)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Users size={16} style={{ color: 'var(--color-body)' }} />
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate('/settings');
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.65rem 0.8rem',
                          borderRadius: '8px',
                          color: 'var(--color-heading)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'background-color var(--duration-fast) var(--ease-premium)',
                          backgroundColor: 'transparent',
                          border: 'none'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--background)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Settings size={16} style={{ color: 'var(--color-body)' }} />
                        Settings
                      </button>
                      <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '0.2rem 0' }} />
                      <div className="mobile-only">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setShowCreateTicketModal(true);
                          }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.65rem 0.8rem',
                            borderRadius: '8px',
                            color: 'var(--color-heading)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'background-color var(--duration-fast) var(--ease-premium)',
                            backgroundColor: 'transparent',
                            border: 'none'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--background)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <HelpCircle size={16} style={{ color: 'var(--color-body)' }} />
                          Need Help?
                        </button>
                        <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '0.2rem 0' }} />
                      </div>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.65rem 0.8rem',
                          borderRadius: '8px',
                          color: 'var(--color-error)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'background-color var(--duration-fast) var(--ease-premium)',
                          backgroundColor: 'transparent',
                          border: 'none'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>


          </div>
        </header>

        {/* Main Content Area */}
        <main className="dashboard-main-content" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', minHeight: '36px' }}>
            <DashboardBreadcrumb style={{ marginBottom: 0 }} />
            <div id="dashboard-header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}></div>
          </div>
          <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '2rem' }}>
              <SimpleLoader text="Loading page..." />
            </div>
          }>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={isAdminRoute ? 'admin-theme' : ''} style={{ position: 'fixed', inset: 0, zIndex: 110, display: 'flex' }}>
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(36, 52, 77, 0.4)', backdropFilter: 'blur(4px)' }}
          />
          <div style={{
            position: 'relative',
            width: 'min(280px, 80vw)',
            backgroundColor: 'var(--color-card)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-xl)',
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollBehavior: 'smooth' }} className="mobile-sidebar-drawer animate-slide-up">
            <SidebarContent onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <NotificationDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        notifications={drawerNotifications}
        unreadCount={unreadCount}
        loading={drawerLoading}
        onMarkRead={markRead}
        onMarkAllRead={markAllRead}
        onDelete={deleteNotification}
        onViewAll={() => { closeDrawer(); navigate('/notifications'); }}
      />

      <AnimatePresence>
        {showMessagesModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem' }}>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMessagesModal(false)}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.4)',
                backdropFilter: 'blur(8px)' }}
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '460px',
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '2.5rem 2rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                zIndex: 10,
                overflow: 'hidden',
                textAlign: 'center' }}
            >
              {/* Accent Gradient Element */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '180px',
                height: '180px',
                background: 'radial-gradient(circle, rgba(11, 59, 145, 0.12) 0%, rgba(11, 59, 145, 0) 70%)',
                pointerEvents: 'none' }} />

              {/* Close Button */}
              <button
                onClick={() => setShowMessagesModal(false)}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  border: 'none',
                  background: '#f1f5f9',
                  color: '#64748b',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e2e8f0'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
              >
                <X size={16} />
              </button>

              {/* Icon Container */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover, #082a68) 100%)',
                color: '#ffffff',
                marginBottom: '1.5rem',
                boxShadow: '0 10px 15px -3px rgba(11, 59, 145, 0.3)' }}>
                <MessageSquare size={32} />
              </div>

              {/* Title with Sparkles */}
              <h3 style={{
                color: '#1e293b',
                margin: '0 0 0.75rem 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem' }}>
                Next-Gen Chat Is Coming! <Sparkles size={20} style={{ color: '#fbbf24' }} />
              </h3>

              {/* Description */}
              <p style={{
                color: '#475569',
                margin: '0 0 2rem 0' }}>
                We are building a powerful, real-time messaging workspace to connect you directly with team leaders and fellow volunteers. Stay tuned for a seamless way to collaborate!
              </p>

              {/* Preview Feature Items */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                textAlign: 'left',
                marginBottom: '2rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '16px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9' }}>
                  <div style={{ color: 'var(--primary-blue)', display: 'flex' }}>
                    <Zap size={18} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: '#334155' }}>Instant Real-Time Chat</h4>
                    <p style={{ margin: 0, color: '#64748b' }}>Direct messaging and workspace-focused team threads.</p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '16px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f1f5f9' }}>
                  <div style={{ color: '#10b981', display: 'flex' }}>
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: '#334155' }}>Smart Task Actions</h4>
                    <p style={{ margin: 0, color: '#64748b' }}>Create tasks, check-in, and share links directly within messages.</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setShowMessagesModal(false)}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '16px',
                  border: 'none',
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover, #082a68) 100%)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(11, 59, 145, 0.2)',
                  transition: 'transform 0.15s, box-shadow 0.15s' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px -1px rgba(11, 59, 145, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(11, 59, 145, 0.2)';
                }}
              >
                Count Me In! 🚀
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateTicketModal && (
          <CreateTicketModal
            onClose={() => setShowCreateTicketModal(false)}
            isAdmin={isAdmin}
          />
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .main-content-wrapper { margin-left: 0 !important; }
          .mobile-menu-trigger { display: block !important; }
          .desktop-only { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
