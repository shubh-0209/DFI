import React from 'react';
import { Clock, Send, ShieldCheck, CheckCircle2, Award, RefreshCw, UserCheck } from 'lucide-react';

const contributionStages = [
  { key: 'pending', label: 'Submitted', icon: Send, description: 'Contribution submitted for review' },
  { key: 'under_review', label: 'Under Review', icon: ShieldCheck, description: 'Admin is reviewing' },
  { key: 'approved', label: 'Approved', icon: CheckCircle2, description: 'Contribution approved' },
  { key: 'rejected', label: 'Rejected', icon: Clock, description: 'Contribution rejected' },
  { key: 'needs_changes', label: 'Needs Changes', icon: RefreshCw, description: 'Changes requested' },
  { key: 'archived', label: 'Archived', icon: Award, description: 'Contribution archived' },
];

const ActivityTimeline = ({ currentStatus, reviews = [], automation = [] }) => {
  const currentIndex = contributionStages.findIndex((s) => s.key === currentStatus);

  const getStageStatus = (index) => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'upcoming';
  };

  const hasReviews = reviews && reviews.length > 0;
  const hasAutomation = automation && automation.length > 0;
  const showReviewSection = hasReviews || hasAutomation;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
        Activity Timeline
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
            background: 'var(--color-border)',
          }}
        />
        {contributionStages.map((stage, index) => {
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
                  transition: 'all 0.3s ease',
                }}
              >
                <stage.icon size={16} />
              </div>
              <div style={{ paddingLeft: '0.5rem' }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', color: isCurrent ? 'var(--color-primary)' : 'var(--color-heading)' }}>
                  {stage.label}
                  {isCurrent && <span style={{ marginLeft: '0.5rem', fontSize: 'var(--text-xs)', color: 'var(--color-body)' }}>Current</span>}
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-body)', marginTop: '0.15rem' }}>{stage.description}</div>
              </div>
            </div>
          );
        })}
      </div>

      {showReviewSection && (
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {hasReviews && (
            <div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-heading)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserCheck size={16} style={{ color: 'var(--color-primary)' }} /> Review History
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {reviews.map((review, index) => (
                  <div key={review._id || index} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-card)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)' }}>
                        {review.action?.replace(/_/g, ' ')?.replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-body)' }}>{formatDateTime(review.reviewedAt || review.createdAt)}</span>
                    </div>
                    {review.reviewedBy?.name && (
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-body)', marginBottom: '0.25rem' }}>
                        Reviewer: {review.reviewedBy.name}
                      </div>
                    )}
                    {review.feedback && (
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-body)', lineHeight: 1.5 }}>
                        {review.feedback}
                      </div>
                    )}
                    {review.coinsAwarded > 0 && (
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-success)', fontWeight: 600, marginTop: '0.25rem' }}>
                        +{review.coinsAwarded} coins awarded
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasAutomation && (
            <div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-heading)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} style={{ color: 'var(--color-info)' }} /> Automation Events
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {automation.map((event, index) => (
                  <div key={index} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)', background: 'var(--color-card)' }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-heading)', marginBottom: '0.25rem' }}>
                      {event.type || 'Event'}
                    </div>
                    {event.message && (
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-body)' }}>{event.message}</div>
                    )}
                    {event.timestamp && (
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-body)', marginTop: '0.25rem' }}>{formatDateTime(event.timestamp)}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
