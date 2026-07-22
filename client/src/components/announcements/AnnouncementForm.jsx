import SimpleLoader from '../common/SimpleLoader';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Calendar, Users, Tag, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { createAnnouncement, updateAnnouncement, getAnnouncementById } from '../../services/announcementsService';

const ANNOUNCEMENT_TYPES = [
  { value: 'general', label: 'General', icon: '📢' },
  { value: 'program', label: 'Program', icon: '📅' },
  { value: 'emergency', label: 'Emergency', icon: '🚨' },
  { value: 'maintenance', label: 'Maintenance', icon: '🔧' },
  { value: 'event', label: 'Event', icon: '🎉' },
  { value: 'recruitment', label: 'Recruitment', icon: '🤝' },
  { value: 'system', label: 'System', icon: '⚙️' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: '#94A3B8' },
  { value: 'medium', label: 'Medium', color: '#F59E0B' },
  { value: 'high', label: 'High', color: 'var(--primary-blue)' },
  { value: 'critical', label: 'Critical', color: '#EF4444' },
];

const TARGET_AUDIENCE_OPTIONS = [
  { value: 'all_users', label: 'All Users', desc: 'Visible to everyone on the platform' },
  { value: 'volunteers', label: 'Volunteers', desc: 'Only users with volunteer role' },
  { value: 'ngos', label: 'NGOs', desc: 'Only NGO partners' },
  { value: 'admins', label: 'Admins', desc: 'Admin, Super Admin, Coordinator' },
  { value: 'specific_users', label: 'Specific Users', desc: 'Manually selected users' },
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'published', label: 'Published' },
];

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title cannot exceed 255 characters'),
  message: z.string().min(1, 'Message is required').max(2000, 'Message cannot exceed 2000 characters'),
  type: z.string().min(1, 'Type is required'),
  priority: z.string().min(1, 'Priority is required'),
  targetAudience: z.string().min(1, 'Target audience is required'),
  scheduledAt: z.string().optional().or(z.literal('')),
  expiresAt: z.string().optional().or(z.literal('')),
  status: z.string().min(1, 'Status is required'),
});

const inputStyle = (field, errors) => ({
  width: '100%',
  padding: '0.625rem 1rem',
  borderRadius: 'var(--radius-md)',
  border: `1.5px solid ${errors[field] ? 'var(--color-error)' : 'var(--color-border)'}`,
  color: 'var(--color-heading)',
  backgroundColor: 'var(--color-card)',
  outline: 'none',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  boxShadow: errors[field] ? '0 0 0 3px rgba(220,38,38,0.08)' : 'none',
});

const AnnouncementForm = ({ announcementId, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const isEdit = Boolean(announcementId);

  const {
    register, handleSubmit, reset, formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(announcementSchema),
    defaultValues: { title: '', message: '', type: 'general', priority: 'medium', targetAudience: 'all_users', scheduledAt: '', expiresAt: '', status: 'published' },
  });

  useEffect(() => {
    if (!isEdit) return;
    const fetchAnnouncement = async () => {
      try {
        const res = await getAnnouncementById(announcementId);
        if (res.success) {
          const a = res.data?.announcement || res.data;
          reset({ title: a.title || '', message: a.message || '', type: a.type || 'general', priority: a.priority || 'medium', targetAudience: a.targetAudience || 'all_users', scheduledAt: a.scheduledAt ? new Date(a.scheduledAt).toISOString().slice(0, 16) : '', expiresAt: a.expiresAt ? new Date(a.expiresAt).toISOString().slice(0, 16) : '', status: a.status || 'draft' });
          if (a.attachments) setAttachments(Array.isArray(a.attachments) ? a.attachments : []);
        }
      } catch (err) { console.error(err); toast.error('Failed to load announcement details'); }
    };
    fetchAnnouncement();
  }, [announcementId, isEdit, reset]);

  const onSubmit = async (data) => {
    try {
      setUploading(true);
      const payload = { ...data, attachments: attachments.length > 0 ? attachments : [] };
      if (data.scheduledAt === '') payload.scheduledAt = undefined;
      if (data.expiresAt === '') payload.expiresAt = undefined;
      if (isEdit) { await updateAnnouncement(announcementId, payload); toast.success('Announcement updated successfully'); }
      else { await createAnnouncement(payload); toast.success('Announcement created successfully'); }
      queryClient.invalidateQueries(['announcements', 'admin-announcements']);
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || (isEdit ? 'Failed to update announcement' : 'Failed to create announcement'));
    } finally { setUploading(false); }
  };

  const handleAttachmentAdd = () => {
    const url = prompt('Enter attachment URL:');
    if (url?.trim()) { const name = prompt('Enter attachment name:') || 'attachment'; setAttachments((p) => [...p, { name: name.trim(), url: url.trim(), type: 'file', size: 0 }]); }
  };
  const handleAttachmentRemove = (index) => setAttachments((p) => p.filter((_, i) => i !== index));

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '880px', margin: '0 auto' }}>
      


      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid var(--color-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
              Title <span style={{ color: 'var(--color-error)' }}>*</span>
            </label>
            <input type="text" placeholder="Enter a clear, concise title" {...register('title')} style={inputStyle('title', errors)} aria-invalid={!!errors.title} aria-describedby={errors.title ? 'ann-title-err' : undefined} onFocus={(e) => { if (!errors.title) e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = errors.title ? '0 0 0 3px rgba(220,38,38,0.08)' : '0 0 0 3px rgba(37,99,235,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = errors.title ? 'var(--color-error)' : 'var(--color-border)'; e.target.style.boxShadow = errors.title ? '0 0 0 3px rgba(220,38,38,0.08)' : 'none'; }} />
            <AnimatePresence>{errors.title && (<motion.p id="ann-title-err" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ color: 'var(--color-error)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }} role="alert"><AlertCircle size={13} /> {errors.title.message}</motion.p>)}</AnimatePresence>
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
              Message <span style={{ color: 'var(--color-error)' }}>*</span>
            </label>
            <textarea placeholder="Write your announcement message..." rows={5} {...register('message')} style={{ ...inputStyle('message', errors), resize: 'vertical', minHeight: '130px' }} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'ann-msg-err' : undefined} onFocus={(e) => { if (!errors.message) e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = errors.message ? '0 0 0 3px rgba(220,38,38,0.08)' : '0 0 0 3px rgba(37,99,235,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = errors.message ? 'var(--color-error)' : 'var(--color-border)'; e.target.style.boxShadow = errors.message ? '0 0 0 3px rgba(220,38,38,0.08)' : 'none'; }} />
            <AnimatePresence>{errors.message && (<motion.p id="ann-msg-err" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ color: 'var(--color-error)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }} role="alert"><AlertCircle size={13} /> {errors.message.message}</motion.p>)}</AnimatePresence>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
                Type <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <select {...register('type')} style={inputStyle('type', errors)} aria-invalid={!!errors.type} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none'; }}>
                  {ANNOUNCEMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
                Priority <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <select {...register('priority')} style={inputStyle('priority', errors)} aria-invalid={!!errors.priority} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none'; }}>
                {PRIORITY_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
                <Users size={14} aria-hidden="true" style={{ display: 'inline', marginRight: '0.3rem' }} />
                Target Audience <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <select {...register('targetAudience')} style={inputStyle('targetAudience', errors)} aria-invalid={!!errors.targetAudience} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none'; }}>
                {TARGET_AUDIENCE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <p style={{ color: 'var(--color-body)', marginTop: '0.3rem', fontStyle: 'italic' }}>{TARGET_AUDIENCE_OPTIONS.find((t) => t.value === (errors.targetAudience ? '' : ''))?.desc || ''}</p>
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
                Status
              </label>
              <select {...register('status')} style={inputStyle('status', errors)} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none'; }}>
                {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', padding: '1rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--color-heading)', marginBottom: '0.5rem', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={14} aria-hidden="true" /> Scheduled At
              </label>
              <input type="datetime-local" {...register('scheduledAt')} style={inputStyle('scheduledAt', errors)} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--color-heading)', marginBottom: '0.5rem', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={14} aria-hidden="true" /> Expires At
              </label>
              <input type="datetime-local" {...register('expiresAt')} style={inputStyle('expiresAt', errors)} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }} onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none'; }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
              Attachments
            </label>
            <button type="button" onClick={handleAttachmentAdd} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', height: '42px' }}>
              <Upload size={16} /> Add Attachment
            </button>
            <AnimatePresence>
              {attachments.length > 0 && (
                <motion.ul initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ listStyle: 'none', padding: 0, marginTop: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {attachments.map((att, i) => (
                    <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 0.875rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', gap: '0.75rem' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        <strong style={{ color: 'var(--color-heading)' }}>{att.name}</strong>
                        <span style={{ color: 'var(--color-body)', margin: '0 0.5rem' }}>—</span>
                         <a href={att.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.underline = 'underline'} onMouseLeave={(e) => { e.target.style.underline = 'none'; }}>{att.url}</a>
                      </span>
                      <button type="button" onClick={() => handleAttachmentRemove(i)} aria-label={`Remove attachment ${att.name}`} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', padding: '0.25rem', display: 'flex', flexShrink: 0 }}>
                        <X size={15} />
                      </button>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', padding: '0 0.25rem' }}>
          {onCancel && (<button type="button" onClick={onCancel} className="btn btn-secondary" disabled={isSubmitting || uploading} style={{ minWidth: '100px' }}>Cancel</button>)}
          <button type="submit" className="btn btn-primary" disabled={isSubmitting || uploading} style={{ minWidth: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {uploading || isSubmitting ? (<><SimpleLoader /> Processing...</>) : isEdit ? 'Update Announcement' : 'Create Announcement'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AnnouncementForm;
