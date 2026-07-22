import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex-center animate-slide-up" style={{ minHeight: '60vh', flexDirection: 'column', padding: '2rem', textAlign: 'center' }}>
      <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', marginBottom: '1.5rem' }}>
        <AlertCircle size={48} />
      </div>
      <h2 style={{ marginBottom: '0.5rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--color-body)', marginBottom: '2.5rem', maxWidth: '420px' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary" style={{ gap: '0.5rem' }}>
        <Home size={18} /> Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
