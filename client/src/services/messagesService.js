import api from './api';

/**
 * Normalize API response.
 * Axios interceptor returns response.data which is { success, message, data }.
 * These helpers extract the nested `data` payload consistently.
 */

const unwrap = (res) => {
  if (!res) return undefined;
  if (res.data && typeof res.data === 'object' && 'success' in res.data) {
    return res.data;
  }
  return res;
};

export const sendMessage = async (conversationId, data) => {
  const res = await api.post(`/conversations/${conversationId}/messages`, data);
  const payload = unwrap(res);
  return {
    message: payload?.data?.message || payload?.message,
    successMessage: payload?.message || 'Message sent',
  };
};

export const getMessages = async (conversationId, params = {}) => {
  const res = await api.get(`/conversations/${conversationId}/messages`, { params });
  const payload = unwrap(res);
  return {
    messages: payload?.data?.messages || payload?.messages || [],
    pagination: payload?.data?.pagination || payload?.pagination || {},
    successMessage: payload?.message || 'Messages retrieved',
  };
};

export const getMessage = async (conversationId, messageId) => {
  const res = await api.get(`/conversations/${conversationId}/messages/${messageId}`);
  const payload = unwrap(res);
  return {
    message: payload?.data?.message || payload?.message,
    successMessage: payload?.message || 'Message retrieved',
  };
};

export const updateMessage = async (conversationId, messageId, content) => {
  const res = await api.patch(`/conversations/${conversationId}/messages/${messageId}`, { content });
  const payload = unwrap(res);
  return {
    message: payload?.data?.message || payload?.message,
    successMessage: payload?.message || 'Message updated',
  };
};

export const deleteMessage = async (conversationId, messageId) => {
  const res = await api.delete(`/conversations/${conversationId}/messages/${messageId}`);
  const payload = unwrap(res);
  return {
    successMessage: payload?.message || 'Message deleted',
  };
};

export const pinMessage = async (conversationId, messageId) => {
  const res = await api.post(`/conversations/${conversationId}/messages/${messageId}/pin`);
  const payload = unwrap(res);
  return {
    message: payload?.data?.message || payload?.message,
    successMessage: payload?.message || 'Message pinned',
  };
};

export const unpinMessage = async (conversationId, messageId) => {
  const res = await api.delete(`/conversations/${conversationId}/messages/${messageId}/pin`);
  const payload = unwrap(res);
  return {
    message: payload?.data?.message || payload?.message,
    successMessage: payload?.message || 'Message unpinned',
  };
};

export const markMessageAsRead = async (conversationId, messageId) => {
  const res = await api.post(`/conversations/${conversationId}/messages/${messageId}/read`);
  const payload = unwrap(res);
  return {
    successMessage: payload?.message || 'Message marked as read',
  };
};

export const getPinnedMessages = async (conversationId) => {
  const res = await api.get(`/conversations/${conversationId}/pinned`);
  const payload = unwrap(res);
  return {
    messages: payload?.data?.messages || payload?.messages || [],
    successMessage: payload?.message || 'Pinned messages retrieved',
  };
};

export const searchMessages = async (conversationId, search, params = {}) => {
  const res = await api.get(`/conversations/${conversationId}/messages/search`, { params: { search, ...params } });
  const payload = unwrap(res);
  return {
    messages: payload?.data?.messages || payload?.messages || [],
    total: payload?.data?.total || payload?.total || 0,
    successMessage: payload?.message || 'Messages retrieved',
  };
};
