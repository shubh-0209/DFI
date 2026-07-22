/**
 * Export utilities for CSV, Excel, and PDF
 */

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const exportToCSV = (data, filename = 'export') => {
  if (!data || !data.length) {
    console.warn('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') return `"${JSON.stringify(val)}"`;
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (data, filename = 'export') => {
  if (!data || !data.length) {
    console.warn('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const tsvContent = [
    headers.join('\t'),
    ...data.map(row =>
      headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return '';
        return String(val);
      }).join('\t')
    ),
  ].join('\n');

  const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (data, filename = 'export') => {
  if (!data) {
    console.warn('No data to export');
    return;
  }

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatAnalyticsForExport = (analytics, type) => {
  if (!analytics) return [];

  switch (type) {
    case 'volunteers':
      return analytics.volunteersByState?.map(s => ({
        State: s.state,
        Count: s.count,
        Percentage: `${s.percentage}%`,
      })) || [];

    case 'programs':
      return analytics.programsByCategory?.map(c => ({
        Category: c.category,
        Count: c.count,
      })) || [];

    case 'applications':
      return analytics.statusDistribution?.map(s => ({
        Status: s.status,
        Count: s.count,
      })) || [];

    case 'attendance':
      return analytics.monthlyAttendance?.map(m => ({
        Month: `${MONTH_NAMES[m.month]} ${m.year}`,
        Sessions: m.count,
        Hours: m.totalHours || 0,
      })) || [];

    case 'certificates':
      return analytics.certificatesByProgram?.map(c => ({
        Program: c.program,
        Count: c.count,
      })) || [];

    case 'rewards':
      return analytics.coinsEarnedByMonth?.map(c => ({
        Month: `${MONTH_NAMES[c.month]} ${c.year}`,
        Coins: c.coins || 0,
      })) || [];

    case 'leaderboard':
      return analytics.topVolunteers?.map(v => ({
        Name: v.name,
        Email: v.email,
        Hours: v.totalHours || 0,
      })) || [];

    case 'organizations':
      return [{
        'Organizations Created': analytics.organizationsCreated,
        'Verified Organizations': analytics.verifiedOrganizations,
        'Active Organizations': analytics.activeOrganizations,
      }];

    default:
      return [];
  }
};

export const downloadReport = (analytics, type, format = 'csv') => {
  const data = formatAnalyticsForExport(analytics, type);
  const filename = `analytics_${type}_${format}`;

  switch (format) {
    case 'csv':
      exportToCSV(data, filename);
      break;
    case 'excel':
      exportToExcel(data, filename);
      break;
    case 'json':
      exportToJSON(analytics, filename);
      break;
    default:
      exportToCSV(data, filename);
  }
};