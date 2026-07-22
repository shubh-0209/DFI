/**
 * AdminPrograms.jsx  —  Program Management Page
 *
 * Features:
 *  • Stats cards: Total / Active / Draft / Completed
 *  • Search bar (client-side instant filter)
 *  • Filter by Status dropdown
 *  • Filter by Category dropdown
 *  • Professional table with status badges, category chips, date, applications count
 *  • Proper empty state with CTA when no programs exist
 *  • Loading skeleton rows
 *  • Create / Edit via ProgramModal (auto-refreshes list on success)
 *  • Soft-delete with confirmation
 *  • Publish shortcut button on draft rows
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Edit2, Trash2, Send,
  Briefcase, CheckCircle2, FileText, Archive,
  CalendarDays, MapPin, Users, ChevronDown,
  FolderOpen, X, QrCode,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { getAllPrograms, deleteProgram, publishProgram, archiveProgram, restoreProgram } from '../../services/programsService';
import ProgramModal from '../../components/admin/ProgramModal';
import ProgramQrModal from '../../components/admin/ProgramQrModal';

/* ─── config ─────────────────────────────────────────────────────────────── */

const STATUS_CONFIG = {
  draft: { label: 'Draft', bg: '#EFF6FF', color: '#2563EB', dot: '#2563EB' },
  pending_approval: { label: 'Pending Approval', bg: '#FEF3C7', color: '#D97706', dot: '#D97706' },
  published: { label: 'Published', bg: '#F0FDF4', color: '#16A34A', dot: '#16A34A' },
  registration_closed: { label: 'Reg. Closed', bg: '#FFF7ED', color: '#EA580C', dot: '#EA580C' },
  ongoing: { label: 'Ongoing', bg: '#F0FDF4', color: '#059669', dot: '#059669' },
  completed: { label: 'Completed', bg: '#F5F3FF', color: 'var(--color-primary)', dot: 'var(--color-primary)' },
  cancelled: { label: 'Cancelled', bg: '#FEF2F2', color: '#DC2626', dot: '#DC2626' },
  archived: { label: 'Archived', bg: '#F1F5F9', color: '#64748B', dot: '#94A3B8' },
};

const MODE_LABELS = { online: 'Online', offline: 'Offline', hybrid: 'Hybrid' };

const CATEGORY_OPTIONS = [
  'Education', 'Environment', 'Health', 'Community',
  'Animal Welfare', 'Disaster Relief', 'Arts & Culture',
  'Technology', 'Sports', 'Other',
];

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'registration_closed', label: 'Reg. Closed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'archived', label: 'Archived' },
];

/* ─── helpers ────────────────────────────────────────────────────────────── */

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ─── sub-components ─────────────────────────────────────────────────────── */

const StatusBadge = React.memo(({ status }) => {
  const cfg = STATUS_CONFIG[status] || { label: status, bg: '#F1F5F9', color: '#64748B', dot: '#94A3B8' };
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
});

const StatCard = React.memo(({ icon: Icon, label, value, color, bg, loading }) => (
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
    <div style={{
      width: 44, height: 44, borderRadius: 12,
      background: bg, color,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
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
));

const SkeletonRow = React.memo(() => (
  <tr>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <td key={i} style={{ padding: '1rem 1.25rem' }}>
        <div className="skeleton" style={{ height: 16, borderRadius: 6, width: i === 1 ? '70%' : '50%' }} />
      </td>
    ))}
  </tr>
));

const EmptyState = ({ hasFilters, onClearFilters, onCreateFirst }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '4rem 2rem', textAlign: 'center',
    }}
  >
    <div style={{
      width: 80, height: 80, borderRadius: '50%',
      background: 'var(--color-bg)', border: '2px dashed var(--color-border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem',
    }}>
      <FolderOpen size={32} style={{ color: 'var(--color-body)', opacity: 0.5 }} />
    </div>
    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-heading)', margin: '0 0 0.5rem' }}>
      {hasFilters ? 'No programs match your filters' : 'No Programs Created Yet'}
    </h3>
    <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-body)', margin: '0 0 1.5rem', maxWidth: 380, lineHeight: 1.6 }}>
      {hasFilters
        ? 'Try adjusting your search or filter criteria to find what you&apos;re looking for.'
        : 'Start building your volunteering platform by creating your first program.'}
    </p>
    {hasFilters ? (
      <button onClick={onClearFilters} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
        <X size={15} /> Clear Filters
      </button>
    ) : (
      <button onClick={onCreateFirst} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
        <Plus size={16} /> Create Your First Program
      </button>
    )}
  </motion.div>
);

/* ─── main component ─────────────────────────────────────────────────────── */

const AdminPrograms = () => {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProgram, setEditProgram] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [publishingId, setPublishingId] = useState(null);
  const [archivingId, setArchivingId] = useState(null);
  const [restoringId, setRestoringId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  const [qrProgramId, setQrProgramId] = useState(null);
  const [qrProgramTitle, setQrProgramTitle] = useState('');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const handleShowQr = useCallback((id, title) => {
    setQrProgramId(id);
    setQrProgramTitle(title);
    setIsQrModalOpen(true);
  }, []);

  /* ── data fetching ────────────────────────────────────────────── */

  const { data, isLoading } = useQuery({
    queryKey: ['admin-programs'],
    queryFn: async () => {
      const res = await getAllPrograms({ limit: 100 });
      return res.programs || [];
    },
    placeholderData: keepPreviousData,
  });

  const programs = data || [];

  /* ── derived stats ────────────────────────────────────────────── */

  const stats = useMemo(() => ({
    total: programs.length,
    active: programs.filter((p) => p.status === 'published' || p.status === 'ongoing').length,
    draft: programs.filter((p) => p.status === 'draft').length,
    completed: programs.filter((p) => p.status === 'completed').length,
  }), [programs]);

  /* ── client-side filtering ────────────────────────────────────── */

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return programs.filter((p) => {
      const matchSearch = !q ||
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q);
      const isArchived = p.status === 'archived';
      const matchArchiveFilter = isArchived ? (showArchived || statusFilter === 'archived') : !showArchived;
      const matchStatus = !statusFilter || p.status === statusFilter;
      const matchCategory = !categoryFilter || p.category === categoryFilter;
      return matchSearch && matchStatus && matchCategory && matchArchiveFilter;
    });
  }, [programs, search, statusFilter, categoryFilter, showArchived]);

  const hasFilters = Boolean(search || statusFilter || categoryFilter);

  const clearFilters = useCallback(() => {
    setSearch('');
    setStatusFilter('');
    setCategoryFilter('');
  }, []);

  /* ── actions ──────────────────────────────────────────────────── */

  const handleCreate = useCallback(() => {
    alert("clicked");
    console.log("clicked");

    setEditProgram(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((prog) => {
    setEditProgram(prog);
    setIsModalOpen(true);
  }, []);

  const handleModalSuccess = useCallback(() => {
    setIsModalOpen(false);
    // Invalidate both the programs list AND the dashboard summary so stat cards update
    queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
    queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['admin-programs-summary'] });
  }, [queryClient]);

  const handleDelete = useCallback(async (prog) => {
    const id = prog._id || prog.id;
    if (!window.confirm(`Delete "${prog.title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteProgram(id);
      toast.success('Program deleted.');
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['admin-programs-summary'] });
    } catch (err) {
      toast.error(err?.message || 'Failed to delete program.');
    } finally {
      setDeletingId(null);
    }
  }, [queryClient]);

  const handlePublish = useCallback(async (prog) => {
    const id = prog._id || prog.id;
    setPublishingId(id);
    try {
      await publishProgram(id);
      toast.success(`"${prog.title}" published!`);
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['admin-programs-summary'] });
    } catch (err) {
      toast.error(err?.message || 'Failed to publish program.');
    } finally {
      setPublishingId(null);
    }
  }, [queryClient]);

  const handleArchive = useCallback(async (prog) => {
    const id = prog._id || prog.id;
    if (!window.confirm(`Archive "${prog.title}"?`)) return;
    setArchivingId(id);
    try {
      await archiveProgram(id);
      toast.success('Program archived.');
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['admin-programs-summary'] });
    } catch (err) {
      toast.error(err?.message || 'Failed to archive program.');
    } finally {
      setArchivingId(null);
    }
  }, [queryClient]);

  const handleRestore = useCallback(async (prog) => {
    const id = prog._id || prog.id;
    if (!window.confirm(`Restore "${prog.title}"?`)) return;
    setRestoringId(id);
    try {
      await restoreProgram(id);
      toast.success('Program restored.');
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['admin-programs-summary'] });
    } catch (err) {
      toast.error(err?.message || 'Failed to restore program.');
    } finally {
      setRestoringId(null);
    }
  }, [queryClient]);

  /* ── render ───────────────────────────────────────────────────── */

  const [headerActionsEl, setHeaderActionsEl] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      const el = document.getElementById('dashboard-header-actions');
      if (el) setHeaderActionsEl(el);
    }, 0);
  }, []);

  return (
    <div style={{ padding: '0.5rem 0 2rem 0', maxWidth: 1400, margin: '0 auto' }}>

      {headerActionsEl && createPortal(
        <button
          className="btn btn-primary"
          onClick={handleCreate}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}
        >
          <Plus size={17} /> New Program
        </button>,
        headerActionsEl
      )}

      {/* ── Stats cards ───────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
        gap: '1rem', marginBottom: '1.75rem',
      }}>
        <StatCard icon={Briefcase} label="Total Programs" value={stats.total} color="var(--color-primary)" bg="color-mix(in srgb, var(--color-primary) 15%, transparent)" loading={isLoading} />
        <StatCard icon={CheckCircle2} label="Active" value={stats.active} color="var(--color-success)" bg="color-mix(in srgb, var(--color-success) 15%, transparent)" loading={isLoading} />
        <StatCard icon={FileText} label="Draft" value={stats.draft} color="var(--color-warning)" bg="color-mix(in srgb, var(--color-warning) 15%, transparent)" loading={isLoading} />
        <StatCard icon={Archive} label="Completed" value={stats.completed} color="var(--color-primary)" bg="color-mix(in srgb, var(--color-primary) 15%, transparent)" loading={isLoading} />
      </div>

      {/* ── Filters bar ───────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
        marginBottom: '1.25rem', alignItems: 'center',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
          <Search size={15} style={{
            position: 'absolute', left: '0.75rem', top: '50%',
            transform: 'translateY(-50%)', color: 'var(--color-body)', pointerEvents: 'none',
          }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, category, city…"
            className="form-control"
            style={{ paddingLeft: '2.25rem', paddingRight: search ? '2.25rem' : '0.875rem' }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute', right: '0.625rem', top: '50%',
                transform: 'translateY(-50%)', background: 'none', border: 'none',
                cursor: 'pointer', color: 'var(--color-body)', display: 'flex',
              }}
              aria-label="Clear search"
            >
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
            aria-label="Filter by status"
          >
            {STATUS_FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={14} style={{
            position: 'absolute', right: '0.625rem', top: '50%',
            transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-body)',
          }} />
        </div>

        {/* Category filter */}
        <div style={{ position: 'relative', flex: '0 0 auto' }}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-control"
            style={{ paddingRight: '2rem', minWidth: 160, appearance: 'none' }}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <ChevronDown size={14} style={{
            position: 'absolute', right: '0.625rem', top: '50%',
            transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-body)',
          }} />
        </div>

        {/* Show Archived filter */}
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '0.25rem' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--text-sm)', color: 'var(--color-heading)', cursor: 'pointer', userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
            />
            Show Archived
          </label>
        </div>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: 'var(--text-sm)' }}
          >
            <X size={13} /> Clear
          </button>
        )}

        {/* Result count */}
        {!isLoading && (
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-body)', marginLeft: 'auto', flexShrink: 0 }}>
            {filtered.length} program{filtered.length !== 1 ? 's' : ''}
            {hasFilters ? ' found' : ' total'}
          </span>
        )}
      </div>

      {/* ── Programs table ────────────────────────────────────────── */}
      <div style={{
        background: 'var(--color-card)', borderRadius: 14,
        border: '1px solid var(--color-border)', overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                {['Program', 'Category', 'Mode', 'Start Date', 'Status', 'Actions'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '0.875rem 1.25rem',
                      fontSize: 'var(--text-xs)', fontWeight: 700,
                      color: 'var(--color-body)', textTransform: 'uppercase',
                      letterSpacing: '0.05em', whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Loading skeletons */}
              {isLoading && [1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)}

              {/* Empty state */}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      hasFilters={hasFilters}
                      onClearFilters={clearFilters}
                      onCreateFirst={handleCreate}
                    />
                  </td>
                </tr>
              )}

              {/* Data rows */}
              <AnimatePresence>
                {!isLoading && filtered.map((prog, idx) => {
                  const id = prog._id || prog.id;
                  const isDeleting = deletingId === id;
                  const isPublishing = publishingId === id;

                  return (
                    <motion.tr
                      key={id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      style={{
                        borderBottom: '1px solid var(--color-border)',
                        background: isDeleting ? '#FEF2F2' : 'transparent',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => { if (!isDeleting) e.currentTarget.style.background = 'var(--color-bg)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = isDeleting ? '#FEF2F2' : 'transparent'; }}
                    >
                      {/* Program title + location */}
                      <td style={{ padding: '1rem 1.25rem', maxWidth: 280 }}>
                        <div style={{
                          fontWeight: 700, fontSize: 'var(--text-base)',
                          color: 'var(--color-heading)', marginBottom: '0.2rem',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {prog.title}
                        </div>
                        {(prog.city || prog.mode === 'online') && (
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-body)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <MapPin size={10} />
                            {prog.mode === 'online' ? 'Online' : prog.city}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        {prog.category ? (
                          <span style={{
                            display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 999,
                            background: '#F1F5F9', color: '#475569',
                            fontSize: 'var(--text-xs)', fontWeight: 600,
                          }}>
                            {prog.category}
                          </span>
                        ) : <span style={{ color: 'var(--color-body)', fontSize: 'var(--text-sm)' }}>—</span>}
                      </td>

                      {/* Mode */}
                      <td style={{ padding: '1rem 1.25rem', fontSize: 'var(--text-sm)', color: 'var(--color-body)' }}>
                        {MODE_LABELS[prog.mode] || prog.mode || '—'}
                      </td>

                      {/* Start date */}
                      <td style={{ padding: '1rem 1.25rem', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: 'var(--text-sm)', color: 'var(--color-body)' }}>
                          <CalendarDays size={13} />
                          {formatDate(prog.startDate)}
                        </div>
                      </td>

                      {/* Status badge */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <StatusBadge status={prog.status} />
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          {/* Publish shortcut — only for draft programs */}
                          {prog.status === 'draft' && (
                            <button
                              onClick={() => handlePublish(prog)}
                              disabled={isPublishing}
                              title="Publish Program"
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                padding: '0.35rem 0.7rem', borderRadius: 7,
                                background: '#F0FDF4', color: '#16A34A',
                                border: '1px solid #BBF7D0', cursor: 'pointer',
                                fontSize: 'var(--text-xs)', fontWeight: 700,
                                opacity: isPublishing ? 0.6 : 1,
                              }}
                            >
                              <Send size={12} />
                              {isPublishing ? '…' : 'Publish'}
                            </button>
                          )}

                          {/* Archive Program — only for published programs */}
                          {prog.status === 'published' && (
                            <button
                              onClick={() => handleArchive(prog)}
                              disabled={archivingId === id}
                              title="Archive Program"
                              style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: 32, height: 32, borderRadius: 7,
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-card)', cursor: 'pointer',
                                color: 'var(--color-body)',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-warning)'; e.currentTarget.style.color = 'var(--color-warning)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-body)'; }}
                            >
                              <Archive size={14} />
                            </button>
                          )}

                          {/* Restore Program — only for archived programs */}
                          {prog.status === 'archived' && (
                            <button
                              onClick={() => handleRestore(prog)}
                              disabled={restoringId === id}
                              title="Restore Program"
                              style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: 32, height: 32, borderRadius: 7,
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-card)', cursor: 'pointer',
                                color: 'var(--color-success)',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-success)'; e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-success)'; }}
                            >
                              <Send size={14} />
                            </button>
                          )}

                          {/* Display QR Shortcut */}
                          {(prog.mode === 'offline' || prog.mode === 'hybrid') && (
                            <button
                              onClick={() => handleShowQr(id, prog.title)}
                              title="Generate Attendance QR Code"
                              style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: 32, height: 32, borderRadius: 7,
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-card)', cursor: 'pointer',
                                color: 'var(--color-primary)',
                                marginRight: '0.1rem'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'rgba(79, 70, 229, 0.05)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                            >
                              <QrCode size={14} />
                            </button>
                          )}

                          {/* Edit */}
                          <button
                            onClick={() => handleEdit(prog)}
                            title="Edit Program"
                            style={{
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              width: 32, height: 32, borderRadius: 7,
                              border: '1px solid var(--color-border)',
                              background: 'var(--color-card)', cursor: 'pointer',
                              color: 'var(--color-body)',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-body)'; }}
                          >
                            <Edit2 size={14} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(prog)}
                            disabled={isDeleting}
                            title="Delete Program"
                            style={{
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              width: 32, height: 32, borderRadius: 7,
                              border: '1px solid var(--color-border)',
                              background: 'var(--color-card)', cursor: isDeleting ? 'not-allowed' : 'pointer',
                              color: isDeleting ? '#94A3B8' : 'var(--color-error)',
                              opacity: isDeleting ? 0.5 : 1,
                            }}
                            onMouseEnter={(e) => { if (!isDeleting) { e.currentTarget.style.borderColor = 'var(--color-error)'; e.currentTarget.style.background = '#FEF2F2'; } }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'var(--color-card)'; }}
                          >
                            <Trash2 size={14} />
                          </button>
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

      {/* ── Create / Edit modal ───────────────────────────────────── */}
      <ProgramModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        editData={editProgram}
      />

      <ProgramQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        programId={qrProgramId}
        programTitle={qrProgramTitle}
      />
    </div>
  );
};

export default AdminPrograms;
