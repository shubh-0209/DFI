/**
 * DashboardMyImpact.jsx
 * Section 4 – "My Impact"
 *
 * Shows the volunteer's personal impact summary using existing backend data.
 * Metrics shown: Hours Served, Programs Participated, Contributions Submitted,
 * Certificates Earned, plus Coins Earned and Badges if available.
 *
 * Hidden entirely when all values are zero (no impact yet).
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Briefcase, FileText, Award, Coins, Star } from 'lucide-react';

/* ─── single metric tile ────────────────────────────────────────────────────── */

const ImpactTile = ({ icon: Icon, value, label, color, bg, delay }) => (
  <motion.div
    className="dashboard-card impact-card w-full"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 'var(--space-3)',
    }}
  >
    <div style={{
      borderRadius: '8px',
      background: bg,
      color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      flexShrink: 0
    }}>
      <Icon size={16} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
      <div style={{ color: 'var(--color-heading)', fontSize: '18px', fontWeight: 700, lineHeight: 1.1 }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div style={{ color: 'var(--color-body)', fontSize: 'var(--text-supporting)' }}>
        {label}
      </div>
    </div>
  </motion.div>
);

/* ─── component ─────────────────────────────────────────────────────────────── */

const DashboardMyImpact = ({
  totalHours,
  programsJoined,
  contributionsCount,
  certificatesEarned,
  coinsEarned,
  badgesEarned,
  loading,
}) => {
  if (loading) return null;

  // Build the metric list — only include tiles that have real data (value > 0)
  const allMetrics = [
    {
      icon: FileText,
      value: contributionsCount ?? 0,
      label: 'Contributions',
      color: '#2563EB',
      bg: '#DBEAFE',
    },
    {
      icon: Coins,
      value: coinsEarned ?? 0,
      label: 'Coins Earned',
      color: 'var(--primary-blue)',
      bg: '#FFF3ED',
    },
  ];

  // Only show tiles where the value is greater than zero
  const visibleMetrics = allMetrics.filter((m) => m.value > 0);

  // Hide the whole section if nothing to show
  if (visibleMetrics.length === 0) return null;

  return (
    <div className="dashboard-card">
      {/* Section heading */}
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <h2 style={{
          color: 'var(--color-heading)',
          fontSize: 'var(--text-section-title)',
          margin: 0
        }}>
          My Impact
        </h2>
        <p style={{
          color: 'var(--color-body)',
          fontSize: 'var(--text-supporting)',
          margin: 'var(--space-1) 0 0 0'
        }}>
          Your contribution to Disha For India so far.
        </p>
      </div>

      {/* Tile grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2)' }}>
        {visibleMetrics.map((m, i) => (
          <ImpactTile key={m.label} {...m} delay={i * 0.05} />
        ))}
      </div>
    </div>
  );
};

export default DashboardMyImpact;
