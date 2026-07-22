import api from './api';

const BASE = '/contributions/config';

export const getCategories = async (params = {}) => {
  const res = await api.get(`${BASE}/categories`, { params });
  if (res?.success && Array.isArray(res.data?.categories)) {
    return { categories: res.data.categories, pagination: res.data.pagination || {} };
  }
  return { categories: [], pagination: {} };
};

export const createCategory = async (data) => {
  const res = await api.post(`${BASE}/categories`, data);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to create category');
};

export const updateCategory = async (id, data) => {
  const res = await api.patch(`${BASE}/categories/${id}`, data);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to update category');
};

export const deleteCategory = async (id) => {
  const res = await api.delete(`${BASE}/categories/${id}`);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to delete category');
};

export const restoreCategory = async (id) => {
  const res = await api.post(`${BASE}/categories/${id}/restore`);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to restore category');
};

export const toggleCategory = async (id, isActive) => {
  const res = await api.patch(`${BASE}/categories/${id}/toggle`, { isActive });
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to toggle category');
};

export const getTypes = async (params = {}) => {
  const res = await api.get(`${BASE}/types`, { params });
  if (res?.success && Array.isArray(res.data?.types)) {
    return { types: res.data.types, pagination: res.data.pagination || {} };
  }
  return { types: [], pagination: {} };
};

export const createType = async (data) => {
  const res = await api.post(`${BASE}/types`, data);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to create type');
};

export const updateType = async (id, data) => {
  const res = await api.patch(`${BASE}/types/${id}`, data);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to update type');
};

export const deleteType = async (id) => {
  const res = await api.delete(`${BASE}/types/${id}`);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to delete type');
};

export const restoreType = async (id) => {
  const res = await api.post(`${BASE}/types/${id}/restore`);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to restore type');
};

export const toggleType = async (id, isActive) => {
  const res = await api.patch(`${BASE}/types/${id}/toggle`, { isActive });
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to toggle type');
};

export const getCoinRules = async (params = {}) => {
  const res = await api.get(`${BASE}/coin-rules`, { params });
  if (res?.success && Array.isArray(res.data?.rules)) {
    return { rules: res.data.rules, pagination: res.data.pagination || {} };
  }
  return { rules: [], pagination: {} };
};

export const createCoinRule = async (data) => {
  const res = await api.post(`${BASE}/coin-rules`, data);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to create coin rule');
};

export const updateCoinRule = async (id, data) => {
  const res = await api.patch(`${BASE}/coin-rules/${id}`, data);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to update coin rule');
};

export const deleteCoinRule = async (id) => {
  const res = await api.delete(`${BASE}/coin-rules/${id}`);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to delete coin rule');
};

export const restoreCoinRule = async (id) => {
  const res = await api.post(`${BASE}/coin-rules/${id}/restore`);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to restore coin rule');
};

export const toggleCoinRule = async (id, isActive) => {
  const res = await api.patch(`${BASE}/coin-rules/${id}/toggle`, { isActive });
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to toggle coin rule');
};

export const getBadgeRules = async (params = {}) => {
  const res = await api.get(`${BASE}/badge-rules`, { params });
  if (res?.success && Array.isArray(res.data?.rules)) {
    return { rules: res.data.rules, pagination: res.data.pagination || {} };
  }
  return { rules: [], pagination: {} };
};

export const createBadgeRule = async (data) => {
  const res = await api.post(`${BASE}/badge-rules`, data);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to create badge rule');
};

export const updateBadgeRule = async (id, data) => {
  const res = await api.patch(`${BASE}/badge-rules/${id}`, data);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to update badge rule');
};

export const deleteBadgeRule = async (id) => {
  const res = await api.delete(`${BASE}/badge-rules/${id}`);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to delete badge rule');
};

export const restoreBadgeRule = async (id) => {
  const res = await api.post(`${BASE}/badge-rules/${id}/restore`);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to restore badge rule');
};

export const toggleBadgeRule = async (id, isActive) => {
  const res = await api.patch(`${BASE}/badge-rules/${id}/toggle`, { isActive });
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to toggle badge rule');
};

export const getReviewTemplates = async (params = {}) => {
  const res = await api.get(`${BASE}/review-templates`, { params });
  if (res?.success && Array.isArray(res.data?.templates)) {
    return { templates: res.data.templates, pagination: res.data.pagination || {} };
  }
  return { templates: [], pagination: {} };
};

export const createReviewTemplate = async (data) => {
  const res = await api.post(`${BASE}/review-templates`, data);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to create review template');
};

export const updateReviewTemplate = async (id, data) => {
  const res = await api.patch(`${BASE}/review-templates/${id}`, data);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to update review template');
};

export const deleteReviewTemplate = async (id) => {
  const res = await api.delete(`${BASE}/review-templates/${id}`);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to delete review template');
};

export const restoreReviewTemplate = async (id) => {
  const res = await api.post(`${BASE}/review-templates/${id}/restore`);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to restore review template');
};

export const toggleReviewTemplate = async (id, isActive) => {
  const res = await api.patch(`${BASE}/review-templates/${id}/toggle`, { isActive });
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to toggle review template');
};

export const getFileTypeConfigs = async (params = {}) => {
  const res = await api.get(`${BASE}/file-types`, { params });
  if (res?.success && Array.isArray(res.data?.configs)) {
    return { configs: res.data.configs, pagination: res.data.pagination || {} };
  }
  return { configs: [], pagination: {} };
};

export const createFileTypeConfig = async (data) => {
  const res = await api.post(`${BASE}/file-types`, data);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to create file type config');
};

export const updateFileTypeConfig = async (id, data) => {
  const res = await api.patch(`${BASE}/file-types/${id}`, data);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to update file type config');
};

export const deleteFileTypeConfig = async (id) => {
  const res = await api.delete(`${BASE}/file-types/${id}`);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to delete file type config');
};

export const restoreFileTypeConfig = async (id) => {
  const res = await api.post(`${BASE}/file-types/${id}/restore`);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to restore file type config');
};

export const toggleFileTypeConfig = async (id, isActive) => {
  const res = await api.patch(`${BASE}/file-types/${id}/toggle`, { isActive });
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to toggle file type config');
};

export const getPortfolioConfigs = async (params = {}) => {
  const res = await api.get(`${BASE}/portfolio-configs`, { params });
  if (res?.success && Array.isArray(res.data?.configs)) {
    return { configs: res.data.configs, pagination: res.data.pagination || {} };
  }
  return { configs: [], pagination: {} };
};

export const createPortfolioConfig = async (data) => {
  const res = await api.post(`${BASE}/portfolio-configs`, data);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to create portfolio config');
};

export const updatePortfolioConfig = async (id, data) => {
  const res = await api.patch(`${BASE}/portfolio-configs/${id}`, data);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to update portfolio config');
};

export const deletePortfolioConfig = async (id) => {
  const res = await api.delete(`${BASE}/portfolio-configs/${id}`);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to delete portfolio config');
};

export const restorePortfolioConfig = async (id) => {
  const res = await api.post(`${BASE}/portfolio-configs/${id}/restore`);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to restore portfolio config');
};

export const togglePortfolioConfig = async (id, isActive) => {
  const res = await api.patch(`${BASE}/portfolio-configs/${id}/toggle`, { isActive });
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to toggle portfolio config');
};

export const getFeaturedConfigs = async (params = {}) => {
  const res = await api.get(`${BASE}/featured-configs`, { params });
  if (res?.success && Array.isArray(res.data?.configs)) {
    return { configs: res.data.configs, pagination: res.data.pagination || {} };
  }
  return { configs: [], pagination: {} };
};

export const createFeaturedConfig = async (data) => {
  const res = await api.post(`${BASE}/featured-configs`, data);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to create featured config');
};

export const updateFeaturedConfig = async (id, data) => {
  const res = await api.patch(`${BASE}/featured-configs/${id}`, data);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to update featured config');
};

export const deleteFeaturedConfig = async (id) => {
  const res = await api.delete(`${BASE}/featured-configs/${id}`);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to delete featured config');
};

export const restoreFeaturedConfig = async (id) => {
  const res = await api.post(`${BASE}/featured-configs/${id}/restore`);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to restore featured config');
};

export const toggleFeaturedConfig = async (id, isActive) => {
  const res = await api.patch(`${BASE}/featured-configs/${id}/toggle`, { isActive });
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to toggle featured config');
};

export const getReviewConfigs = async (params = {}) => {
  const res = await api.get(`${BASE}/review-configs`, { params });
  if (res?.success && Array.isArray(res.data?.configs)) {
    return { configs: res.data.configs, pagination: res.data.pagination || {} };
  }
  return { configs: [], pagination: {} };
};

export const createReviewConfig = async (data) => {
  const res = await api.post(`${BASE}/review-configs`, data);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to create review config');
};

export const updateReviewConfig = async (id, data) => {
  const res = await api.patch(`${BASE}/review-configs/${id}`, data);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to update review config');
};

export const deleteReviewConfig = async (id) => {
  const res = await api.delete(`${BASE}/review-configs/${id}`);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to delete review config');
};

export const restoreReviewConfig = async (id) => {
  const res = await api.post(`${BASE}/review-configs/${id}/restore`);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to restore review config');
};

export const toggleReviewConfig = async (id, isActive) => {
  const res = await api.patch(`${BASE}/review-configs/${id}/toggle`, { isActive });
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to toggle review config');
};

export const getAutomationConfigs = async (params = {}) => {
  const res = await api.get(`${BASE}/automation-configs`, { params });
  if (res?.success && Array.isArray(res.data?.configs)) {
    return { configs: res.data.configs, pagination: res.data.pagination || {} };
  }
  return { configs: [], pagination: {} };
};

export const createAutomationConfig = async (data) => {
  const res = await api.post(`${BASE}/automation-configs`, data);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to create automation config');
};

export const updateAutomationConfig = async (id, data) => {
  const res = await api.patch(`${BASE}/automation-configs/${id}`, data);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to update automation config');
};

export const deleteAutomationConfig = async (id) => {
  const res = await api.delete(`${BASE}/automation-configs/${id}`);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to delete automation config');
};

export const restoreAutomationConfig = async (id) => {
  const res = await api.post(`${BASE}/automation-configs/${id}/restore`);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to restore automation config');
};

export const toggleAutomationConfig = async (id, isActive) => {
  const res = await api.patch(`${BASE}/automation-configs/${id}/toggle`, { isActive });
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to toggle automation config');
};

export const getConfigOverview = async () => {
  const res = await api.get(`${BASE}/overview`);
  if (res?.success) return res.data;
  throw new Error(res?.message || 'Failed to load config overview');
};

