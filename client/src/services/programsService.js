import api from './api';

// api.js interceptor already unwraps response.data, so `res` IS the server response body:
// { success: true, message: '...', data: { program } }
// This helper normalises both that shape and the raw axios shape (in case interceptor is bypassed).
const unwrap = (res) => {
  if (!res) return undefined;
  // Server response already unwrapped by interceptor: { success, message, data }
  if ('success' in res) return res;
  // Raw axios response (interceptor bypassed)
  if (res.data && 'success' in res.data) return res.data;
  return res;
};

export const getPrograms = async (params = {}) => {
  const res = await api.get('/programs', { params });
  const payload = unwrap(res);
  return {
    programs:   payload?.data?.programs   || [],
    pagination: payload?.data?.pagination || {},
  };
};

export const getAllPrograms = async (params = {}) => {
  const res = await api.get('/programs', { params });
  const payload = unwrap(res);
  return {
    programs:   payload?.data?.programs   || [],
    pagination: payload?.data?.pagination || {},
  };
};

export const createProgram = async (data) => {
  const res = await api.post('/programs', data);
  const payload = unwrap(res);
  return {
    program: payload?.data?.program || null,
    successMessage: payload?.message || 'Program created',
  };
};

export const updateProgram = async (id, data) => {
  const res = await api.put(`/programs/${id}`, data);
  const payload = unwrap(res);
  return {
    program: payload?.data?.program || null,
    successMessage: payload?.message || 'Program updated',
  };
};

export const deleteProgram = async (id) => {
  const res = await api.delete(`/programs/${id}`);
  const payload = unwrap(res);
  return { successMessage: payload?.message || 'Program deleted' };
};

export const archiveProgram = async (id) => {
  const res = await api.patch(`/programs/${id}/archive`);
  const payload = unwrap(res);
  return { successMessage: payload?.message || 'Program archived' };
};

export const restoreProgram = async (id) => {
  const res = await api.patch(`/programs/${id}/restore`);
  const payload = unwrap(res);
  return { successMessage: payload?.message || 'Program restored' };
};

export const getJoinedPrograms = async () => {
  const res = await api.get('/programs/me');
  const payload = unwrap(res);
  return {
    programs:   payload?.data?.programs   || [],
    pagination: payload?.data?.pagination || {},
  };
};

export const getProgramById = async (id) => {
  const res = await api.get(`/programs/${id}`);
  const payload = unwrap(res);
  return {
    program: payload?.data?.program || null,
    successMessage: payload?.message || 'Program retrieved',
  };
};

export const getJoinedProgramById = async (id) => {
  const res = await api.get(`/programs/me/${id}`);
  const payload = unwrap(res);
  return {
    success: payload?.success ?? true,
    data: { program: payload?.data?.program || null },
  };
};

export const getMyPrograms = async () => {
  const res = await api.get('/programs/me');
  const payload = unwrap(res);
  return {
    programs:   payload?.data?.programs   || [],
    pagination: payload?.data?.pagination || {},
  };
};

export const publishProgram = async (id) => {
  const res = await api.patch(`/programs/${id}/publish`);
  const payload = unwrap(res);
  return {
    program: payload?.data?.program || null,
    successMessage: payload?.message || 'Program published',
  };
};

export const changeProgramStatus = async (id, status) => {
  const res = await api.patch(`/programs/${id}/status`, { status });
  const payload = unwrap(res);
  return {
    program: payload?.data?.program || null,
    successMessage: payload?.message || 'Program updated',
  };
};

export const generateQrToken = async (id, type) => {
  const res = await api.post(`/programs/${id}/qr-token`, { type });
  const payload = unwrap(res);
  return payload;
};

export const getVolunteerHours = async () => {
  try {
    const res = await api.get('/attendance/dashboard');
    const summary = res?.data?.summary || res?.summary || {};
    const totalHours = summary.totalHours || 0;
    return {
      success: true,
      data: {
        today: 0,
        thisWeek: Math.round(totalHours * 100) / 100,
        thisMonth: Math.round(totalHours * 100) / 100,
        lifetime: Math.round(totalHours * 100) / 100,
        weeklyData: [
          { day: 'Mon', hours: 0 },
          { day: 'Tue', hours: 0 },
          { day: 'Wed', hours: 0 },
          { day: 'Thu', hours: 0 },
          { day: 'Fri', hours: 0 },
          { day: 'Sat', hours: 0 },
          { day: 'Sun', hours: totalHours },
        ],
        monthlyData: [
          { month: 'Jan', hours: 0 },
          { month: 'Feb', hours: 0 },
          { month: 'Mar', hours: 0 },
          { month: 'Apr', hours: 0 },
          { month: 'May', hours: 0 },
          { month: 'Jun', hours: totalHours },
        ],
        programBreakdown: [],
      },
    };
  } catch (_err) {
    return {
      success: true,
      data: {
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        lifetime: 0,
        weeklyData: [],
        monthlyData: [],
        programBreakdown: [],
      },
    };
  }
};

export default {
  getPrograms,
  getAllPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  getJoinedPrograms,
  getJoinedProgramById,
  getProgramById,
  getMyPrograms,
  publishProgram,
  changeProgramStatus,
  generateQrToken,
  archiveProgram,
  restoreProgram,
  getVolunteerHours,
};
