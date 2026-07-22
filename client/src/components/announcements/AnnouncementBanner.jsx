import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Calendar, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusConfig = {
  draft:     { bg: '#EFF6FF', color: '#2563EB', label: 'Draft' },
  scheduled: { bg: '#FEF3C7', color: '#D97706', label: 'Scheduled' },
  published: { bg: '#F0FDF4', color: '#059669', label: 'Published' },
  expired:   { bg: '#FFF7ED', color: '#9A3412', label: 'Expired' },
  archived:  { bg: '#F1F5F9', color: '#64748B', label: 'Archived' },
};

const AnnouncementBanner = ({ announcement, onClose }) => {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose?.();
  }, [onClose]);

  if (!announcement) return null;

  const status = statusConfig[announcement.status] || statusConfig.draft;
  const isEmergency = announcement.type === 'emergency';
  const id = announcement._id || announcement.announcementId;

  return (
    <motion.div
      role="banner"
      aria-label={`Featured announcement: ${announcement.title}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0, y: -14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        padding: '2.25rem 2.5rem',
        borderRadius: 'var(--radius-xl)',
        background: isEmergency
          ? 'linear-gradient(135deg, #7f1d1d, #dc2626)'
          : 'linear-gradient(135deg, #1e3a8a, #2563eb)',
        color: '#fff',
        overflow: 'hidden',
        marginBottom: '2rem',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', right: '-4rem', top: '-4rem', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
      <div aria-hidden="true" style={{ position: 'absolute', left: '35%', bottom: '-5rem', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

      <div aria-hidden="true" style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.2)' }}>
        <Megaphone size={26} />
      </div>

      <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.625rem', flexWrap: 'wrap' }}>
          {isEmergency && (
            <span style={{ padding: '0.3rem 0.75rem', borderRadius: 999, background: 'rgba(239,68,68,0.25)', color: '#FCA5A5', textTransform: 'uppercase' }}>
              🚨 Emergency
            </span>
          )}
          <span style={{ padding: '0.3rem 0.75rem', borderRadius: 999, background: 'rgba(255,255,255,0.15)', color: '#fff', textTransform: 'capitalize', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: status.color, display: 'inline-block' }} />
            {status.label}
          </span>
        </div>

        <h2 style={{ margin: '0 0 0.5rem' }}>
          {announcement.title}
        </h2>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.92)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {announcement.message}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.75rem', color: 'rgba(255,255,255,0.65)' }}>
          {announcement.scheduledAt && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={13} /> Scheduled: {new Date(announcement.scheduledAt).toLocaleDateString()}
            </span>
          )}
          {announcement.expiresAt && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              Expires: {new Date(announcement.expiresAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <Link
        to={`/announcements/${id}`}
        aria-label={`Read full announcement: ${announcement.title}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.875rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255,255,255,0.14)',
          color: '#fff',
          textDecoration: 'none',
          flexShrink: 0,
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(255,255,255,0.25)',
          position: 'relative',
          zIndex: 1,
          transition: 'background 0.2s ease, transform 0.15s ease' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.24)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.transform = 'none'; }}
      >
        Read More <ArrowRight size={16} />
      </Link>

      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss featured announcement"
          style={{
            position: 'absolute',
            top: '0.875rem',
            right: '0.875rem',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.25)',
            color: '#fff',
            width: 32,
            height: 32,
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            transition: 'background 0.15s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
        >
          <X size={16} />
        </button>
      )}
    </motion.div>
  );
};

export default AnnouncementBanner;
