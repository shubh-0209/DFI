const express = require('express');
const forecastController = require('./forecast.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');
const { authorize } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

/**
 * @route GET /api/v1/forecast/dashboard
 * @desc Get comprehensive forecast dashboard
 * @access Private - Admin Only
 */
router.get(
  '/dashboard',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  forecastController.getDashboard
);

/**
 * @route GET /api/v1/forecast/volunteers
 * @desc Get volunteer growth forecast
 * @access Private - Admin Only
 */
router.get(
  '/volunteers',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  forecastController.getVolunteers
);

/**
 * @route GET /api/v1/forecast/programs
 * @desc Get program demand forecast
 * @access Private - Admin Only
 */
router.get(
  '/programs',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  forecastController.getPrograms
);

/**
 * @route GET /api/v1/forecast/attendance
 * @desc Get attendance trends forecast
 * @access Private - Admin Only
 */
router.get(
  '/attendance',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  forecastController.getAttendance
);

/**
 * @route GET /api/v1/forecast/rewards
 * @desc Get reward redemption and coin distribution forecast
 * @access Private - Admin Only
 */
router.get(
  '/rewards',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  forecastController.getRewards
);

module.exports = router;
