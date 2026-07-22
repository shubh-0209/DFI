import React from 'react';
import { motion } from 'framer-motion';
import { Download, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const CertificateGrid = ({ certificates }) => {
  if (!certificates || certificates.length === 0) {
    return (
      <div style={{ background: 'white', borderRadius: 20, padding: '2rem', border: '1px solid #F0EDE8', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '0.75rem' }}>📜</div>
        <h3 style={{ color: 'var(--color-heading)', margin: '0 0 0.5rem 0' }}>No Certificates Yet</h3>
        <p style={{ color: 'var(--color-body)', margin: 0 }}>Complete programs to earn verified certificates.</p>
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
        <h3 style={{ color: 'var(--color-heading)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          📜 Certificates Earned ({certificates.length})
        </h3>
        <Link to="/certificates" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          View All <ExternalLink size={13} />
        </Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {certificates.slice(0, 6).map((cert, i) => {
          const name = cert.title || cert.certificateName || cert.name || 'Certificate';
          const issueDate = cert.issuedAt || cert.createdAt || cert.issueDate;
          const certId = cert._id || cert.certificateNumber;
          return (
            <motion.div
              key={cert._id || certId || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
                borderRadius: 14, padding: '1.25rem', border: '1px solid #BBF7D0',
                boxShadow: '0 2px 8px rgba(5,150,105,0.06)' }}
            >
              <div style={{ marginBottom: '0.5rem' }}>📜</div>
              <h4 style={{ color: 'var(--color-heading)', margin: '0 0 0.3rem 0' }}>{name}</h4>
              {issueDate && (
                <p style={{ color: 'var(--color-body)', margin: '0 0 0.75rem 0' }}>
                  Issued {new Date(issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              )}
              {certId && (
                <button
                  onClick={() => window.open(`/api/v1/certificates/${certId}/download`, '_blank')}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '0.4rem 0.75rem', borderRadius: 8, background: 'white',
                    border: '1px solid #BBF7D0', color: '#059669', cursor: 'pointer' }}
                >
                  <Download size={13} /> Download
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CertificateGrid;
