import SimpleLoader from '../../common/SimpleLoader';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const NeedsChangesForm = ({ onSubmit, loading = false }) => {
  const [feedback, setFeedback] = useState('');
  const [requiredChanges, setRequiredChanges] = useState('');
  const [resubmitInstructions, setResubmitInstructions] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      action: 'needs_changes',
      feedback: feedback || null,
      internalNotes: requiredChanges || resubmitInstructions || null,
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
        <label className="form-label" htmlFor="feedback">Feedback</label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="form-control"
          rows={4}
          placeholder="Describe what needs to be improved..."
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="requiredChanges">Required Changes</label>
        <textarea
          id="requiredChanges"
          value={requiredChanges}
          onChange={(e) => setRequiredChanges(e.target.value)}
          className="form-control"
          rows={4}
          placeholder="List specific changes required..."
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="resubmitInstructions">Resubmit Instructions</label>
        <textarea
          id="resubmitInstructions"
          value={resubmitInstructions}
          onChange={(e) => setResubmitInstructions(e.target.value)}
          className="form-control"
          rows={3}
          placeholder="Instructions for resubmitting..."
        />
      </div>
      <button type="submit" disabled={loading} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', color: 'var(--color-orange)', borderColor: 'var(--color-orange)' }}>
        {loading ? <SimpleLoader /> : <AlertCircle size={18} />}
        {loading ? 'Saving...' : 'Request Changes'}
      </button>
    </motion.form>
  );
};

export default NeedsChangesForm;
