import SimpleLoader from '../../common/SimpleLoader';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';

const REJECT_REASONS = [
  { value: 'spam', label: 'Spam' },
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'incomplete', label: 'Incomplete' },
  { value: 'wrong_category', label: 'Wrong Category' },
  { value: 'low_quality', label: 'Low Quality' },
  { value: 'other', label: 'Other' },
];

const RejectForm = ({ onSubmit, loading = false }) => {
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason) return;
    onSubmit({
      action: 'rejected',
      reason,
      feedback: feedback || null,
      internalNotes: internalNotes || null,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    >
      <div className="form-group">
        <label className="form-label" htmlFor="reason">Reason *</label>
        <select
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="form-control"
        >
          <option value="">Select a reason</option>
          {REJECT_REASONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="feedback">Comment</label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="form-control"
          rows={4}
          placeholder="Explain why this contribution was rejected..."
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="internalNotes">Internal Notes</label>
        <textarea
          id="internalNotes"
          value={internalNotes}
          onChange={(e) => setInternalNotes(e.target.value)}
          className="form-control"
          rows={3}
          placeholder="Notes visible only to admins..."
        />
      </div>
      <button type="submit" disabled={loading || !reason} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
        {loading ? <SimpleLoader /> : <XCircle size={18} />}
        {loading ? 'Rejecting...' : 'Reject Contribution'}
      </button>
    </motion.form>
  );
};

export default RejectForm;
