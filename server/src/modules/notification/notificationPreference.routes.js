const express = require('express');
const notificationPreferenceController = require('./notificationPreference.controller');
const {
  validateGetPreferences,
  validateUpdatePreferences,
} = require('./notificationPreference.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');

const router = express.Router();

// ─── Notification Preference Routes ────────────────────────────────
router.get('/preferences', authenticate, authenticatedLimiter, validateGetPreferences, notificationPreferenceController.getPreferences);

router.put('/preferences', authenticate, authenticatedLimiter, validateUpdatePreferences, notificationPreferenceController.updatePreferences);

module.exports = router;
