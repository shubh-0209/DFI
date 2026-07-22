import api from '../services/api';

export const getAdminContributions = async (params = {}) => {
  const res = await api.get('/admin/contributions', { params });
  if (res?.success && Array.isArray(res.data?.contributions)) {
    return {
      contributions: res.data.contributions,
      pagination: res.data.pagination || {},
    };
  }
  throw new Error(res?.message || 'Failed to fetch admin contributions');
};

export const getAdminContributionDetail = async (id) => {
  const res = await api.get(`/admin/contributions/${id}`);
  if (res?.success && res.data?.contribution) {
    return {
      contribution: res.data.contribution,
      reviews: res.data.reviews || [],
    };
  }
  throw new Error(res?.message || 'Failed to fetch contribution detail');
};

export const reviewContribution = async (id, payload) => {
  const res = await api.post(`/admin/contributions/${id}/review`, payload);
  if (res?.success) {
    return res.data;
  }
  throw new Error(res?.message || 'Failed to review contribution');
};

export const featureContribution = async (id) => {
  const res = await api.post(`/admin/contributions/${id}/feature`);
  if (res?.success) {
    return res.data;
  }
  throw new Error(res?.message || 'Failed to feature contribution');
};

export const archiveContribution = async (id) => {
  const res = await api.post(`/admin/contributions/${id}/archive`);
  if (res?.success) {
    return res.data;
  }
  throw new Error(res?.message || 'Failed to archive contribution');
};

export const getAdminReviewHistory = async (params = {}) => {
  const res = await api.get('/admin/contributions/review-history', { params });
  if (res?.success && Array.isArray(res.data?.reviews)) {
    return {
      reviews: res.data.reviews,
      pagination: res.data.pagination || {},
    };
  }
  throw new Error(res?.message || 'Failed to fetch review history');
};
