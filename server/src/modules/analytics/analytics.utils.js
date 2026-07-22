/**
 * Analytics Utility Functions
 * Provides date range calculations and helper functions for analytics
 */

const DATE_RANGES = {
  TODAY: 'today',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  LAST_3_MONTHS: 'last_3_months',
  LAST_6_MONTHS: 'last_6_months',
  LAST_YEAR: 'last_year',
};

/**
 * Calculate date range based on filter type
 * @param {string} dateRange - One of DATE_RANGES values or 'custom'
 * @param {string} startDate - Custom start date (ISO string) for custom range
 * @param {string} endDate - Custom end date (ISO string) for custom range
 * @returns {object} Query filter object with date range
 */
const getDateRangeFilter = (dateRange, startDate = null, endDate = null) => {
  const now = new Date();
  const filter = {};

  switch (dateRange) {
    case DATE_RANGES.TODAY:
      filter.dateField = {
        $gte: new Date(now.setHours(0, 0, 0, 0)),
        $lt: new Date(now.setHours(23, 59, 59, 999)),
      };
      break;

    case DATE_RANGES.THIS_WEEK: {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      filter.dateField = {
        $gte: startOfWeek,
        $lt: endOfWeek,
      };
      break;
    }

    case DATE_RANGES.THIS_MONTH: {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);

      filter.dateField = {
        $gte: startOfMonth,
        $lt: endOfMonth,
      };
      break;
    }

    case DATE_RANGES.LAST_MONTH: {
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      lastMonthEnd.setHours(23, 59, 59, 999);

      filter.dateField = {
        $gte: lastMonthStart,
        $lt: lastMonthEnd,
      };
      break;
    }

    case DATE_RANGES.LAST_3_MONTHS: {
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      threeMonthsAgo.setHours(0, 0, 0, 0);

      filter.dateField = {
        $gte: threeMonthsAgo,
      };
      break;
    }

    case DATE_RANGES.LAST_6_MONTHS: {
      const sixMonthsAgo = new Date(now);
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      sixMonthsAgo.setHours(0, 0, 0, 0);

      filter.dateField = {
        $gte: sixMonthsAgo,
      };
      break;
    }

    case DATE_RANGES.LAST_YEAR: {
      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      oneYearAgo.setHours(0, 0, 0, 0);

      filter.dateField = {
        $gte: oneYearAgo,
      };
      break;
    }

    case 'custom': {
      if (startDate && endDate) {
        filter.dateField = {
          $gte: new Date(startDate),
          $lt: new Date(endDate),
        };
      }
      break;
    }

    default:
      // No date filter applied
      break;
  }

  return filter;
};

/**
 * Get month/year format from date
 * @param {Date} date - Date object
 * @returns {object} { month: string, year: number }
 */
const getMonthYear = (date) => {
  return {
    month: date.toLocaleString('default', { month: 'short' }),
    year: date.getFullYear(),
  };
};

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @returns {number} Percentage
 */
const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 100) / 100;
};

/**
 * Calculate growth rate
 * @param {number} current - Current period value
 * @param {number} previous - Previous period value
 * @returns {object} { rate: number, direction: 'up' | 'down' | 'same' }
 */
const calculateGrowthRate = (current, previous) => {
  if (previous === 0 && current === 0) return { rate: 0, direction: 'same' };
  if (previous === 0) return { rate: 100, direction: 'up' };

  const rate = ((current - previous) / previous) * 100;
  const direction = rate > 0 ? 'up' : rate < 0 ? 'down' : 'same';

  return {
    rate: Math.round(rate * 100) / 100,
    direction,
  };
};

module.exports = {
  DATE_RANGES,
  getDateRangeFilter,
  getMonthYear,
  calculatePercentage,
  calculateGrowthRate,
};