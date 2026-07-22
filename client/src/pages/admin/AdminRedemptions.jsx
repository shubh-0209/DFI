import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Package, Search, X, ChevronDown, MapPin, Truck,
  CheckCircle, XCircle, Clock, BadgeCheck, Coins, User,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminGetAllRedemptions, adminUpdateRedemptionStatus } from '../../services/marketplaceService';

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#F59E0B', bg: 'rgba(245,158,11,0.10)', icon: <Clock       size={14} /> },
  approved:  { label: 'Approved',  color: '#3B82F6', bg: 'rgba(59,130,246,0.10)', icon: <BadgeCheck  size={14} /> },
  shipped:   { label: 'Shipped',   color: '#8B5CF6', bg: 'rgba(139,92,246,0.10)', icon: <Truck       size={14} /> },
  delivered: { label: 'Delivered', color: '#10B981', bg: 'rgba(16,185,129,0.10)', icon: <CheckCircle size={14} /> },
  cancelled: { label: 'Cancelled', color: '#EF4444', bg: 'rgba(239,68,68,0.10)',  icon: <XCircle     size={14} /> },
};

// What transitions are allowed from each status
const NEXT_ACTIONS = {
  pending:  [{ status: 'approved',  label: 'Approve' }, { status: 'cancelled', label: 'Cancel' }],
  approved: [{ status: 'shipped',   label: 'Mark Shipped' }, { status: 'cancelled', label: 'Cancel' }],
  shipped:  [{ status: 'delivered', label: 'Mark Delivered' }],
  delivered: [],
  cancelled: [],
};

// Action button colours
const ACTION_COLORS = {
  approved:  { bg: 'var(--color-primary)', hover: 'var(--color-primary-hover)' },
  shipped:   { bg: '#7C3AED', hover: '#6D28D9' },
  delivered: { bg: '#059669', hover: '#047857' },
  cancelled: { bg: '#DC2626', hover: '#B91C1C' },
};

// ── Status badge ──────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.04em', padding: '0.25rem 0.625rem',
      borderRadius: '999px', background: cfg.bg, color: cfg.color,
      whiteSpace: 'nowrap',
    }}>
      {cfg.icon}{cfg.label}
    </span>
  );
};

// ── Update status modal ───────────────────────────────────────────────────────

const UpdateModal = ({ redemption, targetStatus, onClose, onSuccess }) => {
  const [notes, setNotes]               = useState('');
  const [trackingNumber, setTracking]   = useState('');
  const [loading, setLoading]           = useState(false);
  const needsTracking                   = targetStatus === 'shipped';

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await adminUpdateRedemptionStatus(redemption._id, targetStatus, notes, trackingNumber);
      toast.success(`Redemption marked as ${targetStatus}.`);
      onSuccess();
    } catch {
      toast.error('Failed to update status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const actionCfg = STATUS_CONFIG[targetStatus];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', width: '100%', maxWidth: 440, padding: '1.5rem', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-lg)', margin: 0 }}>
            Update Status
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-body)', padding: '0.25rem' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: actionCfg?.bg, border: `1px solid ${actionCfg?.color}30` }}>
          <p style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 600, color: actionCfg?.color }}>
            Marking &ldquo;{redemption.rewardSnapshot?.name}&rdquo; as <strong>{actionCfg?.label}</strong>.
          </p>
          <p style={{ margin: '0.25rem 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-body)' }}>
            Volunteer: {redemption.user?.name || '—'} ({redemption.user?.email || '—'})
          </p>
        </div>

        {needsTracking && (
          <div style={{ marginBottom: '0.875rem' }}>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--color-heading)' }}>
              Tracking Number <span style={{ color: 'var(--color-body)', fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              type="text" value={trackingNumber} onChange={(e) => setTracking(e.target.value)}
              placeholder="e.g. DTDC123456789IN"
              style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', color: 'var(--color-heading)', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        )}

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--color-heading)' }}>
            Notes <span style={{ color: 'var(--color-body)', fontWeight: 400 }}>(sent to volunteer{targetStatus === 'cancelled' ? ' as reason' : ''})</span>
          </label>
          <textarea
            rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder={targetStatus === 'cancelled' ? 'Reason for cancellation...' : 'Any message for the volunteer...'}
            style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', color: 'var(--color-heading)', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onClose} disabled={loading} style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'transparent', fontSize: 'var(--text-base)', fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit} disabled={loading}
            style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: 'none', background: loading ? '#D1D5DB' : (ACTION_COLORS[targetStatus]?.bg || 'var(--color-primary)'), color: 'white', fontSize: 'var(--text-base)', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {loading
              ? <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> Saving...</>
              : `Confirm — ${actionCfg?.label}`
            }
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Address popover ───────────────────────────────────────────────────────────

const AddressCell = ({ address }) => {
  const [open, setOpen] = useState(false);
  if (!address?.line1) return <span style={{ color: 'var(--color-body)', fontSize: 'var(--text-sm)' }}>—</span>;
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '6px', padding: '0.25rem 0.625rem', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-primary)', cursor: 'pointer' }}
      >
        <MapPin size={12} /> View
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
          <div style={{ position: 'absolute', top: 'calc(100% + 0.5rem)', left: 0, zIndex: 20, background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', padding: '0.875rem 1rem', minWidth: 220, fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
            <p style={{ margin: 0, fontWeight: 700, color: 'var(--color-heading)' }}>{address.fullName}</p>
            <p style={{ margin: 0, color: 'var(--color-body)' }}>{address.line1}</p>
            <p style={{ margin: 0, color: 'var(--color-body)' }}>{address.city}, {address.state} — {address.pincode}</p>
            <p style={{ margin: 0, color: 'var(--color-body)' }}>📞 {address.phone}</p>
          </div>
        </>
      )}
    </div>
  );
};

// ── Stat tile ─────────────────────────────────────────────────────────────────

const StatTile = ({ label, value, color }) => (
  <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '1rem 1.25rem', flex: '1 1 120px', minWidth: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-body)', marginBottom: '0.35rem' }}>{label}</div>
    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, fontFamily: 'var(--font-heading)', color: color || 'var(--color-heading)', lineHeight: 1 }}>{value ?? 0}</div>
  </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────

const AdminRedemptions = () => {
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch]             = useState('');
  const [page, setPage]                 = useState(1);
  const [pendingUpdate, setPendingUpdate] = useState(null); // { redemption, targetStatus }

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-redemptions', statusFilter, search, page],
    queryFn: () => adminGetAllRedemptions({ status: statusFilter, search, page, limit: 20 }),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const redemptions  = data?.redemptions  || [];
  const total        = data?.total        || 0;
  const statusCounts = data?.statusCounts || {};
  const totalPages   = Math.ceil(total / 20);

  const handleUpdateSuccess = () => {
    setPendingUpdate(null);
    queryClient.invalidateQueries({ queryKey: ['admin-redemptions'] });
  };

  const FILTER_TABS = [
    { key: 'all',       label: `All (${total})` },
    { key: 'pending',   label: `Pending (${statusCounts.pending   ?? 0})` },
    { key: 'approved',  label: `Approved (${statusCounts.approved  ?? 0})` },
    { key: 'shipped',   label: `Shipped (${statusCounts.shipped   ?? 0})` },
    { key: 'delivered', label: `Delivered (${statusCounts.delivered ?? 0})` },
    { key: 'cancelled', label: `Cancelled (${statusCounts.cancelled ?? 0})` },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8F7F4', fontFamily: 'var(--font-primary)', padding: '0.5rem 0 3rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Global Statistics */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <StatTile label="Total"     value={total}                       color="var(--color-heading)" />
          <StatTile label="Pending"   value={statusCounts.pending}        color="#F59E0B" />
          <StatTile label="Approved"  value={statusCounts.approved}       color="#3B82F6" />
          <StatTile label="Shipped"   value={statusCounts.shipped}        color="#8B5CF6" />
          <StatTile label="Delivered" value={statusCounts.delivered}      color="#10B981" />
          <StatTile label="Cancelled" value={statusCounts.cancelled}      color="#EF4444" />
        </div>

        {/* Controls */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Status filter tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {FILTER_TABS.map((tab) => {
              const active = statusFilter === tab.key;
              return (
                <button key={tab.key} onClick={() => { setStatusFilter(tab.key); setPage(1); }}
                  style={{ padding: '0.45rem 0.875rem', borderRadius: '999px', border: active ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)', background: active ? 'var(--color-primary)' : 'var(--color-card)', color: active ? 'white' : 'var(--color-body)', fontSize: 'var(--text-sm)', fontWeight: active ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'var(--transition-fast)' }}>
                  {tab.label}
                </button>
              );
            })}
          </div>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)', pointerEvents: 'none' }} />
            <input
              type="text" value={search} placeholder="Search by redemption ID…"
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{ width: '100%', padding: '0.65rem 2.5rem 0.65rem 2.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)', fontSize: 'var(--text-base)', color: 'var(--color-heading)', outline: 'none', boxSizing: 'border-box' }}
            />
            {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-body)', display: 'flex', padding: '0.25rem' }}><X size={14} /></button>}
          </div>
        </div>

        {/* Table / card list */}
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '80px', borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : error ? (
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-error)', marginBottom: '1rem' }}>Failed to load redemptions.</p>
            <button onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-redemptions'] })} className="btn btn-primary">Retry</button>
          </div>
        ) : redemptions.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '3rem', textAlign: 'center' }}>
            <Package size={40} style={{ opacity: 0.25, margin: '0 auto 1rem', display: 'block' }} />
            <p style={{ color: 'var(--color-body)', fontWeight: 600 }}>No redemptions found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {redemptions.map((r) => {
              const statusCfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.pending;
              const actions   = NEXT_ACTIONS[r.status] || [];
              const date      = new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

              return (
                <div key={r._id} style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '1.25rem 1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                  {/* Reward image */}
                  <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', background: r.rewardSnapshot?.image ? `url(${r.rewardSnapshot.image}) center/cover no-repeat` : 'linear-gradient(135deg,#F8F7F4,#EDE9FE)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {!r.rewardSnapshot?.image && <Package size={20} style={{ opacity: 0.35 }} />}
                  </div>

                  {/* Info block */}
                  <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-heading)', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.rewardSnapshot?.name || '—'}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: 'var(--text-sm)', color: 'var(--color-body)' }}><User size={12} /> {r.user?.name || '—'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: 'var(--text-sm)', color: 'var(--color-body)' }}><Coins size={12} /> {r.totalCoinsDeducted?.toLocaleString()} coins</span>
                      {r.quantity > 1 && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-body)' }}>Qty: {r.quantity}</span>}
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-body)' }}>{date}</span>
                    </div>
                    <div style={{ marginTop: '0.3rem', fontSize: 'var(--text-xs)', color: 'var(--color-body)', fontFamily: 'monospace' }}>{r.redemptionId}</div>
                  </div>

                  {/* Address */}
                  <AddressCell address={r.deliveryAddress} />

                  {/* Tracking */}
                  {r.trackingNumber ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: 'var(--text-sm)', color: '#8B5CF6', fontWeight: 600 }}>
                      <Truck size={13} />{r.trackingNumber}
                    </div>
                  ) : null}

                  {/* Status badge */}
                  <StatusBadge status={r.status} />

                  {/* Action buttons */}
                  {actions.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {actions.map((action) => (
                        <button
                          key={action.status}
                          onClick={() => setPendingUpdate({ redemption: r, targetStatus: action.status })}
                          style={{ padding: '0.45rem 0.875rem', borderRadius: 'var(--radius-md)', border: 'none', background: ACTION_COLORS[action.status]?.bg || 'var(--color-primary)', color: 'white', fontSize: 'var(--text-sm)', fontWeight: 700, cursor: 'pointer', transition: 'var(--transition-fast)', whiteSpace: 'nowrap' }}
                          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'white', fontSize: 'var(--text-base)', fontWeight: 600, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>
              Previous
            </button>
            <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-body)', fontWeight: 500 }}>
              Page {page} of {totalPages}
            </span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'white', fontSize: 'var(--text-base)', fontWeight: 600, cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}>
              Next
            </button>
          </div>
        )}

      </div>

      {/* Update status modal */}
      {pendingUpdate && (
        <UpdateModal
          redemption={pendingUpdate.redemption}
          targetStatus={pendingUpdate.targetStatus}
          onClose={() => setPendingUpdate(null)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default AdminRedemptions;
