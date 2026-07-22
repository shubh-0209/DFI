import SimpleLoader from '../../common/SimpleLoader';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

const ApproveForm = ({ onSubmit, loading = false }) => {
  const [coins, setCoins] = useState('');
  const [badge, setBadge] = useState('');
  const [feedback, setFeedback] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      action: 'approved',
      coinsAwarded: Number(coins) || 0,
      badgeAwarded: badge || null,
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
        <label className="form-label" htmlFor="coins">Coins Awarded</label>
        <input
          id="coins"
          type="number"
          min="0"
          value={coins}
          onChange={(e) => setCoins(e.target.value)}
          className="form-control"
          placeholder="0"
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="badge">Badge (optional)</label>
        <input
          id="badge"
          type="text"
          value={badge}
          onChange={(e) => setBadge(e.target.value)}
          className="form-control"
          placeholder="e.g. Bronze Contributor"
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="feedback">Feedback</label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="form-control"
          rows={4}
          placeholder="Share positive feedback with the volunteer..."
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
      <button type="submit" disabled={loading} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
        {loading ? <SimpleLoader /> : <Award size={18} />}
        {loading ? 'Approving...' : 'Approve Contribution'}
      </button>
    </motion.form>
  );
};

export default ApproveForm;
