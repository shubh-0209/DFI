import api from '../services/api';

/**
 * Admin service utilities.
 * Currently provides a soft‑delete operation for users.
 */
export const softDeleteUser = async (userId) => {
  try {
    const res = await api.patch(`/admin/users/${userId}`, { isDeleted: true });
    return res;
  } catch (err) {
    throw err;
  }
};
export const getDashboardStatistics = async () => {
  const res = await api.get('/admin/users/statistics');
  return res;
};
export const getUsers = async (params = {}) => {
  const res = await api.get('/admin/users', { params });
  return res;
};
