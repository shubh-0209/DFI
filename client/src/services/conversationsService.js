import api from './api';

const unwrap = (res) => {
  if (!res) return undefined;
  if (res.data && typeof res.data === 'object' && 'success' in res.data) {
    return res.data;
  }
  return res;
};

export const createConversation = async (data) => {
  const res = await api.post('/conversations', data);
  const payload = unwrap(res);
  return {
    conversation: payload?.data?.conversation || payload?.conversation,
    successMessage: payload?.message || 'Conversation created',
  };
};

export const getConversations = async (params = {}) => {
  const res = await api.get('/conversations', { params });
  const payload = unwrap(res);
  return {
    conversations: payload?.data?.conversations || payload?.conversations || [],
    pagination: payload?.data?.pagination || payload?.pagination || {},
    successMessage: payload?.message || 'Conversations retrieved',
  };
};

export const getConversation = async (conversationId) => {
  const res = await api.get(`/conversations/${conversationId}`);
  const payload = unwrap(res);
  return {
    conversation: payload?.data?.conversation || payload?.conversation,
    successMessage: payload?.message || 'Conversation retrieved',
  };
};

export const updateConversation = async (conversationId, data) => {
  const res = await api.patch(`/conversations/${conversationId}`, data);
  const payload = unwrap(res);
  return {
    conversation: payload?.data?.conversation || payload?.conversation,
    successMessage: payload?.message || 'Conversation updated',
  };
};

export const archiveConversation = async (conversationId) => {
  const res = await api.patch(`/conversations/${conversationId}/archive`);
  const payload = unwrap(res);
  return {
    conversation: payload?.data?.conversation || payload?.conversation,
    successMessage: payload?.message || 'Conversation archived',
  };
};

export const deleteConversation = async (conversationId) => {
  const res = await api.delete(`/conversations/${conversationId}`);
  const payload = unwrap(res);
  return {
    successMessage: payload?.message || 'Conversation deleted',
  };
};
