import api from './api';

export const getWorkspaces = async (params = {}) => {
  return api.get('/collaboration/workspaces', { params });
};

export const getWorkspaceById = async (id) => {
  return api.get(`/collaboration/workspaces/${id}`);
};

export const createWorkspace = async (data) => {
  return api.post('/collaboration/workspaces', data);
};

export const updateWorkspace = async (id, data) => {
  return api.patch(`/collaboration/workspaces/${id}`, data);
};

export const deleteWorkspace = async (id) => {
  return api.delete(`/collaboration/workspaces/${id}`);
};

export const joinWorkspace = async (id) => {
  return api.post(`/collaboration/workspaces/${id}/join`);
};

export const leaveWorkspace = async (id) => {
  return api.post(`/collaboration/workspaces/${id}/leave`);
};

export const getWorkspaceMembers = async (id) => {
  return api.get(`/collaboration/workspaces/${id}/members`);
};

export const addNote = async (id, data) => {
  return api.post(`/collaboration/workspaces/${id}/notes`, data);
};

export const addFile = async (id, data) => {
  return api.post(`/collaboration/workspaces/${id}/files`, data);
};

export const assignTask = async (id, data) => {
  return api.post(`/collaboration/workspaces/${id}/tasks`, data);
};

export const updateTaskStatus = async (workspaceId, taskIndex, data) => {
  return api.patch(`/collaboration/workspaces/${workspaceId}/tasks/${taskIndex}`, data);
};

export const getWorkspaceActivityLog = async (id) => {
  return api.get(`/collaboration/workspaces/${id}/activity-log`);
};

export const inviteToWorkspace = async (id, data) => {
  return api.post(`/collaboration/workspaces/${id}/invitations`, data);
};

export const acceptInvitation = async (id, token) => {
  return api.post(`/collaboration/workspaces/${id}/invitations/${token}/accept`);
};

export const declineInvitation = async (id, token) => {
  return api.post(`/collaboration/workspaces/${id}/invitations/${token}/decline`);
};

export const requestToJoin = async (id, message = '') => {
  return api.post(`/collaboration/workspaces/${id}/join-requests`, { message });
};

export const getPendingJoinRequests = async (id) => {
  return api.get(`/collaboration/workspaces/${id}/join-requests`);
};

export const reviewJoinRequest = async (id, requestIndex, action) => {
  return api.patch(`/collaboration/workspaces/${id}/join-requests/${requestIndex}`, { action });
};

export const getPendingInvitations = async (id) => {
  return api.get(`/collaboration/workspaces/${id}/invitations`);
};

export const updateMemberRole = async (id, userId, role) => {
  return api.patch(`/collaboration/workspaces/${id}/members/${userId}/role`, { role });
};

export const getActivityTimeline = async (id, params = {}) => {
  return api.get(`/collaboration/workspaces/${id}/timeline`, { params });
};

export const getUserRecentActivity = async () => {
  return api.get('/collaboration/workspaces/recent-activity');
};

export default {
  getWorkspaces,
  getWorkspaceById,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  joinWorkspace,
  leaveWorkspace,
  getWorkspaceMembers,
  addNote,
  addFile,
  assignTask,
  updateTaskStatus,
  getWorkspaceActivityLog,
  inviteToWorkspace,
  acceptInvitation,
  declineInvitation,
  requestToJoin,
  getPendingJoinRequests,
  reviewJoinRequest,
  getPendingInvitations,
  updateMemberRole,
  getActivityTimeline,
  getUserRecentActivity,
};
