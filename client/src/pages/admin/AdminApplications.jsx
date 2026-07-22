import SimpleLoader from '../../components/common/SimpleLoader';
/**
 * AdminApplications.jsx  —  Admin Application Management Page
 *
 * Features:
 *  • Stats cards: Total / Pending / Approved / Rejected
 *  • Search (name, email, program) + Status filter — live client-side
 *  • Table with applicant avatar, program, date, status badge, actions
 *  • Approve / Reject individual applications (new dedicated endpoints)
 *  • Rejection reason modal
 *  • Optimistic UI updates — no full page reload after action
 *  • React Query for data + cache invalidation
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, FileCheck, Users, CheckCircle2, XCircle,
  Search, ChevronDown, X, Calendar, Eye, FolderOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getAdminApplications,
  approveApplication,
  rejectApplication,
} from '../../services/applicationsService';

/* ─── status config ──────────────────────────────────────────────────────── */

const STATUS_CONFIG = {
  applied:   { label: 'Pending',   bg: '#FEF3C7', color: '#92400E', dot: '#D97706' },
  approved:  { label: 'Approved',  bg: '#DCFCE7', color: '#14532D', dot: '#16A34A' },
  joined:    { label: 'Joined',    bg: '#DBEAFE', color: '#1E40AF', dot: '#2563EB' },
  rejected:  { label: 'Rejected',  bg: '#FEE2E2', color: '#991B1B', dot: '#DC2626' },
  withdrawn: { label: 'Withdrawn', bg: '#F1F5F9', color: '#334155', dot: '#64748B' },
  cancelled: { label: 'Cancelled', bg: '#F1F5F9', color: '#334155', dot: '#94A3B8' },
  completed: { label: 'Completed', bg: '#F3E8FF', color: '#5B21B6', dot: 'var(--color-primary)' },
};

const STATUS_FILTER_OPTIONS = [
  { value: '',          label: 'All Statuses' },
  { value: 'applied',   label: 'Pending'     },
  { value: 'approved',  label: 'Approved'    },
  { value: 'joined',    label: 'Joined'      },
  { value: 'rejected',  label: 'Rejected'    },
  { value: 'withdrawn', label: 'Withdrawn'   },
  { value: 'cancelled', label: 'Cancelled'   },
];

/* ─── sub-components ─────────────────────────────────────────────────────── */

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { label: status, bg: '#F1F5F9', color: '#334155', dot: '#64748B' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
      padding: '0.25rem 0.7rem', borderRadius: 999,
      background: cfg.bg, color: cfg.color,
      fontSize: 'var(--text-xs)', fontWeight: 700, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, color, bg, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      background: 'var(--color-card)', borderRadius: 14,
      padding: '1.25rem 1.5rem', border: '1px solid var(--color-border)',
      display: 'flex', alignItems: 'center', gap: '1rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}
  >
    <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={20} />
    </div>
    <div>
      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-body)', marginBottom: '0.2rem' }}>{label}</div>
      {loading
        ? <div className="skeleton" style={{ height: 28, width: 48, borderRadius: 6 }} />
        : <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-heading)', lineHeight: 1 }}>{value}</div>
      }
    </div>
  </motion.div>
);

const SkeletonRow = () => (
  <tr>
    {[1, 2, 3, 4, 5].map((i) => (
      <td key={i} style={{ padding: '1rem 1.25rem' }}>
        <div className="skeleton" style={{ height: 16, borderRadius: 6, width: i === 1 ? '70%' : '50%' }} />
      </td>
    ))}
  </tr>
);

/* ─── rejection reason modal ─────────────────────────────────────────────── */

const RejectModal = ({ app, onConfirm, onClose }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onConfirm(app._id || app.id, reason);
    setLoading(false);
  };

  if (!app) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          position: 'relative', background: 'var(--color-card)', borderRadius: 16,
          padding: '1.75rem', width: '100%', maxWidth: 480,
          boxShadow: 'var(--shadow-xl)', border: '1px solid var(--color-border)',
        }}
      >
        <h3 style={{ margin: '0 0 0.5rem', fontWeight: 700, color: 'var(--color-heading)', fontSize: 'var(--text-lg)' }}>
          Reject Application
        </h3>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-body)', margin: '0 0 1.25rem' }}>
          Rejecting application from <strong>{app.user?.name || 'this volunteer'}</strong> for{' '}
          <strong>{app.program?.title || 'this program'}</strong>.
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Reason <span style={{ color: 'var(--color-body)', fontWeight: 400 }}>(optional)</span></label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="form-control"
              rows={3}
              placeholder="e.g. Program capacity reached, qualifications mismatch…"
              maxLength={500}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              {loading ? <SimpleLoader /> : <XCircle size={15} />}
              Reject Application
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* ─── main component ─────────────────────────────────────────────────────── */

const AdminApplications = () => {
  const queryClient = useQueryClient();
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [rejectTarget, setRejectTarget] = useState(null);
  const [actioningId, setActioningId]   = useState(null);

  /* ── data ───────────────────────────────────────────────────── */

  const { data, isLoading } = useQuery({
    queryKey: ['admin-applications', statusFilter],
    queryFn: async () => {
      // Pass the status filter server-side to reduce payload size.
      // The server returns all applications for admin roles; volunteers
      // only see their own — role check is done server-side.
      const params = { limit: 200 };
      if (statusFilter) params.status = statusFilter;
      const res = await getAdminApplications(params);
      return res?.data?.applications || res?.applications || [];
    },
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
  });

  const applications = data || [];

  /* ── derived stats ──────────────────────────────────────────── */

  const stats = useMemo(() => ({
    total:    applications.length,
    pending:  applications.filter((a) => a.status === 'applied').length,
    approved: applications.filter((a) => a.status === 'approved' || a.status === 'joined').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  }), [applications]);

  /* ── client-side filtering ──────────────────────────────────── */

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return applications.filter((app) => {
      const name    = (app.user?.name  || '').toLowerCase();
      const email   = (app.user?.email || '').toLowerCase();
      const program = (app.program?.title || '').toLowerCase();
      // Status already filtered server-side; client-side search only
      return !q || name.includes(q) || email.includes(q) || program.includes(q);
    });
  }, [applications, search]);

  /* ── actions ────────────────────────────────────────────────── */

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['admin-applications'] }); // clears all status variants
    queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
  }, [queryClient]);

  const handleApprove = useCallback(async (id) => {
    setActioningId(id);
    try {
      await approveApplication(id);
      toast.success('Application approved!');
      // Optimistic update — patch the cached list without waiting for refetch
      const patchStatus = (old = []) =>
        old.map((a) => (a._id === id || a.id === id) ? { ...a, status: 'approved' } : a);
      queryClient.setQueriesData({ queryKey: ['admin-applications'] }, patchStatus);
      invalidate();
    } catch (err) {
      toast.error(err?.message || 'Failed to approve application.');
    } finally {
      setActioningId(null);
    }
  }, [queryClient, invalidate]);

  const handleRejectConfirm = useCallback(async (id, reason) => {
    setActioningId(id);
    try {
      await rejectApplication(id, reason);
      toast.success('Application rejected.');
      const patchStatus = (old = []) =>
        old.map((a) => (a._id === id || a.id === id) ? { ...a, status: 'rejected' } : a);
      queryClient.setQueriesData({ queryKey: ['admin-applications'] }, patchStatus);
      invalidate();
    } catch (err) {
      toast.error(err?.message || 'Failed to reject application.');
    } finally {
      setActioningId(null);
      setRejectTarget(null);
    }
  }, [queryClient, invalidate]);

  /* ── render ──────────────────────────────────────────────────── */

  return (
    <div style={{ padding: '2rem', maxWidth: 1400, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-heading)', margin: 0 }}>
          Application Management
        </h1>
        <p style={{ color: 'var(--color-body)', margin: '0.3rem 0 0', fontSize: 'var(--text-base)' }}>
          Review, approve, and reject volunteer applications across all programs.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <StatCard icon={Users}       label="Total Applications" value={stats.total}    color="var(--color-primary)" bg="color-mix(in srgb, var(--color-primary) 15%, transparent)" loading={isLoading} />
        <StatCard icon={FileCheck}   label="Pending Review"     value={stats.pending}  color="#D97706" bg="#FEF3C7" loading={isLoading} />
        <StatCard icon={CheckCircle2}label="Approved"           value={stats.approved} color="#16A34A" bg="#DCFCE7" loading={isLoading} />
        <StatCard icon={XCircle}     label="Rejected"           value={stats.rejected} color="#DC2626" bg="#FEE2E2" loading={isLoading} />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)', pointerEvents: 'none' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or program…"
            className="form-control"
            style={{ paddingLeft: '2.25rem', paddingRight: search ? '2.25rem' : '0.875rem' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.625rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-body)', display: 'flex' }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <div style={{ position: 'relative', flex: '0 0 auto' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-control"
            style={{ paddingRight: '2rem', minWidth: 160, appearance: 'none' }}
          >
            {STATUS_FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: '0.625rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-body)' }} />
        </div>

        {/* Result count */}
        {!isLoading && (
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-body)', marginLeft: 'auto', flexShrink: 0 }}>
            {filtered.length} application{filtered.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Table */}
      <div style={{ background: 'var(--color-card)', borderRadius: 14, border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                {['Applicant', 'Program', 'Applied On', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '0.875rem 1.25rem', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-body)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && [1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)}

              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
                      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-bg)', border: '2px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                        <FolderOpen size={28} style={{ color: 'var(--color-body)', opacity: 0.4 }} />
                      </div>
                      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-heading)', margin: '0 0 0.4rem' }}>
                        {search || statusFilter ? 'No applications match your filters' : 'No Applications Yet'}
                      </h3>
                      <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-body)', margin: 0 }}>
                        {search || statusFilter ? 'Try adjusting your search or filter.' : 'Applications will appear here once volunteers start applying.'}
                      </p>
                      {(search || statusFilter) && (
                        <button onClick={() => { setSearch(''); setStatusFilter(''); }} className="btn btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: 'var(--text-sm)' }}>
                          <X size={13} /> Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              <AnimatePresence>
                {!isLoading && filtered.map((app, idx) => {
                  const id       = app._id || app.id;
                  const name     = app.user?.name  || 'Unknown Volunteer';
                  const email    = app.user?.email || '';
                  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
                  const progName = app.program?.title || 'Unknown Program';
                  const isActioning = actioningId === id;
                  const isPending = app.status === 'applied';
                  const isApproved = app.status === 'approved' || app.status === 'joined';
                  const isRejected = app.status === 'rejected';

                  return (
                    <motion.tr
                      key={id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      style={{ borderBottom: '1px solid var(--color-border)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-bg)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      {/* Applicant */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-sm)', fontWeight: 700, flexShrink: 0 }}>
                            {initials}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 700, color: 'var(--color-heading)', fontSize: 'var(--text-base)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>
                              {name}
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-body)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>
                              {email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Program */}
                      <td style={{ padding: '1rem 1.25rem', maxWidth: 220 }}>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--color-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {progName}
                        </div>
                        {app.program?.category && (
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-body)', marginTop: '0.15rem' }}>
                            {app.program.category}
                          </div>
                        )}
                      </td>

                      {/* Applied on */}
                      <td style={{ padding: '1rem 1.25rem', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: 'var(--text-sm)', color: 'var(--color-body)' }}>
                          <Calendar size={13} />
                          {new Date(app.appliedAt || app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <StatusBadge status={app.status} />
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          {/* Approve */}
                          {!isApproved && !isRejected && (
                            <button
                              onClick={() => handleApprove(id)}
                              disabled={isActioning}
                              title="Approve"
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                padding: '0.32rem 0.7rem', borderRadius: 7,
                                background: '#DCFCE7', color: '#15803D',
                                border: '1px solid #BBF7D0',
                                cursor: isActioning ? 'not-allowed' : 'pointer',
                                fontSize: 'var(--text-xs)', fontWeight: 700,
                                opacity: isActioning ? 0.6 : 1,
                              }}
                            >
                              {isActioning ? <SimpleLoader /> : <CheckCircle2 size={12} />}
                              Approve
                            </button>
                          )}

                          {/* Reject */}
                          {!isRejected && (
                            <button
                              onClick={() => setRejectTarget(app)}
                              disabled={isActioning}
                              title="Reject"
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                padding: '0.32rem 0.7rem', borderRadius: 7,
                                background: '#FEE2E2', color: '#DC2626',
                                border: '1px solid #FECACA',
                                cursor: isActioning ? 'not-allowed' : 'pointer',
                                fontSize: 'var(--text-xs)', fontWeight: 700,
                                opacity: isActioning ? 0.6 : 1,
                              }}
                            >
                              <XCircle size={12} /> Reject
                            </button>
                          )}

                          {/* Already-decided badges */}
                          {isApproved && (
                            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: '#16A34A', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <CheckCircle2 size={13} /> Approved
                            </span>
                          )}
                          {isRejected && (
                            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: '#DC2626', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <XCircle size={13} /> Rejected
                            </span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject modal */}
      <AnimatePresence>
        {rejectTarget && (
          <RejectModal
            app={rejectTarget}
            onConfirm={handleRejectConfirm}
            onClose={() => setRejectTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminApplications;
