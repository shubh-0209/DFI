import SimpleLoader from '../common/SimpleLoader';
/**
 * ProgramModal.jsx
 *
 * Create / Edit program modal.
 *
 * Fixes applied:
 *  1. formData is reset via useEffect whenever isOpen or editData changes —
 *     previously useState initial value was stale on re-open.
 *  2. maxVolunteers is coerced to Number in the payload so backend validation
 *     (integer check) never rejects a string coming from the <input>.
 *  3. Error state is cleared on every open.
 *  4. Proper success feedback and onSuccess() callback.
 */

import React, { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { createProgram, updateProgram, changeProgramStatus } from '../../services/programsService';

/* ─── option lists ────────────────────────────────────────────────────────── */

const MODE_OPTIONS = [
  { value: 'offline', label: 'Offline' },
  { value: 'online',  label: 'Online'  },
  { value: 'hybrid',  label: 'Hybrid'  },
];

const STATUS_OPTIONS = [
  { value: 'draft',               label: 'Draft'               },
  { value: 'published',           label: 'Published'           },
  { value: 'registration_closed', label: 'Registration Closed' },
  { value: 'ongoing',             label: 'Ongoing'             },
  { value: 'completed',           label: 'Completed'           },
  { value: 'cancelled',           label: 'Cancelled'           },
];

const CATEGORY_OPTIONS = [
  'Education',
  'Environment',
  'Health',
  'Community',
  'Animal Welfare',
  'Disaster Relief',
  'Arts & Culture',
  'Technology',
  'Sports',
  'Other',
];

/* ─── helpers ─────────────────────────────────────────────────────────────── */

const normalizeMode   = (m) => (m ? m.toLowerCase() : 'offline');
const normalizeStatus = (s) => (s ? s.toLowerCase() : 'draft');

const toDateInput = (d) => {
  if (!d) return '';
  try { return new Date(d).toISOString().split('T')[0]; }
  catch { return ''; }
};

const buildInitialForm = (editData) => ({
  title:                editData?.title               || '',
  shortDescription:     editData?.shortDescription    || '',
  description:          editData?.description         || '',
  category:             editData?.category            || 'Education',
  mode:                 normalizeMode(editData?.mode),
  startDate:            toDateInput(editData?.startDate),
  endDate:              toDateInput(editData?.endDate),
  registrationDeadline: toDateInput(editData?.registrationDeadline),
  city:                 editData?.city    || editData?.location?.city    || '',
  state:                editData?.state   || editData?.location?.state   || '',
  address:              editData?.address || editData?.location?.address || '',
  maxVolunteers:        editData?.maxVolunteers || 50,
  status:               normalizeStatus(editData?.status),
  approvalRequired:     editData?.approvalRequired || false,
  rewardCoins:          editData?.rewardCoins || 0,
});

/* ─── component ───────────────────────────────────────────────────────────── */

const ProgramModal = ({ isOpen, onClose, onSuccess, editData }) => {
  const isEditing = Boolean(editData);

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [formData, setFormData] = useState(() => buildInitialForm(editData));

  /* Reset form whenever the modal opens or switches between create / edit */
  useEffect(() => {
    if (isOpen) {
      setFormData(buildInitialForm(editData));
      setError('');
    }
  }, [isOpen, editData]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  /* ── form handlers ──────────────────────────────────────────────── */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side guard: title is the only truly required field at creation time
    if (!formData.title.trim() || formData.title.trim().length < 3) {
      setError('Program title is required and must be at least 3 characters.');
      return;
    }

    setLoading(true);
    setError('');

    /* Build payload — coerce types to match backend expectations */
    const payload = {
      title:            formData.title.trim(),
      description:      formData.description.trim(),
      category:         formData.category,
      mode:             formData.mode,
      maxVolunteers:    Number(formData.maxVolunteers),   // must be integer
      approvalRequired: Boolean(formData.approvalRequired),
      rewardCoins:      Number(formData.rewardCoins),
    };

    if (formData.shortDescription.trim()) {
      payload.shortDescription = formData.shortDescription.trim();
    }
    if (formData.startDate)            payload.startDate            = formData.startDate;
    if (formData.endDate)              payload.endDate              = formData.endDate;
    if (formData.registrationDeadline) payload.registrationDeadline = formData.registrationDeadline;

    if (formData.mode !== 'online') {
      if (formData.city.trim())    payload.city    = formData.city.trim();
      if (formData.state.trim())   payload.state   = formData.state.trim();
      if (formData.address.trim()) payload.address = formData.address.trim();
    }

    try {
      if (isEditing) {
        const programId = editData._id || editData.id;
        await updateProgram(programId, payload);

        /* Only call changeProgramStatus if status actually changed */
        const originalStatus = normalizeStatus(editData?.status);
        if (formData.status !== originalStatus) {
          await changeProgramStatus(programId, formData.status);
        }

        toast.success('Program updated successfully!');
      } else {
        await createProgram(payload);
        toast.success('Program created! It has been saved as a draft.');
      }

      onSuccess();
    } catch (err) {
      // Surface the full error — covers validation errors, auth errors, network failures
      let msg = 'Error saving program. Please try again.';

      if (err?.data?.errors && Array.isArray(err.data.errors)) {
        // Backend validation error array — show the first field error
        msg = err.data.errors.map((e) => e.message).join(', ');
      } else if (err?.message) {
        msg = err.message;
      } else if (typeof err === 'string') {
        msg = err;
      }

      // Also log the full error to the console so it's visible in DevTools
      // eslint-disable-next-line no-console
      console.error('[ProgramModal] createProgram error:', err);

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── render ─────────────────────────────────────────────────────── */

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Backdrop */}
      <div
        onClick={loading ? undefined : onClose}
        style={{
          position: 'absolute', inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(6px)',
          cursor: loading ? 'default' : 'pointer',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'relative',
        width: '100%', maxWidth: '860px',
        maxHeight: '92vh',
        backgroundColor: 'var(--color-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
      }}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          backgroundColor: 'var(--color-bg)',
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 'var(--text-xl)', color: 'var(--color-heading)', fontWeight: 700 }}>
              {isEditing ? 'Edit Program' : 'Create New Program'}
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: 'var(--text-sm)', color: 'var(--color-body)' }}>
              {isEditing
                ? 'Update the program details below.'
                : 'Programs are saved as Draft. Publish them when ready.'}
            </p>
          </div>
          <button
            type="button"
            onClick={loading ? undefined : onClose}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'var(--color-card)', cursor: loading ? 'not-allowed' : 'pointer',
              color: 'var(--color-body)', opacity: loading ? 0.5 : 1,
            }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Form wraps both scrollable body AND footer ──────────── */}
        <form
          onSubmit={handleSubmit}
          noValidate
          style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}
        >

          {/* ── Scrollable body ─────────────────────────────────── */}
          <div style={{ padding: '1.5rem 2rem', overflowY: 'auto', flex: 1 }}>

            {error && (
              <div style={{
                padding: '0.75rem 1rem', borderRadius: 8,
                backgroundColor: '#FEE2E2', color: '#991B1B',
                marginBottom: '1.25rem', fontSize: 'var(--text-base)',
                border: '1px solid #FECACA',
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {/* Title */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Program Title <span style={{ color: 'var(--color-error)' }}>*</span></label>
                <input
                  required
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g. Weekend Beach Cleanup"
                  minLength={3}
                  maxLength={150}
                />
              </div>

              {/* Short Description */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">
                  Short Description{' '}
                  <span style={{ color: 'var(--color-body)', fontWeight: 400 }}>(optional — shown on cards)</span>
                </label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="A brief one-liner about the program…"
                  maxLength={300}
                />
              </div>

              {/* Full Description */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Full Description <span style={{ color: 'var(--color-error)' }}>*</span></label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  rows={4}
                  placeholder="Describe the program, its goals, what volunteers will do…"
                />
              </div>

              {/* Category & Mode */}
              <div>
                <label className="form-label">Category <span style={{ color: 'var(--color-error)' }}>*</span></label>
                <select name="category" value={formData.category} onChange={handleChange} className="form-control">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Mode <span style={{ color: 'var(--color-error)' }}>*</span></label>
                <select name="mode" value={formData.mode} onChange={handleChange} className="form-control">
                  {MODE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div>
                <label className="form-label">Start Date <span style={{ color: 'var(--color-error)' }}>*</span></label>
                <input
                  required
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div>
                <label className="form-label">End Date <span style={{ color: 'var(--color-error)' }}>*</span></label>
                <input
                  required
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div>
                <label className="form-label">Registration Deadline <span style={{ color: 'var(--color-body)', fontWeight: 400 }}>(optional)</span></label>
                <input
                  type="date"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div>
                <label className="form-label">Max Volunteers <span style={{ color: 'var(--color-error)' }}>*</span></label>
                <input
                  required
                  type="number"
                  min="1"
                  max="100000"
                  step="1"
                  name="maxVolunteers"
                  value={formData.maxVolunteers}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div>
                <label className="form-label">Disha Coins Reward <span style={{ color: 'var(--color-error)' }}>*</span></label>
                <input
                  required
                  type="number"
                  min="0"
                  max="5000"
                  step="1"
                  name="rewardCoins"
                  value={formData.rewardCoins}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g. 50"
                />
              </div>

              {/* Location — only for offline / hybrid */}
              {formData.mode !== 'online' && (
                <>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="123 Main St, Near XYZ landmark"
                    />
                  </div>
                  <div>
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Maharashtra"
                    />
                  </div>
                </>
              )}

              {/* Approval required */}
              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="checkbox"
                  id="approvalRequired"
                  name="approvalRequired"
                  checked={formData.approvalRequired}
                  onChange={handleChange}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                />
                <label htmlFor="approvalRequired" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
                  Require admin approval for volunteer applications
                </label>
              </div>

              {/* Status — edit mode only */}
              {isEditing && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Program Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-control"
                    style={{ maxWidth: 260 }}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-body)', marginTop: '0.3rem' }}>
                    Typical flow: Draft → Published → Ongoing → Completed
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Footer — inside the form ──────────────────────────── */}
          <div style={{
            padding: '1.25rem 2rem',
            borderTop: '1px solid var(--color-border)',
            display: 'flex', justifyContent: 'flex-end', gap: '0.875rem',
            backgroundColor: 'var(--color-bg)',
            flexShrink: 0,
          }}>
            <button
              type="button"
              onClick={loading ? undefined : onClose}
              disabled={loading}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', minWidth: 160 }}
            >
              {loading ? (
                <>
                  <SimpleLoader />
                  Saving…
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  {isEditing ? 'Save Changes' : 'Create Program'}
                </>
              )}
            </button>
          </div>

        </form>{/* end form */}
      </div>
    </div>
  );
};

export default ProgramModal;
