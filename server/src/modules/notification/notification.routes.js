const express = require('express');
const notificationController = require('./notification.controller');
const notificationPreferenceController = require('./notificationPreference.controller');
const {
  validateGetNotifications,
  validateGetNotification,
  validateSearchNotifications,
  validateMarkAsRead,
  validateMarkAllAsRead,
  validateDeleteNotification,
  validateRestoreNotification,
  validateBroadcastNotification,
  validateCreateNotification,
  validateGetPreferences,
  validateUpdatePreferences,
} = require('./notification.validation');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');

const router = express.Router();

// ─── Notification Routes ─────────────────────────────────────────
router.get('/', authenticate, authenticatedLimiter, validateGetNotifications, notificationController.getNotifications);

router.get('/search', authenticate, authenticatedLimiter, validateSearchNotifications, notificationController.searchNotifications);

router.get('/unread', authenticate, authenticatedLimiter, validateGetNotifications, notificationController.getUnreadNotifications);

router.get('/unread/count', authenticate, authenticatedLimiter, notificationController.getUnreadCount);

router.get('/:id', authenticate, authenticatedLimiter, validateGetNotification, notificationController.getNotification);

router.patch('/:id/read', authenticate, authenticatedLimiter, validateMarkAsRead, notificationController.markAsRead);

router.patch('/read-all', authenticate, authenticatedLimiter, validateMarkAllAsRead, notificationController.markAllAsRead);

router.patch('/:id/restore', authenticate, authenticatedLimiter, validateRestoreNotification, notificationController.restoreNotification);

router.delete('/:id', authenticate, authenticatedLimiter, validateDeleteNotification, notificationController.deleteNotification);

router.post('/notifications', authenticate, authenticatedLimiter, validateCreateNotification, authorize(['admin', 'superadmin']), notificationController.createNotification);

router.post('/broadcast', authenticate, authenticatedLimiter, validateBroadcastNotification, authorize(['admin', 'superadmin']), notificationController.broadcastNotification);

// ─── Notification Preference Routes ───────────────────────────────
router.get('/preferences', authenticate, authenticatedLimiter, validateGetPreferences, notificationPreferenceController.getPreferences);

router.put('/preferences', authenticate, authenticatedLimiter, validateUpdatePreferences, notificationPreferenceController.updatePreferences);

module.exports = router;
