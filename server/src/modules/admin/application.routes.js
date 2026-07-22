const express = require('express');
const applicationController = require('../application/application.controller');
const {
  validateAdminApplications,
  validateBulkUpdate,
} = require('../application/application.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');
const { authorize } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

// ─── Admin Routes ───────────────────────────────────────────────────
router.get(
  '/applications',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateAdminApplications,
  applicationController.getAdminApplications
);

router.get(
  '/applications/statistics',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  applicationController.getApplicationStatistics
);

router.post(
  '/applications/bulk',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validateBulkUpdate,
  applicationController.bulkUpdateApplications
);

module.exports = router;
