/**
 * DashboardUnifiedFeed.jsx
 * Section 7 – "Updates"
 *
 * Merges notifications, announcements, and collaboration activity into a single
 * chronological feed, grouped by relative day (Today / Yesterday / earlier dates).
 *
 * Rules:
 *  - Hidden entirely when there are no items across all three sources.
 *  - Items are sorted newest-first before grouping.
 *  - Shows a max of 12 items total to keep the feed concise.
 *  - Each item type gets a distinct icon and colour so the volunteer can scan at a glance.
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Bell,
  Megaphone,
  Activity,
  ArrowRight,
} from 'lucide-react';

/* ─── helpers ───────────────────────────────────────────────────────────────── */

const MAX_ITEMS = 12;

/** Returns "Today", "Yesterday", or a locale date string. */
function relativeDay(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return 'Earlier';
  const today = new Date();
  const diff = Math.floor((today - d) / 86_400_000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  const days = Math.round(diff);
  if (days <= 6) return `${days} Days Ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Normalise heterogeneous sources into a common shape. */
function normalise(notifications, announcements, activities) {
  const items = [];

  (notifications || []).forEach((n) => {
    items.push({
      id: n._id || n.id,
      type: 'notification',
      title: n.title || 'Notification',
      body: n.message || '',
      date: n.createdAt || n.sentAt || new Date().toISOString(),
      unread: !n.read,
      link: '/notifications',
    });
  });

  (announcements || []).forEach((a) => {
    items.push({
      id: a._id || a.announcementId,
      type: 'announcement',
      title: a.title || 'Announcement',
      body: a.message || '',
      date: a.createdAt || new Date().toISOString(),
      unread: false,
      link: `/announcements/${a._id || a.announcementId}`,
    });
  });

  (activities || []).forEach((act) => {
    items.push({
      id: act._id || act.activityId,
      type: 'activity',
      title: act.action || act.title || 'Workspace Activity',
      body: act.workspaceName || '',
      date: act.createdAt || new Date().toISOString(),
      unread: false,
      link: '/collaboration/workspaces',
    });
  });

  // sort newest first, cap at MAX_ITEMS
  return items
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, MAX_ITEMS);
}

/** Groups a flat sorted array into { dayLabel: [items] } */
function groupByDay(items) {
  const groups = [];
  const seen = new Map();
  items.forEach((item) => {
    const label = relativeDay(item.date);
    if (!seen.has(label)) {
      seen.set(label, []);
      groups.push({ label, items: seen.get(label) });
    }
    seen.get(label).push(item);
  });
  return groups;
}

/* ─── per-type config ────────────────────────────────────────────────────────── */

const TYPE_CONFIG = {
  notification: {
    Icon: Bell,
    color: '#2563EB',
    bg: '#DBEAFE',
    viewAll: '/notifications',
  },
  announcement: {
    Icon: Megaphone,
    color: '#D97706',
    bg: '#FEF3C7',
    viewAll: '/announcements',
  },
  activity: {
    Icon: Activity,
    color: 'var(--primary-blue)',
    bg: '#EDE9FE',
    viewAll: '/collaboration/workspaces',
  },
};

/* ─── single feed item ───────────────────────────────────────────────────────── */

const FeedItem = ({ item, delay }) => {
  const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.notification;
  const Icon = cfg.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22, delay }}
    >
      <Link
        to={item.link}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--space-2)',
          padding: 'var(--space-2)',
          borderRadius: '8px',
          background: item.unread ? cfg.bg + 'AA' : '#FAFAF8',
          border: `1px solid ${item.unread ? cfg.color + '33' : 'transparent'}`,
          textDecoration: 'none',
          transition: 'all 0.18s' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = cfg.bg;
          e.currentTarget.style.borderColor = cfg.color + '55';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = item.unread ? cfg.bg + 'AA' : '#FAFAF8';
          e.currentTarget.style.borderColor = item.unread ? cfg.color + '33' : '#F0EDE8';
        }}
      >
        {/* Icon dot */}
        <div style={{
          width: 32, height: 32,
          borderRadius: '8px',
          background: cfg.bg,
          color: cfg.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 1 }}>
          <Icon size={14} />
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            margin: 0,
            fontSize: 'var(--text-label)',
            fontWeight: 500,
            color: 'var(--color-heading)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis' }}>
            {item.title}
          </p>
          {item.body && (
            <p style={{
              margin: 'var(--space-1) 0 0 0',
              fontSize: 'var(--text-supporting)',
              color: 'var(--color-body)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis' }}>
              {item.body}
            </p>
          )}
        </div>

        {/* Unread dot */}
        {item.unread && (
          <div style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: cfg.color,
            flexShrink: 0,
            marginTop: 6 }} />
        )}
      </Link>
    </motion.div>
  );
};

/* ─── main component ─────────────────────────────────────────────────────────── */

const DashboardUnifiedFeed = ({
  notifications,
  announcements,
  activities,
  loading,
}) => {
  const items = useMemo(
    () => normalise(notifications, announcements, activities),
    [notifications, announcements, activities]
  );

  const groups = useMemo(() => groupByDay(items), [items]);

  // While loading, show nothing (layout collapses)
  if (loading) return null;

  // Hidden when there is nothing to show
  if (items.length === 0) return null;

  let globalIndex = 0; // for staggered animation delays

  return (
    <div>
      {/* Section heading */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-3)' }}>
        <div>
          <h2 style={{
            color: 'var(--color-heading)',
            fontSize: 'var(--text-section-title)',
            margin: 0 }}>
            Updates
          </h2>
          <p style={{
            color: 'var(--color-body)',
            fontSize: 'var(--text-supporting)',
            margin: 'var(--space-1) 0 0 0' }}>
            What's changed since your last visit.
          </p>
        </div>
        <Link
          to="/notifications"
          style={{
            color: 'var(--color-primary)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3 }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          View All <ArrowRight size={13} />
        </Link>
      </div>

      {/* Feed */}
      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
        {groups.map((group, gi) => (
          <div key={group.label}>
            {/* Day label */}
            <div style={{
              padding: 'var(--space-2) var(--space-4)',
              background: '#F8F7F4',
              borderBottom: '1px solid var(--border)',
              borderTop: gi > 0 ? '1px solid var(--border)' : 'none' }}>
              <span style={{
                textTransform: 'uppercase',
                fontSize: 'var(--text-caption)',
                fontWeight: 600,
                color: 'var(--color-body)' }}>
                {group.label}
              </span>
            </div>

            {/* Items */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              padding: '0.75rem' }}>
              {group.items.map((item) => {
                const idx = globalIndex++;
                return (
                  <FeedItem
                    key={`${item.type}-${item.id || idx}`}
                    item={item}
                    delay={idx * 0.04}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardUnifiedFeed;
