const { REPORT_TYPES, EXPORT_FORMATS, REPORT_PERIODS, PAGE_SIZES, ORIENTATIONS } = require('./report.model');

const REPORT_TYPE_LABELS = {
  [REPORT_TYPES.VOLUNTEER]: 'Volunteer Report',
  [REPORT_TYPES.PROGRAM]: 'Program Report',
  [REPORT_TYPES.APPLICATION]: 'Application Report',
  [REPORT_TYPES.ATTENDANCE]: 'Attendance Report',
  [REPORT_TYPES.CERTIFICATE]: 'Certificate Report',
  [REPORT_TYPES.REWARD]: 'Reward Report',
  [REPORT_TYPES.LEADERBOARD]: 'Leaderboard Report',
  [REPORT_TYPES.ORGANIZATION]: 'Organization Report',
  [REPORT_TYPES.PLATFORM]: 'Platform Report',
  [REPORT_TYPES.IMPACT]: 'Impact Report',
};

const MESSAGES = {
  REPORT_GENERATED: 'Report generated successfully',
  REPORT_FETCHED: 'Report fetched successfully',
  REPORT_UPDATED: 'Report updated successfully',
  REPORT_DELETED: 'Report deleted successfully',
  REPORT_EXPORTED: 'Report exported successfully',
  REPORT_PREVIEW_FETCHED: 'Report preview fetched successfully',
  COMPARISON_DATA_FETCHED: 'Comparison data fetched successfully',
  BI_DATA_FETCHED: 'Business intelligence data fetched successfully',
  HISTORY_FETCHED: 'Report history fetched successfully',
};

const GROUP_BY_OPTIONS = [
  { value: 'state', label: 'State' },
  { value: 'city', label: 'City' },
  { value: 'category', label: 'Category' },
  { value: 'status', label: 'Status' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

const SORT_OPTIONS = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

const EXPORT_FORMAT_LABELS = {
  [EXPORT_FORMATS.CSV]: 'CSV',
  [EXPORT_FORMATS.EXCEL]: 'Excel',
  [EXPORT_FORMATS.PDF]: 'PDF',
};

const PAGE_SIZE_LABELS = {
  [PAGE_SIZES.A4]: 'A4',
  [PAGE_SIZES.LETTER]: 'Letter',
};

const ORIENTATION_LABELS = {
  [ORIENTATIONS.PORTRAIT]: 'Portrait',
  [ORIENTATIONS.LANDSCAPE]: 'Landscape',
};

module.exports = {
  REPORT_TYPE_LABELS,
  MESSAGES,
  GROUP_BY_OPTIONS,
  SORT_OPTIONS,
  EXPORT_FORMAT_LABELS,
  PAGE_SIZE_LABELS,
  ORIENTATION_LABELS,
  REPORT_TYPES,
  EXPORT_FORMATS,
  REPORT_PERIODS,
  PAGE_SIZES,
  ORIENTATIONS,
};