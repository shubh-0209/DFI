/**
 * Announcements.jsx  —  Volunteer Communication Center
 *
 * Layout:
 *   1. Page header  (title + subtitle)
 *   2. Pinned hero card (only when one announcement is pinned)
 *   3. Category pill filter row  (no search bar, no complex filters)
 *   4. Card grid  (expired items hidden, markRead fires on card click)
 *   5. Friendly empty state
 *   6. Pagination
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Pin, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';

import {
  getAnnouncements,
  markAnnouncementRead,
} from '../../services/announcementsService';
import { useAuth } from '../../context/AuthContext';
import AnnouncementCard      from '../../components/announcements/AnnouncementCard';
import AnnouncementSkeleton  from '../../components/announcements/AnnouncementSkeleton';
import AnnouncementEmptyState from '../../components/announcements/AnnouncementEmptyState';
import AnnouncementPagination from '../../components/announcements/AnnouncementPagination';

const PAGE_SIZE = 9;

/* ─── category pill row ──────────────────────────────────────────────────── */

const CATEGORIES = [
  { value: '',            label: 'All' },
  { value: 'general',     label: '📢  General' },
  { value: 'program',     label: '📅  Programs' },
  { value: 'event',       label: '🎉  Events' },
  { value: 'recruitment', label: '🤝  Opportunities' },
  { value: 'system',      label: '⚙️  Platform' },
  { value: 'emergency',   label: '🚨  Emergency' },
];

const CategoryPills = ({ active, onChange }) => (
  <div
    role="group"
    aria-label="Filter announcements by category"
    style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}
  >
    {CATEGORIES.map((cat) => {
      const on = active === cat.value;
      return (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          aria-pressed={on}
          style={{
            padding: '0.4rem 1rem', borderRadius: 999,
            border: `1.5px solid ${on ? 'var(--color-primary)' : 'var(--color-border)'}`,
            background: on ? 'var(--color-primary)' : 'var(--color-card)',
            color: on ? '#fff' : 'var(--color-body)',
            cursor: 'pointer', transition: 'all 0.18s' }}
          onMouseEnter={(e) => {
            if (!on) {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (!on) {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-body)';
            }
          }}
        >
          {cat.label}
        </button>
      );
    })}
  </div>
);

/* ─── pinned hero ────────────────────────────────────────────────────────── */

const PinnedHero = ({ announcement, onRead, navigate }) => {
  if (!announcement) return null;
  const id = announcement._id || announcement.announcementId;
  const isEmergency = announcement.type === 'emergency';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'relative',
        padding: '1.5rem 1.75rem',
        borderRadius: 16,
        background: isEmergency
          ? 'linear-gradient(135deg, #7f1d1d, #dc2626)'
          : 'linear-gradient(135deg, #1e3a8a, #2563eb)',
        color: '#fff',
        marginBottom: '2rem',
        boxShadow: '0 8px 28px rgba(0,0,0,0.14)',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem' }}
      onClick={() => {
        if (!announcement.isRead) onRead(id);
        navigate(`/announcements/${id}`);
      }}
    >
      {/* Decorative bubble */}
      <div aria-hidden="true" style={{ position: 'absolute', right: '-3rem', top: '-3rem', width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />

      {/* Pinned label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.8)' }}>
        <Pin size={12} aria-hidden="true" />
        📌 PINNED
      </div>

      <h2 style={{ margin: 0 }}>
        {announcement.title}
      </h2>

      <p style={{
        margin: 0, color: 'rgba(255,255,255,0.88)',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {announcement.message}
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {announcement.actionButton?.label && announcement.actionButton?.url && (
          <a
            href={announcement.actionButton.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 1.1rem', borderRadius: 8,
              background: 'rgba(255,255,255,0.18)', color: '#fff',
              textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)',
              transition: 'background 0.18s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.28)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
          >
            {announcement.actionButton.label} <ExternalLink size={13} aria-hidden="true" />
          </a>
        )}
        <span style={{ color: 'rgba(255,255,255,0.6)' }}>
          Tap to read full announcement →
        </span>
      </div>
    </motion.div>
  );
};

/* ─── main page ──────────────────────────────────────────────────────────── */

const Announcements = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage]   = useState(1);
  const [type, setType]   = useState('');

  const params = useMemo(() => {
    const p = { page, limit: PAGE_SIZE, sortBy: 'createdAt', order: 'desc', status: 'published' };
    if (type) p.type = type;
    return p;
  }, [page, type]);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['announcements', params],
    queryFn: async () => {
      const res = await getAnnouncements(params);
      if (res.success) {
        return {
          announcements: res.data?.announcements || [],
          total:      res.data?.pagination?.total      || 0,
          totalPages: res.data?.pagination?.totalPages || 1,
        };
      }
      throw new Error(res.message || 'Failed to load announcements');
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  // Strip expired items client-side (belt-and-suspenders)
  const now     = useMemo(() => Date.now(), []);
  const rawList = data?.announcements || [];
  const visible = useMemo(
    () => rawList.filter((a) => !a.expiresAt || new Date(a.expiresAt) > now),
    [rawList, now]
  );

  // Pinned item surfaces as hero; rest go into the grid
  const pinnedItem = useMemo(() => visible.find((a) => a.isPinned) || null, [visible]);
  const gridItems  = useMemo(
    () => visible.filter((a) => !a.isPinned),
    [visible, pinnedItem]
  );

  // Optimistically mark a card as read in the cache
  const handleMarkRead = useCallback(async (id) => {
    try {
      await markAnnouncementRead(id);
      queryClient.setQueryData(['announcements', params], (old) => {
        if (!old) return old;
        return {
          ...old,
          announcements: old.announcements.map((a) =>
            (a._id === id || a.announcementId === id) ? { ...a, isRead: true } : a
          ),
        };
      });
    } catch {
      // non-critical — fail silently
    }
  }, [queryClient, params]);

  const handleCategoryChange = useCallback((val) => {
    setType(val);
    setPage(1);
  }, []);

  return (
    <div style={{ padding: '0.5rem 0 3rem' }}>

      {/* ── Header ───────────────────────────────────────────────── */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h1 className="page-title" style={{ color: 'var(--color-heading)', margin: 0 }}>
              Announcements
            </h1>
            <p className="page-description" style={{ color: 'var(--color-body)', margin: '0.3rem 0 0' }}>
              Official updates and notices from Disha for India.
            </p>
          </div>

          {isFetching && !isLoading && (
            <span style={{ color: 'var(--color-body)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }} aria-live="polite">
              <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true" />
              Refreshing…
            </span>
          )}
        </div>
      </div>

      {/* ── Error ────────────────────────────────────────────────── */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.25rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, color: 'var(--color-error)', marginBottom: '1.5rem' }} role="alert">
          <AlertCircle size={16} aria-hidden="true" /> {error.message}
        </div>
      )}

      {/* ── Pinned hero ───────────────────────────────────────────── */}
      <AnimatePresence>
        {pinnedItem && (
          <PinnedHero
            key={pinnedItem._id || pinnedItem.announcementId}
            announcement={pinnedItem}
            onRead={handleMarkRead}
            navigate={navigate}
          />
        )}
      </AnimatePresence>

      {/* ── Category pills ────────────────────────────────────────── */}
      <CategoryPills active={type} onChange={handleCategoryChange} />

      {/* ── Content ───────────────────────────────────────────────── */}
      {isLoading ? (
        <AnnouncementSkeleton count={6} />
      ) : gridItems.length === 0 && !pinnedItem ? (
        <AnnouncementEmptyState
          title="No announcements at the moment"
          description="Check back soon for new updates, events, and important notices from Disha for India."
        />
      ) : (
        <>
          {gridItems.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
              gap: '1.25rem' }}>
              {gridItems.map((ann) => (
                <AnnouncementCard
                  key={ann._id || ann.announcementId}
                  announcement={ann}
                  onMarkRead={handleMarkRead}
                  onClick={() => {
                    if (!ann.isRead) handleMarkRead(ann._id || ann.announcementId);
                    navigate(`/announcements/${ann._id || ann.announcementId}`);
                  }}
                  showActions={false}
                />
              ))}
            </div>
          )}

          {(data?.totalPages || 1) > 1 && (
            <div style={{ marginTop: '2.5rem', padding: '1.25rem', background: 'var(--color-card)', borderRadius: 12, border: '1px solid var(--color-border)' }}>
              <AnnouncementPagination
                currentPage={page}
                totalPages={data?.totalPages || 1}
                totalItems={data?.total || 0}
                itemsPerPage={PAGE_SIZE}
                onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Announcements;
