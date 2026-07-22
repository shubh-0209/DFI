import React from 'react';
import { Check, X, ThumbsUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  saveRecommendation,
  unsaveRecommendation,
  dismissRecommendation,
  submitRecommendationFeedback,
} from '../../services/recommendationService';

/**
 * RecommendationCard – displays a single recommendation with actions.
 * Props:
 *   recommendation: { id, title, description, reason, priority, score }
 *   onSavedChange?: (id: string, saved: boolean) => void
 *   onDismissed?: (id: string) => void
 */
export default function RecommendationCard({ recommendation, onSavedChange, onDismissed }) {
  const { id, title, description, reason, priority, score } = recommendation;
  const [feedbackRating, setFeedbackRating] = React.useState(null);

  const handleSave = async () => {
    try {
      await saveRecommendation({ programId: id, score: score || 0, reasonForRecommendation: reason });
      toast.success('Recommendation saved');
      onSavedChange?.(id, true);
    } catch (e) {
      toast.error('Save failed');
    }
  };

  const handleDismiss = async () => {
    try {
      await dismissRecommendation({ programId: id });
      toast.success('Dismissed');
      onDismissed?.(id);
    } catch (e) {
      toast.error('Dismiss failed');
    }
  };

  const handleFeedback = async (rating) => {
    try {
      await submitRecommendationFeedback({
        programId: id,
        rating,
        comments: '',
        dismissed: false,
      });
      toast.success(`Feedback recorded: ${rating}/5`);
      setFeedbackRating(rating);
    } catch (e) {
      toast.error('Feedback failed');
    }
  };

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 11.52,
        padding: '1rem 1.25rem',
        border: '1px solid #F0EDE8',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
        <h4 style={{ margin: 0 }}>{title}</h4>
        {priority && (
          <span
            style={{
              background: '#E5E7EB',
              borderRadius: 5.76,
              padding: '2px 6px',
              color: '#374151',
              flexShrink: 0 }}
          >
            {priority}
          </span>
        )}
      </div>
      {description && (
        <p style={{ margin: 0, color: '#4B5563' }}>{description}</p>
      )}
      {reason && (
        <p style={{ margin: 0, color: '#6B7280' }}>
          <strong>Why:</strong> {reason}
        </p>
      )}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button
          onClick={handleSave}
          style={{
            flex: 1,
            background: '#10B981',
            color: 'white',
            border: 'none',
            borderRadius: 5.76,
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            cursor: 'pointer' }}
        >
          <Check size={14} /> Save
        </button>
        <button
          onClick={handleDismiss}
          style={{
            flex: 1,
            background: '#EF4444',
            color: 'white',
            border: 'none',
            borderRadius: 5.76,
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            cursor: 'pointer' }}
        >
          <X size={14} /> Dismiss
        </button>
        <button
          onClick={() => handleFeedback(5)}
          disabled={feedbackRating !== null}
          style={{
            flex: 1,
            background: feedbackRating ? '#4F46E5' : '#6366F1',
            color: 'white',
            border: 'none',
            borderRadius: 5.76,
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            cursor: feedbackRating ? 'default' : 'pointer',
            opacity: feedbackRating ? 0.8 : 1 }}
        >
          <ThumbsUp size={14} /> {feedbackRating ? 'Feedback Sent' : 'Helpful'}
        </button>
      </div>
    </div>
  );
}
