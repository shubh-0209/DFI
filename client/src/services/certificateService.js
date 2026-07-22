import api from './api';

/**
 * Get all certificates for the current user.
 */
export const getMyCertificates = async (params = {}) => {
  return await api.get('/certificates/me', { params });
};

/**
 * Search certificates (admin/volunteer).
 */
export const searchCertificates = async (params = {}) => {
  return await api.get('/certificates', { params });
};

/**
 * Get a single certificate by ID.
 */
export const getCertificate = async (id) => {
  return await api.get(`/certificates/${id}`);
};

/**
 * Get certificate history.
 */
export const getCertificateHistory = async (id) => {
  return await api.get(`/certificates/${id}/history`);
};

/**
 * Download a certificate PDF.
 */
export const downloadCertificate = async (id) => {
  return await api.get(`/certificates/${id}/download`, { responseType: 'blob' });
};

/**
 * Verify a certificate by its unique number (Public route).
 */
export const verifyCertificate = async (certificateNumber) => {
  return await api.get(`/certificates/verify/${certificateNumber}`);
};

/**
 * Admin: Auto-generate certificates for a completed program.
 */
export const autoGenerateCertificates = async (programId) => {
  return await api.post(`/certificates/admin/auto-generate/${programId}`);
};

/**
 * Admin: Bulk generate certificates for a completed program.
 */
export const bulkGenerateCertificates = async (programId) => {
  return await api.post(`/certificates/admin/bulk-generate/${programId}`);
};

/**
 * Admin: Revoke a certificate.
 */
export const revokeCertificate = async (id) => {
  return await api.post(`/certificates/admin/${id}/revoke`);
};

/**
 * Admin: Approve a certificate.
 */
export const approveCertificate = async (id) => {
  return await api.post(`/certificates/admin/${id}/approve`);
};

/**
 * Admin: Reject a certificate.
 */
export const rejectCertificate = async (id) => {
  return await api.post(`/certificates/admin/${id}/reject`);
};

/**
 * Admin: Delete a certificate.
 */
export const deleteCertificate = async (id) => {
  return await api.delete(`/certificates/admin/${id}`);
};

/**
 * Admin: Manually generate a certificate for a volunteer.
 */
export const adminGenerateCertificate = async (payload) => {
  return await api.post('/certificates/admin/generate', payload);
};

export default {
  getMyCertificates,
  searchCertificates,
  getCertificate,
  getCertificateHistory,
  downloadCertificate,
  verifyCertificate,
  autoGenerateCertificates,
  bulkGenerateCertificates,
  revokeCertificate,
  approveCertificate,
  rejectCertificate,
  deleteCertificate,
  adminGenerateCertificate,
};
