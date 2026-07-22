import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Ticket as TicketIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSupportTicket } from '../../services/supportTicketsService';
import toast from 'react-hot-toast';

const CreateTicketModal = ({ onClose, isAdmin = false }) => {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('general');
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data) => createSupportTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['support-tickets']);
      toast.success(isAdmin ? 'Support ticket created successfully' : 'Support ticket created successfully');
      onClose();
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create ticket');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;
    mutation.mutate({ subject, description, category });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.45)',
        backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-card)', borderRadius: 'var(--radius-xl)',
          width: '100%', maxWidth: 520, boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--color-border)', maxHeight: '85vh', overflow: 'auto' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-ticket-title"
      >
        <div style={{ padding: '1.5rem 1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--gradient-primary)', color: '#fff' }}>
              <TicketIcon size={18} />
            </span>
            <h2 id="create-ticket-title" style={{ margin: 0 }}>Create Support Ticket</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-body)', padding: '0.25rem' }} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              type="text"
              className="form-control"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              required
              maxLength={255}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="general">General</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="complaint">Complaint</option>
              <option value="suggestion">Suggestion</option>
              <option value="attendance">Attendance</option>
              <option value="programs">Programs</option>
              <option value="certificates">Certificates</option>
              <option value="rewards">Rewards</option>
              <option value="applications">Applications</option>
              <option value="ngo">NGO</option>
              <option value="volunteer">Volunteer</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your issue in detail..."
              rows={5}
              required
              maxLength={2000}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={mutation.isPending}>
              Cancel
            </button>
            <motion.button
              type="submit"
              className="btn btn-primary"
              disabled={mutation.isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus size={18} />
              {mutation.isPending ? 'Creating...' : 'Create Ticket'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateTicketModal;
