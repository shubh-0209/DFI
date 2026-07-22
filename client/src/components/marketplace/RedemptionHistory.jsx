import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { History, Package, Calendar, Coins, BadgeCheck } from 'lucide-react';
import marketplaceService from '../../services/marketplaceService';
import EmptyState from '../marketplace/EmptyState';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  approved: { label: 'Approved', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  shipped: { label: 'Shipped', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  delivered: { label: 'Delivered', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  cancelled: { label: 'Cancelled', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

const RedemptionHistory = ({ history, loading }) => {
  const [filter, setFilter] = useState('all');
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['redemption-history', filter],
    queryFn: async () => {
      const res = await marketplaceService.getRedemptionHistory({ page: 1, limit: 20, status: filter });
      return res;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: filter === 'all' && !history,
  });

  const redemptions = (filter === 'all' ? history : data)?.redemptions || [];
  const total = (filter === 'all' ? history : data)?.total || 0;

  if (loading || isLoading) {
    return (
      <div>
        <h2 style={{ color: 'var(--color-heading)', marginBottom: '1rem' }}>
          Redemption History
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: '14px', width: '50%', borderRadius: '4px', marginBottom: '0.5rem' }} />
                <div className="skeleton" style={{ height: '10px', width: '30%', borderRadius: '4px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ color: 'var(--color-heading)', margin: 0 }}>
          Redemption History
          {total > 0 && <span style={{ color: 'var(--color-body)', marginLeft: '0.5rem' }}>({total})</span>}
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['all', 'pending', 'approved', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '999px',
                border: filter === status ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                background: filter === status ? 'var(--color-primary)' : 'var(--color-card)',
                color: filter === status ? 'white' : 'var(--color-body)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                textTransform: 'capitalize' }}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {redemptions.length === 0 ? (
        <EmptyState type="history" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {redemptions.map((redemption) => {
            const statusCfg = STATUS_CONFIG[redemption.status] || STATUS_CONFIG.pending;
            const date = new Date(redemption.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
            const rewardName = redemption.rewardSnapshot?.name || redemption.reward?.name || 'Unknown Reward';
            const category = redemption.rewardSnapshot?.category || redemption.reward?.category || '';

            return (
              <div
                key={redemption._id || redemption.redemptionId}
                style={{
                  background: 'var(--color-card)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'var(--transition-fast)' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: redemption.rewardSnapshot?.image ? `url(${redemption.rewardSnapshot.image}) center/cover no-repeat` : 'linear-gradient(135deg, #F8F7F4, #EDE9FE)',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center' }}
                >
                  {!redemption.rewardSnapshot?.image && <Package size={20} style={{ opacity: 0.4 }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem', gap: '0.5rem' }}>
                    <h4 style={{ color: 'var(--color-heading)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {rewardName}
                    </h4>
                    <span
                      style={{
                        padding: '0.2rem 0.625rem',
                        borderRadius: '999px',
                        background: statusCfg.bg,
                        color: statusCfg.color,
                        textTransform: 'uppercase',
                        flexShrink: 0 }}
                    >
                      {statusCfg.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ color: 'var(--color-body)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Coins size={14} />
                      {redemption.totalCoinsDeducted?.toLocaleString()} coins
                    </span>
                    {category && (
                      <span style={{ color: 'var(--color-body)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <BadgeCheck size={14} />
                        {category}
                      </span>
                    )}
                    <span style={{ color: 'var(--color-body)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} />
                      {date}
                    </span>
                    {redemption.quantity > 1 && (
                      <span style={{ color: 'var(--color-body)' }}>Qty: {redemption.quantity}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RedemptionHistory;
