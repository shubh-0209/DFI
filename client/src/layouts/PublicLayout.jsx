import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { Shield, LogOut, Menu, X, Heart, Mail, Search, Bell, ChevronDown, User } from 'lucide-react';

// Social icons — react-icons is not installed; defined as minimal inline SVGs
const FaLinkedin = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const FaInstagram = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);
const FaYoutube = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);
const FaFacebook = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);


import { motion, AnimatePresence } from 'framer-motion';

const PublicLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 60);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);

  const isHomePage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const solidNav = isHomePage ? isScrolled : true;

  const navBaseStyle = {
    padding: '0.5rem 0.875rem',
    borderRadius: 8,
    fontSize: 'var(--text-base)',
    fontWeight: 500,
    textDecoration: 'none',
    position: 'relative',
    transition: 'color 0.23s ease-in-out, opacity 0.23s ease-in-out',
  };

  const commonLinkStyle = {
    ...navBaseStyle,
    color: 'rgba(255,255,255,0.92)',
    backgroundColor: 'transparent',
    opacity: 1,
    textShadow: '0 1px 3px rgba(0,0,0,0.5), 0 0 8px rgba(0,0,0,0.25)',
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsScrolled(window.scrollY > 60);
  }, [location.pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Programs', path: '/programs' },
    { name: 'Leaderboard', path: '/leaderboard' },
  ];

  // Roles are stored in lowercase on server, normalize for comparison
  const adminRoles = ['admin', 'superadmin', 'super_admin', 'coordinator'];
  const dashboardPath = user && adminRoles.includes(user?.role?.toLowerCase()) ? '/admin/dashboard' : '/dashboard';

  return (
    <div className="flex flex-col min-h-screen" style={{ fontFamily: 'var(--font-primary)', backgroundColor: 'var(--color-bg)' }}>

      {/* ─────────────── HEADER ─────────────── */}
      {!isAuthPage && (
      <header
        className="fixed w-full top-0 z-[100] transition-all duration-300 ease-in-out"
        style={{
          backgroundColor: solidNav ? 'rgba(255,255,255,0.95)' : 'transparent',
          borderBottom: solidNav ? '1px solid rgba(0,0,0,0.08)' : '1px solid transparent',
          boxShadow: 'none',
          backdropFilter: solidNav ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: solidNav ? 'blur(16px)' : 'none',
          height: '76px',
        }}
      >
        <style>{`
          @media (prefers-reduced-motion: reduce) {
            header { transition: none !important; }
            header * { transition: none !important; }
          }
        `}</style>
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between h-full gap-2 relative">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 no-underline shrink-0">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} color="white" />
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-xl)', color: solidNav ? 'var(--color-heading)' : '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1 }}>
                DISHA
              </span>
              <span style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: solidNav ? 'var(--color-primary)' : 'rgba(255,255,255,0.85)', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>
                for India
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center justify-center gap-4 lg:gap-6 flex-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    ...commonLinkStyle,
                    backgroundColor: 'transparent',
                    opacity: isActive ? 1 : 0.85,
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.opacity = '0.85'; }}
                  onFocus={e => { e.currentTarget.style.outline = '2px solid var(--color-primary)'; e.currentTarget.style.outlineOffset = '2px'; }}
                  onBlur={e => { e.currentTarget.style.outline = 'none'; }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.name}
                  {isActive && <span style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', width: 18, height: 2, borderRadius: 999, background: 'var(--color-primary)' }} />}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0 ml-auto relative">

            {/* Search (Absolute Overlay to prevent layout shift) */}
            <div className="relative flex items-center justify-end" style={{ width: 36, height: 36 }}>
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ width: 36, opacity: 0 }}
                    animate={{ width: 260, opacity: 1 }}
                    exit={{ width: 36, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-0 bottom-0"
                    style={{ 
                      display: 'flex', alignItems: 'center', 
                      backgroundColor: solidNav ? '#F5F3EF' : 'rgba(255,255,255,0.95)', 
                      borderRadius: 8, padding: '0 0.75rem', gap: '0.5rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      zIndex: 50
                    }}
                  >
                    <Search size={15} style={{ color: 'var(--color-body)', flexShrink: 0 }} />
                    <input
                      ref={searchRef}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search programs, NGOs..."
                      style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 'var(--text-base)', color: 'var(--color-heading)', width: '100%' }}
                      onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
                    />
                    <button onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                      <X size={16} style={{ color: 'var(--color-body)' }} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {!searchOpen && (
                <button
                  onClick={() => setSearchOpen(true)}
                  style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: solidNav ? 'var(--color-body)' : 'rgba(255,255,255,0.92)', transition: 'background 0.23s ease-in-out, color 0.23s ease-in-out' }}
                  onMouseEnter={e => { e.currentTarget.style.background = solidNav ? '#F5F3EF' : 'rgba(255,255,255,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  onFocus={e => { e.currentTarget.style.outline = '2px solid var(--color-primary)'; e.currentTarget.style.outlineOffset = '2px'; }}
                  onBlur={e => { e.currentTarget.style.outline = 'none'; }}
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {user && (
              <button
                style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: solidNav ? 'var(--color-body)' : 'rgba(255,255,255,0.92)', position: 'relative', transition: 'background 0.23s, color 0.23s' }}
                aria-label="Notifications"
                onMouseEnter={e => { e.currentTarget.style.background = solidNav ? '#F5F3EF' : 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                onFocus={e => { e.currentTarget.style.outline = '2px solid var(--color-primary)'; e.currentTarget.style.outlineOffset = '2px'; }}
                onBlur={e => { e.currentTarget.style.outline = 'none'; }}
              >
                <Bell size={18} />
                <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', background: 'var(--color-error)', border: '2px solid ' + (solidNav ? 'white' : 'transparent') }} />
              </button>
            )}

            <div style={{ width: 1, height: 20, background: solidNav ? '#E8E3D9' : 'rgba(255,255,255,0.2)', margin: '0 0.25rem' }} />

            {user ? (
              <>
                <Link
                  to={dashboardPath}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 outline-none group"
                  style={{ color: solidNav ? 'var(--color-heading)' : 'white' }}
                  onMouseEnter={e => { e.currentTarget.style.background = solidNav ? '#F5F3EF' : 'rgba(255,255,255,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  onFocus={e => { e.currentTarget.style.outline = '2px solid var(--color-primary)'; e.currentTarget.style.outlineOffset = '2px'; }}
                >
                  <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center shrink-0">
                    <User size={14} color="white" />
                  </div>
                  <span className="truncate max-w-[80px] lg:max-w-[120px]">
                    Hi, {(user?.name || 'User').split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-semibold cursor-pointer flex items-center gap-1.5 transition-all outline-none hover:bg-red-100 shrink-0"
                  onFocus={e => { e.currentTarget.style.outline = '2px solid var(--color-error)'; e.currentTarget.style.outlineOffset = '2px'; }}
                >
                  <LogOut size={14} /> <span className="hidden lg:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{ ...commonLinkStyle, backgroundColor: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '0.85'; }}
                  onFocus={e => { e.currentTarget.style.outline = '2px solid var(--color-primary)'; e.currentTarget.style.outlineOffset = '2px'; }}
                  onBlur={e => { e.currentTarget.style.outline = 'none'; }}
                >
                  Sign In
                </Link>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-[var(--color-primary)] text-white no-underline shadow-[0_2px_8px_rgba(211,84,0,0.3)] transition-all flex items-center gap-1.5 shrink-0 hover:bg-[var(--color-primary-hover)] hover:-translate-y-[1px] outline-none"
                  onFocus={e => { e.currentTarget.style.outline = '2px solid var(--color-primary)'; e.currentTarget.style.outlineOffset = '2px'; }}
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden ml-auto shrink-0"
            style={{ width: 40, height: 40, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: solidNav ? 'var(--color-heading)' : 'white', transition: 'color 0.23s ease-in-out' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            onFocus={e => { e.currentTarget.style.outline = '2px solid var(--color-primary)'; e.currentTarget.style.outlineOffset = '2px'; }}
            onBlur={e => { e.currentTarget.style.outline = 'none'; }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-0 z-[200] bg-white flex flex-col pt-20 px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] overflow-y-auto w-full"
            >
              <div className="absolute top-4 right-4 flex items-center gap-3">
                {user && (
                  <button
                    className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700 relative"
                    aria-label="Notifications"
                  >
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border border-white" />
                  </button>
                )}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Mobile Search */}
              <div className="relative mb-6">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search programs, NGOs..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-gray-800 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                />
              </div>

              <nav className="flex flex-col gap-2 mb-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="px-4 py-3.5 rounded-xl text-lg font-bold transition-colors font-heading"
                    style={{ 
                      color: location.pathname === link.path ? 'var(--color-primary)' : 'var(--color-heading)',
                      background: location.pathname === link.path ? 'rgba(211,84,0,0.08)' : 'transparent'
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
                {user && (
                  <Link 
                    to={dashboardPath} 
                    className="px-4 py-3.5 rounded-xl text-lg font-bold transition-colors font-heading"
                    style={{ 
                      color: location.pathname === dashboardPath ? 'var(--color-primary)' : 'var(--color-heading)',
                      background: location.pathname === dashboardPath ? 'rgba(211,84,0,0.08)' : 'transparent'
                    }}
                  >
                    Dashboard
                  </Link>
                )}
              </nav>

              <div className="mt-auto flex flex-col gap-3">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-base font-bold cursor-pointer flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                ) : (
                  <>
                    <Link to="/login" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-[var(--color-heading)] text-base font-bold text-center block hover:bg-gray-50 transition-colors">
                      Sign In
                    </Link>
                    <Link to="/register" className="w-full px-4 py-3.5 rounded-xl bg-[var(--color-primary)] text-white text-base font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-primary-hover)] transition-colors shadow-lg shadow-[rgba(211,84,0,0.25)]">
                      <Heart size={20} /> Become a Volunteer
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      )}

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: (isHomePage || isAuthPage) ? 0 : '76px' }}>
        <React.Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '60vh' }}>Loading...</div>}>
          <Outlet />
        </React.Suspense>
      </main>

      {/* ─────────────── FOOTER ─────────────── */}
      {!isAuthPage && (
      <footer style={{ background: '#111827', color: '#9CA3AF', fontFamily: 'var(--font-primary)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '3rem', paddingBottom: '3rem', borderBottom: '1px solid #1F2937' }}>
            <div style={{ gridColumn: 'span 1' }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: '1rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Shield size={20} color="white" />
                </div>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-xl)', color: 'white' }}>DISHA</span>
              </Link>
              <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.7, color: '#6B7280', marginBottom: '1.5rem', maxWidth: 260 }}>
                Empowering communities through verifiable volunteering. Connecting passionate individuals with grassroot NGOs across India.
              </p>
              <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                {[
                  { Icon: FaLinkedin, label: 'LinkedIn' },
                  { Icon: FaInstagram, label: 'Instagram' },
                  { Icon: FaYoutube, label: 'YouTube' },
                  { Icon: FaFacebook, label: 'Facebook' },
                ].map(({ Icon, label }) => (
                  <a key={label} href="#" aria-label={label}
                    style={{ width: 36, height: 36, borderRadius: 8, background: '#1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#1F2937'; e.currentTarget.style.color = '#9CA3AF'; }}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h5 style={{ color: 'white', fontWeight: 700, fontSize: 'var(--text-sm)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Company</h5>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['About', 'Careers', 'Contact', 'Our Mission'].map(item => (
                  <li key={item}><a href="#" style={{ color: '#6B7280', fontSize: 'var(--text-base)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
                  >{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 style={{ color: 'white', fontWeight: 700, fontSize: 'var(--text-sm)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Programs</h5>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['Volunteer', 'Events', 'Success Stories', 'Leaderboard', 'Certificates'].map(item => (
                  <li key={item}><a href="#" style={{ color: '#6B7280', fontSize: 'var(--text-base)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
                  >{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 style={{ color: 'white', fontWeight: 700, fontSize: 'var(--text-sm)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Resources</h5>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['Blogs', 'FAQs', 'Downloads', 'Help Center', 'Community'].map(item => (
                  <li key={item}><a href="#" style={{ color: '#6B7280', fontSize: 'var(--text-base)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
                  >{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 style={{ color: 'white', fontWeight: 700, fontSize: 'var(--text-sm)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Legal</h5>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['Privacy', 'Terms', 'Refund Policy', 'Cookie Policy', 'Accessibility'].map(item => (
                  <li key={item}><a href="#" style={{ color: '#6B7280', fontSize: 'var(--text-base)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
                  >{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 style={{ color: 'white', fontWeight: 700, fontSize: 'var(--text-sm)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Stay Updated</h5>
              <p style={{ fontSize: 'var(--text-sm)', color: '#6B7280', marginBottom: '1rem', lineHeight: 1.6 }}>
                Get impact stories, volunteer spotlights, and new program alerts.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  placeholder="Your email"
                  style={{ flex: 1, minWidth: 0, padding: '0.6rem 0.75rem', borderRadius: 8, border: '1px solid #374151', background: '#1F2937', color: 'white', fontSize: 'var(--text-sm)', outline: 'none', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={e => e.target.style.borderColor = '#374151'}
                />
                <button
                  style={{ padding: '0.6rem 0.875rem', borderRadius: 8, background: 'var(--color-primary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', flexShrink: 0 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--color-primary)'}
                >
                  <Mail size={16} color="white" />
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '1.5rem 0', fontSize: 'var(--text-sm)', color: '#4B5563' }}>
            <span>© {new Date().getFullYear()} Disha for India Foundation. All rights reserved.</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span>Made with</span>
              <Heart size={12} style={{ color: '#EF4444', fill: '#EF4444' }} />
              <span>in India</span>
              <span style={{ color: '#374151' }}>·</span>
              <span>Version 1.0</span>
              <span style={{ color: '#374151' }}>·</span>
              <a href="#" style={{ color: '#4B5563', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = '#D1D5DB'} onMouseLeave={e => e.currentTarget.style.color = '#4B5563'}>Privacy</a>
              <span style={{ color: '#374151' }}>·</span>
              <a href="#" style={{ color: '#4B5563', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = '#D1D5DB'} onMouseLeave={e => e.currentTarget.style.color = '#4B5563'}>Terms</a>
            </div>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
};

export default PublicLayout;