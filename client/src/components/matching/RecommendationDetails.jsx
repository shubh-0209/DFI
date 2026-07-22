import React from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Tag, Briefcase, Sparkles } from 'lucide-react';

const RecommendationDetails = ({ recommendation, onClose }) => {
  if (!recommendation) return null;

  const isProgram = !!recommendation.programId;
  const scoreColor = recommendation.score >= 75
    ? { bg: '#DCFCE7', text: '#059669', stroke: '#86EFAC' }
    : recommendation.score >= 50
    ? { bg: '#FEF3C7', text: '#D97706', stroke: '#FCD34D' }
    : { bg: '#FEE2E2', text: '#DC2626', stroke: '#FCA5A5' };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15,23,42,0.45)',
        backdropFilter: 'blur(4px)',
        padding: '2rem' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 260 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative' }}
      >
        <div style={{ padding: '2rem 2rem 1.5rem', borderBottom: '1px solid #F0EDE8', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ color: 'var(--color-heading)', margin: '0 0 0.4rem 0' }}>
              {isProgram ? recommendation.programTitle : recommendation.volunteerName}
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {recommendation.reasonForRecommendation?.split('; ').map((reason, idx) => (
                <span key={idx} style={{ padding: '0.35rem 0.7rem', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.08)', color: '#059669', border: '1px solid #D1FAE5' }}>
                  <Sparkles size={10} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  {reason}
                </span>
              ))}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-body)', padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', transition: 'all 0.15s' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{
              background: scoreColor.bg,
              color: scoreColor.text,
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${scoreColor.stroke}` }}>
              {recommendation.score}% Match
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {isProgram ? (
                <>
                  {recommendation.programCategory && (
                    <span style={{ padding: '0.4rem 0.875rem', background: 'rgba(37, 99, 235, 0.08)', color: 'var(--color-primary)', borderRadius: '999px' }}>
                      <Tag size={12} style={{ display: 'inline', marginRight: '0.35rem' }} />
                      {recommendation.programCategory}
                    </span>
                  )}
                  {recommendation.programCity && (
                    <span style={{ padding: '0.4rem 0.875rem', background: 'rgba(11, 59, 145, 0.08)', color: 'var(--primary-blue)', borderRadius: '999px' }}>
                      <MapPin size={12} style={{ display: 'inline', marginRight: '0.35rem' }} />
                      {recommendation.programCity}{recommendation.programState ? `, ${recommendation.programState}` : ''}
                    </span>
                  )}
                </>
              ) : (
                <>
                  {recommendation.volunteerCity && (
                    <span style={{ padding: '0.4rem 0.875rem', background: 'rgba(11, 59, 145, 0.08)', color: 'var(--primary-blue)', borderRadius: '999px' }}>
                      <MapPin size={12} style={{ display: 'inline', marginRight: '0.35rem' }} />
                      {recommendation.volunteerCity}{recommendation.volunteerState ? `, ${recommendation.volunteerState}` : ''}
                    </span>
                  )}
                  {recommendation.volunteerSkills?.length > 0 && (
                    <span style={{ padding: '0.4rem 0.875rem', background: 'rgba(16, 185, 129, 0.08)', color: '#059669', borderRadius: '999px' }}>
                      <Briefcase size={12} style={{ display: 'inline', marginRight: '0.35rem' }} />
                      {recommendation.volunteerSkills.length} Skills
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <div style={{ background: '#F9FAFB', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid #F0EDE8' }}>
            <h4 style={{ color: 'var(--color-heading)', margin: '0 0 0.5rem 0' }}>Why this recommendation?</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {recommendation.reasonForRecommendation?.split('; ').map((reason, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-body)' }}>
                  <Sparkles size={12} color="#059669" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#F9FAFB', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid #F0EDE8' }}>
            <h4 style={{ color: 'var(--color-heading)', margin: '0 0 0.5rem 0' }}>Matching Skills</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {recommendation.matchingSkills?.length > 0 ? (
                recommendation.matchingSkills.map((skill, idx) => (
                  <span key={idx} style={{ padding: '0.3rem 0.65rem', background: 'white', color: 'var(--color-primary)', borderRadius: '999px', border: '1px solid var(--color-border)' }}>
                    {skill}
                  </span>
                ))
              ) : (
                <p style={{ color: 'var(--color-body)', margin: 0 }}>No matching skills found</p>
              )}
            </div>
          </div>

          {recommendation.missingSkills?.length > 0 && (
            <div style={{ background: '#FEF2F2', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid #FECACA' }}>
              <h4 style={{ color: '#991B1B', margin: '0 0 0.5rem 0' }}>Missing Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {recommendation.missingSkills.map((skill, idx) => (
                  <span key={idx} style={{ padding: '0.3rem 0.65rem', background: '#FEE2E2', color: '#991B1B', borderRadius: '999px' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid #F0EDE8', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s' }}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RecommendationDetails;
