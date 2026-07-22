const { REPORT_TYPES, EXPORT_FORMATS, REPORT_PERIODS, PAGE_SIZES, ORIENTATIONS } = require('./report.model');

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DATE_RANGE_LABELS = {
  [REPORT_PERIODS.TODAY]: 'Today',
  [REPORT_PERIODS.THIS_WEEK]: 'This Week',
  [REPORT_PERIODS.THIS_MONTH]: 'This Month',
  [REPORT_PERIODS.LAST_MONTH]: 'Last Month',
  [REPORT_PERIODS.LAST_3_MONTHS]: 'Last 3 Months',
  [REPORT_PERIODS.LAST_6_MONTHS]: 'Last 6 Months',
  [REPORT_PERIODS.LAST_YEAR]: 'Last Year',
  [REPORT_PERIODS.MONTHLY]: 'Monthly',
  [REPORT_PERIODS.QUARTERLY]: 'Quarterly',
  [REPORT_PERIODS.ANNUAL]: 'Annual',
};

const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 100) / 100;
};

const flattenObject = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], newKey));
    } else {
      acc[newKey] = obj[key];
    }
    return acc;
  }, {});
};

const convertToCSV = (data) => {
  if (!data || typeof data !== 'object') return '';
  const flat = Array.isArray(data) ? data.map(flattenObject) : [flattenObject(data)];
  const headers = Object.keys(flat[0] || {});
  const rows = flat.map(row => headers.map(h => `"${row[h] || ''}"`).join(','));
  return [headers.join(','), ...rows].join('\n');
};

const formatReportData = (reportType, data, options = {}) => {
  const formatted = {
    reportType,
    generatedAt: new Date(),
    options,
    data,
  };

  return formatted;
};

const buildPDFMetadata = (report, user) => {
  return {
    title: `Disha for India - ${report.reportType.charAt(0).toUpperCase() + report.reportType.slice(1)} Report`,
    author: user?.name || 'System',
    subject: `${report.reportType} Report`,
    keywords: 'report,disha,india,volunteer',
    creator: 'Disha for India Platform',
    producer: 'Disha for India Platform',
  };
};

module.exports = {
  MONTH_NAMES,
  DATE_RANGE_LABELS,
  calculatePercentage,
  flattenObject,
  convertToCSV,
  formatReportData,
  buildPDFMetadata,
  REPORT_TYPES,
  EXPORT_FORMATS,
  REPORT_PERIODS,
  PAGE_SIZES,
  ORIENTATIONS,
};