import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle, Eye, Mail, X } from 'lucide-react';
import StatusBadge from './StatusBadge';

const ApplicationCard = ({ application, onViewDetails, onWithdraw, onContact }) => {
  const isPending = application.status === 'pending' || application.status === 'under_review';
  
  // Calculate days until deadline
  const deadlineDate = new Date(application.deadline);
  const today = new Date();
  const diffTime = Math.abs(deadlineDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isUrgent = diffDays <= 7 && isPending;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)', borderColor: 'rgba(37, 99, 235, 0.15)' }}
      className="card"
      style={{
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      {/* Banner Strip */}
      <div style={{ 
        height: '60px', 
        background: application.bannerColor || 'var(--gradient-primary)',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', bottom: '-12px', right: '1.5rem' }}>
          <StatusBadge status={application.status} size="sm" />
        </div>
      </div>

      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header info */}
        <div style={{ marginBottom: '1rem' }}>
          <span className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>{application.programCategory}</span>
          <h3 style={{ marginBottom: '0.25rem' }}>{application.programTitle}</h3>
          <p style={{ color: 'var(--color-body)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Calendar size={14} /> Applied: {new Date(application.appliedDate).toLocaleDateString()}
          </p>
        </div>

        {/* Coordinator Info */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          padding: '0.75rem', 
          backgroundColor: 'var(--color-bg)', 
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            backgroundColor: 'var(--color-primary)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {application.coordinatorName.charAt(0)}
          </div>
          <div >
            <div style={{ color: 'var(--color-heading)' }}>{application.coordinatorName}</div>
            <div style={{ color: 'var(--color-body)' }}>Coordinator</div>
          </div>
        </div>

        {/* Urgent deadline warning */}
        {isUrgent && (
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', 
            marginBottom: '1rem' }}>
            <AlertCircle size={14} /> Decision expected in {diffDays} days
          </div>
        )}

        <div style={{ flex: 1 }}></div>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: isPending ? '1fr 1fr' : '1fr', gap: '0.5rem' }}>
          <button onClick={() => onViewDetails(application.id)} className="btn btn-primary" style={{ padding: '0.5rem' }}>
            <Eye size={14} /> View Details
          </button>
          {isPending && (
            <button onClick={() => onWithdraw(application.id)} className="btn btn-secondary" style={{ padding: '0.5rem', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
              <X size={14} /> Withdraw
            </button>
          )}
        </div>
        <button onClick={() => onContact(application.coordinatorEmail)} className="btn" style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', color: 'var(--color-body)' }}>
          <Mail size={14} /> Contact Coordinator
        </button>
      </div>
    </motion.div>
  );
};

export default ApplicationCard;
