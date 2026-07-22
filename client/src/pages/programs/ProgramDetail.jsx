import SimpleLoader from '../../components/common/SimpleLoader';
/**
 * ProgramDetail.jsx
 *
 * Volunteer-facing program detail page with inline application flow.
 *
 * Apply button is active when:
 *   • program.status is 'published' OR 'ongoing'
 *   • registration deadline has not passed (or no deadline set)
 *   • volunteer has not already applied (status: applied / approved / joined)
 *   • checkingApp has resolved
 *
 * All other states show clear, actionable status messages.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, MapPin, Calendar, Users, Clock,
  CheckCircle, AlertCircle, Tag, Globe, Award, FileText, Coins,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getProgramById } from '../../services/programsService';
import { submitApplication, getApplications } from '../../services/applicationsService';

/* ─── config ──────────────────────────────────────────────────────────────── */

const CATEGORY_COLORS = {
  Education:        '#3b82f6',
  Environment:      '#22c55e',
  Health:           '#ef4444',
  Community:        '#a855f7',
  'Animal Welfare': '#f59e0b',
  'Disaster Relief':'var(--primary-blue)',
  Other:            '#6b7280',
};

const MODE_ICONS = { online: '💻', offline: '📍', hybrid: '🔄' };

// Statuses that mean the volunteer can still apply
const ACCEPTING_STATUSES = new Set(['published', 'ongoing']);

// Statuses that mean the volunteer already has an active application
const ACTIVE_APPLICATION_STATUSES = new Set(['applied', 'approved', 'joined']);

/* ─── sub-components ─────────────────────────────────────────────────────── */

const StatusBadge = ({ status }) => {
  const map = {
    published:           { label: 'Open for Applications', color: '#16a34a', bg: '#dcfce7' },
    ongoing:             { label: 'Ongoing — Accepting',   color: '#2563eb', bg: '#dbeafe' },
    registration_closed: { label: 'Registration Closed',   color: 'var(--primary-blue)', bg: '#ffedd5' },
    completed:           { label: 'Completed',             color: '#6b7280', bg: '#f3f4f6' },
    cancelled:           { label: 'Cancelled',             color: '#ef4444', bg: '#fee2e2' },
    draft:               { label: 'Draft',                 color: '#a855f7', bg: '#f3e8ff' },
    archived:            { label: 'Archived',              color: '#6b7280', bg: '#f1f5f9' },
  };
  const info = map[status] || { label: status, color: '#6b7280', bg: '#f3f4f6' };
  return (
    <span style={{
      padding: '0.4rem 1rem', borderRadius: '999px',
      color: info.color, backgroundColor: info.bg }}>
      {info.label}
    </span>
  );
};

const ApplicationStatusBadge = ({ status }) => {
  const map = {
    applied:   { label: '⏳ Pending Review',  color: '#d97706', bg: '#fef3c7' },
    approved:  { label: '✅ Approved',         color: '#16a34a', bg: '#dcfce7' },
    joined:    { label: '✅ Joined',           color: '#16a34a', bg: '#dcfce7' },
    rejected:  { label: '❌ Rejected',         color: '#dc2626', bg: '#fee2e2' },
    withdrawn: { label: '↩ Withdrawn',         color: '#6b7280', bg: '#f3f4f6' },
    cancelled: { label: '✕ Cancelled',         color: '#6b7280', bg: '#f3f4f6' },
    completed: { label: '🏆 Completed',        color: 'var(--primary-blue)', bg: '#f3e8ff' },
  };
  const info = map[status] || { label: status, color: '#6b7280', bg: '#f3f4f6' };
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.35rem 0.875rem', borderRadius: 999,
      color: info.color, backgroundColor: info.bg }}>
      {info.label}
    </span>
  );
};

const InfoRow = ({ icon: Icon, label, value }) =>
  value ? (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
      <Icon size={18} style={{ color: 'var(--color-body)', marginTop: '2px', flexShrink: 0 }} />
      <div>
        <div style={{ color: 'var(--color-body)', marginBottom: '0.15rem', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ color: 'var(--color-heading)' }}>{value}</div>
      </div>
    </div>
  ) : null;

/* ─── main component ─────────────────────────────────────────────────────── */

const ProgramDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [program, setProgram]             = useState(null);
  const [loading, setLoading]             = useState(true);
  const [applying, setApplying]           = useState(false);
  const [existingApp, setExistingApp]     = useState(null);
  const [checkingApp, setCheckingApp]     = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [motivation, setMotivation]       = useState('');

  /* ── load program ─────────────────────────────────────────────── */

  useEffect(() => {
    let cancelled = false;
    const loadProgram = async () => {
      try {
        const res = await getProgramById(id);
        // programsService.getProgramById returns { program, successMessage }
        if (!cancelled) setProgram(res?.program || null);
      } catch (err) {
        if (!cancelled) toast.error(err.message || 'Failed to load program');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadProgram();
    return () => { cancelled = true; };
  }, [id]);

  /* ── check existing application ───────────────────────────────── */

  const checkExisting = useCallback(async () => {
    if (!id) { setCheckingApp(false); return; }
    try {
      // api.js interceptor returns response.data directly, so res IS:
      // { success, message, data: { applications, pagination } }
      const res = await getApplications({ limit: 100 });
      const apps = (res?.data?.applications || []).filter((app) => {
        const progId = app?.program?._id?.toString() || app?.program?.toString() || '';
        return progId === id;
      });

      const activeApp = apps.find((app) => ACTIVE_APPLICATION_STATUSES.has(app.status));
      setExistingApp(activeApp || apps[0] || null);
    } catch (_) {
      // non-critical — show the Apply button if we can't determine status
    } finally {
      setCheckingApp(false);
    }
  }, [id]);

  useEffect(() => {
    checkExisting();
  }, [checkExisting]);

  /* ── apply handler ────────────────────────────────────────────── */

  const handleApply = async (e) => {
    e.preventDefault();
    if (!motivation.trim()) {
      toast.error('Please write a brief motivation before applying.');
      return;
    }
    setApplying(true);
    try {
      // Backend expects: POST /applications { programId, answers: { ... } }
      // submitApplication(programId, formData) spreads formData as { programId, ...formData }
      // So we must wrap motivation inside the answers key here.
      const res = await submitApplication(id, {
        answers: { motivation: motivation.trim() },
      });
      // api.js interceptor returns response.data, so res IS { success, message, data: { application } }
      const newApp = res?.data?.application || null;
      toast.success('🎉 Application submitted successfully!');
      setShowApplyForm(false);
      setMotivation('');
      setExistingApp(newApp || { status: 'applied', appliedAt: new Date().toISOString() });
      // Invalidate dashboard + applications caches
      queryClient.invalidateQueries({ queryKey: ['volunteer-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
    } catch (err) {
      toast.error(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  /* ── loading / error states ───────────────────────────────────── */

  if (loading) {
    return <SimpleLoader />;
  }

  if (!program) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <AlertCircle size={48} style={{ color: 'var(--color-error)', marginBottom: '1rem' }} />
        <h2 style={{ color: 'var(--color-heading)' }}>Program not found</h2>
        <p style={{ color: 'var(--color-body)', marginBottom: '1.5rem' }}>
          This program may have been removed or doesn&apos;t exist.
        </p>
        <Link to="/opportunities" className="btn btn-primary">Browse All Programs</Link>
      </div>
    );
  }

  /* ── derived state ────────────────────────────────────────────── */

  const accentColor     = CATEGORY_COLORS[program.category] || '#6b7280';
  const location        = [program.address, program.city, program.state].filter(Boolean).join(', ');
  const isAccepting     = ACCEPTING_STATUSES.has(program.status);
  const isDeadlinePassed = program.registrationDeadline && new Date() > new Date(program.registrationDeadline);
  const hasActiveApp    = existingApp && ACTIVE_APPLICATION_STATUSES.has(existingApp.status);
  const canApply        = isAccepting && !isDeadlinePassed && !hasActiveApp && !checkingApp;

  /* ── apply CTA card content ───────────────────────────────────── */

  const renderApplyCTA = () => {
    if (checkingApp) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem' }}>
          <Loader size={22} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }} />
        </div>
      );
    }

    if (hasActiveApp) {
      return (
        <div>
          <div style={{ marginBottom: '0.875rem' }}>
            <ApplicationStatusBadge status={existingApp.status} />
          </div>
          <p style={{ color: 'var(--color-body)', marginBottom: '1rem' }}>
            You applied on{' '}
            {new Date(existingApp.appliedAt || existingApp.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}.
          </p>
          <Link
            to="/applications"
            className="btn btn-secondary"
            style={{ width: '100%', textAlign: 'center', display: 'block' }}
          >
            View My Applications
          </Link>
        </div>
      );
    }

    if (!isAccepting) {
      const closedMessages = {
        registration_closed: { emoji: '🔒', text: 'Registration for this program is now closed.' },
        completed:           { emoji: '🏁', text: 'This program has been completed.' },
        cancelled:           { emoji: '❌', text: 'This program has been cancelled.' },
        archived:            { emoji: '📦', text: 'This program has been archived.' },
        draft:               { emoji: '✏️', text: 'This program is not yet published.' },
      };
      const msg = closedMessages[program.status] || { emoji: '⚠️', text: 'This program is not currently accepting applications.' };
      return (
        <div style={{ padding: '0.875rem 1rem', borderRadius: 10, backgroundColor: '#fef3c7', color: '#92400e' }}>
          {msg.emoji} {msg.text}
        </div>
      );
    }

    if (isDeadlinePassed) {
      return (
        <div style={{ padding: '0.875rem 1rem', borderRadius: 10, backgroundColor: '#fee2e2', color: '#991b1b' }}>
          ⏰ The registration deadline has passed.
        </div>
      );
    }

    // canApply === true — show Apply button (or inline form)
    return (
      <>
        <p style={{ color: 'var(--color-body)', marginBottom: '1.25rem' }}>
          Join this program and make a meaningful impact in your community.
          {program.approvalRequired && (
            <span style={{ display: 'block', marginTop: '0.5rem', color: 'var(--primary-blue)' }}>
              ⚠️ Applications require admin approval before you are confirmed.
            </span>
          )}
        </p>
        {!showApplyForm && (
          <button
            className="btn btn-primary"
            onClick={() => setShowApplyForm(true)}
            style={{ width: '100%', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <Award size={18} />
            Apply Now
          </button>
        )}
      </>
    );
  };

  /* ── render ───────────────────────────────────────────────────── */

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 0 3rem' }}>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-secondary"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Hero */}
      <div style={{
        borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2rem',
        background: `linear-gradient(135deg, ${accentColor}20 0%, var(--color-card) 60%)`,
        border: '1px solid var(--color-border)', padding: '2.5rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', backgroundColor: accentColor }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{ padding: '0.3rem 0.85rem', borderRadius: '999px', backgroundColor: `${accentColor}20`, color: accentColor }}>
                {program.category}
              </span>
              <span style={{ padding: '0.3rem 0.85rem', borderRadius: '999px', backgroundColor: 'var(--color-bg)', color: 'var(--color-body)', border: '1px solid var(--color-border)' }}>
                {MODE_ICONS[program.mode]} {program.mode?.charAt(0).toUpperCase() + program.mode?.slice(1)}
              </span>
            </div>
            <h1 style={{ color: 'var(--color-heading)', marginBottom: '0.75rem' }}>
              {program.title}
            </h1>
            {program.shortDescription && (
              <p style={{ color: 'var(--color-body)', maxWidth: '680px' }}>
                {program.shortDescription}
              </p>
            )}
          </div>
          <div style={{ flexShrink: 0 }}>
            <StatusBadge status={program.status} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          {program.startDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-body)' }}>
              <Calendar size={16} style={{ color: accentColor }} />
              <span>
                {new Date(program.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                {program.endDate && ` → ${new Date(program.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`}
              </span>
            </div>
          )}
          {location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-body)' }}>
              <MapPin size={16} style={{ color: accentColor }} />
              <span>{location}</span>
            </div>
          )}
          {program.maxVolunteers && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-body)' }}>
              <Users size={16} style={{ color: accentColor }} />
              <span>Up to {program.maxVolunteers.toLocaleString()} volunteers</span>
            </div>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

        {/* Left — content */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-heading)' }}>
              <FileText size={18} style={{ color: accentColor }} /> About This Program
            </h2>
            <div style={{ color: 'var(--color-body)', whiteSpace: 'pre-wrap' }}>
              {program.description || 'No description provided.'}
            </div>
          </div>

          {program.tags?.length > 0 && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-heading)' }}>
                <Tag size={16} style={{ color: accentColor }} /> Tags
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {program.tags.map((tag) => (
                  <span key={tag} style={{ padding: '0.3rem 0.75rem', borderRadius: '999px', backgroundColor: 'var(--color-bg)', color: 'var(--color-body)', border: '1px solid var(--color-border)' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Inline application form */}
          {showApplyForm && canApply && (
            <div className="card" style={{ border: `2px solid ${accentColor}40`, marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-heading)' }}>
                ✍️ Your Application
              </h3>
              <form onSubmit={handleApply}>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Why do you want to join this program? *</label>
                  <textarea
                    required
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    className="form-control"
                    rows={5}
                    placeholder="Share your motivation, relevant experience, and what you hope to achieve…"
                    maxLength={1000}
                  />
                  <div style={{ color: 'var(--color-body)', marginTop: '0.3rem', textAlign: 'right' }}>
                    {motivation.length}/1000
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={applying} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    {applying ? (
                      <>
                        <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                        Submitting…
                      </>
                    ) : (
                      <><CheckCircle size={16} /> Submit Application</>
                    )}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowApplyForm(false); setMotivation(''); }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right — sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Apply CTA */}
          <div className="card" style={{ border: canApply ? `2px solid ${accentColor}40` : '1px solid var(--color-border)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--color-heading)' }}>
              {hasActiveApp ? '📋 Your Application' : 'Apply to This Program'}
            </h3>
            {renderApplyCTA()}
          </div>

          {/* Program details */}
          <div className="card">
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-heading)' }}>
              Program Details
            </h3>
            {program.rewardCoins > 0 && (
              <InfoRow icon={Coins} label="Completion Reward" value={`+${program.rewardCoins} Disha Coins`} />
            )}
            <InfoRow icon={Calendar} label="Start Date" value={program.startDate ? new Date(program.startDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : null} />
            <InfoRow icon={Calendar} label="End Date"   value={program.endDate   ? new Date(program.endDate  ).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : null} />
            <InfoRow icon={Clock}    label="Registration Deadline" value={program.registrationDeadline ? new Date(program.registrationDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'No deadline set'} />
            <InfoRow icon={Users}    label="Max Volunteers" value={program.maxVolunteers ? program.maxVolunteers.toLocaleString() : 'Unlimited'} />
            <InfoRow icon={Globe}    label="Mode" value={`${MODE_ICONS[program.mode]} ${program.mode?.charAt(0).toUpperCase() + program.mode?.slice(1)}`} />
            {location && <InfoRow icon={MapPin} label="Location" value={location} />}
          </div>

          {/* Organizer */}
          {program.createdBy && (
            <div className="card">
              <h3 style={{ marginBottom: '1rem', color: 'var(--color-heading)' }}>
                Organizer
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: `${accentColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: accentColor }}>
                    {(program.createdBy.name || 'A')[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <div style={{ color: 'var(--color-heading)' }}>{program.createdBy.name || 'Admin'}</div>
                  <div style={{ color: 'var(--color-body)' }}>{program.createdBy.email || ''}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
