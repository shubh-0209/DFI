import SimpleLoader from '../../components/common/SimpleLoader';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Download, Share2, Search, Eye, FileText, CheckCircle2, XCircle, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import certificateService from '../../services/certificateService';
import toast from 'react-hot-toast';
import CertificatePreview from '../../components/certificates/CertificatePreview';
import CertificateShare from '../../components/certificates/CertificateShare';
import CertificateFilters from '../../components/certificates/CertificateFilters';
import { useAuth } from '../../context/AuthContext';

const Certificates = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'COORDINATOR'].includes(user?.role?.toUpperCase());
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [previewCert, setPreviewCert] = useState(null);
  const [shareCert, setShareCert] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [revokingId, setRevokingId] = useState(null);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: isAdmin ? ['admin-certificates', { filter, sort, search: searchQuery }] : ['my-certificates', { filter, sort }],
    queryFn: async () => {
      const params = { filter, sort, page: 1, limit: 12 };
      if (isAdmin && searchQuery.trim()) params.search = searchQuery.trim();
      const res = isAdmin
        ? await certificateService.searchCertificates(params)
        : await certificateService.getMyCertificates(params);
      return (res.data) || {};
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const downloadMutation = useMutation({
    mutationFn: async ({ certId, certNumber }) => {
      const blob = await certificateService.downloadCertificate(certId);
      return { blob, certNumber };
    },
    onSuccess: ({ blob, certNumber }) => {
      const url = window.URL.createObjectURL(blob instanceof Blob ? blob : new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certNumber || 'certificate'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Certificate downloaded successfully');
    },
    onError: () => {
      toast.error('Failed to download certificate. Please try again.');
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (id) => certificateService.revokeCertificate(id),
    onSuccess: () => {
      toast.success('Certificate revoked successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to revoke certificate');
    },
  });

  const handleDownload = (e, cert) => {
    e.stopPropagation();
    setDownloadingId(cert._id);
    downloadMutation.mutate({ certId: cert._id, certNumber: cert.certificateNumber }, {
      onSettled: () => setDownloadingId(null),
    });
  };

  const handleRevoke = (e, cert) => {
    e.stopPropagation();
    if (!confirm(`Revoke certificate #${cert.certificateNumber}? This cannot be undone.`)) return;
    setRevokingId(cert._id);
    revokeMutation.mutate(cert._id, {
      onSettled: () => setRevokingId(null),
    });
  };

  const certificates = data?.certificates || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 12) || 1;

  if (isLoading) {
    return <SimpleLoader />;
  }

  return (
    <div style={{ padding: '0.5rem 0 3rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h1 className="page-title" style={{ color: 'var(--color-heading)', margin: 0 }}>
              {isAdmin ? 'All Certificates' : 'My Certificates'}
            </h1>
            <p className="page-description" style={{ color: 'var(--color-body)', margin: '0.3rem 0 0' }}>
              {isAdmin ? 'Manage and verify all volunteer certificates across the platform.' : 'View, download, and share your earned certificates.'}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {isAdmin && (
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              type="text"
              placeholder="Search by ID, volunteer, or program..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              style={{
                width: '100%', padding: '0.75rem 2.5rem 0.75rem 2.75rem',
                borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', backgroundColor: 'var(--color-card)',
                color: 'var(--color-heading)' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              aria-label="Search certificates"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-body)' }} aria-label="Clear search">
                <XCircle size={16} />
              </button>
            )}
          </div>
        )}
        <CertificateFilters filter={filter} sort={sort} onFilterChange={(v) => { setFilter(v); setPage(1); }} onSortChange={setSort} />
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.5rem' }}>
              <div style={{ width: '100%', height: 18, borderRadius: 8, background: '#E5E7EB' }} />
              <div style={{ width: '65%', height: 14, borderRadius: 6, background: '#E5E7EB' }} />
              <div style={{ width: '45%', height: 12, borderRadius: 6, background: '#E5E7EB' }} />
              <div style={{ width: '100%', height: 38, borderRadius: 8, background: '#E5E7EB' }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <XCircle size={48} style={{ color: 'var(--color-error)', margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-error)' }}>Error loading certificates</h3>
          <p style={{ color: 'var(--color-body)' }}>{error?.message || 'Something went wrong. Please try again.'}</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <FileText size={56} style={{ color: 'var(--color-border)', margin: '0 auto 1.5rem' }} />
          <h3 style={{ marginBottom: '0.75rem' }}>No Certificates Found</h3>
          <p style={{ color: 'var(--color-body)', maxWidth: 480, margin: '0 auto' }}>
            {searchQuery || filter !== 'all'
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : isAdmin ? 'No certificates have been issued yet.' : 'Complete programs and log your hours to earn verifiable certificates!'}
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <AnimatePresence mode="popLayout">
              {certificates.map((cert, idx) => (
                <motion.div
                  key={cert._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  className="card"
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
                  onClick={() => navigate(`/certificates/${cert._id}`)}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                      <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-purple)', display: 'flex' }}>
                        <Award size={26} />
                      </div>
                      <span
                        className="badge"
                        style={{ padding: '0.2rem 0.7rem', borderRadius: 999, textTransform: 'uppercase',
                          backgroundColor: cert.status === 'revoked' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                          color: cert.status === 'revoked' ? 'var(--color-error)' : 'var(--color-success)' }}
                      >
                        {cert.status === 'revoked' ? 'Revoked' : (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle2 size={12} /> Verified</span>
                        )}
                      </span>
                    </div>
                    <h4 style={{ marginBottom: '0.5rem' }}>{cert.program?.title || 'Program Completion'}</h4>
                    {isAdmin && (
                      <p style={{ color: 'var(--color-body)', marginBottom: '0.3rem' }}>
                        {cert.user?.name || 'Unknown Volunteer'}
                      </p>
                    )}
                    <p style={{ color: 'var(--color-body)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={14} /> {new Date(cert.issuedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p style={{ color: 'var(--color-body)', opacity: 0.8, marginBottom: '0.2rem' }}>
                      #{cert.certificateNumber}
                    </p>
                    <p style={{ color: 'var(--color-body)', opacity: 0.7 }}>
                      {cert.volunteerHours} hours · {cert.organization}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setPreviewCert(cert); }}
                      className="btn btn-secondary"
                      style={{ flex: 1, gap: '0.35rem', justifyContent: 'center', padding: '0.5rem 0.5rem' }}
                      aria-label={`Preview certificate for ${cert.program?.title}`}
                    >
                      <Eye size={14} /> Preview
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShareCert(cert); }}
                      className="btn btn-secondary"
                      style={{ flex: 1, gap: '0.35rem', justifyContent: 'center', padding: '0.5rem 0.5rem' }}
                      aria-label={`Share certificate for ${cert.program?.title}`}
                    >
                      <Share2 size={14} /> Share
                    </button>
                    <motion.button
                      onClick={(e) => handleDownload(e, cert)}
                      className="btn btn-primary"
                      disabled={downloadingId === cert._id || cert.status === 'revoked'}
                      style={{ flex: 1, gap: '0.35rem', justifyContent: 'center', padding: '0.5rem 0.5rem' }}
                      whileHover={{ scale: downloadingId === cert._id || cert.status === 'revoked' ? 1 : 0.98 }}
                      whileTap={{ scale: downloadingId === cert._id || cert.status === 'revoked' ? 1 : 0.95 }}
                      aria-label={`Download certificate ${cert.certificateNumber}`}
                    >
                      {downloadingId === cert._id
                        ? <><SimpleLoader /> Saving...</>
                        : <><Download size={14} /> PDF</>}
                    </motion.button>
                    {isAdmin && cert.status !== 'revoked' && (
                      <button
                        onClick={(e) => handleRevoke(e, cert)}
                        className="btn btn-secondary"
                        disabled={revokingId === cert._id}
                        style={{ color: 'var(--color-error)', gap: '0.35rem', padding: '0.5rem 0.6rem' }}
                        aria-label={`Revoke certificate ${cert.certificateNumber}`}
                      >
                        {revokingId === cert._id ? <><SimpleLoader />...</> : 'Revoke'}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem', alignItems: 'center' }}>
              <button
                onClick={() => navigate(`?page=${Math.max(1, page - 1)}`)}
                disabled={page === 1}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem' }}
              >Previous</button>
              <span style={{ color: 'var(--color-body)' }}>Page {page} of {totalPages}</span>
              <button
                onClick={() => navigate(`?page=${Math.min(totalPages, page + 1)}`)}
                disabled={page === totalPages}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem' }}
              >Next</button>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {previewCert && <CertificatePreview certificate={previewCert} onClose={() => setPreviewCert(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {shareCert && <CertificateShare certificate={shareCert} onClose={() => setShareCert(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default Certificates;

