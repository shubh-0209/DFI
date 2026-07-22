import api from './api';

export const getAnnouncements = async (params = {}) => {
  return api.get('/announcements', { params });
};

export const getAnnouncementById = async (id) => {
  return api.get(`/announcements/${id}`);
};

export const createAnnouncement = async (data) => {
  return api.post('/announcements', data);
};

export const updateAnnouncement = async (id, data) => {
  return api.patch(`/announcements/${id}`, data);
};

export const deleteAnnouncement = async (id) => {
  return api.delete(`/announcements/${id}`);
};

export const publishAnnouncement = async (id) => {
  return api.patch(`/announcements/${id}/publish`);
};

export const archiveAnnouncement = async (id) => {
  return api.patch(`/announcements/${id}/archive`);
};

/** Mark an announcement as read by the current volunteer */
export const markAnnouncementRead = async (id) => {
  return api.patch(`/announcements/${id}/read`);
};

/** Pin an announcement — admin only, only one can be pinned at a time */
export const pinAnnouncement = async (id) => {
  return api.patch(`/announcements/${id}/pin`);
};

/** Unpin a previously pinned announcement — admin only */
export const unpinAnnouncement = async (id) => {
  return api.patch(`/announcements/${id}/unpin`);
};
