import SimpleLoader from '../../components/common/SimpleLoader';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Award, AlertCircle, Download, Share2, Shield, ArrowLeft, ExternalLink } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import CertificateShare from '../../components/certificates/CertificateShare';
import certificateService from '../../services/certificateService';
import toast from 'react-hot-toast';

const CertificateDetails = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await certificateService.getCertificate(id);
        if (res.success) {
          setCertificate(res.data);
        } else {
          setError(res.message || 'Failed to load certificate');
        }
      } catch {
        setError('Failed to load certificate details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCertificate();
  }, [id]);

  const handleDownload = async () => {
    if (!certificate) return;
    try {
      setDownloading(true);
      const res = await certificateService.downloadCertificate(certificate._id);
      const blob = res.data || res;
      const url = window.URL.createObjectURL(new Blob([blob instanceof Blob ? blob : new Blob([blob])]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certificate.certificateNumber || 'certificate'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Certificate downloaded successfully');
    } catch {
      toast.error('Failed to download certificate');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--color-body)', justifyContent: 'center' }} aria-label="Breadcrumb">
          <Link to="/certificates" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Certificates</Link>
        </nav>
        <SimpleLoader />
        <SimpleLoader />
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--color-body)' }} aria-label="Breadcrumb">
          <Link to="/certificates" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Certificates</Link>
        </nav>
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem', border: '1px solid var(--color-error)' }}>
          <AlertCircle size={48} style={{ color: 'var(--color-error)', margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-error)' }}>Error Loading Certificate</h3>
          <p style={{ color: 'var(--color-body)', marginBottom: '1.5rem' }}>{error || 'Certificate not found'}</p>
          <Link to="/certificates" className="btn btn-primary">Back to Certificates</Link>
        </div>
      </div>
    );
  }

  const cert = certificate;
  const volunteerName = cert.user?.name || 'Volunteer';
  const programTitle = cert.program?.title || 'Program Completion';
  const issueDate = new Date(cert.issuedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const isRevoked = cert.status === 'revoked';

  return (
    <div style={{ padding: '2rem 0', maxWidth: 1000, margin: '0 auto' }}>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--color-body)' }} aria-label="Breadcrumb">
        <Link to="/certificates" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <ArrowLeft size={14} /> Certificates
        </Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--color-heading)' }}>{programTitle}</span>
      </nav>

      <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(211,84,0,0.05))', borderRadius: 20, padding: '2.5rem', marginBottom: '2rem', border: '1px solid var(--color-border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-purple)', marginBottom: '1rem' }}>
              <Award size={28} />
            </div>
            <h1 style={{ color: 'var(--color-heading)', margin: '0 0 0.5rem 0' }}>
              Certificate of Completion
            </h1>
            <p style={{ color: 'var(--color-body)', margin: 0 }}>
              Issued to {volunteerName} for {programTitle}
            </p>
          </div>
          <span
            className="badge"
            style={{ padding: '0.4rem 1rem', borderRadius: 999,
              textTransform: 'uppercase',
              backgroundColor: isRevoked ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
              color: isRevoked ? 'var(--color-error)' : 'var(--color-success)' }}
          >
            {isRevoked ? 'Revoked' : 'Verified'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid var(--color-border)' }}>
            <div style={{ color: 'var(--color-body)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Volunteer</div>
            <div >{volunteerName}</div>
          </div>
          <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid var(--color-border)' }}>
            <div style={{ color: 'var(--color-body)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Program</div>
            <div >{programTitle}</div>
          </div>
          <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid var(--color-border)' }}>
            <div style={{ color: 'var(--color-body)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Certificate No.</div>
            <div >{cert.certificateNumber}</div>
          </div>
          <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid var(--color-border)' }}>
            <div style={{ color: 'var(--color-body)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Hours Served</div>
            <div >{cert.volunteerHours} Hours</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={handleDownload} className="btn btn-primary" disabled={downloading || isRevoked} style={{ gap: '0.5rem' }}>
            {downloading ? <><SimpleLoader /> Saving...</> : <><Download size={16} /> Download PDF</>}
          </button>
          {!isRevoked && (
            <a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ gap: '0.5rem', textDecoration: 'none' }}>
              <ExternalLink size={16} /> Verification Page
            </a>
          )}
          {!isRevoked && (
            <button onClick={() => setShowShare(true)} className="btn btn-secondary" style={{ gap: '0.5rem' }}>
              <Share2 size={16} /> Share
            </button>
          )}
          <Link to="/certificates" className="btn btn-secondary" style={{ gap: '0.5rem', textDecoration: 'none' }}>
            <Shield size={16} /> All Certificates
          </Link>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 16, padding: '1.5rem', border: '1px solid var(--color-border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Certificate Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ color: 'var(--color-body)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Issue Date</div>
            <div >{issueDate}</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-body)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Organization</div>
            <div >{cert.organization}</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-body)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Status</div>
            <div style={{ color: isRevoked ? 'var(--color-error)' : 'var(--color-secondary)' }}>{cert.status?.toUpperCase()}</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-body)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Certificate ID</div>
            <div >{cert.certificateId}</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-body)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Template</div>
            <div style={{ textTransform: 'capitalize' }}>{cert.template || 'Default'}</div>
          </div>
          <div>
            <div style={{ color: 'var(--color-body)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Verifications</div>
            <div >{cert.verificationCount || 0} times</div>
          </div>
        </div>
      </div>

      {cert.qrCode && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-body)', marginBottom: '0.75rem' }}>Scan to verify this certificate</p>
          <img src={cert.qrCode} alt="Certificate QR Code" style={{ width: 120, height: 120, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
        </div>
      )}

      <AnimatePresence>
        {showShare && certificate && (
          <CertificateShare certificate={certificate} onClose={() => setShowShare(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CertificateDetails;
