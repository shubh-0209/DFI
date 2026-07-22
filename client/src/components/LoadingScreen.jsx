import SimpleLoader from './common/SimpleLoader';
import React from 'react';
import { Shield } from 'lucide-react';

const LoadingScreen = ({ message = 'Loading Disha for India...' }) => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-bg)',
      transition: 'var(--transition-normal)'
    }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem'
      }}>
        {/* Animated outer ring */}
        <div style={{
          width: '80px',
          height: '80px',
          border: '3px solid transparent',
          borderTopColor: 'var(--color-primary)',
          borderBottomColor: 'var(--color-secondary)',
          borderRadius: '50%',
          animation: 'spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite'
        }}></div>

        {/* Central pulsing icon */}
        <div style={{
          position: 'absolute',
          display: 'flex',
          padding: '0.75rem',
          borderRadius: '16px',
          background: 'var(--gradient-primary)',
          color: '#ffffff',
          boxShadow: 'var(--gradient-glow)',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          <Shield size={28} />
        </div>
      </div>

      <p style={{
        color: 'var(--color-heading)',
        animation: 'pulseText 2s ease-in-out infinite'
      }}>
        {message}
      </p>

      {/* Embedded local keyframe animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: var(--gradient-glow); }
          50% { transform: scale(1.08); box-shadow: 0 12px 40px rgba(37, 99, 235, 0.4); }
        }
        @keyframes pulseText {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
