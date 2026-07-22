const MESSAGES = {
  USERS_FETCHED: 'Users retrieved successfully',
  USER_FETCHED: 'User details retrieved successfully',
  STATUS_UPDATED: 'User status updated successfully',
  ROLE_UPDATED: 'User role updated successfully',
  USER_DELETED: 'User soft deleted successfully',
  USER_RESTORED: 'User restored successfully',
  STATISTICS_FETCHED: 'Dashboard statistics retrieved successfully',
};

const ALLOWED_STATUSES = ['active', 'inactive', 'suspended'];

const ALLOWED_ROLES = ['volunteer', 'coordinator', 'admin'];

const SORT_FIELDS = ['createdAt', 'name', 'email', 'points', 'status', 'role'];

const SORT_ORDERS = ['asc', 'desc'];

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

module.exports = {
  MESSAGES,
  ALLOWED_STATUSES,
  ALLOWED_ROLES,
  SORT_FIELDS,
  SORT_ORDERS,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
};
