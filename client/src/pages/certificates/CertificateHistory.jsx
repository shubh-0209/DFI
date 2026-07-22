import SimpleLoader from '../../components/common/SimpleLoader';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Award, AlertCircle, History, Clock } from 'lucide-react';
import certificateService from '../../services/certificateService';

const CertificateHistory = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await certificateService.getCertificateHistory(id);
        if (res.success) {
          setData(res.data);
        } else {
          setError(res.message || 'Failed to load certificate history');
        }
      } catch {
        setError('Failed to load certificate history');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchHistory();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--color-body)', justifyContent: 'center' }} aria-label="Breadcrumb">
          <Link to="/certificates" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Certificates</Link>
        </nav>
        <SimpleLoader />
        <SimpleLoader />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--color-body)' }} aria-label="Breadcrumb">
          <Link to="/certificates" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Certificates</Link>
        </nav>
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem', border: '1px solid var(--color-error)' }}>
          <AlertCircle size={48} style={{ color: 'var(--color-error)', margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-error)' }}>Error Loading History</h3>
          <p style={{ color: 'var(--color-body)', marginBottom: '1.5rem' }}>{error || 'Certificate history not found'}</p>
          <Link to="/certificates" className="btn btn-primary">Back to Certificates</Link>
        </div>
      </div>
    );
  }

  const { certificate, history } = data;

  const getActionIcon = (action) => {
    switch (action) {
      case 'issued': return <Award size={16} />;
      case 'revoked': return <AlertCircle size={16} />;
      case 'verified': return <Clock size={16} />;
      default: return <History size={16} />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'issued': return 'var(--color-success)';
      case 'revoked': return 'var(--color-error)';
      case 'verified': return 'var(--color-primary)';
      default: return 'var(--color-body)';
    }
  };

  return (
    <div style={{ padding: '2rem 0', maxWidth: 800, margin: '0 auto' }}>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-body)' }} aria-label="Breadcrumb">
        <Link to="/certificates" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <ChevronRight style={{ transform: 'rotate(180deg)' }} size={14} /> Certificates
        </Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--color-heading)' }}>History</span>
      </nav>

      <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(211,84,0,0.05))', borderRadius: 20, padding: '2rem', marginBottom: '2rem', border: '1px solid var(--color-border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-purple)', display: 'flex' }}>
            <Award size={24} />
          </div>
          <div>
            <h1 style={{ color: 'var(--color-heading)', margin: '0 0 0.25rem 0' }}>
              Certificate History
            </h1>
            <p style={{ margin: 0, color: 'var(--color-body)' }}>
              {certificate?.certificateNumber || 'N/A'} - {certificate?.program?.title || 'Program Completion'}
            </p>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: 0 }}>Audit Trail</h3>
        </div>
        {history && history.length > 0 ? (
          <div style={{ padding: '1rem 1.5rem' }}>
            {history.map((entry, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: idx < history.length - 1 ? '1px solid var(--color-border)' : 'none', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: `${getActionColor(entry.action)}20`, color: getActionColor(entry.action), display: 'flex', flexShrink: 0 }}>
                  {getActionIcon(entry.action)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ textTransform: 'capitalize', color: 'var(--color-heading)' }}>{entry.action}</div>
                  <div style={{ color: 'var(--color-body)', marginTop: '0.25rem' }}>{entry.details}</div>
                  <div style={{ color: 'var(--color-body)', marginTop: '0.35rem', opacity: 0.7 }}>
                    {entry.date ? new Date(entry.date).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--color-body)' }}>
            <History size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>No history available for this certificate.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateHistory;
