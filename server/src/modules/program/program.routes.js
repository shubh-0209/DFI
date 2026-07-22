const express = require('express');
const programController = require('./program.controller');
const {
  validateCreateProgram,
  validateUpdateProgram,
  validateGetProgram,
  validateListPrograms,
  validatePublishProgram,
  validateArchiveProgram,
  validateRestoreProgram,
  validateDeleteProgram,
  validateChangeProgramStatus,
} = require('./program.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');
const { authorize } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

// ─── STATIC routes MUST come before /:id ────────────────────────────

// All authenticated users: list programs
router.get('/', authenticate, authenticatedLimiter, validateListPrograms, programController.listPrograms);

// All authenticated users: my programs (programs the user has applied to)
router.get('/me', authenticate, authenticatedLimiter, programController.getMyPrograms);

// Admin/Coordinator: aggregate statistics (MUST be above /:id)
router.get(
  '/statistics',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  programController.getStatistics
);

// Admin/Coordinator: create a program
router.post(
  '/',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateCreateProgram,
  programController.createProgram
);

// ─── Dynamic /:id routes ─────────────────────────────────────────────

// Any authenticated user: get a single program
router.get('/:id', authenticate, authenticatedLimiter, validateGetProgram, programController.getProgram);

// Admin/Coordinator: update program
router.put(
  '/:id',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateUpdateProgram,
  programController.updateProgram
);

// Admin/Coordinator: delete program
router.delete(
  '/:id',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateDeleteProgram,
  programController.deleteProgram
);

// Admin/Coordinator: publish program
router.patch(
  '/:id/publish',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validatePublishProgram,
  programController.publishProgram
);

// Admin/Coordinator: archive program
router.patch(
  '/:id/archive',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateArchiveProgram,
  programController.archiveProgram
);

// Admin/Super Admin: restore program
router.patch(
  '/:id/restore',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validateRestoreProgram,
  programController.restoreProgram
);

// Admin/Coordinator: change program status
router.patch(
  '/:id/status',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateChangeProgramStatus,
  programController.changeProgramStatus
);

// Admin/Coordinator: generate dynamic expiring check-in/out QR token
router.post(
  '/:id/qr-token',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  programController.generateQrToken
);

module.exports = router;
