import SimpleLoader from '../components/common/SimpleLoader';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Search, Award, Download } from 'lucide-react';
import certificateService from '../services/certificateService';

const VerifyCertificate = () => {
  const { id } = useParams();
  const [certId, setCertId] = useState(id || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // If there's an ID in the URL, verify it immediately
  useEffect(() => {
    if (id) {
      handleVerify(id);
    }
  }, [id]);

  const handleVerify = async (queryId) => {
    if (!queryId) return;
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const res = await certificateService.verifyCertificate(queryId);
      if (res.success) {
        setResult(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Certificate not found or invalid.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleVerify(certId);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Simple Header for public page */}
      <header style={{ padding: '1.5rem 2rem', backgroundColor: '#fff', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={28} className="text-primary" />
          <span style={{ color: 'var(--color-heading)' }}>Disha for India</span>
        </div>
        <Link to="/" className="btn btn-secondary" >Back to Home</Link>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>Verify Certificate</h2>
            <p style={{ color: 'var(--color-body)' }}>Enter the unique certificate ID to verify its authenticity.</p>
          </div>

          <form onSubmit={onSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)' }} />
              <input
                type="text"
                className="form-control"
                placeholder="e.g. CERT-2026-ABC123XYZ"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                style={{ paddingLeft: '3rem', height: '100%' }}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '120px' }}>
              {loading ? <SimpleLoader /> : 'Verify'}
            </button>
          </form>

          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <SimpleLoader />
              <p style={{ marginTop: '1rem', color: 'var(--color-body)' }}>Verifying securely...</p>
            </div>
          )}

          {error && !loading && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-error)', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center' }}>
              <XCircle size={48} style={{ color: 'var(--color-error)', margin: '0 auto 1rem' }} />
              <h3 style={{ color: 'var(--color-error)', marginBottom: '0.5rem' }}>Invalid Certificate</h3>
              <p style={{ color: 'var(--color-body)' }}>{error}</p>
            </div>
          )}

          {result && !loading && (
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', textAlign: 'center' }}>
              <CheckCircle size={64} style={{ color: 'var(--color-success)', margin: '0 auto 1.5rem' }} />
              <h3 style={{ color: 'var(--color-success)', marginBottom: '1rem' }}>{result.isRevoked ? 'Certificate Revoked' : 'Certificate is Valid'}</h3>

              <div style={{ textAlign: 'left', backgroundColor: '#fff', borderRadius: 'var(--radius-md)', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ color: 'var(--color-body)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Awarded To</div>
                  <div >{result.certificate?.user?.name || 'Volunteer'}</div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ color: 'var(--color-body)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Program</div>
                  <div >{result.certificate?.program?.title || 'Disha for India Program'}</div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ color: 'var(--color-body)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Certificate Number</div>
                  <div >{result.certificate?.certificateNumber || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--color-body)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Issue Date</div>
                  <div>{result.certificate?.issuedAt ? new Date(result.certificate.issuedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</div>
                </div>
              </div>

              {result.isRevoked && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-error)' }}>
                  <p style={{ margin: 0, color: 'var(--color-error)' }}>This certificate has been revoked and is no longer valid.</p>
                </div>
              )}

              {result.certificate?.certificateUrl && !result.isRevoked && (
                <div style={{ marginTop: '1.5rem' }}>
                  <a href={result.certificate.certificateUrl} download className="btn btn-primary" style={{ gap: '0.5rem' }}>
                    <Download size={16} /> Download Certificate
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VerifyCertificate;
