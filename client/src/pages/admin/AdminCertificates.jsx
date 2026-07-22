import SimpleLoader from '../../components/common/SimpleLoader';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Plus, Eye, Share2, Trash2, ShieldCheck, ShieldX, RefreshCw, FileText, Award, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  searchCertificates,
  approveCertificate,
  rejectCertificate,
  revokeCertificate,
  deleteCertificate,
  bulkGenerateCertificates,
  autoGenerateCertificates,
  adminGenerateCertificate,
} from '../../services/certificateService';
import { getAllPrograms } from '../../services/programsService';
import CertificatePreview from '../../components/certificates/CertificatePreview';
import CertificateShare from '../../components/certificates/CertificateShare';
import StatusBadge from '../../components/volunteer/StatusBadge';

import ConfirmModal from '../../components/admin/ConfirmModal';
import toast from 'react-hot-toast';

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [previewCert, setPreviewCert] = useState(null);
  const [shareCert, setShareCert] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);

  // Issue certificate modal state
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueForm, setIssueForm] = useState({ userId: '', programId: '', volunteerHours: '', skillsEarned: '', description: '', completionDate: '' });
  const [issueLoading, setIssueLoading] = useState(false);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        sort,
        filter,
      };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      const res = await searchCertificates(params);
      if (res.success) {
        setCertificates(res.data?.certificates || []);
        setTotalPages(Math.ceil((res.data?.total || 0) / 12) || 1);
      }
    } catch (err) {
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const fetchPrograms = async () => {
    try {
      const res = await getAllPrograms();
      if (res.success) {
        setPrograms(res.data?.programs || []);
      }
    } catch {
      // silent
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [page, sort, filter]);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCertificates();
  };

  const handleApprove = async (e, id) => {
    e.stopPropagation();
    setActionLoading((prev) => ({ ...prev, [`approve-${id}`]: true }));
    try {
      const res = await approveCertificate(id);
      if (res.success) {
        toast.success('Certificate approved');
        setCertificates((prev) => prev.map((c) => (c._id === id ? res.data : c)));
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to approve certificate');
    } finally {
      setActionLoading((prev) => ({ ...prev, [`approve-${id}`]: false }));
    }
  };

  const handleReject = async (e, id) => {
    e.stopPropagation();
    setActionLoading((prev) => ({ ...prev, [`reject-${id}`]: true }));
    try {
      const res = await rejectCertificate(id);
      if (res.success) {
        toast.success('Certificate rejected');
        setCertificates((prev) => prev.map((c) => (c._id === id ? res.data : c)));
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to reject certificate');
    } finally {
      setActionLoading((prev) => ({ ...prev, [`reject-${id}`]: false }));
    }
  };

  const handleRevoke = async (e, id) => {
    e.stopPropagation();
    setActionLoading((prev) => ({ ...prev, [`revoke-${id}`]: true }));
    try {
      const res = await revokeCertificate(id);
      if (res.success) {
        toast.success('Certificate revoked');
        setCertificates((prev) => prev.map((c) => (c._id === id ? { ...c, status: 'revoked' } : c)));
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to revoke certificate');
    } finally {
      setActionLoading((prev) => ({ ...prev, [`revoke-${id}`]: false }));
    }
  };

  const handleDelete = async () => {
    if (!confirmTarget) return;
    setActionLoading((prev) => ({ ...prev, [`delete-${confirmTarget}`]: true }));
    try {
      const res = await deleteCertificate(confirmTarget);
      if (res.success) {
        toast.success('Certificate deleted');
        setCertificates((prev) => prev.filter((c) => c._id !== confirmTarget));
        setShowConfirm(false);
        setConfirmTarget(null);
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to delete certificate');
    } finally {
      setActionLoading((prev) => ({ ...prev, [`delete-${confirmTarget}`]: false }));
    }
  };

  const handleBulkGenerate = async () => {
    if (!selectedProgram) {
      toast.error('Please select a program');
      return;
    }
    setBulkLoading(true);
    try {
      const res = await autoGenerateCertificates(selectedProgram);
      if (res.success) {
        toast.success(`Generated ${res.data?.generated || 0} certificates`);
        fetchCertificates();
        setSelectedProgram('');
      }
    } catch (err) {
      toast.error(err?.message || 'Bulk generation failed');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleIssueCertificate = async (e) => {
    e.preventDefault();
    setIssueLoading(true);
    try {
      const payload = {
        userId: issueForm.userId,
        programId: issueForm.programId,
        volunteerHours: Number(issueForm.volunteerHours) || 0,
        skillsEarned: issueForm.skillsEarned ? issueForm.skillsEarned.split(',').map((s) => s.trim()).filter(Boolean) : [],
        description: issueForm.description,
        completionDate: issueForm.completionDate || undefined,
      };
      const res = await adminGenerateCertificate(payload);
      if (res.success) {
        toast.success('Certificate issued successfully');
        setShowIssueModal(false);
        setIssueForm({ userId: '', programId: '', volunteerHours: '', skillsEarned: '', description: '', completionDate: '' });
        fetchCertificates();
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to issue certificate');
    } finally {
      setIssueLoading(false);
    }
  };

  const [headerActionsEl, setHeaderActionsEl] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      const el = document.getElementById('dashboard-header-actions');
      if (el) setHeaderActionsEl(el);
    }, 0);
  }, []);

  return (
    <div style={{ padding: '0.5rem 0 2rem 0' }}>
      {headerActionsEl && createPortal(
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'nowrap' }}>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 'var(--text-sm)', minWidth: '160px' }}
            aria-label="Select program for bulk generation"
          >
            <option value="">Select Program</option>
            {programs.map((p) => (
              <option key={p._id || p.id} value={p._id || p.id}>{p.title}</option>
            ))}
          </select>
          <button
            className="btn btn-secondary"
            onClick={handleBulkGenerate}
            disabled={!selectedProgram || bulkLoading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
          >
            {bulkLoading ? <><RefreshCw size={16} className="animate-spin" /> Generating...</> : <><Plus size={16} /> Auto Generate</>}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowIssueModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
          >
            <UserPlus size={16} /> Issue Certificate
          </button>
        </div>,
        headerActionsEl
      )}

      <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            type="text"
            placeholder="Search by certificate ID, volunteer, or program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '0.75rem 2.5rem 0.75rem 2.75rem',
              borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
              fontSize: 'var(--text-base)', outline: 'none', backgroundColor: 'var(--color-card)',
              color: 'var(--color-heading)',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            aria-label="Search certificates"
          />
          {searchQuery && (
            <button type="button" onClick={() => { setSearchQuery(''); setPage(1); fetchCertificates(); }} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-body)' }} aria-label="Clear search">
              <ShieldX size={16} />
            </button>
          )}
        </div>
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(1); }}
          style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 'var(--text-sm)' }}
          aria-label="Filter certificates"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="revoked">Revoked</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 'var(--text-sm)' }}
          aria-label="Sort certificates"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        <button type="submit" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={16} /> Search
        </button>
      </form>

      {loading ? (
        <SimpleLoader />
      ) : certificates.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <FileText size={56} style={{ color: 'var(--color-border)', margin: '0 auto 1.5rem' }} />
          <h3 style={{ marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>No Certificates Found</h3>
          <p style={{ color: 'var(--color-body)', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
            {searchQuery || filter !== 'all' ? 'Try adjusting your search or filters.' : 'No certificates have been issued yet.'}
          </p>
        </div>
      ) : (
        <>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '1rem 1.5rem', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-body)' }}>Certificate</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-body)' }}>Volunteer</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-body)' }}>Program</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-body)' }}>Hours</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-body)' }}>Status</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-body)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((cert) => (
                    <motion.tr
                      key={cert._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }}
                      onClick={() => window.open(`/certificates/${cert._id}`, '_blank')}
                    >
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-purple)', display: 'flex' }}>
                            <Award size={18} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', fontFamily: 'monospace' }}>{cert.certificateNumber}</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-body)', opacity: 0.7 }}>
                              {new Date(cert.issuedAt).toLocaleDateString('en-IN')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: 'var(--text-base)' }}>{cert.user?.name || 'N/A'}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: 'var(--text-base)' }}>{cert.program?.title || 'N/A'}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: 'var(--text-base)' }}>{cert.volunteerHours}h</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <StatusBadge status={cert.status === 'issued' ? 'approved' : cert.status === 'revoked' ? 'rejected' : cert.status} />
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <button className="btn btn-secondary" style={{ padding: '0.4rem', minWidth: 32 }} onClick={(e) => { e.stopPropagation(); setPreviewCert(cert); }} aria-label="Preview">
                            <Eye size={14} />
                          </button>
                          <button className="btn btn-secondary" style={{ padding: '0.4rem', minWidth: 32 }} onClick={(e) => { e.stopPropagation(); setShareCert(cert); }} aria-label="Share">
                            <Share2 size={14} />
                          </button>
                          {cert.status === 'pending' && (
                            <>
                              <button className="btn btn-secondary" style={{ padding: '0.4rem', minWidth: 32, color: 'var(--color-success)' }} onClick={(e) => handleApprove(e, cert._id)} disabled={actionLoading[`approve-${cert._id}`]} aria-label="Approve">
                                {actionLoading[`approve-${cert._id}`] ? <><RefreshCw size={14} className="animate-spin" /></> : <ShieldCheck size={14} />}
                              </button>
                              <button className="btn btn-secondary" style={{ padding: '0.4rem', minWidth: 32, color: 'var(--color-error)' }} onClick={(e) => handleReject(e, cert._id)} disabled={actionLoading[`reject-${cert._id}`]} aria-label="Reject">
                                {actionLoading[`reject-${cert._id}`] ? <><RefreshCw size={14} className="animate-spin" /></> : <ShieldX size={14} />}
                              </button>
                            </>
                          )}
                          {cert.status !== 'revoked' && (
                            <button className="btn btn-secondary" style={{ padding: '0.4rem', minWidth: 32, color: 'var(--color-error)' }} onClick={(e) => handleRevoke(e, cert._id)} disabled={actionLoading[`revoke-${cert._id}`]} aria-label="Revoke">
                              {actionLoading[`revoke-${cert._id}`] ? <><RefreshCw size={14} className="animate-spin" /></> : <Trash2 size={14} />}
                            </button>
                          )}
                          {(cert.status === 'rejected' || cert.status === 'pending') && (
                            <button className="btn btn-secondary" style={{ padding: '0.4rem', minWidth: 32 }} onClick={() => { setConfirmTarget(cert._id); setShowConfirm(true); }} disabled={actionLoading[`delete-${cert._id}`]} aria-label="Delete">
                              {actionLoading[`delete-${cert._id}`] ? <><RefreshCw size={14} className="animate-spin" /></> : <Trash2 size={14} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem', alignItems: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft size={16} /> Previous
              </button>
              <span style={{ color: 'var(--color-body)', fontSize: 'var(--text-base)' }}>Page {page} of {totalPages}</span>
              <button className="btn btn-secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                Next <ChevronRight size={16} />
              </button>
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
      <ConfirmModal
        isOpen={showConfirm}
        title="Delete Certificate"
        message="Are you sure you want to delete this certificate? This action cannot be undone."
        onCancel={() => { setShowConfirm(false); setConfirmTarget(null); }}
        onConfirm={handleDelete}
      />

      <AnimatePresence>
        {showIssueModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}
            onClick={() => setShowIssueModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: '2rem', maxWidth: 560, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-xl)', position: 'relative' }}
            >
              <button onClick={() => setShowIssueModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.05)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-body)' }} aria-label="Close">
                <ShieldX size={18} />
              </button>

              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 700, margin: '0 0 1rem 0' }}>Issue New Certificate</h3>
              <p style={{ color: 'var(--color-body)', fontSize: 'var(--text-sm)', margin: '0 0 1.5rem 0' }}>
                Manually issue a certificate to a volunteer for a completed program.
              </p>

              <form onSubmit={handleIssueCertificate}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem', display: 'block' }}>Volunteer ID <span style={{ color: 'var(--color-error)' }}>*</span></label>
                    <input
                      type="text"
                      value={issueForm.userId}
                      onChange={(e) => setIssueForm((p) => ({ ...p, userId: e.target.value }))}
                      placeholder="Enter volunteer user ID"
                      required
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 'var(--text-base)', outline: 'none' }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem', display: 'block' }}>Program <span style={{ color: 'var(--color-error)' }}>*</span></label>
                    <select
                      value={issueForm.programId}
                      onChange={(e) => setIssueForm((p) => ({ ...p, programId: e.target.value }))}
                      required
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 'var(--text-base)', outline: 'none', backgroundColor: 'white' }}
                    >
                      <option value="">Select a program</option>
                      {programs.map((p) => (
                        <option key={p._id || p.id} value={p._id || p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem', display: 'block' }}>Volunteer Hours</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={issueForm.volunteerHours}
                      onChange={(e) => setIssueForm((p) => ({ ...p, volunteerHours: e.target.value }))}
                      placeholder="e.g. 40"
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 'var(--text-base)', outline: 'none' }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem', display: 'block' }}>Skills Earned <span style={{ fontSize: 'var(--text-xs)', fontWeight: 400, color: 'var(--color-body)' }}>(comma separated)</span></label>
                    <input
                      type="text"
                      value={issueForm.skillsEarned}
                      onChange={(e) => setIssueForm((p) => ({ ...p, skillsEarned: e.target.value }))}
                      placeholder="e.g. Communication, Leadership, Teamwork"
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 'var(--text-base)', outline: 'none' }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem', display: 'block' }}>Completion Date</label>
                    <input
                      type="date"
                      value={issueForm.completionDate}
                      onChange={(e) => setIssueForm((p) => ({ ...p, completionDate: e.target.value }))}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 'var(--text-base)', outline: 'none' }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.35rem', display: 'block' }}>Description</label>
                    <textarea
                      value={issueForm.description}
                      onChange={(e) => setIssueForm((p) => ({ ...p, description: e.target.value }))}
                      placeholder="Optional certificate description"
                      rows={3}
                      style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: 'var(--text-base)', outline: 'none', resize: 'vertical' }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowIssueModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={issueLoading}>
                    {issueLoading ? <><RefreshCw size={16} className="animate-spin" /> Issuing...</> : 'Issue Certificate'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCertificates;
