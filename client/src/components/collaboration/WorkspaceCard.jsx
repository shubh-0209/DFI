import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle } from 'lucide-react';

const WorkspaceCard = ({ workspace, onJoin, onLeave, isMember, isCreator }) => {
  const memberCount = workspace.members?.length || 0;
  const noteCount = workspace.sharedNotes?.length || 0;
  const taskCount = workspace.taskAssignments?.length || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="card"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        height: '100%',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden' }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: isCreator
          ? 'linear-gradient(90deg, var(--color-primary), var(--color-primary-hover))'
          : 'linear-gradient(90deg, var(--color-secondary), var(--color-secondary-hover))',
        borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }} />

      <div>
        <h3 style={{
          marginBottom: '0.5rem',
          color: 'var(--color-heading)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden' }}>
          {workspace.name}
        </h3>
        <p style={{
          color: 'var(--color-body)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          margin: 0 }}>
          {workspace.description || 'No description provided'}
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: '1.25rem',
        flexWrap: 'wrap',
        color: 'var(--color-body)',
        padding: '0.75rem',
        background: 'var(--color-bg)',
        borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Users size={15} aria-hidden="true" />
          <span >{memberCount}</span>
          <span>member{memberCount !== 1 ? 's' : ''}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <FileText size={15} aria-hidden="true" />
          <span >{noteCount}</span>
          <span>note{noteCount !== 1 ? 's' : ''}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle size={15} aria-hidden="true" />
          <span >{taskCount}</span>
          <span>task{taskCount !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div style={{
        marginTop: 'auto',
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--color-border)' }}>
        <motion.div whileTap={{ scale: 0.97 }} style={{ flex: 1, minWidth: '80px' }}>
          <a
            href={`/collaboration/workspaces/${workspace._id}`}
            className="btn btn-primary"
            style={{
              width: '100%',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem' }}
            aria-label={`Open workspace ${workspace.name}`}
          >
            Open
          </a>
        </motion.div>
        {isMember && !isCreator && (
          <motion.div whileTap={{ scale: 0.97 }} style={{ flex: 1, minWidth: '80px' }}>
            <button
              onClick={() => onLeave(workspace._id)}
              className="btn btn-secondary"
              style={{
                width: '100%',
                color: 'var(--color-error)',
                borderColor: 'var(--color-error)' }}
              aria-label={`Leave workspace ${workspace.name}`}
            >
              Leave
            </button>
          </motion.div>
        )}
        {!isMember && (
          <motion.div whileTap={{ scale: 0.97 }} style={{ flex: 1, minWidth: '80px' }}>
            <button
              onClick={() => onJoin(workspace._id)}
              className="btn btn-success"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem' }}
              aria-label={`Join workspace ${workspace.name}`}
            >
              Join
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default WorkspaceCard;
