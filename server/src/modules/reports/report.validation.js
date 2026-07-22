const ValidationError = require('../../utils/errors/ValidationError');

const VALID_DATE_RANGES = [
  'today',
  'this_week',
  'this_month',
  'last_month',
  'last_3_months',
  'last_6_months',
  'last_year',
  'monthly',
  'quarterly',
  'annual',
  'custom',
];

const VALID_REPORT_TYPES = [
  'volunteer',
  'program',
  'application',
  'attendance',
  'certificate',
  'reward',
  'leaderboard',
  'organization',
  'platform',
  'impact',
];

const VALID_EXPORT_FORMATS = ['csv', 'excel', 'pdf'];
const VALID_PAGE_SIZES = ['a4', 'letter'];
const VALID_ORIENTATIONS = ['portrait', 'landscape'];
const VALID_SORT_ORDERS = ['asc', 'desc'];

const GROUP_BY_FIELDS = ['state', 'city', 'category', 'status', 'month', 'year', 'none'];

const DATE_RANGE_LABELS = {
  today: 'Today',
  this_week: 'This Week',
  this_month: 'This Month',
  last_month: 'Last Month',
  last_3_months: 'Last 3 Months',
  last_6_months: 'Last 6 Months',
  last_year: 'Last Year',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annual: 'Annual',
  custom: 'Custom Range',
};

const REPORT_TYPE_LABELS = {
  volunteer: 'Volunteer Report',
  program: 'Program Report',
  application: 'Application Report',
  attendance: 'Attendance Report',
  certificate: 'Certificate Report',
  reward: 'Reward Report',
  leaderboard: 'Leaderboard Report',
  organization: 'Organization Report',
  platform: 'Platform Report',
  impact: 'Impact Report',
};

const getDateRangeFilter = (dateRange, customStartDate = null, customEndDate = null) => {
  if (!dateRange) return {};

  const now = new Date();

  switch (dateRange) {
    case 'today': {
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(now);
      todayEnd.setHours(23, 59, 59, 999);
      return { $gte: todayStart, $lt: todayEnd };
    }

    case 'this_week': {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      return { $gte: startOfWeek, $lt: endOfWeek };
    }

    case 'this_month': {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      return { $gte: startOfMonth, $lt: endOfMonth };
    }

    case 'last_month': {
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      lastMonthEnd.setHours(23, 59, 59, 999);
      return { $gte: lastMonthStart, $lt: lastMonthEnd };
    }

    case 'last_3_months': {
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      threeMonthsAgo.setHours(0, 0, 0, 0);
      return { $gte: threeMonthsAgo };
    }

    case 'last_6_months': {
      const sixMonthsAgo = new Date(now);
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      sixMonthsAgo.setHours(0, 0, 0, 0);
      return { $gte: sixMonthsAgo };
    }

    case 'last_year': {
      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      oneYearAgo.setHours(0, 0, 0, 0);
      return { $gte: oneYearAgo };
    }

    case 'monthly': {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return { $gte: startOfMonth };
    }

    case 'quarterly': {
      const quarterStart = new Date(now);
      quarterStart.setMonth(now.getMonth() - 3);
      quarterStart.setHours(0, 0, 0, 0);
      return { $gte: quarterStart };
    }

    case 'annual': {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      return { $gte: yearStart };
    }

    case 'custom': {
      if (customStartDate && customEndDate) {
        return {
          $gte: new Date(customStartDate),
          $lt: new Date(customEndDate),
        };
      }
      break;
    }

    default:
      break;
  }

  return {};
};

const isValidDateRange = (dateRange) => {
  if (!dateRange) return true;
  return VALID_DATE_RANGES.includes(dateRange);
};

const isValidReportType = (reportType) => {
  return VALID_REPORT_TYPES.includes(reportType);
};

const isValidExportFormat = (format) => {
  return VALID_EXPORT_FORMATS.includes(format);
};

const isValidPageSize = (size) => {
  return !size || VALID_PAGE_SIZES.includes(size);
};

const isValidOrientation = (orientation) => {
  return !orientation || VALID_ORIENTATIONS.includes(orientation);
};

const isValidSortOrder = (order) => {
  return VALID_SORT_ORDERS.includes(order);
};

const isValidGroupBy = (groupBy) => {
  return !groupBy || GROUP_BY_FIELDS.includes(groupBy);
};

const validateReportParams = (req, res, next) => {
  const { reportType, dateRange, format, pageSize, orientation, sortOrder, groupBy } = req.query;
  const errors = [];

  if (reportType && !isValidReportType(reportType)) {
    errors.push({
      field: 'reportType',
      message: `Invalid report type. Must be one of: ${VALID_REPORT_TYPES.join(', ')}`,
    });
  }

  if (dateRange && !isValidDateRange(dateRange)) {
    errors.push({
      field: 'dateRange',
      message: `Invalid date range. Must be one of: ${VALID_DATE_RANGES.join(', ')}`,
    });
  }

  if (format && !isValidExportFormat(format)) {
    errors.push({
      field: 'format',
      message: `Invalid export format. Must be one of: ${VALID_EXPORT_FORMATS.join(', ')}`,
    });
  }

  if (pageSize && !isValidPageSize(pageSize)) {
    errors.push({
      field: 'pageSize',
      message: `Invalid page size. Must be one of: ${VALID_PAGE_SIZES.join(', ')}`,
    });
  }

  if (orientation && !isValidOrientation(orientation)) {
    errors.push({
      field: 'orientation',
      message: `Invalid orientation. Must be one of: ${VALID_ORIENTATIONS.join(', ')}`,
    });
  }

  if (sortOrder && !isValidSortOrder(sortOrder)) {
    errors.push({
      field: 'sortOrder',
      message: `Invalid sort order. Must be one of: ${VALID_SORT_ORDERS.join(', ')}`,
    });
  }

  if (groupBy && !isValidGroupBy(groupBy)) {
    errors.push({
      field: 'groupBy',
      message: `Invalid group by. Must be one of: ${GROUP_BY_FIELDS.join(', ')}`,
    });
  }

  if (dateRange === 'custom') {
    if (!req.query.startDate) {
      errors.push({ field: 'startDate', message: 'Start date is required for custom date range' });
    }
    if (!req.query.endDate) {
      errors.push({ field: 'endDate', message: 'End date is required for custom date range' });
    }
    if (req.query.startDate && req.query.endDate && new Date(req.query.startDate) >= new Date(req.query.endDate)) {
      errors.push({ field: 'endDate', message: 'End date must be after start date' });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  req.reportFilters = {
    dateRange,
    format,
    pageSize,
    orientation,
    sortOrder,
    groupBy,
    organization: req.query.organization,
    program: req.query.program,
    state: req.query.state,
    status: req.query.status,
    category: req.query.category,
    limit: parseInt(req.query.limit, 10) || 10,
    sortBy: req.query.sortBy,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
  };

  return next();
};

const validateReportTypeParam = (req, res, next) => {
  const { reportType } = req.params;
  const errors = [];

  if (!reportType || !isValidReportType(reportType)) {
    errors.push({
      field: 'reportType',
      message: `Invalid report type. Must be one of: ${VALID_REPORT_TYPES.join(', ')}`,
    });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

module.exports = {
  VALID_DATE_RANGES,
  VALID_REPORT_TYPES,
  VALID_EXPORT_FORMATS,
  VALID_PAGE_SIZES,
  VALID_ORIENTATIONS,
  VALID_SORT_ORDERS,
  GROUP_BY_FIELDS,
  DATE_RANGE_LABELS,
  REPORT_TYPE_LABELS,
  getDateRangeFilter,
  isValidDateRange,
  isValidReportType,
  isValidExportFormat,
  isValidPageSize,
  isValidOrientation,
  isValidSortOrder,
  isValidGroupBy,
  validateReportParams,
  validateReportTypeParam,
};