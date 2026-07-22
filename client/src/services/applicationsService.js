import api from './api';

/**
 * Fetch all applications for the authenticated volunteer.
 * @param {Object} params  - Optional query params: status, search, sortBy, page, limit
 */
export const getApplications = async (params = {}) => {
  const res = await api.get('/applications', { params });
  return res; // { success, data: { applications, pagination, stats } }
};

/**
 * Fetch a single application by ID.
 * @param {string|number} id
 */
export const getApplicationById = async (id) => {
  const res = await api.get(`/applications/${id}`);
  return res; // { success, data: { application } }
};

/**
 * Submit a new application for a given program.
 * @param {string|number} programId
 * @param {Object} formData  - motivation, availability, experience, etc.
 */
export const submitApplication = async (programId, formData) => {
  const res = await api.post('/applications', { programId, ...formData });
  return res; // { success, data: { application } }
};

/**
 * Withdraw / cancel an existing application.
 * @param {string|number} id
 */
export const withdrawApplication = async (id) => {
  const res = await api.patch(`/applications/${id}/withdraw`);
  return res; // { success, data: { application } }
};

/** Admin: Approve a single application */
export const approveApplication = async (id) => {
  const res = await api.patch(`/applications/${id}/approve`);
  return res;
};

/** Admin: Reject a single application with optional reason */
export const rejectApplication = async (id, reason) => {
  const res = await api.patch(`/applications/${id}/reject`, { reason });
  return res;
};

/**
 * Fetch aggregated stats (pending / approved / rejected / waitlisted).
 */
export const getApplicationStats = async () => {
  const res = await api.get('/applications/stats');
  return res; // { success, data: { pending, approved, rejected, waitlisted } }
};

/**
 * Admin: Fetch paginated applications for review.
 * The server automatically returns all applications when the caller is an
 * Admin/Coordinator role — no separate /admin prefix needed.
 * @param {Object} params - status, search, programId, page, limit, sortBy
 */
export const getAdminApplications = async (params = {}) => {
  const res = await api.get('/applications', { params });
  return res;
};

/**
 * Admin: Fetch system-wide application stats.
 * Same endpoint as volunteer stats — server returns aggregate counts for admins.
 */
export const getAdminApplicationStats = async () => {
  const res = await api.get('/applications/stats');
  return res;
};

/**
 * Admin: Bulk approve/reject applications.
 * @param {Array<string>} ids
 * @param {string} status - e.g., 'approved', 'rejected'
 */
export const bulkUpdateApplications = async (ids, status) => {
  const res = await api.patch('/applications/bulk', { ids, status });
  return res;
};

export default {
  getApplications,
  getApplicationById,
  submitApplication,
  withdrawApplication,
  getApplicationStats,
  getAdminApplications,
  getAdminApplicationStats,
  bulkUpdateApplications,
};
