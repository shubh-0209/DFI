import React from 'react';
import { ArrowRight, Sparkles, Coins, Zap } from 'lucide-react';

const MOTIVATIONAL_MESSAGES = [
  'Every coin you earn is a step towards making a difference. Keep volunteering!',
  'Your dedication is paying off. Redeem amazing rewards with your hard-earned coins!',
  "You're doing incredible work. Treat yourself to a well-deserved reward!",
  "Impact lives, earn coins, claim rewards. That's the Disha way!",
  'Your volunteer journey is extraordinary. Explore what your coins can unlock!',
];

const MarketplaceHero = ({ coins, level, onBrowse }) => {
  const message = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];

  return (
    <div
      className="marketplace-hero-card"
      style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d1b69 50%, #1a1a2e 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: 'clamp(1.75rem, 4vw, 2.75rem) clamp(1.5rem, 4vw, 2.5rem)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
        flexWrap: 'wrap'
      }}
    >
      {/* Background decoration */}
      <div style={{ position: 'absolute', top: '-50px', right: '20px', opacity: 0.05, pointerEvents: 'none' }}>
        <Sparkles size={240} />
      </div>
      <div style={{ position: 'absolute', bottom: '-40px', left: '10px', opacity: 0.04, pointerEvents: 'none' }}>
        <Sparkles size={180} />
      </div>

      {/* Left — branding + message + CTA */}
      <div style={{ position: 'relative', zIndex: 1, flex: '1 1 340px', minWidth: 0 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.875rem',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            marginBottom: '1rem'
          }}
        >
          <Sparkles size={13} />
          <span style={{ textTransform: 'uppercase' }}>
            Disha Marketplace
          </span>
        </div>

        <h1
          className="marketplace-hero-title"
          style={{
            margin: '0 0 0.75rem 0',
            color: '#FFFFFF',
            background: 'none',
            WebkitTextFillColor: 'initial'
          }}
        >
          Redeem Your Impact
        </h1>

        <p
          className="marketplace-hero-desc"
          style={{
            marginBottom: '1.75rem',
            opacity: 0.82,
            maxWidth: '480px'
          }}
        >
          {message}
        </p>

        <button
          className="marketplace-hero-btn"
          onClick={onBrowse}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.625rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: 'white',
            color: '#1e3a5f',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.28)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)'; }}
        >
          Browse Rewards
          <ArrowRight size={17} />
        </button>
      </div>

      {/* Right — coin + level stat tiles */}
      <div
        className="marketplace-hero-stats-container"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          gap: '1rem',
          flexShrink: 0,
          flexWrap: 'wrap'
        }}
      >
        <div
          className="marketplace-hero-stat-card"
          style={{
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.75rem',
            textAlign: 'center',
            minWidth: '120px',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(251,191,36,0.2)',
              border: '1px solid rgba(251,191,36,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.625rem',
              color: '#FCD34D'
            }}
          >
            <Coins size={20} />
          </div>
          <div style={{ textTransform: 'uppercase', opacity: 0.7, marginBottom: '0.3rem' }}>
            Your Coins
          </div>
          <div >
            {coins.toLocaleString()}
          </div>
        </div>

        <div
          className="marketplace-hero-stat-card"
          style={{
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.75rem',
            textAlign: 'center',
            minWidth: '120px',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(167,139,250,0.2)',
              border: '1px solid rgba(167,139,250,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.625rem',
              color: '#C4B5FD'
            }}
          >
            <Zap size={20} />
          </div>
          <div style={{ textTransform: 'uppercase', opacity: 0.7, marginBottom: '0.3rem' }}>
            Level
          </div>
          <div >
            {level || 'Beginner'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHero;
