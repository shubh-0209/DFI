const express = require('express');
const attendanceController = require('../attendance/attendance.controller');
const {
  validateAttendanceHistory,
  validateBulkAttendance,
  validateMarkAttendance,
} = require('../attendance/attendance.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');
const { authorize } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

// Apply auth & role requirements for all admin attendance endpoints
router.use(authenticate);
router.use(authenticatedLimiter);

// ─── Statistics ──────────────────────────────────────────────────
router.get(
  '/attendance/statistics',
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  attendanceController.getStatistics
);

// ─── Export ──────────────────────────────────────────────────────
router.get(
  '/attendance/export',
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  attendanceController.exportAttendance
);

// ─── Bulk ────────────────────────────────────────────────────────
router.post(
  '/attendance/bulk',
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validateBulkAttendance,
  attendanceController.bulkAttendance
);

// ─── Standard List & Edit ────────────────────────────────────────
router.get(
  '/attendance',
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateAttendanceHistory,
  attendanceController.getAdminAttendance
);

router.patch(
  '/attendance/:id',
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validateMarkAttendance,
  attendanceController.editAttendance
);

module.exports = router;
