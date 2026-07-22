const MESSAGES = {
  ROLE_CREATED: 'Role created successfully',
  ROLE_UPDATED: 'Role updated successfully',
  ROLE_FETCHED: 'Role retrieved successfully',
  ROLES_FETCHED: 'Roles retrieved successfully',
  ROLE_DELETED: 'Role deleted successfully',
  ROLE_NOT_FOUND: 'Role not found',
  ROLE_ALREADY_EXISTS: 'Role with this slug already exists',
};

// ROLE_PERMISSIONS maps role slugs (used in Role model) to permission codes
const ROLE_PERMISSIONS = {
  superadmin: [], // Super admins have all permissions via middleware
  admin: [
    'users:read',
    'users:update',
    'programs:create',
    'programs:read',
    'programs:update',
    'programs:delete',
    'programs:publish',
    'applications:read',
    'applications:approve',
    'attendance:read',
    'attendance:mark',
    'certificates:read',
    'certificates:generate',
    'rewards:read',
    'leaderboard:read',
    'notifications:read',
    'organizations:read',
  ],
  coordinator: [
    'programs:read',
    'applications:read',
    'attendance:mark',
    'attendance:read',
    'leaderboard:read',
  ],
  volunteer_coordinator: [
    'programs:read',
    'applications:read',
    'attendance:mark',
    'attendance:read',
    'leaderboard:read',
  ],
  attendance_manager: ['attendance:mark', 'attendance:read', 'users:read'],
  reviewer: ['applications:read', 'users:read'],
  volunteer: ['applications:create', 'attendance:read', 'certificates:read', 'programs:read'],
  guest: ['programs:read'],
};

// Maps role slug strings to canonical values
const ROLE_SLUG_MAP = {
  superadmin: 'superadmin',
  admin: 'admin',
  coordinator: 'coordinator',
  volunteer_coordinator: 'volunteer_coordinator',
  attendance_manager: 'attendance_manager',
  reviewer: 'reviewer',
  volunteer: 'volunteer',
  guest: 'guest',
};

module.exports = {
  MESSAGES,
  ROLE_PERMISSIONS,
  ROLE_SLUG_MAP,
};