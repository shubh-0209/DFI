const express = require('express');
const userController = require('./user.controller');
const {
  validateGetCurrentProfile,
  validateUpdateProfile,
  validateUploadProfilePhoto,
  validateUploadResume,
  validatePublicProfile,
  validateAdminUserSearch,
} = require('./user.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');
const { authorize } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');
const multer = require('multer');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ─── Protected Profile Routes ────────────────────────────────────
router.get('/me', authenticate, authenticatedLimiter, validateGetCurrentProfile, userController.getCurrentProfile);
router.put('/me', authenticate, authenticatedLimiter, validateUpdateProfile, userController.updateProfile);

// ─── Volunteer Progress Routes ───────────────────────────────────
router.get('/profile-completion', authenticate, authenticatedLimiter, userController.getProfileCompletion);
router.get('/statistics', authenticate, authenticatedLimiter, userController.getVolunteerStatistics);

// ─── File Upload Routes ───
router.patch(
  '/profile-photo',
  authenticate, authenticatedLimiter,
  upload.single('profilePhoto'),
  validateUploadProfilePhoto,
  userController.uploadProfilePhoto
);
router.patch('/resume', authenticate, authenticatedLimiter, validateUploadResume, userController.uploadResume);

// ─── Public Profile Route ────────────────────────────────────────
router.get('/public/:username', validatePublicProfile, userController.getPublicProfile);

// ─── Admin / Coordinator Search Route ───────────────────────────
router.get(
  '/',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  validateAdminUserSearch,
  userController.searchUsers
);

module.exports = router;
