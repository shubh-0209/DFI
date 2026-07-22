import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-bg)'
    }}>
      {/* Mini Header */}
      <header style={{
        height: 'var(--navbar-height)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: 'var(--text-xl)', color: 'var(--color-primary)' }}>
          <span style={{
            display: 'flex',
            padding: '0.4rem',
            borderRadius: '8px',
            background: 'var(--gradient-primary)',
            color: '#ffffff'
          }}>
            <Shield size={20} />
          </span>
          DISHA FOR INDIA
        </Link>
      </header>

      {/* Main Form Center Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem'
      }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
