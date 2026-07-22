const express = require('express');
const attendanceController = require('./attendance.controller');
const {
  validateCheckIn,
  validateCheckOut,
  validateMarkAttendance,
  validateGetAttendance,
  validateMyAttendance,
  validateAttendanceHistory,
} = require('./attendance.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');
const { authorize, isVolunteer } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

// All attendance routes require authentication
router.use(authenticate);
router.use(authenticatedLimiter);

// ─── STATIC routes MUST come before /:id ────────────────────────────

// Volunteer: check in
router.post('/check-in', isVolunteer, validateCheckIn, attendanceController.checkIn);

// Volunteer: check out
router.patch('/check-out', isVolunteer, validateCheckOut, attendanceController.checkOut);

// Volunteer & Admin: personal attendance summary (dashboard)
router.get('/dashboard', attendanceController.getDashboard);

// Volunteer: my attendance list
router.get('/me', validateMyAttendance, attendanceController.getMyAttendance);

// Admin / Coordinator: attendance history with filters
router.get(
  '/history',
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateAttendanceHistory,
  attendanceController.attendanceHistory
);

// Admin / Coordinator: aggregate statistics
router.get(
  '/statistics',
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  attendanceController.getStatistics
);

// Admin / Coordinator: edit a specific attendance record (PATCH /:id)
router.patch(
  '/:id',
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateMarkAttendance,
  attendanceController.editAttendance
);

// ─── Dynamic /:id route MUST be last ────────────────────────────────
router.get('/:id', validateGetAttendance, attendanceController.getAttendance);

module.exports = router;
