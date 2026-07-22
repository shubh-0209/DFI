import api from './api';

export const saveRecommendation = async (data) => {
  return api.post('/matching/save', data);
};

export const unsaveRecommendation = async (recommendationId) => {
  return api.delete(`/matching/save/${recommendationId}`);
};

export const dismissRecommendation = async (payload) => {
  return api.post('/matching/dismiss', payload);
};

export const getSavedRecommendations = async (params = {}) => {
  return api.get('/matching/saved', { params });
};

export const getRecommendationHistory = async (params = {}) => {
  return api.get('/matching/history', { params });
};

export const refreshRecommendations = async (params = {}) => {
  return api.get('/matching/refresh', { params });
};

export const submitRecommendationFeedback = async (payload) => {
  return api.post('/matching/feedback', payload);
};

export default {
  saveRecommendation,
  unsaveRecommendation,
  dismissRecommendation,
  getSavedRecommendations,
  getRecommendationHistory,
  refreshRecommendations,
  submitRecommendationFeedback,
};
