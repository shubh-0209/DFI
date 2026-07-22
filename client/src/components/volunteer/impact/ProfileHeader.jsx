import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, MapPin, Calendar, Award, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileHeader = ({ user, level, rank, stats }) => {
  const initials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    : 'V';

  const levelTitle = level?.currentLevel?.title || 'Beginner';
  const impactScore = stats?.impactScore || 0;
  const contributionScore = user?.points || 0;
  const city = user?.city || user?.location || 'India';
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'N/A';
  const bio = user?.about || user?.bio || 'Passionate about making a difference.';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 40%, var(--primary-blue) 100%)',
        borderRadius: 24,
        padding: '2.5rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(37,99,235,0.25)',
        marginBottom: '2rem' }}
    >
      <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '-40px', width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{
          width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '3px solid rgba(255,255,255,0.4)', flexShrink: 0, color: 'white'
        }}>
          {user?.profilePhoto ? (
            <img src={user.profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : initials}
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <h2 style={{ margin: '0 0 0.25rem 0', color: 'white' }}>
            {user?.name || 'Volunteer'}
          </h2>
          <p style={{ opacity: 0.85, margin: '0 0 0.75rem 0' }}>{user?.role || 'VOLUNTEER'}</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ padding: '0.3rem 0.75rem', borderRadius: 999, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Award size={12} /> {levelTitle}
            </span>
            {rank && (
              <span style={{ padding: '0.3rem 0.75rem', borderRadius: 999, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Trophy size={12} /> Rank #{rank}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', opacity: 0.9 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={13} /> {city}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Calendar size={13} /> Joined {joinedDate}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><TrendingUp size={13} /> Impact: {impactScore}</span>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2, marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)', maxWidth: 500 }}>
        <p style={{ opacity: 0.9, margin: 0, fontStyle: 'italic' }}>"{bio}"</p>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
