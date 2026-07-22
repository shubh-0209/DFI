import React from 'react';
import { motion } from 'framer-motion';
import { Play, Award, ExternalLink, CalendarClock } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';

const JoinedProgramCard = ({ program, onOpen, onMarkAttendance, onViewCertificate }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 }
      }}
      whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
      className="card glow-card"
      style={{
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
      }}
    >
      {/* Top Banner section */}
      <div style={{ 
        padding: '1.5rem', 
        background: program.bannerColor || 'var(--gradient-primary)',
        color: '#fff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <span style={{ 
            backgroundColor: 'rgba(255,255,255,0.2)', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '99px' }}>
            {program.programCategory}
          </span>
          <StatusBadge status={program.status} />
        </div>
        <h3 style={{ marginBottom: '0.25rem', color: '#fff' }}>{program.programTitle}</h3>
        <p style={{ opacity: 0.9 }}>by {program.coordinatorName}</p>
      </div>

      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Hours Progress */}
        <div>
          <ProgressBar 
            value={(program.hoursCompleted / program.totalHoursRequired) * 100} 
            label="Hours Completed" 
            color="primary"
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'var(--color-body)', marginTop: '0.25rem' }}>
            {program.hoursCompleted} / {program.totalHoursRequired} hrs
          </div>
        </div>

        {/* Circular Attendance Stat & Next Session */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <div className="progress-ring-container" style={{ width: '50px', height: '50px' }}>
            <svg width="50" height="50" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" fill="none" stroke="var(--color-border)" strokeWidth="4" />
              <circle cx="25" cy="25" r="20" fill="none" stroke="var(--color-secondary)" strokeWidth="4" 
                strokeDasharray={`${2 * Math.PI * 20}`} 
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - program.attendancePercent / 100)}`} 
                strokeLinecap="round" 
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease-in-out' }} 
              />
            </svg>
            <span style={{ position: 'absolute' }}>{program.attendancePercent}%</span>
          </div>
          <div>
            <div style={{ color: 'var(--color-body)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <CalendarClock size={12} /> Next Session
            </div>
            <div style={{ color: 'var(--color-heading)' }}>
              {program.nextSession ? new Date(program.nextSession).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'TBD'}
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}></div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          {program.status === 'active' ? (
            <button onClick={() => onMarkAttendance(program.id)} className="btn btn-success" style={{ padding: '0.5rem' }}>
              <Play size={14} fill="currentColor" /> Check In
            </button>
          ) : (
            <button onClick={() => onViewCertificate(program.id)} className="btn btn-secondary" style={{ padding: '0.5rem', color: 'var(--color-purple)', borderColor: 'var(--color-purple)' }}>
              <Award size={14} /> Certificate
            </button>
          )}
          <button onClick={() => onOpen(program.id)} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
            <ExternalLink size={14} /> Open Portal
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default JoinedProgramCard;
