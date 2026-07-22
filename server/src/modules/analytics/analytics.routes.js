const express = require('express');
const analyticsController = require('./analytics.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');
const { authorize } = require('../../middlewares/rbac.middleware');
const {
  validateVolunteerAnalytics,
  validateProgramAnalytics,
  validateApplicationAnalytics,
  validateAttendanceAnalytics,
  validateCertificateAnalytics,
  validateRewardAnalytics,
  validateLeaderboardAnalytics,
  validateOrganizationAnalytics,
} = require('./analytics.validation');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

// ============================================================
// DASHBOARD STATISTICS (Module 11.1)
// ============================================================

/**
 * @route GET /api/v1/analytics/dashboard/volunteer
 * @desc Get volunteer dashboard statistics
 * @access Private - Volunteers, Coordinators, Admins, Super Admins
 */
router.get(
  '/dashboard/volunteer',
  authenticate, authenticatedLimiter,
  authorize(ROLES.VOLUNTEER, ROLES.COORDINATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  analyticsController.getVolunteerDashboard
);

/**
 * @route GET /api/v1/analytics/dashboard/volunteer/rank
 * @desc Get volunteer rank independently
 * @access Private - Volunteers, Coordinators, Admins, Super Admins
 */
router.get(
  '/dashboard/volunteer/rank',
  authenticate, authenticatedLimiter,
  authorize(ROLES.VOLUNTEER, ROLES.COORDINATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  analyticsController.getVolunteerRank
);

/**
 * @route GET /api/v1/analytics/dashboard/admin
 * @desc Get admin dashboard statistics
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/dashboard/admin',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  analyticsController.getAdminDashboard
);

/**
 * @route GET /api/v1/analytics/dashboard/super-admin
 * @desc Get super admin dashboard statistics
 * @access Private - Super Admins only
 */
router.get(
  '/dashboard/super-admin',
  authenticate, authenticatedLimiter,
  authorize(ROLES.SUPER_ADMIN),
  analyticsController.getSuperAdminDashboard
);

// ============================================================
// VOLUNTEER ANALYTICS (Module 11.2)
// ============================================================

/**
 * @route GET /api/v1/analytics/volunteers
 * @desc Get volunteer analytics report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/volunteers',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateVolunteerAnalytics,
  analyticsController.getVolunteerAnalytics
);

// ============================================================
// PROGRAM ANALYTICS (Module 11.2)
// ============================================================

/**
 * @route GET /api/v1/analytics/programs
 * @desc Get program analytics report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/programs',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateProgramAnalytics,
  analyticsController.getProgramAnalytics
);

// ============================================================
// APPLICATION ANALYTICS (Module 11.2)
// ============================================================

/**
 * @route GET /api/v1/analytics/applications
 * @desc Get application analytics report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/applications',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateApplicationAnalytics,
  analyticsController.getApplicationAnalytics
);

// ============================================================
// ATTENDANCE ANALYTICS (Module 11.2)
// ============================================================

/**
 * @route GET /api/v1/analytics/attendance
 * @desc Get attendance analytics report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/attendance',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateAttendanceAnalytics,
  analyticsController.getAttendanceAnalytics
);

// ============================================================
// CERTIFICATE ANALYTICS (Module 11.2)
// ============================================================

/**
 * @route GET /api/v1/analytics/certificates
 * @desc Get certificate analytics report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/certificates',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateCertificateAnalytics,
  analyticsController.getCertificateAnalytics
);

// ============================================================
// REWARD ANALYTICS (Module 11.2)
// ============================================================

/**
 * @route GET /api/v1/analytics/rewards
 * @desc Get reward analytics report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/rewards',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateRewardAnalytics,
  analyticsController.getRewardAnalytics
);

// ============================================================
// LEADERBOARD ANALYTICS (Module 11.2)
// ============================================================

/**
 * @route GET /api/v1/analytics/leaderboard
 * @desc Get leaderboard analytics report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/leaderboard',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateLeaderboardAnalytics,
  analyticsController.getLeaderboardAnalytics
);

// ============================================================
// ORGANIZATION ANALYTICS (Module 11.2)
// ============================================================

/**
 * @route GET /api/v1/analytics/organizations
 * @desc Get organization analytics report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/organizations',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateOrganizationAnalytics,
  analyticsController.getOrganizationAnalytics
);

// ============================================================
// EXPORT ENDPOINT (Module 11.2)
// ============================================================

/**
 * @route GET /api/v1/analytics/export/:type
 * @desc Export analytics data as CSV
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/export/:type',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  analyticsController.exportAnalytics
);

module.exports = router;