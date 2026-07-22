const express = require('express');
const adminController = require('./admin.controller');
const {
  validateGetAllUsers,
  validateUserId,
  validateUpdateStatus,
  validateUpdateRole,
} = require('./admin.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');
const { isAdmin } = require('../../middlewares/rbac.middleware');
const applicationRoutes = require('./application.routes');
const attendanceRoutes = require('./attendance.routes');
const contributionRoutes = require('./contribution.routes');
const contributionConfigRoutes = require('../contribution/contribution-config.routes');

const router = express.Router();

// All admin routes require authentication and rate limiting
router.use(authenticate, authenticatedLimiter);

// ─── Statistics ──────────────────────────────────────────────────
router.get('/users/statistics', isAdmin, adminController.getDashboardStatistics);

// ─── User Listing & Details ──────────────────────────────────────
router.get('/users', isAdmin, validateGetAllUsers, adminController.getAllUsers);
router.get('/users/:id', isAdmin, validateUserId, adminController.getUserDetails);

// ─── User Mutations ──────────────────────────────────────────────
router.patch('/users/:id/status', isAdmin, validateUpdateStatus, adminController.changeUserStatus);
router.patch('/users/:id/role', isAdmin, validateUpdateRole, adminController.changeUserRole);
router.patch('/users/:id/restore', isAdmin, validateUserId, adminController.restoreUser);
router.delete('/users/:id', isAdmin, validateUserId, adminController.deleteUser);

// ─── Application Management ──────────────────────────────────────
router.use('/', applicationRoutes);

// ─── Attendance Management ───────────────────────────────────────
router.use('/', attendanceRoutes);

// ─── Contribution Management ────────────────────────────────────
router.use('/', contributionRoutes);

// ─── Contribution Configuration ─────────────────────────────────
router.use('/', contributionConfigRoutes);

module.exports = router;
