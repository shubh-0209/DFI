const MESSAGES = {
  PERMISSION_CREATED: 'Permission created successfully',
  PERMISSION_FETCHED: 'Permission retrieved successfully',
  PERMISSIONS_FETCHED: 'Permissions retrieved successfully',
  PERMISSION_NOT_FOUND: 'Permission not found',
  PERMISSION_ALREADY_EXISTS: 'Permission with this code already exists',
};

const PERMISSION_MODULES = {
  USERS: 'users',
  PROGRAMS: 'programs',
  APPLICATIONS: 'applications',
  ATTENDANCE: 'attendance',
  CERTIFICATES: 'certificates',
  REWARDS: 'rewards',
  LEADERBOARD: 'leaderboard',
  NOTIFICATIONS: 'notifications',
  ORGANIZATIONS: 'organizations',
  ROLES: 'roles',
  PERMISSIONS: 'permissions',
  ANALYTICS: 'analytics',
  MEDIA: 'media',
  SETTINGS: 'settings',
};

const PERMISSION_CATEGORIES = {
  CRUD: 'crud',
  MANAGEMENT: 'management',
  ADMIN: 'admin',
};

module.exports = {
  MESSAGES,
  PERMISSION_MODULES,
  PERMISSION_CATEGORIES,
};