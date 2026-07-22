import api from './api';

/**
 * Fetch the attendance dashboard summary for the authenticated volunteer.
 * Returns streak, total sessions, monthly breakdown, etc.
 */
export const getAttendanceDashboard = async () => {
  const res = await api.get('/attendance/dashboard');
  return res; // { success, data: { ... dashboard fields } }
};

/**
 * Fetch paginated attendance history records.
 * @param {Object} params - program, dateRange, status, month, page, limit
 */
export const getAttendanceHistory = async (params = {}) => {
  try {
    const res = await api.get('/attendance/me', { params });
    if (res?.success && res?.data) {
      return {
        ...res,
        data: {
          records: res.data.records || [],
          pagination: res.data.pagination || {
            page: res.data.page || 1,
            limit: res.data.limit || 10,
            total: res.data.total || 0,
          },
        },
      };
    }
    return res;
  } catch (_err) {
    const res = await api.get('/attendance/history', { params });
    return res;
  }
};

/**
 * Check in to a program session.
 * @param {string|number} applicationId
 */
export const checkIn = async (applicationId, coordinates = null, qrToken = null) => {
  const res = await api.post('/attendance/check-in', { applicationId, coordinates, qrToken });
  return res; // { success, data: { attendanceId, checkInTime } }
};

/**
 * Check out from an active session.
 * @param {string|number} attendanceId  - ID returned by checkIn
 * @param {Object} [coordinates]        - GPS coordinates { latitude, longitude }
 * @param {string} [qrToken]            - Scanned dynamic QR token
 */
export const checkOut = async (attendanceId, coordinates = null, qrToken = null) => {
  const res = await api.patch('/attendance/check-out', { attendanceId, coordinates, qrToken });
  return res;
};

/**
 * Admin: Get attendance list for admin dashboard.
 */
export const adminGetAttendance = async () => {
  const res = await api.get('/admin/attendance');
  return res;
};

/**
 * Admin: Bulk update attendance records (mark present/absent in bulk).
 * @param {Array<string>} ids - attendance record IDs
 * @param {string} status - e.g., 'present', 'absent'
 * @param {string} [remarks]
 */
export const bulkUpdateAttendance = async (ids, status, remarks) => {
  const res = await api.post('/admin/attendance/bulk', { ids, status, remarks });
  return res;
};

/**
 * Admin: Edit a single attendance record manually.
 * @param {string} attendanceId - the attendance record _id
 * @param {Object} updateData - { status, checkInTime, checkOutTime, remarks }
 */
export const editAttendance = async (attendanceId, updateData) => {
  const res = await api.patch(`/admin/attendance/${attendanceId}`, updateData);
  return res;
};

export default {
  getAttendanceDashboard,
  getAttendanceHistory,
  checkIn,
  checkOut,
  adminGetAttendance,
  bulkUpdateAttendance,
  editAttendance,
};
