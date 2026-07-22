import React from 'react';
import { motion } from 'framer-motion';
import { Gift, History, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const RewardSection = ({ rewards, history }) => {
  if (!rewards && !history) return null;

  const totalPoints = rewards?.totalPoints ?? 0;
  const totalCoins = rewards?.totalCoins ?? 0;
  const transactions = history?.transactions || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: 'white', borderRadius: 20, padding: '2rem', border: '1px solid #F0EDE8', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: '2rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Gift size={20} />
          </div>
          <h3 style={{ margin: 0, color: 'var(--color-heading)' }}>Rewards</h3>
        </div>
        <Link to="/marketplace" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          View Rewards <ExternalLink size={13} />
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 120, background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', borderRadius: 12, padding: '1rem', textAlign: 'center', border: '1px solid #FDE68A' }}>
          <div style={{ color: '#92400E', textTransform: 'uppercase' }}>Total Points</div>
          <div style={{ color: '#B45309' }}>{totalPoints}</div>
        </div>
        <div style={{ flex: 1, minWidth: 120, background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)', borderRadius: 12, padding: '1rem', textAlign: 'center', border: '1px solid #FED7AA' }}>
          <div style={{ color: '#9A3412', textTransform: 'uppercase' }}>Total Coins</div>
          <div style={{ color: '#C2410C' }}>{totalCoins}</div>
        </div>
      </div>

      {transactions.length > 0 && (
        <div>
          <h4 style={{ color: 'var(--color-heading)', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: 6 }}>
            <History size={15} /> Reward History
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {transactions.slice(0, 5).map((txn, i) => (
              <div
                key={txn._id || i}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.65rem 0.875rem', background: '#FAFAF8', borderRadius: 10,
                  border: '1px solid #F0EDE8' }}
              >
                <div>
                  <div style={{ color: 'var(--color-heading)' }}>{txn.reason || txn.type || 'Reward'}</div>
                  <div style={{ color: 'var(--color-body)' }}>
                    {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                  </div>
                </div>
                <span style={{ color: (txn.points || txn.coins || 0) >= 0 ? '#059669' : '#DC2626' }}>
                  {(txn.points || txn.coins || 0) >= 0 ? '+' : ''}{txn.points || txn.coins || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RewardSection;
