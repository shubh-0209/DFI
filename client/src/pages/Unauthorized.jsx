import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', backgroundColor: 'var(--color-bg)' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '4rem 2rem' }}
      >
        <div style={{ 
          width: '80px', height: '80px', borderRadius: '50%', 
          backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 2rem auto'
        }}>
          <ShieldAlert size={40} />
        </div>
        
        <h1 style={{ marginBottom: '1rem', color: 'var(--color-heading)' }}>Access Denied</h1>
        <p style={{ color: 'var(--color-body)', marginBottom: '2.5rem' }}>
          You don't have permission to access this page. This area is restricted to administrators.
        </p>

        <button 
          onClick={() => navigate('/dashboard')} 
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem' }}
        >
          <ArrowLeft size={18} /> Return to Dashboard
        </button>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
