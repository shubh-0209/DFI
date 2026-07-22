import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, FileText } from 'lucide-react';

const SharedNotes = ({ notes, onAddNote }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAddNote({ title: title.trim() || undefined, content: content.trim() });
    setTitle('');
    setContent('');
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setTitle('');
    setContent('');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h4 style={{ color: 'var(--color-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={20} aria-hidden="true" />
          Shared Notes
          {notes?.length > 0 && (
            <span style={{
              padding: '0.2rem 0.6rem',
              borderRadius: '99px',
              background: 'rgba(37,99,235,0.1)',
              color: 'var(--color-primary)' }}>
              {notes.length}
            </span>
          )}
        </h4>
        {!isAdding && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsAdding(true)}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={16} aria-hidden="true" /> Add Note
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="card"
            style={{ padding: '1.25rem', marginBottom: '1.5rem', overflow: 'hidden' }}
          >
            <div className="form-group">
              <label className="form-label" htmlFor="note-title">Title (optional)</label>
              <input
                id="note-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-control"
                placeholder="Note title"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="note-content">Content</label>
              <textarea
                id="note-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="form-control"
                rows={3}
                placeholder="Write your note..."
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <X size={16} aria-hidden="true" /> Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                Save Note
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {notes && notes.length > 0 ? (
        <motion.div
          layout
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
        >
          {notes.map((note, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card"
              style={{ padding: '1rem 1.25rem' }}
            >
              {note.title && (
                <h5 style={{ marginBottom: '0.5rem', color: 'var(--color-heading)' }}>
                  {note.title}
                </h5>
              )}
              <p style={{ color: 'var(--color-body)', whiteSpace: 'pre-wrap', margin: 0 }}>
                {note.content}
              </p>
              <div style={{
                color: 'var(--color-body)',
                marginTop: '0.75rem',
                opacity: 0.7,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem' }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  display: 'inline-block' }} />
                {note.createdBy?.name || 'Unknown'} • {new Date(note.createdAt).toLocaleString()}
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            color: 'var(--color-body)',
            background: 'var(--color-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px dashed var(--color-border)' }}
        >
          <FileText size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} aria-hidden="true" />
          <p >No notes yet</p>
          <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>Be the first to add a note!</p>
        </motion.div>
      )}
    </div>
  );
};

export default SharedNotes;
