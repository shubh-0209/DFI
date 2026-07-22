import api from './api';
import axios from 'axios';

const createDraft = async (data) => {
  const payload = {
    title: data.title || '',
    description: data.description || '',
    category: data.category || 'other',
    contributionType: data.contributionType || 'other',
    skillsUsed: data.skillsUsed || [],
    hoursWorked: data.hoursWorked || 0,
    tags: data.tags || [],
    visibility: data.visibility || 'private',
    metadata: data.metadata || {},
  };

  const res = await api.post('/contributions', payload);
  return res;
};

const saveDraft = async (contributionId, data) => {
  const payload = {
    title: data.title || '',
    description: data.description || '',
    category: data.category,
    contributionType: data.contributionType || 'other',
    skillsUsed: data.skillsUsed || [],
    hoursWorked: data.hoursWorked || 0,
    tags: data.tags || [],
    visibility: data.visibility || 'private',
    // Note: files are uploaded separately via uploadFiles(); don't send file objects in JSON
    githubUrl: data.githubUrl || null,
    figmaUrl: data.figmaUrl || null,
    canvaUrl: data.canvaUrl || null,
    googleDriveUrl: data.googleDriveUrl || null,
    notes: data.notes || '',
  };

  const res = await api.put(`/contributions/${contributionId}`, payload);
  return res;
};

/**
 * Upload actual File objects to backend (multipart/form-data → Cloudinary).
 * Returns { success, data: { files: [{originalName, publicUrl, ...}] } }
 */
const uploadFiles = async (contributionId, files = []) => {
  const rawFiles = files
    .filter((f) => f.file instanceof File)
    .map((f) => f.file);

  if (rawFiles.length === 0) return { success: true, data: { files: [] } };

  const formData = new FormData();
  rawFiles.forEach((file) => formData.append('files', file));

  // Use axios directly with multipart headers; api instance defaults to JSON
  const BASE_URL =
    import.meta.env.VITE_API_URL ||
    '/api/v1';

  const token = api.defaults.headers.common['Authorization'];
  const res = await axios.post(
    `${BASE_URL}/contributions/${contributionId}/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: token } : {}),
      },
    }
  );
  return res.data;
};

const submitContribution = async (contributionId) => {
  const res = await api.post(`/contributions/${contributionId}/submit`);
  return res;
};

const getDraft = async (contributionId) => {
  const res = await api.get(`/contributions/${contributionId}`);
  return res;
};

const getMyDrafts = async () => {
  const res = await api.get('/contributions/my', { params: { status: 'draft' } });
  return res;
};

export {
  createDraft,
  saveDraft,
  uploadFiles,
  submitContribution,
  getDraft,
  getMyDrafts,
};

export default {
  createDraft,
  saveDraft,
  uploadFiles,
  submitContribution,
  getDraft,
  getMyDrafts,
};
