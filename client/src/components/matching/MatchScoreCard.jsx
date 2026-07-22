import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Heart, AlertCircle } from 'lucide-react';
import recommendationService from '../../services/recommendationService';
import { useAuth } from '../../context/AuthContext';

const MatchScoreCard = ({ recommendation, onClick }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!recommendation) return null;

  const isProgram = !!recommendation.programId;
  const scoreColor = recommendation.score >= 75
    ? { bg: '#DCFCE7', text: '#059669', stroke: '#86EFAC' }
    : recommendation.score >= 50
    ? { bg: '#FEF3C7', text: '#D97706', stroke: '#FCD34D' }
    : { bg: '#FEE2E2', text: '#DC2626', stroke: '#FCA5A5' };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!user || saving) return;
    setSaving(true);
    try {
      const res = await recommendationService.saveRecommendation({
        programId: recommendation.programId || null,
        volunteerId: recommendation.volunteerId || null,
        score: recommendation.score,
        reasonForRecommendation: recommendation.reasonForRecommendation,
        matchingSkills: recommendation.matchingSkills || [],
        missingSkills: recommendation.missingSkills || [],
        metadata: {},
      });
      if (res.success) {
        setSaved(true);
        queryClient.invalidateQueries(['saved-recommendations']);
        queryClient.invalidateQueries(['program-recommendations']);
        queryClient.invalidateQueries(['volunteer-recommendations']);
      }
    } catch (err) {
      console.error('Failed to save recommendation', err);
    } finally {
      setSaving(false);
    }
  };

  const renderDetails = () => {
    if (isProgram) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--color-body)' }}>Location</span>
            <span style={{ color: 'var(--color-heading)', textAlign: 'right', maxWidth: '60%' }}>
              {recommendation.programCity}{recommendation.programState ? `, ${recommendation.programState}` : ''}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--color-body)' }}>Category</span>
            <span style={{ color: 'var(--color-heading)', textAlign: 'right', maxWidth: '60%' }}>
              {recommendation.programCategory || 'General'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--color-body)' }}>Matching Skills</span>
            <span style={{ color: 'var(--color-primary)', textAlign: 'right', maxWidth: '60%' }}>
              {recommendation.matchingSkills?.length ? recommendation.matchingSkills.slice(0, 3).join(', ') : 'None'}
              {recommendation.matchingSkills?.length > 3 && ` +${recommendation.matchingSkills.length - 3}`}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--color-body)' }}>Location</span>
          <span style={{ color: 'var(--color-heading)', textAlign: 'right', maxWidth: '60%' }}>
            {recommendation.volunteerCity}{recommendation.volunteerState ? `, ${recommendation.volunteerState}` : ''}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--color-body)' }}>Skills</span>
          <span style={{ color: 'var(--color-primary)', textAlign: 'right', maxWidth: '60%' }}>
            {recommendation.volunteerSkills?.length ? recommendation.volunteerSkills.slice(0, 3).join(', ') : 'None'}
            {recommendation.volunteerSkills?.length > 3 && ` +${recommendation.volunteerSkills.length - 3}`}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--color-body)' }}>Matching Skills</span>
          <span style={{ color: 'var(--color-primary)', textAlign: 'right', maxWidth: '60%' }}>
            {recommendation.matchingSkills?.length ? recommendation.matchingSkills.slice(0, 3).join(', ') : 'None'}
            {recommendation.matchingSkills?.length > 3 && ` +${recommendation.matchingSkills.length - 3}`}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        padding: '1.25rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        position: 'relative',
        overflow: 'hidden' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ color: 'var(--color-heading)', margin: '0 0 0.5rem 0' }}>
            {isProgram ? recommendation.programTitle : recommendation.volunteerName}
          </h4>
          <p style={{ color: 'var(--color-body)', margin: 0 }}>{recommendation.reasonForRecommendation}</p>
        </div>
        <div
          style={{
            flexShrink: 0,
            marginLeft: '1rem',
            background: scoreColor.bg,
            color: scoreColor.text,
            padding: '0.5rem 0.875rem',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${scoreColor.stroke}`,
            minWidth: '52px',
            textAlign: 'center' }}
        >
          {recommendation.score}%
        </div>
      </div>

      {renderDetails()}

      {recommendation.missingSkills?.length > 0 && (
        <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#FEF2F2', borderRadius: 'var(--radius-sm)', border: '1px solid #FECACA' }}>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.4rem' }}>
            <AlertCircle size={14} color="#DC2626" />
            <span style={{ color: '#DC2626' }}>Missing Skills</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {recommendation.missingSkills.slice(0, 5).map((skill, idx) => (
              <span key={idx} style={{ padding: '0.2rem 0.5rem', background: '#FEE2E2', color: '#991B1B', borderRadius: '999px' }}>
                {skill}
              </span>
            ))}
            {recommendation.missingSkills.length > 5 && (
              <span style={{ padding: '0.2rem 0.5rem', color: '#991B1B' }}>
                +{recommendation.missingSkills.length - 5}
              </span>
            )}
          </div>
        </div>
      )}

      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        {!saved && (
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ padding: '0.4rem 0.75rem', borderRadius: 8, border: '1px solid var(--color-border)', background: saved ? '#DCFCE7' : 'white', color: saved ? '#059669' : 'var(--color-heading)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <Heart size={14} /> {saving ? 'Saving...' : 'Save'}
          </button>
        )}
        {saved && (
          <span style={{ padding: '0.4rem 0.75rem', borderRadius: 8, border: '1px solid #D1FAE5', background: '#DCFCE7', color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <Heart size={14} /> Saved
          </span>
        )}
      </div>
    </div>
  );
};

export default MatchScoreCard;
