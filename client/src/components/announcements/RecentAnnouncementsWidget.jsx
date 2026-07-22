/**
 * RecentAnnouncementsWidget.jsx
 *
 * Dashboard widget — shows 2-3 most recent published announcements.
 * Rules:
 *  • Pinned item always surfaces first
 *  • Expired items are filtered out
 *  • Hidden entirely when nothing to show (no empty placeholder)
 *  • Unread items get a blue dot and bold title
 *  • "View All Announcements" link in the footer
 */

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Megaphone, Pin, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAnnouncements } from '../../services/announcementsService';

const TYPE_COLOR = {
  general:     '#475569',
  program:     '#DB2777',
  emergency:   '#DC2626',
  maintenance: '#2563EB',
  event:       '#D97706',
  recruitment: '#16A34A',
  system:      '#64748B',
};

function formatRelative(d) {
  if (!d) return '';
  const diff = Math.floor((Date.now() - new Date(d)) / 86_400_000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7)  return `${diff} days ago`;
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const RecentAnnouncementsWidget = ({ limit = 3 }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['recent-announcements-widget', { limit: limit + 2 }],
    queryFn: async () => {
      const res = await getAnnouncements({
        page: 1,
        limit: limit + 2,   // fetch a couple extra so pinned can surface
        sortBy: 'createdAt',
        order: 'desc',
        status: 'published',
      });
      if (res.success) return res.data?.announcements || [];
      return [];
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  // Pinned first, then by date; drop expired; cap at `limit`
  const items = useMemo(() => {
    const now   = Date.now();
    const valid = (data || []).filter((a) => !a.expiresAt || new Date(a.expiresAt) > now);
    const pinned = valid.filter((a) =>  a.isPinned);
    const rest   = valid.filter((a) => !a.isPinned);
    return [...pinned, ...rest].slice(0, limit);
  }, [data, limit]);

  /* Skeleton */
  if (isLoading) {
    return (
      <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Megaphone size={17} className="text-primary" aria-hidden="true" />
          <h3 style={{ margin: 0 }}>Announcements</h3>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: 52, borderRadius: 8 }} />
        ))}
      </div>
    );
  }

  /* Hidden when empty */
  if (items.length === 0) return null;

  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Megaphone size={17} className="text-primary" aria-hidden="true" />
          <h3 style={{ margin: 0 }}>Announcements</h3>
        </div>
        <Link
          to="/announcements"
          style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 2 }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          View All
        </Link>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map((ann, idx) => {
          const id       = ann._id || ann.announcementId;
          const col      = TYPE_COLOR[ann.type] || '#475569';
          const isUnread = !ann.isRead;

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.22 }}
            >
              <Link
                to={`/announcements/${id}`}
                style={{
                  display: 'block',
                  padding: '0.65rem 0.875rem',
                  borderLeft: `3px solid ${col}`,
                  borderRadius: '0 8px 8px 0',
                  background: isUnread ? '#F0F9FF' : '#FAFAF8',
                  textDecoration: 'none',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  position: 'relative' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(3px)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Pinned label */}
                {ann.isPinned && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#92400E', marginBottom: '0.18rem' }}>
                    <Pin size={8} aria-hidden="true" /> Pinned
                  </div>
                )}

                {/* Title + unread dot */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <span style={{ color: 'var(--color-heading)', flex: 1, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {ann.title}
                  </span>
                  {isUnread && (
                    <span aria-label="Unread" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, marginTop: 4 }} />
                  )}
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.28rem', color: '#9CA3AF', flexWrap: 'wrap' }}>
                  <span style={{ padding: '0.1rem 0.4rem', borderRadius: 999, background: '#F1F5F9', color: col, textTransform: 'capitalize' }}>
                    {ann.type}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Clock size={9} aria-hidden="true" />
                    {formatRelative(ann.publishedAt || ann.createdAt)}
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* View All footer */}
      <Link
        to="/announcements"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
          padding: '0.5rem', borderRadius: 8,
          border: '1px solid var(--color-border)',
          color: 'var(--color-primary)',
          textDecoration: 'none', transition: 'background 0.15s' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(37,99,235,0.04)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        View All Announcements <ExternalLink size={12} aria-hidden="true" />
      </Link>
    </div>
  );
};

export default RecentAnnouncementsWidget;
