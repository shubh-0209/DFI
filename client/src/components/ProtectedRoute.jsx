import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLoader from './common/DashboardLoader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  try {
    if (loading) {
      return <DashboardLoader />;
    }

    if (!user) {
      return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role?.toUpperCase())) {
      return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
  } catch (error) {
    console.error('[ProtectedRoute] render error:', error);
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)', padding: '2rem' }}>
        <div style={{ maxWidth: 400, width: '100%', textAlign: 'center', background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <h2 style={{ color: 'var(--color-error)', marginBottom: '0.5rem' }}>Something went wrong</h2>
          <p style={{ color: 'var(--color-body)', marginBottom: '1rem' }}>This page encountered an unexpected error while loading.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      </div>
    );
  }
};

export default ProtectedRoute;
