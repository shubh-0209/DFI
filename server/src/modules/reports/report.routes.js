const express = require('express');
const reportController = require('./report.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');
const { authorize } = require('../../middlewares/rbac.middleware');
const { validateReportParams, validateReportTypeParam } = require('./report.validation');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

/**
 * @route POST /api/v1/reports/generate
 * @desc Generate a new report and save to history
 * @access Private - Admins, Super Admins, Coordinators
 */
router.post(
  '/generate',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateReportParams,
  reportController.generateReport
);

/**
 * @route GET /api/v1/reports/preview
 * @desc Preview a report before export
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/preview',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateReportParams,
  reportController.previewReport
);

/**
 * @route GET /api/v1/reports/export/:reportType
 * @desc Export a report in specified format (CSV, Excel, PDF)
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/export/:reportType',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateReportTypeParam,
  validateReportParams,
  reportController.exportReport
);

/**
 * @route GET /api/v1/reports/history
 * @desc Get report generation history
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/history',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  reportController.getReportHistory
);

/**
 * @route GET /api/v1/reports/bi
 * @desc Get business intelligence data
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/bi',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  reportController.getBusinessIntelligence
);

/**
 * @route GET /api/v1/reports/compare/:compareType
 * @desc Get comparison data (month, year, program, organization, state)
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/compare/:compareType',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  reportController.getComparisonData
);

// ============================================================
// INDIVIDUAL REPORT ENDPOINTS
// ============================================================

/**
 * @route GET /api/v1/reports/volunteers
 * @desc Get volunteer report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/volunteers',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateReportParams,
  reportController.getVolunteerReport
);

/**
 * @route GET /api/v1/reports/programs
 * @desc Get program report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/programs',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateReportParams,
  reportController.getProgramReport
);

/**
 * @route GET /api/v1/reports/applications
 * @desc Get application report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/applications',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateReportParams,
  reportController.getApplicationReport
);

/**
 * @route GET /api/v1/reports/attendance
 * @desc Get attendance report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/attendance',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateReportParams,
  reportController.getAttendanceReport
);

/**
 * @route GET /api/v1/reports/certificates
 * @desc Get certificate report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/certificates',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateReportParams,
  reportController.getCertificateReport
);

/**
 * @route GET /api/v1/reports/rewards
 * @desc Get reward report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/rewards',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateReportParams,
  reportController.getRewardReport
);

/**
 * @route GET /api/v1/reports/leaderboard
 * @desc Get leaderboard report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/leaderboard',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateReportParams,
  reportController.getLeaderboardReport
);

/**
 * @route GET /api/v1/reports/organizations
 * @desc Get organization report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/organizations',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateReportParams,
  reportController.getOrganizationReport
);

/**
 * @route GET /api/v1/reports/platform
 * @desc Get platform-wide report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/platform',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateReportParams,
  reportController.getPlatformReport
);

/**
 * @route GET /api/v1/reports/impact
 * @desc Get impact report
 * @access Private - Admins, Super Admins, Coordinators
 */
router.get(
  '/impact',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateReportParams,
  reportController.getImpactReport
);

module.exports = router;