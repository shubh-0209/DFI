import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from './api';
import { CATEGORIES, MOCK_CONTRIBUTIONS } from './contributionService';

const fetchMyContributions = async (params = {}) => {
  const res = await api.get('/contributions/my', { params });
  if (res?.success && Array.isArray(res.data?.contributions)) {
    return {
      contributions: res.data.contributions,
      pagination: res.data.pagination || {},
    };
  }
  throw new Error(res?.message || 'Failed to fetch contributions');
};

const fetchContributionDetail = async (id) => {
  const res = await api.get(`/contributions/${id}`);
  if (res?.success && res.data?.contribution) {
    return res.data.contribution;
  }
  throw new Error(res?.message || 'Failed to fetch contribution detail');
};

const fetchVersionHistory = async (id) => {
  const res = await api.get(`/contributions/${id}/versions`);
  if (res?.success && Array.isArray(res.data?.versions)) {
    return res.data.versions;
  }
  throw new Error(res?.message || 'Failed to fetch versions');
};

const fetchContributionReviews = async (id) => {
  const res = await api.get(`/contributions/${id}/reviews`);
  if (res?.success && Array.isArray(res.data?.reviews)) {
    return res.data.reviews;
  }
  throw new Error(res?.message || 'Failed to fetch reviews');
};

const deleteDraft = async (id) => {
  const res = await api.delete(`/contributions/${id}`);
  if (res?.success) {
    return res.data;
  }
  throw new Error(res?.message || 'Failed to delete draft');
};

export const useMyContributions = (filters = {}) => {
  const params = {
    status: filters.status || '',
    page: filters.page || 1,
    limit: filters.limit || 10,
    sortBy: filters.sortBy || 'createdAt',
    sortOrder: filters.sortOrder || 'desc',
    search: filters.search || '',
    category: filters.category || '',
  };

  return useQuery({
    queryKey: ['myContributions', params],
    queryFn: () => fetchMyContributions(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

export const useContributionDetail = (id) => {
  return useQuery({
    queryKey: ['contributionDetail', id],
    queryFn: () => fetchContributionDetail(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useVersionHistory = (id) => {
  return useQuery({
    queryKey: ['versionHistory', id],
    queryFn: () => fetchVersionHistory(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useContributionReviews = (id) => {
  return useQuery({
    queryKey: ['contributionReviews', id],
    queryFn: () => fetchContributionReviews(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDeleteDraft = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDraft,
    onSuccess: () => {
      queryClient.invalidateQueries(['myContributions']);
    },
  });
};

export const getCategoryName = (catId) => {
  const map = {
    graphic_design: 'Graphic Design',
    content_writing: 'Content Writing',
    digital_marketing: 'Digital Marketing',
    photography: 'Photography',
    videography: 'Videography',
    teaching: 'Teaching',
    web_development: 'Web Development',
    ui_ux: 'UI/UX Design',
    event_management: 'Event Management',
    social_media: 'Social Media',
    research: 'Research',
    other: 'Other',
  };
  return map[catId] || catId;
};

export const getStatusColor = (status) => {
  const map = {
    draft: { bg: 'rgba(107, 114, 128, 0.10)', text: 'var(--color-gray)', border: 'rgba(107, 114, 128, 0.20)' },
    pending: { bg: 'rgba(245, 158, 11, 0.10)', text: 'var(--color-accent)', border: 'rgba(245, 158, 11, 0.20)' },
    approved: { bg: 'rgba(5, 150, 105, 0.10)', text: 'var(--color-success)', border: 'rgba(5, 150, 105, 0.20)' },
    needs_changes: { bg: 'rgba(217, 119, 17, 0.10)', text: 'var(--color-orange)', border: 'rgba(217, 119, 17, 0.20)' },
    rejected: { bg: 'rgba(239, 68, 68, 0.10)', text: 'var(--color-error)', border: 'rgba(239, 68, 68, 0.20)' },
    archived: { bg: 'rgba(148, 163, 184, 0.10)', text: 'var(--color-slate)', border: 'rgba(148, 163, 184, 0.20)' },
    under_review: { bg: 'rgba(59, 130, 246, 0.10)', text: 'var(--color-primary)', border: 'rgba(59, 130, 246, 0.20)' },
  };
  return map[status] || map.draft;
};

export { CATEGORIES, MOCK_CONTRIBUTIONS };
