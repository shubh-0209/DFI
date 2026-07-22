const MESSAGES = {
  VOLUNTEER_ANALYTICS_FETCHED: 'Volunteer analytics retrieved successfully',
  PROGRAM_ANALYTICS_FETCHED: 'Program analytics retrieved successfully',
  APPLICATION_ANALYTICS_FETCHED: 'Application analytics retrieved successfully',
  ATTENDANCE_ANALYTICS_FETCHED: 'Attendance analytics retrieved successfully',
  CERTIFICATE_ANALYTICS_FETCHED: 'Certificate analytics retrieved successfully',
  REWARD_ANALYTICS_FETCHED: 'Reward analytics retrieved successfully',
  LEADERBOARD_ANALYTICS_FETCHED: 'Leaderboard analytics retrieved successfully',
  ORGANIZATION_ANALYTICS_FETCHED: 'Organization analytics retrieved successfully',
};

const DATE_RANGES = {
  TODAY: 'today',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  LAST_3_MONTHS: 'last_3_months',
  LAST_6_MONTHS: 'last_6_months',
  LAST_YEAR: 'last_year',
};

const SORT_ORDERS = ['asc', 'desc'];

const MESSAGES_DASHBOARD = {
  VOLUNTEER_DASHBOARD_FETCHED: 'Volunteer dashboard statistics retrieved successfully',
  ADMIN_DASHBOARD_FETCHED: 'Admin dashboard statistics retrieved successfully',
  SUPER_ADMIN_DASHBOARD_FETCHED: 'Super admin dashboard statistics retrieved successfully',
};

module.exports = { MESSAGES, DATE_RANGES, SORT_ORDERS, MESSAGES_DASHBOARD };