import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const ApplicationTimeline = ({ timeline = [], currentStatus = '' }) => {
  if (!timeline || timeline.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1.5rem' }}>Application Progress</h3>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ display: 'flex', flexDirection: 'column', gap: '0' }}
      >
        {timeline.map((step, index) => {
          const isDone = step.done;
          const isCurrent = step.status === currentStatus && !isDone;
          const isLast = index === timeline.length - 1;
          
          return (
            <motion.div key={index} variants={itemVariants} className={`timeline-step ${isDone ? 'done' : ''}`} style={{ paddingBottom: isLast ? '0' : '2rem' }}>
              <div className={`timeline-dot ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                {isDone ? <Check size={16} strokeWidth={3} /> : <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isCurrent ? '#fff' : 'var(--color-border)' }} />}
              </div>
              
              <div style={{ paddingTop: '4px' }}>
                <h4 style={{ color: isDone || isCurrent ? 'var(--color-heading)' : 'var(--color-body)', margin: 0 }}>
                  {step.stage}
                </h4>
                {step.date && (
                  <span style={{ color: 'var(--color-body)', display: 'block', marginTop: '0.25rem' }}>
                    {new Date(step.date).toLocaleDateString()}
                  </span>
                )}
                {step.note && (
                  <p style={{ color: 'var(--color-body)', marginTop: '0.5rem', backgroundColor: 'var(--color-bg)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    {step.note}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ApplicationTimeline;
