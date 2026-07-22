import api from './api';

export const getMonthName = (month) => {
  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month] || '';
};

export const getVolunteerDashboard = async () => {
  return api.get('/analytics/dashboard/volunteer');
};

export const getVolunteerRank = async () => {
  return api.get('/analytics/dashboard/volunteer/rank');
};

export const getAdminDashboard = async () => {
  return api.get('/analytics/dashboard/admin');
};

export const getSuperAdminDashboard = async () => {
  return api.get('/analytics/dashboard/super-admin');
};

export const getLeaderboard = async (params = { limit: 10 }) => {
  return api.get('/leaderboard', { params });
};

export const getMyRank = async () => {
  return api.get('/leaderboard/me');
};

export const getVolunteerAnalytics = async (dateRange = null) => {
  const params = dateRange ? { dateRange } : {};
  return api.get('/analytics/volunteers', { params });
};

export const getProgramAnalytics = async (dateRange = null) => {
  const params = dateRange ? { dateRange } : {};
  return api.get('/analytics/programs', { params });
};

export const getApplicationAnalytics = async (dateRange = null) => {
  const params = dateRange ? { dateRange } : {};
  return api.get('/analytics/applications', { params });
};

export const getAttendanceAnalytics = async (dateRange = null) => {
  const params = dateRange ? { dateRange } : {};
  return api.get('/analytics/attendance', { params });
};

export const getCertificateAnalytics = async (dateRange = null) => {
  const params = dateRange ? { dateRange } : {};
  return api.get('/analytics/certificates', { params });
};

export const getRewardAnalytics = async (dateRange = null) => {
  const params = dateRange ? { dateRange } : {};
  return api.get('/analytics/rewards', { params });
};

export const getLeaderboardAnalytics = async (limit = 10) => {
  return api.get('/analytics/leaderboard', { params: { limit } });
};

export const getOrganizationAnalytics = async (dateRange = null) => {
  const params = dateRange ? { dateRange } : {};
  return api.get('/analytics/organizations', { params });
};

export const exportAnalytics = async (type, dateRange = null) => {
  const params = dateRange ? { dateRange } : {};
  return api.get(`/analytics/export/${type}`, { params, responseType: 'blob' });
};

export const getDashboardStatistics = getAdminDashboard;
