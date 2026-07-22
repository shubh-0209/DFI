import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminContributions,
  getAdminContributionDetail,
  reviewContribution,
  featureContribution,
  archiveContribution,
  getAdminReviewHistory,
} from '../services/adminContributionService';

export const useAdminContributions = (filters = {}) => {
  const params = {
    status: filters.status || '',
    category: filters.category || '',
    contributionType: filters.contributionType || '',
    submittedBy: filters.submittedBy || '',
    search: filters.search || '',
    sortBy: filters.sortBy || 'createdAt',
    sortOrder: filters.sortOrder || 'desc',
    page: filters.page || 1,
    limit: filters.limit || 12,
  };

  return useQuery({
    queryKey: ['adminContributions', params],
    queryFn: () => getAdminContributions(params),
    staleTime: 0, // always refetch after mutation invalidation
  });
};

export const useAdminContributionDetail = (id) => {
  return useQuery({
    queryKey: ['adminContributionDetail', id],
    queryFn: () => getAdminContributionDetail(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useReviewContribution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => reviewContribution(id, payload),
    onSuccess: (_, variables) => {
      // Refetch immediately so the list reflects the new status right away
      queryClient.refetchQueries({ queryKey: ['adminContributions'] });
      queryClient.invalidateQueries({ queryKey: ['adminContributionDetail', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['adminReviewHistory'] });
    },
  });
};

export const useFeatureContribution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: featureContribution,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(['adminContributions']);
      queryClient.invalidateQueries(['adminContributionDetail', id]);
    },
  });
};

export const useArchiveContribution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: archiveContribution,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(['adminContributions']);
      queryClient.invalidateQueries(['adminContributionDetail', id]);
    },
  });
};

export const useAdminReviewHistory = (filters = {}) => {
  const params = {
    page: filters.page || 1,
    limit: filters.limit || 10,
    reviewedBy: filters.reviewedBy || '',
    contributionId: filters.contributionId || '',
  };

  return useQuery({
    queryKey: ['adminReviewHistory', params],
    queryFn: () => getAdminReviewHistory(params),
    staleTime: 5 * 60 * 1000,
  });
};
