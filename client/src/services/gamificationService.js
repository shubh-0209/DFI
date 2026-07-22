import api from './api';

/**
 * Get the global leaderboard.
 * @param {Object} params - page, limit
 */
export const getLeaderboard = async (params = {}) => {
  return await api.get('/leaderboard', { params });
};

/**
 * Get current user's leaderboard rank.
 */
export const getMyRank = async () => {
  return await api.get('/leaderboard/me');
};

/**
 * Get top 10 volunteers.
 */
export const getTopVolunteers = async () => {
  return await api.get('/leaderboard/top');
};

/**
 * Get current user's badges.
 */
export const getMyBadges = async () => {
  return await api.get('/leaderboard/badges');
};

/**
 * Get current user's achievements.
 */
export const getMyAchievements = async () => {
  return await api.get('/leaderboard/achievements');
};

/**
 * Get current user's level details.
 */
export const getMyLevel = async () => {
  return await api.get('/leaderboard/level');
};

/**
 * Get current user's rewards/points summary.
 */
export const getMyRewards = async () => {
  return await api.get('/rewards/me');
};

/**
 * Get current user's points history.
 * @param {Object} params - page, limit
 */
export const getRewardHistory = async (params = {}) => {
  return await api.get('/rewards/history', { params });
};

export default {
  getLeaderboard,
  getMyRank,
  getTopVolunteers,
  getMyBadges,
  getMyAchievements,
  getMyLevel,
  getMyRewards,
  getRewardHistory,
};
