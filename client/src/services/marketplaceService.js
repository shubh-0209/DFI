import api from './api';

export const getMarketplaceCatalog = async (params = {}) => {
  const res = await api.get('/rewards/marketplace', { params });
  return res?.data || null;
};

export const getFeaturedRewards = async (params = {}) => {
  const res = await api.get('/rewards/marketplace/featured', { params });
  return res?.data || [];
};

export const getRewardDetail = async (id) => {
  const res = await api.get(`/rewards/marketplace/${id}`);
  return res?.data || null;
};

export const redeemReward = async (id, quantity = 1, deliveryAddress = null, rewardType = 'physical') => {
  const res = await api.post(`/rewards/marketplace/${id}/redeem`, {
    quantity,
    deliveryAddress: deliveryAddress || undefined,
    rewardType,
  });
  return res?.data || null;
};

export const getRedemptionHistory = async (params = {}) => {
  const res = await api.get('/rewards/my-redemptions', { params });
  return res?.data || null;
};

// ── Admin API ──────────────────────────────────────────────────────────────

export const adminGetAllRedemptions = async (params = {}) => {
  const res = await api.get('/rewards/admin/redemptions', { params });
  return res?.data || null;
};

export const adminUpdateRedemptionStatus = async (id, status, notes = '', trackingNumber = '') => {
  const res = await api.patch(`/rewards/admin/redemptions/${id}/status`, {
    status,
    notes,
    trackingNumber,
  });
  return res?.data || null;
};

export const adminCreateReward = async (rewardData) => {
  const res = await api.post('/rewards/admin/marketplace', rewardData);
  return res?.data || null;
};

export default {
  getMarketplaceCatalog,
  getFeaturedRewards,
  getRewardDetail,
  redeemReward,
  getRedemptionHistory,
  adminGetAllRedemptions,
  adminUpdateRedemptionStatus,
  adminCreateReward,
};
