/**
 * NotificationBell.jsx
 *
 * Bell button with the Transitions.dev badge animation pattern:
 *
 *  • Appear  – badge slides in from bottom-left (offset-x: -8px, offset-y: 12px),
 *              then springs to scale(1) with a slight overshoot.
 *  • Dismiss – badge pops out fast: scale(0) + opacity(0) + blur(2px).
 *  • Count change – badge does a quick "pulse" pop so the number change is noticed.
 *
 * All motion is implemented with framer-motion (already a project dependency)
 * so no extra CSS file is needed.  Reduced-motion is respected via the
 * `useReducedMotion` hook.
 */

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Bell } from 'lucide-react';

/* ─── animation variants ─────────────────────────────────────────────────── */

/**
 * The wrapper span mirrors `.t-badge`:
 *   - On mount it slides in from (−8px, +12px) using a fast ease-out curve.
 *   - On unmount it simply disappears (the dot handles the visual exit).
 */
const wrapperVariants = {
  // slide in from offset, matching cubic-bezier(0.22, 1, 0.36, 1) @ 260 ms
  initial: { x: -8.2, y: 12.4, opacity: 1 },
  animate: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
  },
  // wrapper exit is instant — the dot drives the visual exit
  exit: { opacity: 0, transition: { duration: 0 } },
};

/**
 * The dot itself:
 *   Appear  — spring overshoot: cubic-bezier(0.34, 1.36, 0.64, 1) @ 500 ms
 *   Dismiss — fast scale-to-zero + blur: cubic-bezier(0.4, 0, 0.2, 1) @ 180 ms
 */
const dotVariants = {
  initial: { scale: 0, opacity: 0, filter: 'blur(2px)' },
  animate: {
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      scale:   { duration: 0.5,  ease: [0.34, 1.36, 0.64, 1] },
      opacity: { duration: 0.4,  ease: [0.34, 1.36, 0.64, 1] },
      filter:  { duration: 0.5,  ease: [0.34, 1.36, 0.64, 1] },
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    filter: 'blur(2px)',
    transition: {
      scale:   { duration: 0.18, ease: [0.4, 0, 0.2, 1] },
      opacity: { duration: 0.18, ease: [0.4, 0, 0.2, 1] },
      filter:  { duration: 0.18, ease: [0.4, 0, 0.2, 1] },
    },
  },
};

/**
 * When the count changes while the badge is already visible, pulse the dot
 * briefly so the number change is noticeable.
 */
const pulseTransition = {
  scale: { type: 'spring', stiffness: 600, damping: 12 },
};

/* ─── badge component ────────────────────────────────────────────────────── */

const Badge = React.memo(({ count, reduced }) => (
  <AnimatePresence>
    {count > 0 && (
      /* Wrapper — handles the slide-in entry */
      <motion.span
        key="badge-wrapper"
        variants={reduced ? undefined : wrapperVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          position: 'absolute',
          top: -6,
          right: -8,
          pointerEvents: 'none',
          willChange: 'transform',
          /* ensure the badge always sits above the bell icon */
          zIndex: 1 }}
        aria-hidden="true"
      >
        {/* Dot — handles appear / dismiss / pulse */}
        <motion.span
          key={`dot-${count}`}          // re-key on count change to trigger pulse
          variants={reduced ? undefined : dotVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          // subtle pulse on count-change (re-mount via key)
          transition={reduced ? undefined : pulseTransition}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 18,
            height: 18,
            padding: '0 5px',
            borderRadius: 999,
            backgroundColor: 'var(--color-error)',
            color: '#fff',
            boxShadow: '0 2px 6px rgba(220,38,38,0.35)',
            transformOrigin: 'center',
            willChange: 'transform, opacity, filter' }}
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      </motion.span>
    )}
  </AnimatePresence>
));

Badge.displayName = 'NotificationBadge';

/* ─── bell button ────────────────────────────────────────────────────────── */

const BellButton = React.memo(({ unreadCount = 0, onClick, loading = false, ariaLabel }) => {
  const [isFocused, setIsFocused] = useState(false);
  const reduced = useReducedMotion();

  return (
    <motion.button
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      aria-label={ariaLabel}
      aria-pressed={false}
      title={
        unreadCount > 0
          ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
          : 'No new notifications'
      }
      style={{
        position: 'relative',
        width: 40,
        height: 40,
        borderRadius: 10,
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-card)',
        color: 'var(--color-heading)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'var(--transition-fast)',
        outline: 'none',
        /* overflow visible so the badge can escape the button boundary */
        overflow: 'visible' }}
      whileHover={{ scale: 1.05, borderColor: 'var(--color-primary)' }}
      whileTap={{ scale: 0.95 }}
      animate={{
        backgroundColor: isFocused ? 'var(--color-bg)' : 'var(--color-card)',
        borderColor: isFocused ? 'var(--color-primary)' : 'var(--color-border)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {loading ? (
        <motion.div
          className="spinner"
          style={{ width: 18, height: 18, borderWidth: 2 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
      ) : (
        <Bell size={20} />
      )}

      <Badge count={unreadCount} reduced={reduced} />
    </motion.button>
  );
});

BellButton.displayName = 'BellButton';

/* ─── public export ──────────────────────────────────────────────────────── */

const NotificationBell = ({ unreadCount = 0, onClick, loading = false }) => {
  const ariaLabel =
    unreadCount > 0
      ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
      : 'No unread notifications';

  return (
    <BellButton
      unreadCount={unreadCount}
      onClick={onClick}
      loading={loading}
      ariaLabel={ariaLabel}
    />
  );
};

export default NotificationBell;
