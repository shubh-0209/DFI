const ValidationError = require('../../utils/errors/ValidationError');

const VALID_DATE_RANGES = [
  '',
  'today',
  'this_week',
  'this_month',
  'last_month',
  'last_3_months',
  'last_6_months',
  'last_year',
  'custom',
];

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

const validateDateRangeParam = (req, res, next) => {
  const { dateRange, startDate, endDate } = req.query;
  const errors = [];

  if (dateRange && !isValidDateRange(dateRange)) {
    errors.push({
      field: 'dateRange',
      message: 'Invalid date range. Must be one of: today, this_week, this_month, last_month, last_3_months, last_6_months, last_year, or custom',
    });
  }

  if (dateRange === 'custom') {
    if (!startDate) {
      errors.push({ field: 'startDate', message: 'Start date is required for custom date range' });
    }
    if (!endDate) {
      errors.push({ field: 'endDate', message: 'End date is required for custom date range' });
    }
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      errors.push({ field: 'endDate', message: 'End date must be after start date' });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  req.dateRangeFilter = getDateRangeFilter(dateRange, startDate, endDate);
  return next();
};

const validateDateRangeWithField = (dateField) => {
  return (req, res, next) => {
    const { dateRange } = req.query;
    const customStartDate = req.query.startDate;
    const customEndDate = req.query.endDate;
    const errors = [];

    if (dateRange && !isValidDateRange(dateRange)) {
      errors.push({
        field: 'dateRange',
        message: 'Invalid date range parameter',
      });
    }

    req.analyticsDateFilter = {
      dateRange,
      dateField,
      filter: getDateRangeFilter(dateRange, customStartDate, customEndDate),
    };

    if (errors.length > 0) {
      return next(new ValidationError('Validation failed', errors));
    }

    return next();
  };
};

const validateLimitParam = (req, res, next) => {
  const { limit = '10' } = req.query;
  const numLimit = parseInt(limit, 10);
  const errors = [];

  if (isNaN(numLimit) || numLimit < 1 || numLimit > 100) {
    errors.push({
      field: 'limit',
      message: 'Limit must be a number between 1 and 100',
    });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  req.validatedLimit = numLimit;
  return next();
};

const validateVolunteerAnalytics = validateDateRangeParam;
const validateProgramAnalytics = validateDateRangeParam;
const validateApplicationAnalytics = validateDateRangeParam;
const validateAttendanceAnalytics = validateDateRangeParam;
const validateCertificateAnalytics = validateDateRangeParam;
const validateRewardAnalytics = validateDateRangeParam;
const validateLeaderboardAnalytics = validateLimitParam;
const validateOrganizationAnalytics = validateDateRangeParam;

module.exports = {
  VALID_DATE_RANGES,
  VALID_DATE_RANGES_VALUES: VALID_DATE_RANGES,
  MONTH_NAMES,
  getDateRangeFilter,
  isValidDateRange,
  validateDateRangeParam,
  validateDateRangeWithField,
  validateLimitParam,
  validateVolunteerAnalytics,
  validateProgramAnalytics,
  validateApplicationAnalytics,
  validateAttendanceAnalytics,
  validateCertificateAnalytics,
  validateRewardAnalytics,
  validateLeaderboardAnalytics,
  validateOrganizationAnalytics,
};