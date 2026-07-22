import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

const AnalyticsErrorState = ({ error, onRetry, message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        textAlign: 'center',
        maxWidth: '500px',
        margin: '2rem auto' }}
    >
      <AlertCircle size={48} style={{ color: 'var(--color-error)', marginBottom: '1rem', opacity: 0.5 }} />
      <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-heading)' }}>
        Unable to load analytics
      </h3>
      <p style={{ color: 'var(--color-body)', marginBottom: '1.5rem' }}>
        {message || error?.message || 'Something went wrong while fetching the data. Please try again.'}
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {onRetry && (
          <button onClick={onRetry} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={16} /> Retry
          </button>
        )}
        <button onClick={() => (window.location.href = '/dashboard')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Home size={16} /> Dashboard
        </button>
      </div>
    </motion.div>
  );
};

export default AnalyticsErrorState;