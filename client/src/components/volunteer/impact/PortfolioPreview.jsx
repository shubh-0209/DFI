import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const PortfolioPreview = ({ contributions }) => {
  const approved = (contributions || []).filter(c => c.status === 'approved').slice(0, 4);

  if (!approved.length) {
    return (
      <div style={{ background: 'white', borderRadius: 20, padding: '2rem', border: '1px solid #F0EDE8', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '0.75rem' }}>📁</div>
        <h3 style={{ color: 'var(--color-heading)', margin: '0 0 0.5rem 0' }}>No Portfolio Yet</h3>
        <p style={{ color: 'var(--color-body)', margin: '0 0 1rem 0' }}>Submit and get your contributions approved to build your portfolio.</p>
        <Link to="/contributions/new" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', borderRadius: 8, background: 'var(--color-primary)', color: 'white', textDecoration: 'none' }}>
          Submit Contribution
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: 'white', borderRadius: 20, padding: '2rem', border: '1px solid #F0EDE8', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: '2rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ margin: 0, color: 'var(--color-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={20} /> Portfolio Preview
        </h3>
        <Link to="/my-contributions" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          Open Portfolio <ExternalLink size={13} />
        </Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {approved.map((item, i) => {
          const title = item.title || 'Untitled Contribution';
          const category = item.category || item.contributionType || 'General';
          const coins = item.coinsEarned || item.coins || 0;
          const preview = item.files?.[0]?.url || item.fileUrl || item.thumbnail || null;
          return (
            <motion.div
              key={item._id || i}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: '#FAFAF8', borderRadius: 14, overflow: 'hidden',
                border: '1px solid #F0EDE8', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            >
              {preview && (
                <div style={{ height: 120, background: '#F3F4F6', overflow: 'hidden' }}>
                  <img src={preview} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ padding: '1rem' }}>
                <h4 style={{ color: 'var(--color-heading)', margin: '0 0 0.3rem 0' }}>{title}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-body)', background: '#F0FDF4', padding: '0.2rem 0.6rem', borderRadius: 6 }}>{category}</span>
                  <span style={{ color: 'var(--primary-blue)' }}>+{coins} 🪙</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PortfolioPreview;
