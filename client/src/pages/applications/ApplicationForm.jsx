import SimpleLoader from '../../components/common/SimpleLoader';
/**
 * ApplicationForm.jsx
 *
 * Full-page volunteer application form for /programs/:programId/apply.
 *
 * Fixes applied vs. the old stub:
 *  1. Loads the real program from the API via getProgramById.
 *  2. Checks whether the user already applied; redirects if so.
 *  3. Calls applicationsService.submitApplication directly with the
 *     correct backend payload: { programId, answers: { ... } }.
 *  4. No VolunteerContext stub, no react-hook-form dependency for simple fields.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProgramById }    from '../../services/programsService';
import { submitApplication, getApplications } from '../../services/applicationsService';

/* ─── validation ─────────────────────────────────────────────────────────── */

const validate = (fields) => {
  const errors = {};
  if (!fields.motivation || fields.motivation.trim().length < 50) {
    errors.motivation = 'Please write at least 50 characters explaining your motivation.';
  }
  if (!fields.skills || fields.skills.trim().length < 2) {
    errors.skills = 'Please list at least one relevant skill.';
  }
  if (!fields.availability) {
    errors.availability = 'Please select your availability.';
  }
  if (!fields.phone || fields.phone.trim().length < 10) {
    errors.phone = 'Please enter a valid phone number (at least 10 digits).';
  }
  if (!fields.emergencyContact || fields.emergencyContact.trim().length < 3) {
    errors.emergencyContact = 'Please provide an emergency contact name and phone.';
  }
  return errors;
};

/* ─── helper sub-components ──────────────────────────────────────────────── */

const Field = ({ id, label, error, required, children }) => (
  <div className="form-group">
    <label className="form-label" htmlFor={id}>
      {label}{required && <span style={{ color: 'var(--color-error)', marginLeft: '0.25rem' }}>*</span>}
    </label>
    {children}
    {error && (
      <span style={{ color: 'var(--color-error)', marginTop: '0.25rem', display: 'block' }}>
        {error}
      </span>
    )}
  </div>
);

/* ─── main component ─────────────────────────────────────────────────────── */

const ApplicationForm = () => {
  const { programId } = useParams();
  const navigate      = useNavigate();

  const [program,    setProgram]    = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError,  setPageError]  = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);

  const [fields, setFields] = useState({
    motivation:       '',
    skills:           '',
    availability:     '',
    phone:            '',
    emergencyContact: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});

  /* ── load program + check existing application ────────────────── */

  const load = useCallback(async () => {
    if (!programId) {
      setPageError('No program ID in the URL.');
      setPageLoading(false);
      return;
    }
    try {
      // Load program details
      const programRes = await getProgramById(programId);
      const prog = programRes?.data?.program || programRes?.program || null;
      if (!prog) {
        setPageError('Program not found.');
        setPageLoading(false);
        return;
      }
      setProgram(prog);

      // Check if already applied
      try {
        const appsRes = await getApplications({ limit: 100 });
        const apps    = appsRes?.data?.applications || appsRes?.applications || [];
        const existing = apps.find((a) => {
          const pid = a?.program?._id?.toString() || a?.program?.toString() || '';
          return pid === programId;
        });
        if (existing && ['applied', 'approved', 'joined'].includes(existing.status)) {
          toast('You have already applied to this program.', { icon: 'ℹ️' });
          navigate('/applications', { replace: true });
          return;
        }
      } catch {
        // Non-critical — proceed even if we can't check
      }
    } catch (err) {
      setPageError(err?.message || 'Failed to load program details.');
    } finally {
      setPageLoading(false);
    }
  }, [programId, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  /* ── handlers ─────────────────────────────────────────────────── */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear per-field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(fields);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      // Backend expects: { programId, answers: { ...freeform } }
      await submitApplication(programId, {
        answers: {
          motivation:       fields.motivation.trim(),
          skills:           fields.skills.trim(),
          availability:     fields.availability,
          phone:            fields.phone.trim(),
          emergencyContact: fields.emergencyContact.trim(),
        },
      });

      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (err) {
      const msg = err?.message || 'Failed to submit application. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── loading / error states ───────────────────────────────────── */

  if (pageLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <Loader size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }} />
        <SimpleLoader />
      </div>
    );
  }

  if (pageError) {
    return (
      <div style={{ maxWidth: 600, margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <AlertCircle size={44} style={{ color: 'var(--color-error)', marginBottom: '1rem' }} />
        <h2 style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>Something went wrong</h2>
        <p style={{ color: 'var(--color-body)', marginBottom: '1.5rem' }}>{pageError}</p>
        <Link to="/opportunities" className="btn btn-primary">Browse Programs</Link>
      </div>
    );
  }

  /* ── success state ────────────────────────────────────────────── */

  if (submitted) {
    return (
      <div style={{ maxWidth: 580, margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <CheckCircle size={36} style={{ color: '#16A34A' }} />
        </div>
        <h2 style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
          Application Submitted!
        </h2>
        <p style={{ color: 'var(--color-body)', marginBottom: '0.5rem' }}>
          Your application for <strong>{program?.title}</strong> has been received.
        </p>
        {program?.approvalRequired ? (
          <p style={{ color: 'var(--color-body)', marginBottom: '2rem' }}>
            This program requires admin approval. You will be notified once your application is reviewed.
          </p>
        ) : (
          <p style={{ color: 'var(--color-body)', marginBottom: '2rem' }}>
            You have been automatically enrolled. Check your notifications for confirmation.
          </p>
        )}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link to="/applications" className="btn btn-primary">View My Applications</Link>
          <Link to="/opportunities" className="btn btn-secondary">Browse More</Link>
        </div>
      </div>
    );
  }

  /* ── form render ──────────────────────────────────────────────── */

  const isAccepting = ['published', 'ongoing'].includes(program?.status);

  if (!isAccepting) {
    return (
      <div style={{ maxWidth: 580, margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <AlertCircle size={44} style={{ color: '#F59E0B', marginBottom: '1rem' }} />
        <h2 style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>Not Accepting Applications</h2>
        <p style={{ color: 'var(--color-body)', marginBottom: '1.5rem' }}>
          <strong>{program?.title}</strong> is currently not accepting applications (status: {program?.status}).
        </p>
        <Link to={`/programs/${programId}`} className="btn btn-secondary">Back to Program</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem 3rem' }}>
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="btn btn-secondary"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.75rem', padding: '0.45rem 1rem' }}
      >
        <ArrowLeft size={16} /> Back to Program
      </button>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--color-heading)', marginBottom: '0.4rem' }}>
          Apply for Volunteer Program
        </h1>
        <p style={{ color: 'var(--color-body)' }}>
          Applying for:{' '}
          <strong style={{ color: 'var(--color-heading)' }}>{program?.title}</strong>
          {program?.category && (
            <span style={{ marginLeft: '0.5rem', padding: '0.2rem 0.6rem', borderRadius: 999, background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-body)' }}>
              {program.category}
            </span>
          )}
        </p>
        {program?.approvalRequired && (
          <div style={{ marginTop: '0.75rem', padding: '0.625rem 1rem', borderRadius: 8, background: '#FEF3C7', border: '1px solid #FDE68A', color: '#92400E' }}>
            ⚠️ This program requires admin approval before your spot is confirmed.
          </div>
        )}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="card"
        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
      >
        {/* Motivation */}
        <Field id="motivation" label="Why do you want to volunteer for this program?" error={fieldErrors.motivation} required>
          <textarea
            id="motivation"
            name="motivation"
            value={fields.motivation}
            onChange={handleChange}
            className="form-control"
            rows={5}
            placeholder="Tell us about your motivation, what you hope to achieve, and any relevant experience… (minimum 50 characters)"
            maxLength={1000}
          />
          <div style={{ color: 'var(--color-body)', textAlign: 'right', marginTop: '0.2rem' }}>
            {fields.motivation.length} / 1000
          </div>
        </Field>

        <div className="grid grid-cols-2">
          {/* Skills */}
          <Field id="skills" label="Relevant Skills" error={fieldErrors.skills} required>
            <input
              id="skills"
              name="skills"
              type="text"
              value={fields.skills}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g. Teaching, First Aid, Event Management"
            />
          </Field>

          {/* Availability */}
          <Field id="availability" label="Availability" error={fieldErrors.availability} required>
            <select
              id="availability"
              name="availability"
              value={fields.availability}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select availability…</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
              <option value="both">Both weekdays &amp; weekends</option>
              <option value="flexible">Flexible</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2">
          {/* Phone */}
          <Field id="phone" label="Phone Number" error={fieldErrors.phone} required>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={fields.phone}
              onChange={handleChange}
              className="form-control"
              placeholder="+91 98765 43210"
            />
          </Field>

          {/* Emergency contact */}
          <Field id="emergencyContact" label="Emergency Contact" error={fieldErrors.emergencyContact} required>
            <input
              id="emergencyContact"
              name="emergencyContact"
              type="text"
              value={fields.emergencyContact}
              onChange={handleChange}
              className="form-control"
              placeholder="Name — Phone number"
            />
          </Field>
        </div>

        {/* Footer buttons */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.875rem' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', minWidth: 160 }}
          >
            {submitting ? (
              <>
                <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                Submitting…
              </>
            ) : (
              <><Send size={16} /> Submit Application</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
