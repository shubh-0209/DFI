const express = require('express');
const applicationController = require('./application.controller');
const {
  validateApplyToProgram,
  validateWithdrawApplication,
  validateGetApplication,
  validateMyApplications,
  validateBulkUpdate,
  validateSubmitProof,
  validateVerifyCompletion,
} = require('./application.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');
const { authorize } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

// ─── STATIC routes MUST come before /:id ────────────────────────────

// All authenticated users: my applications
router.get('/me', authenticate, authenticatedLimiter, validateMyApplications, applicationController.getMyApplications);

// All authenticated users: stats
//   - Admin/Coordinator → global aggregate stats
//   - Volunteer         → their own application counts
router.get('/stats', authenticate, authenticatedLimiter, applicationController.getApplicationStatistics);

// All authenticated users: list applications
//   - Admin/Coordinator → all applications with filters
//   - Volunteer         → their own applications (same as /me)
router.get('/', authenticate, authenticatedLimiter, applicationController.getApplications);

// Admin/Coordinator only: bulk status update
router.patch(
  '/bulk',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateBulkUpdate,
  applicationController.bulkUpdateApplications
);

// All authenticated users: create a new application
router.post(
  '/',
  authenticate, authenticatedLimiter,
  authorize(ROLES.VOLUNTEER, ROLES.COORDINATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validateApplyToProgram,
  applicationController.applyToProgram
);

// Admin/Coordinator: approve an application
router.patch(
  '/:id/approve',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateGetApplication,
  applicationController.approveApplication
);

// Admin/Coordinator: reject an application
router.patch(
  '/:id/reject',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateGetApplication,
  applicationController.rejectApplication
);

// Any authenticated user: withdraw their own application
router.patch(
  '/:id/withdraw',
  authenticate, authenticatedLimiter,
  validateWithdrawApplication,
  applicationController.withdrawApplication
);

// Volunteer: submit program proof of work
router.post(
  '/:id/submit-proof',
  authenticate,
  authorize(ROLES.VOLUNTEER),
  validateSubmitProof,
  applicationController.submitProof
);

// Admin/Coordinator: verify/approve volunteer program completion
router.post(
  '/:id/verify-completion',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateVerifyCompletion,
  applicationController.verifyCompletion
);

// ─── Dynamic /:id route MUST be last ────────────────────────────────
router.get('/:id', authenticate, authenticatedLimiter, validateGetApplication, applicationController.getApplication);

module.exports = router;
