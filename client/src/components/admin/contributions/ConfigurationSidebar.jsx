import React, { useState, useEffect, useRef } from 'react';
import { FolderOpen, Coins, Award, MessageSquare, Star, Settings, Upload, Briefcase, Zap, Menu, X } from 'lucide-react';

const SIDEBAR_ITEMS = [
  { key: 'overview', label: 'Overview', icon: Briefcase },
  { key: 'categories', label: 'Contribution Categories', icon: FolderOpen },
  { key: 'types', label: 'Contribution Types', icon: Upload },
  { key: 'coin-rules', label: 'Coin Rules', icon: Coins },
  { key: 'badge-rules', label: 'Badge Rules', icon: Award },
  { key: 'review-templates', label: 'Review Templates', icon: MessageSquare },
  { key: 'reward-catalog', label: 'Reward Catalog', icon: Star },
  { key: 'upload-settings', label: 'Upload Settings', icon: Upload },
  { key: 'portfolio-settings', label: 'Portfolio Settings', icon: Briefcase },
  { key: 'automation-settings', label: 'Automation Settings', icon: Zap },
  { key: 'general-settings', label: 'General Settings', icon: Settings },
];

const ConfigurationSidebar = ({ active, onChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSelect = (key) => {
    onChange(key);
    setMobileOpen(false);
  };

  const navContent = (
    <>
      <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-heading)', margin: 0 }}>
            Configuration
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-body)', margin: '0.25rem 0 0' }}>Manage Contribution Hub</p>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          style={{ display: 'none', background: 'none', border: 'none', color: 'var(--color-body)', cursor: 'pointer', padding: '0.5rem' }}
          className="mobile-close-btn"
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
      </div>

      <nav style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }} aria-label="Configuration sections">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleSelect(item.key)}
              aria-current={isActive ? 'page' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: isActive ? 'rgba(37,99,235,0.06)' : 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--color-body)',
                fontSize: 'var(--text-base)',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'var(--transition-fast)',
                width: '100%',
              }}
            >
              <item.icon size={18} style={{ flexShrink: 0 }} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        style={{
          display: 'none',
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 150,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          boxShadow: 'var(--shadow-lg)',
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        className="mobile-fab"
        aria-label="Open configuration menu"
      >
        <Menu size={24} />
      </button>

      <aside
        ref={sidebarRef}
        style={{
          width: '260px',
          background: 'var(--color-card)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: 'calc(100vh - var(--navbar-height))',
          overflowY: 'auto',
        }}
        className="admin-sidebar"
      >
        {navContent}
      </aside>

      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setMobileOpen(false)} />
          <div
            style={{
              position: 'relative',
              width: '280px',
              maxWidth: '85vw',
              height: '100%',
              background: 'var(--color-card)',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              animation: 'slideInRight 0.3s ease',
            }}
          >
            {navContent}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .mobile-close-btn { display: flex !important; }
          .mobile-fab { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-close-btn { display: none !important; }
          .mobile-fab { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default ConfigurationSidebar;
export { SIDEBAR_ITEMS };
