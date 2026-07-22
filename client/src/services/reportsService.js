import api from './api';

export const DATE_RANGES = [
  { value: '', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'last_3_months', label: 'Last 3 Months' },
  { value: 'last_6_months', label: 'Last 6 Months' },
  { value: 'last_year', label: 'Last Year' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annual', label: 'Annual' },
];

export const REPORT_TYPES = [
  { value: 'volunteer', label: 'Volunteer Report' },
  { value: 'program', label: 'Program Report' },
  { value: 'application', label: 'Application Report' },
  { value: 'attendance', label: 'Attendance Report' },
  { value: 'certificate', label: 'Certificate Report' },
  { value: 'reward', label: 'Reward Report' },
  { value: 'leaderboard', label: 'Leaderboard Report' },
  { value: 'organization', label: 'Organization Report' },
  { value: 'platform', label: 'Platform Report' },
  { value: 'impact', label: 'Impact Report' },
];

export const EXPORT_FORMATS = [
  { value: 'csv', label: 'CSV' },
  { value: 'excel', label: 'Excel' },
  { value: 'pdf', label: 'PDF' },
];

export const PAGE_SIZES = [
  { value: 'a4', label: 'A4' },
  { value: 'letter', label: 'Letter' },
];

export const ORIENTATIONS = [
  { value: 'portrait', label: 'Portrait' },
  { value: 'landscape', label: 'Landscape' },
];

export const GROUP_BY_OPTIONS = [
  { value: 'none', label: 'No Grouping' },
  { value: 'state', label: 'State' },
  { value: 'city', label: 'City' },
  { value: 'category', label: 'Category' },
  { value: 'status', label: 'Status' },
];

export const generateReport = async (data) => {
  return api.post('/reports/generate', data);
};

export const previewReport = async (params = {}) => {
  return api.get('/reports/preview', { params });
};

export const exportReport = async (reportType, params = {}) => {
  return api.get(`/reports/export/${reportType}`, { params, responseType: 'blob' });
};

export const getReportHistory = async (params = {}) => {
  return api.get('/reports/history', { params });
};

export const getBusinessIntelligence = async (params = {}) => {
  return api.get('/reports/bi', { params });
};

export const getComparisonData = async (compareType, params = {}) => {
  return api.get(`/reports/compare/${compareType}`, { params });
};

export const getVolunteerReport = async (params = {}) => {
  return api.get('/reports/volunteers', { params });
};

export const getProgramReport = async (params = {}) => {
  return api.get('/reports/programs', { params });
};

export const getApplicationReport = async (params = {}) => {
  return api.get('/reports/applications', { params });
};

export const getAttendanceReport = async (params = {}) => {
  return api.get('/reports/attendance', { params });
};

export const getCertificateReport = async (params = {}) => {
  return api.get('/reports/certificates', { params });
};

export const getRewardReport = async (params = {}) => {
  return api.get('/reports/rewards', { params });
};

export const getLeaderboardReport = async (params = {}) => {
  return api.get('/reports/leaderboard', { params });
};

export const getOrganizationReport = async (params = {}) => {
  return api.get('/reports/organizations', { params });
};

export const getPlatformReport = async (params = {}) => {
  return api.get('/reports/platform', { params });
};

export const getImpactReport = async (params = {}) => {
  return api.get('/reports/impact', { params });
};