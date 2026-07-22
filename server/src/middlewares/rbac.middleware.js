const ROLES = require('../constants/roles.constants');
const { MESSAGES } = require('../modules/auth/auth.constants');
const { AuthenticationError, AuthorizationError } = require('../utils/errors');

/**
 * Middleware to authorize access based on user roles.
 * @param {...string} allowedRoles - Roles allowed to access the route.
 * @returns {Function} Express middleware function.
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthenticationError(MESSAGES.UNAUTHORIZED));
    }

    // Normalize role comparison to handle case differences
    const userRole = req.user.role?.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());
    
    if (!normalizedAllowedRoles.includes(userRole)) {
      return next(new AuthorizationError(MESSAGES.FORBIDDEN));
    }

    return next();
  };
};

/**
 * Middleware to authorize access based on user permissions.
 * Checks user.permissions array and role-based permissions.
 * @param {...string} requiredPermissions - Permission codes required to access the route.
 * @returns {Function} Express middleware function.
 */
const authorizePermissions = (...requiredPermissions) => {
  return async (req, res, next) => {
    if (!req.user) {
      return next(new AuthenticationError(MESSAGES.UNAUTHORIZED));
    }

    // Super admin has all permissions
    if (req.user.role === ROLES.SUPER_ADMIN) {
      return next();
    }

    // Check direct permissions on user
    const userPermissions = req.user.permissions || [];
    const hasAllPermissions = requiredPermissions.every((perm) => userPermissions.includes(perm));

    if (hasAllPermissions) {
      return next();
    }

    return next(new AuthorizationError(MESSAGES.FORBIDDEN));
  };
};

/**
 * Middleware to authorize access based on user roles (explicit naming).
 * @param {...string} roles - Roles allowed to access the route.
 * @returns {Function} Express middleware function.
 */
const authorizeRoles = (...roles) => authorize(...roles);

/**
 * Reusable helper middleware to check if user has Admin (or Super Admin) role.
 */
const isAdmin = authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN);

/**
 * Reusable helper middleware to check if user has Volunteer role.
 */
const isVolunteer = authorize(ROLES.VOLUNTEER);

/**
 * Reusable helper middleware to check if user has Guest role.
 */
const isGuest = authorize(ROLES.GUEST);

/**
 * Reusable helper middleware to check if user has either Admin, Super Admin, or Volunteer role.
 */
const isAdminOrVolunteer = authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.VOLUNTEER);

module.exports = {
  authorize,
  authorizeRoles,
  authorizePermissions,
  isAdmin,
  isVolunteer,
  isGuest,
  isAdminOrVolunteer,
};