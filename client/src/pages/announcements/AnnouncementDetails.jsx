/**
 * AnnouncementDetails.jsx
 *
 * Full-page view for a single announcement.
 * New features over the original:
 *   • Marks announcement as read on mount (via PATCH /read)
 *   • Shows 📌 Pinned badge when isPinned
 *   • Renders attachments as download/link chips
 *   • Renders optional actionButton CTA
 *   • Admin section: adds Pin / Unpin actions
 */

import React, { useEffect } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, Users, Calendar, Tag, Shield,
  Edit3, Send, Archive, Trash2, Pin, Paperclip, ExternalLink,
} from 'lucide-react';
import {
  getAnnouncementById,
  publishAnnouncement,
  archiveAnnouncement,
  deleteAnnouncement,
  markAnnouncementRead,
  pinAnnouncement,
  unpinAnnouncement,
} from '../../services/announcementsService';
import { useAuth } from '../../context/AuthContext';
import AnnouncementSkeleton  from '../../components/announcements/AnnouncementSkeleton';
import AnnouncementEmptyState from '../../components/announcements/AnnouncementEmptyState';
import toast from 'react-hot-toast';

/* ─── config ──────────────────────────────────────────────────────────────── */

const priorityConfig = {
  low:      { border: '#94A3B8', bg: '#F8FAFC',  color: '#475569' },
  medium:   { border: '#F59E0B', bg: '#FEF3C7',  color: '#92400E' },
  high:     { border: 'var(--primary-blue)', bg: '#FFF7ED',  color: '#9A3412' },
  critical: { border: '#EF4444', bg: '#FEF2F2',  color: '#991B1B' },
};

const statusConfig = {
  draft:     { bg: '#EFF6FF', color: '#2563EB', label: 'Draft' },
  scheduled: { bg: '#FEF3C7', color: '#D97706', label: 'Scheduled' },
  published: { bg: '#F0FDF4', color: '#059669', label: 'Published' },
  expired:   { bg: '#FFF7ED', color: '#9A3412', label: 'Expired' },
  archived:  { bg: '#F1F5F9', color: '#64748B', label: 'Archived' },
};

const TARGET_LABELS = {
  all_users:      'All Users',
  volunteers:     'Volunteers',
  ngos:           'NGOs',
  admins:         'Admins',
  specific_users: 'Specific Users',
};

function formatDateTime(d) {
  if (!d) return '';
  return new Date(d).toLocaleString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

function attachmentEmoji(att) {
  const url = (att.url || '').toLowerCase();
  if (url.endsWith('.pdf') || att.type === 'pdf')   return '📄';
  if (/\.(png|jpg|jpeg|gif|webp|svg)$/.test(url))   return '🖼️';
  return '🔗';
}

/* ─── component ───────────────────────────────────────────────────────────── */

const AnnouncementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'COORDINATOR'].includes(user?.role?.toUpperCase());

  const { data, isLoading, error } = useQuery({
    queryKey: ['announcement', id],
    queryFn: async () => {
      const res = await getAnnouncementById(id);
      if (res.success) return res.data?.announcement || res.data;
      throw new Error(res.message || 'Failed to load announcement');
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    enabled: Boolean(id),
  });

  // Mark as read once the announcement has loaded and isn't already read
  useEffect(() => {
    if (!data || data.isRead) return;
    markAnnouncementRead(id).catch(() => {}); // fire-and-forget, non-critical
    // Optimistically update the list cache
    queryClient.invalidateQueries({ queryKey: ['announcements'] });
    queryClient.invalidateQueries({ queryKey: ['recent-announcements-widget'] });
  }, [data?.isRead, id, queryClient]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── guards ────────────────────────────────────────────────────── */
  if (!id) return <Navigate to="/announcements" replace />;

  if (isLoading) {
    return (
      <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: 960, margin: '0 auto' }}>
        <div className="skeleton" style={{ height: 32, width: 200, borderRadius: 8, marginBottom: 16 }} />
        <AnnouncementSkeleton count={1} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: 960, margin: '0 auto', color: 'var(--color-error)' }} role="alert">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={18} /> {error.message}
        </div>
      </div>
    );
  }

  const announcement = data;

  if (!announcement) {
    return (
      <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: 960, margin: '0 auto' }}>
        <AnnouncementEmptyState
          title="Announcement not found"
          description="The announcement you're looking for doesn't exist or has been removed."
          onAction={() => navigate('/announcements')}
          actionLabel="Browse Announcements"
        />
      </div>
    );
  }

  const p = priorityConfig[announcement.priority] || priorityConfig.medium;
  const s = statusConfig[announcement.status]     || statusConfig.draft;
  const targetLabel = TARGET_LABELS[announcement.targetAudience] || announcement.targetAudience;

  /* ── admin actions ─────────────────────────────────────────────── */
  const handlePublish = async () => {
    try {
      const res = await publishAnnouncement(announcement._id || announcement.announcementId);
      if (res.success) { toast.success('Announcement published'); queryClient.invalidateQueries({ queryKey: ['announcements'] }); }
    } catch (err) { toast.error(err.message || 'Failed to publish'); }
  };

  const handleArchive = async () => {
    try {
      const res = await archiveAnnouncement(announcement._id || announcement.announcementId);
      if (res.success) { toast.success('Announcement archived'); queryClient.invalidateQueries({ queryKey: ['announcements'] }); }
    } catch (err) { toast.error(err.message || 'Failed to archive'); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const res = await deleteAnnouncement(announcement._id || announcement.announcementId);
      if (res.success) { toast.success('Announcement deleted'); navigate(isAdmin ? '/admin/announcements' : '/announcements'); }
    } catch (err) { toast.error(err.message || 'Failed to delete'); }
  };

  const handlePin = async () => {
    try {
      const res = await pinAnnouncement(announcement._id || announcement.announcementId);
      if (res.success) { toast.success('Announcement pinned'); queryClient.invalidateQueries({ queryKey: ['announcements'] }); }
    } catch (err) { toast.error(err.message || 'Failed to pin'); }
  };

  const handleUnpin = async () => {
    try {
      const res = await unpinAnnouncement(announcement._id || announcement.announcementId);
      if (res.success) { toast.success('Announcement unpinned'); queryClient.invalidateQueries({ queryKey: ['announcements'] }); }
    } catch (err) { toast.error(err.message || 'Failed to unpin'); }
  };

  /* ── render ────────────────────────────────────────────────────── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: 960, margin: '0 auto', minHeight: '100vh' }}
    >
      {/* Back link */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Link
          to={isAdmin ? '/admin/announcements' : '/announcements'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-primary)', textDecoration: 'none' }}
        >
          <ArrowLeft size={16} aria-hidden="true" /> {isAdmin ? 'Announcement Management' : 'All Announcements'}
        </Link>
      </div>

      <article style={{
        backgroundColor: 'var(--color-card)',
        borderRadius: 'var(--radius-xl)',
        border: `1px solid var(--color-border)`,
        borderLeft: `4px solid ${p.border}`,
        overflow: 'hidden' }}>
        {/* Critical banner */}
        {announcement.priority === 'critical' && (
          <div style={{ backgroundColor: '#FEF2F2', padding: '0.75rem 1.5rem', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={16} aria-hidden="true" /> Critical Priority Announcement
          </div>
        )}

        {/* Pinned banner */}
        {announcement.isPinned && (
          <div style={{ backgroundColor: '#FEF3C7', padding: '0.55rem 1.5rem', color: '#92400E', display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid #FDE68A' }}>
            <Pin size={13} aria-hidden="true" /> 📌 Pinned Announcement
          </div>
        )}

        <div style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
          {/* Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ padding: '0.3rem 0.75rem', borderRadius: 999, backgroundColor: '#F8FAFC', color: '#475569', textTransform: 'capitalize' }}>
              {announcement.type}
            </span>
            <span style={{ padding: '0.3rem 0.75rem', borderRadius: 999, backgroundColor: `${p.border}18`, color: p.color, textTransform: 'capitalize', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Tag size={11} aria-hidden="true" /> {announcement.priority}
            </span>
            <span style={{ padding: '0.3rem 0.75rem', borderRadius: 999, backgroundColor: s.bg, color: s.color }}>
              {s.label}
            </span>
            {!announcement.isRead && (
              <span style={{ padding: '0.3rem 0.75rem', borderRadius: 999, backgroundColor: '#EFF6FF', color: '#2563EB', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                ● New
              </span>
            )}
          </div>

          {/* Title */}
          <h1 style={{ color: 'var(--color-heading)', margin: '0 0 1rem' }}>
            {announcement.title}
          </h1>

          {/* Message */}
          <p style={{ color: 'var(--color-body)', margin: 0 }}>
            {announcement.message}
          </p>

          {/* Attachments */}
          {announcement.attachments?.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ color: 'var(--color-heading)', margin: '0 0 0.625rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Paperclip size={14} aria-hidden="true" /> Attachments
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {announcement.attachments.map((att, i) => (
                  <a
                    key={i}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.45rem 0.875rem', borderRadius: 8,
                      background: '#F1F5F9', color: '#334155',
                      textDecoration: 'none', border: '1px solid #E2E8F0',
                      transition: 'background 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#E2E8F0'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#F1F5F9'; }}
                  >
                    {attachmentEmoji(att)} {att.name || 'Attachment'}
                    <ExternalLink size={12} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Action button (CTA) */}
          {announcement.actionButton?.label && announcement.actionButton?.url && (
            <div style={{ marginTop: '1.5rem' }}>
              <a
                href={announcement.actionButton.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.7rem 1.5rem', borderRadius: 10,
                  background: 'var(--color-primary)', color: 'white',
                  textDecoration: 'none', transition: 'opacity 0.18s' }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
              >
                {announcement.actionButton.label}
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            </div>
          )}

          {/* Meta row */}
          <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.875rem', color: 'var(--color-body)' }}>
            {announcement.scheduledAt && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={14} aria-hidden="true" />
                <strong>Scheduled:</strong> {formatDateTime(announcement.scheduledAt)}
              </span>
            )}
            {announcement.expiresAt && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={14} aria-hidden="true" />
                <strong>Expires:</strong> {formatDateTime(announcement.expiresAt)}
              </span>
            )}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={14} aria-hidden="true" />
              <strong>Audience:</strong> {targetLabel}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag size={14} aria-hidden="true" />
              <strong>Published:</strong> {announcement.publishedAt ? formatDateTime(announcement.publishedAt) : 'Not yet'}
            </span>
          </div>

          {/* Admin actions */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '2rem', padding: '1.25rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
            >
              <p style={{ color: 'var(--color-body)', margin: '0 0 0.875rem', textTransform: 'uppercase' }}>
                Admin Actions
              </p>
              <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                <Link
                  to={`/admin/announcements/${announcement._id || announcement.announcementId}/edit`}
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Edit3 size={14} aria-hidden="true" /> Edit
                </Link>

                {/* Pin / Unpin */}
                {announcement.isPinned ? (
                  <button onClick={handleUnpin} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Pin size={14} aria-hidden="true" /> Unpin
                  </button>
                ) : (
                  <button onClick={handlePin} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Pin size={14} aria-hidden="true" /> Pin
                  </button>
                )}

                {announcement.status !== 'published' && (
                  <button onClick={handlePublish} className="btn btn-primary" style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Send size={14} aria-hidden="true" /> Publish
                  </button>
                )}
                {announcement.status !== 'archived' && (
                  <button onClick={handleArchive} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Archive size={14} aria-hidden="true" /> Archive
                  </button>
                )}
                <button onClick={handleDelete} className="btn btn-danger" style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Trash2 size={14} aria-hidden="true" /> Delete
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </article>
    </motion.div>
  );
};

export default AnnouncementDetails;
