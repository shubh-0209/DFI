import SimpleLoader from '../common/SimpleLoader';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Star, Flame, ShieldCheck, Truck, BadgeCheck, Image as ImageIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import marketplaceService from '../../services/marketplaceService';
import { getCategoryFallbackImage } from '../../utils/rewardFallbacks';
import RedeemModal from './RedeemModal';

const RewardDetailDrawer = ({ rewardId, onClose, userCoins, onRedeemSuccess }) => {
  const queryClient = useQueryClient();
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { data: reward, isLoading, error } = useQuery({
    queryKey: ['reward-detail', rewardId],
    queryFn: async () => {
      const res = await marketplaceService.getRewardDetail(rewardId);
      return res;
    },
    enabled: !!rewardId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleRedeem = async (quantity = 1, deliveryAddress = null, rewardType = 'physical') => {
    try {
      setRedeeming(true);
      const res = await marketplaceService.redeemReward(rewardId, quantity, deliveryAddress, rewardType);
      if (res) {
        toast.success('Reward redeemed successfully!');
        queryClient.invalidateQueries(['marketplace-catalog']);
        queryClient.invalidateQueries(['featured-rewards']);
        queryClient.invalidateQueries(['redemption-history']);
        queryClient.invalidateQueries(['my-rewards']);
        setShowRedeemModal(false);
        onRedeemSuccess && onRedeemSuccess(res);
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to redeem reward');
    } finally {
      setRedeeming(false);
    }
  };

  if (!rewardId) return null;

  return (
    <AnimatePresence>
      {rewardId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '560px',
              height: '100%',
              background: 'var(--color-card)',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ margin: 0 }}>Reward Details</h2>
              <button
                onClick={onClose}
                aria-label="Close details"
                style={{ background: 'none', border: 'none', color: 'var(--color-body)', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {isLoading && (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <div style={{ width: '40px', height: '40px', border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                  <SimpleLoader />
                </div>
              )}

              {error && (
                <div style={{ textAlign: 'center', padding: 'clamp(2rem, 5vw, 3rem)' }}>
                  <p style={{ color: 'var(--color-error)', marginBottom: '1rem' }}>Failed to load reward details.</p>
                  <button onClick={() => queryClient.invalidateQueries(['reward-detail', rewardId])} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Retry
                  </button>
                </div>
              )}

              {reward && !isLoading && (
                <div>
                  <div
                    style={{
                      width: '100%',
                      height: '240px',
                      background: 'linear-gradient(135deg, #F8F7F4, #EDE9FE)',
                      borderRadius: 'var(--radius-lg)',
                      marginBottom: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}
                  >
                    {(reward.image_url || reward.image) && !imageError ? (
                      <img
                        src={reward.image_url || reward.image}
                        alt={reward.title || reward.name}
                        onError={() => setImageError(true)}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <img
                        src={getCategoryFallbackImage(reward.category)}
                        alt={`Fallback for ${reward.title || reward.name}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ margin: 0, flex: 1 }}>
                      {reward.title || reward.name}
                    </h3>
                    {reward.isFeatured && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.3rem 0.75rem', borderRadius: '999px', background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
                        <Flame size={14} /> Featured
                      </span>
                    )}
                  </div>

                  <span style={{ display: 'inline-block', padding: '0.3rem 0.75rem', borderRadius: '999px', background: 'rgba(37,99,235,0.08)', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                    {reward.category}
                  </span>

                  <p style={{ color: 'var(--color-body)', marginBottom: '1.5rem' }}>{reward.description}</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: '#FDFBF7', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid #F0EDE8' }}>
                      <div style={{ color: 'var(--color-body)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Coin Cost</div>
                      <div style={{ color: 'var(--color-primary)' }}>
                        {reward.coinCost.toLocaleString()}
                        <span style={{ marginLeft: '0.25rem' }}>coins</span>
                      </div>
                    </div>
                    <div style={{ background: '#FDFBF7', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid #F0EDE8' }}>
                      <div style={{ color: 'var(--color-body)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Stock Remaining</div>
                      <div style={{ color: reward.stock > 10 ? 'var(--color-success)' : 'var(--color-error)' }}>
                        {reward.stock}
                      </div>
                    </div>
                  </div>

                  {reward.eligibility && (
                    <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <ShieldCheck size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '0.15rem' }} />
                      <div>
                        <div style={{ color: 'var(--color-heading)', marginBottom: '0.25rem' }}>Eligibility</div>
                        <p style={{ color: 'var(--color-body)', margin: 0 }}>{reward.eligibility}</p>
                      </div>
                    </div>
                  )}

                  {reward.termsAndConditions && (
                    <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <BadgeCheck size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '0.15rem' }} />
                      <div>
                        <div style={{ color: 'var(--color-heading)', marginBottom: '0.25rem' }}>Terms & Conditions</div>
                        <p style={{ color: 'var(--color-body)', margin: 0 }}>{reward.termsAndConditions}</p>
                      </div>
                    </div>
                  )}

                  {reward.estimatedDelivery && (
                    <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <Truck size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '0.15rem' }} />
                      <div>
                        <div style={{ color: 'var(--color-heading)', marginBottom: '0.25rem' }}>Estimated Delivery</div>
                        <p style={{ color: 'var(--color-body)', margin: 0 }}>{reward.estimatedDelivery}</p>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <button
                      onClick={() => setShowRedeemModal(true)}
                      disabled={reward.stock === 0 || userCoins < reward.coinCost}
                      style={{
                        flex: 1,
                        padding: '0.875rem',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        background: reward.stock === 0 || userCoins < reward.coinCost ? '#D1D5DB' : 'var(--color-primary)',
                        color: 'white',
                        cursor: reward.stock === 0 || userCoins < reward.coinCost ? 'not-allowed' : 'pointer',
                        transition: 'var(--transition-fast)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {reward.stock === 0 ? 'Sold Out' : userCoins < reward.coinCost ? 'Insufficient Coins' : 'Redeem Now'}
                    </button>
                    <button
                      onClick={onClose}
                      style={{
                        padding: '0.875rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        background: 'transparent',
                        color: 'var(--color-heading)',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            <RedeemModal
              open={showRedeemModal}
              onClose={() => setShowRedeemModal(false)}
              reward={reward}
              userCoins={userCoins}
              onConfirm={handleRedeem}
              loading={redeeming}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RewardDetailDrawer;
