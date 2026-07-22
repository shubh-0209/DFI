import api from './api';

export const getMyProfile = async () => {
  const res = await api.get('/users/me');
  return res?.data?.user || null;
};

export const getVolunteerStatistics = async () => {
  const res = await api.get('/users/statistics');
  return res?.data || null;
};

export const getMyRank = async () => {
  const res = await api.get('/leaderboard/me');
  return res?.data?.rank || null;
};

export const getMyBadges = async () => {
  const res = await api.get('/leaderboard/badges');
  return res?.data?.badges || [];
};

export const getMyAchievements = async () => {
  const res = await api.get('/leaderboard/achievements');
  return res?.data?.achievements || [];
};

export const getMyLevel = async () => {
  const res = await api.get('/leaderboard/level');
  return res?.data || null;
};

export const getMyRewards = async () => {
  const res = await api.get('/rewards/me');
  return res?.data || null;
};

export const getRewardHistory = async (params = {}) => {
  const res = await api.get('/rewards/history', { params });
  return res?.data || null;
};

export const getMyCertificates = async (params = {}) => {
  const res = await api.get('/certificates/me', { params });
  return res?.data?.certificates || [];
};

export const getMyContributions = async (params = {}) => {
  const res = await api.get('/contributions/my', { params });
  return res?.data?.contributions || [];
};

export const getLeaderboardTop = async (params = { limit: 10 }) => {
  const res = await api.get('/leaderboard', { params });
  return res?.data?.leaderboardAnalytics?.topVolunteers || [];
};

export const getVolunteerAnalytics = async (dateRange = null) => {
  const params = dateRange ? { dateRange } : {};
  const res = await api.get('/analytics/volunteers', { params });
  return res?.data || null;
};

export const getRecentActivity = async () => {
  const res = await api.get('/collaboration/workspaces/recent-activity');
  return res?.data?.activities || [];
};

export default {
  getMyProfile,
  getVolunteerStatistics,
  getMyRank,
  getMyBadges,
  getMyAchievements,
  getMyLevel,
  getMyRewards,
  getRewardHistory,
  getMyCertificates,
  getMyContributions,
  getLeaderboardTop,
  getVolunteerAnalytics,
  getRecentActivity,
};
