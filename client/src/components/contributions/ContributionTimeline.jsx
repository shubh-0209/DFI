import React from 'react';
import { CheckCircle2, Clock, Send, ShieldCheck, Award } from 'lucide-react';

const timelineStages = [
  { key: 'draft', label: 'Draft', icon: Clock, description: 'Contribution created as draft' },
  { key: 'pending', label: 'Submitted', icon: Send, description: 'Submitted for review' },
  { key: 'under_review', label: 'Under Review', icon: ShieldCheck, description: 'Reviewer is evaluating' },
  { key: 'approved', label: 'Approved', icon: CheckCircle2, description: 'Contribution approved' },
  { key: 'rejected', label: 'Rejected', icon: Clock, description: 'Contribution rejected' },
  { key: 'needs_changes', label: 'Needs Changes', icon: Clock, description: 'Changes requested' },
  { key: 'archived', label: 'Archived', icon: Award, description: 'Contribution archived' },
];

const ContributionTimeline = ({ currentStatus, _history = [] }) => {
  const currentIndex = timelineStages.findIndex((s) => s.key === currentStatus);

  const getStageStatus = (index) => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h4 style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
        Contribution Timeline
      </h4>
      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '15px',
            top: '8px',
            bottom: '8px',
            width: 2,
            background: 'var(--color-border)' }}
        />
        {timelineStages.map((stage, index) => {
          const status = getStageStatus(index);
          const isCurrent = status === 'current';
          const isCompleted = status === 'completed';

          return (
            <div key={stage.key} style={{ position: 'relative', paddingBottom: '1.5rem' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '-2rem',
                  top: 0,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isCurrent ? 'var(--color-primary)' : isCompleted ? 'var(--color-secondary)' : 'var(--color-card)',
                  border: `2px solid ${isCurrent ? 'var(--color-primary)' : isCompleted ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                  color: isCurrent || isCompleted ? '#fff' : 'var(--color-body)',
                  zIndex: 1,
                  transition: 'all 0.3s ease' }}
              >
                <stage.icon size={16} />
              </div>
              <div style={{ paddingLeft: '0.5rem' }}>
                <div style={{ color: isCurrent ? 'var(--color-primary)' : 'var(--color-heading)' }}>
                  {stage.label}
                  {isCurrent && <span style={{ marginLeft: '0.5rem', color: 'var(--color-body)' }}>Current</span>}
                </div>
                <div style={{ color: 'var(--color-body)', marginTop: '0.15rem' }}>{stage.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContributionTimeline;
