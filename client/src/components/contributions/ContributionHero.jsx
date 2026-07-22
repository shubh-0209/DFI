import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Trophy } from 'lucide-react';

const ContributionHero = ({ onStartContributing }) => {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #111827 100%)',
        minHeight: '520px',
        display: 'flex',
        alignItems: 'center' }}
    >
      {/* Background decorations */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(211,84,0,0.08)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(5,150,105,0.06)', filter: 'blur(60px)' }} />
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem', position: 'relative', zIndex: 2, width: '100%' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              background: 'rgba(211,84,0,0.15)',
              color: 'var(--color-primary)',
              marginBottom: '1.5rem',
              border: '1px solid rgba(211,84,0,0.2)' }}>
              <Sparkles size={16} />
              Contribution Hub
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            style={{
              color: 'white',
              marginBottom: '1.25rem' }}
          >
            Share Your Skills. <br />
            <span style={{ color: 'var(--color-primary)' }}>Earn Recognition.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            style={{
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '560px',
              margin: '0 auto 2rem' }}
          >
            Contribute your expertise to verified NGOs. Get your work reviewed, earn coins and badges, and build a portfolio of impact.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}
          >
            <button onClick={onStartContributing} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 2rem' }}>
              Start Contributing <ArrowRight size={18} />
            </button>
            <Link to="/programs" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 2rem', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
              Browse Programs
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginTop: '3rem', color: 'rgba(255,255,255,0.5)' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={16} /> Verified Partners
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={16} /> Gamified Rewards
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} /> Blockchain Certificates
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContributionHero;
