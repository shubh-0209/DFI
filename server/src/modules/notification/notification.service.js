const notificationRepository = require('./notification.repository');
const notificationPreferenceRepository = require('./notificationPreference.repository');
const { generateNotificationId, notificationFormatter } = require('./notification.utils');
const { MESSAGES, DEFAULTS, STATUS, CATEGORY, PRIORITY, NOTIFICATION_TYPES } = require('./notification.constants');
const templates = require('./notification.templates');
const User = require('../../modules/user/user.model');
const NotFoundError = require('../../utils/errors/NotFoundError');
const ValidationError = require('../../utils/errors/ValidationError');

class NotificationService {
  /**
   * Create a new notification.
   * @param {object} notificationData - Notification data.
   * @returns {Promise<object>} Created notification.
   */
  async createNotification(notificationData) {
    const notification = await notificationRepository.create({
      ...notificationData,
      notificationId: generateNotificationId(),
      status: STATUS.PENDING,
      priority: notificationData.priority || DEFAULTS.PRIORITY,
      channel: notificationData.channel || DEFAULTS.CHANNEL,
      isRead: notificationData.isRead !== undefined ? notificationData.isRead : DEFAULTS.IS_READ,
    });

    return {
      notification: notificationFormatter(notification),
      message: MESSAGES.NOTIFICATION_CREATED,
    };
  }

  /**
   * Build a notification payload from a template without persisting it.
   * @param {string} templateKey - Template key from notification.templates.
   * @param {object} templateData - Data required by the template.
   * @returns {object} Notification payload.
   */
  buildNotification(templateKey, templateData = {}) {
    if (!templates[templateKey]) {
      throw new ValidationError(`Notification template '${templateKey}' not found`);
    }

    const payload = templates[templateKey](templateData);

    if (!payload.recipient) {
      throw new ValidationError('Notification recipient is required');
    }

    return payload;
  }

  /**
   * Check if a notification type is enabled for a user based on their preferences.
   * @param {string} userId - User ID.
   * @param {string} type - Notification type.
   * @returns {Promise<boolean>} Whether the notification is enabled.
   */
  async isNotificationEnabled(userId, type) {
    const preferences = await notificationPreferenceRepository.getPreferences(userId);

    if (!preferences) {
      return true;
    }

    if (!preferences.inAppEnabled) {
      return false;
    }

    const typeEnabled = preferences.types?.get(type);
    return typeEnabled !== false;
  }

  /**
   * Create and persist an in-app notification using a template, respecting user preferences.
   * @param {string} templateKey - Template key from notification.templates.
   * @param {object} templateData - Data required by the template.
   * @param {object} overrides - Optional field overrides.
   * @returns {Promise<object>} Created notification or null if disabled.
   */
  async sendInAppNotification(templateKey, templateData = {}, overrides = {}) {
    const payload = this.buildNotification(templateKey, templateData);

    const enabled = await this.isNotificationEnabled(payload.recipient, payload.type);

    if (!enabled) {
      return null;
    }

    const notification = await notificationRepository.create({
      ...payload,
      ...overrides,
      notificationId: generateNotificationId(),
      status: STATUS.SENT,
      sentAt: new Date(),
    });

    return {
      notification: notificationFormatter(notification),
      message: MESSAGES.NOTIFICATION_CREATED,
    };
  }

  /**
   * Trigger a notification event.
   * Alias for sendInAppNotification to provide a semantic API for other modules.
   * @param {string} templateKey - Template key from notification.templates.
   * @param {object} templateData - Data required by the template.
   * @param {object} overrides - Optional field overrides.
   * @returns {Promise<object>} Created notification or null if disabled.
   */
  async triggerNotification(templateKey, templateData = {}, overrides = {}) {
    return this.sendInAppNotification(templateKey, templateData, overrides);
  }

  /**
   * Send bulk in-app notifications to multiple recipients using a template.
   * @param {Array<string>} recipientIds - Array of user IDs.
   * @param {string} templateKey - Template key from notification.templates.
   * @param {object} templateData - Data required by the template.
   * @param {object} overrides - Optional field overrides.
   * @returns {Promise<object>} Created notifications.
   */
  async sendBulkInAppNotification(recipientIds, templateKey, templateData = {}, overrides = {}) {
    if (!Array.isArray(recipientIds) || recipientIds.length === 0) {
      throw new ValidationError('At least one recipient is required');
    }

    const validRecipients = [];
    for (const recipientId of recipientIds) {
      const payload = templates[templateKey]({ ...templateData, recipientId });
      const enabled = await this.isNotificationEnabled(recipientId, payload.type);
      if (enabled) {
        validRecipients.push({
          ...payload,
          ...overrides,
          notificationId: generateNotificationId(),
          status: STATUS.SENT,
          sentAt: new Date(),
        });
      }
    }

    if (validRecipients.length === 0) {
      return {
        notifications: [],
        message: 'No notifications created (all recipients have disabled this type)',
      };
    }

    const createdNotifications = await notificationRepository.bulkCreate(validRecipients);

    return {
      notifications: createdNotifications.map(notificationFormatter),
      message: MESSAGES.NOTIFICATION_CREATED,
    };
  }

  /**
   * Get notifications for a user with advanced filters.
   * @param {string} userId - User ID.
   * @param {object} query - Query parameters.
   * @returns {Promise<object>} Notifications list.
   */
  async getNotifications(userId, query = {}) {
    const {
      type,
      category,
      priority,
      isRead,
      startDate,
      endDate,
      page = DEFAULTS.PAGINATION.PAGE,
      limit = DEFAULTS.PAGINATION.LIMIT,
    } = query;

    const { notifications, total } = await notificationRepository.findNotifications(userId, {
      page: Number(page),
      limit: Number(limit),
      sortBy: query.sortBy || DEFAULTS.PAGINATION.SORT_BY,
      order: query.order || DEFAULTS.PAGINATION.ORDER,
      type,
      category,
      priority,
      isRead,
      startDate,
      endDate,
    });

    return {
      notifications: notifications.map(notificationFormatter),
      total,
      message: MESSAGES.NOTIFICATIONS_FETCHED,
    };
  }

  /**
   * Search notifications by keyword for a user.
   * @param {string} userId - User ID.
   * @param {object} query - Query parameters.
   * @returns {Promise<object>} Search results.
   */
  async searchNotifications(userId, query = {}) {
    const { search, page = DEFAULTS.PAGINATION.PAGE, limit = DEFAULTS.PAGINATION.LIMIT } = query;

    if (!search || search.trim() === '') {
      throw new ValidationError('Search query is required');
    }

    const { notifications, total } = await notificationRepository.findNotifications(userId, {
      page: Number(page),
      limit: Number(limit),
      sortBy: query.sortBy || DEFAULTS.PAGINATION.SORT_BY,
      order: query.order || DEFAULTS.PAGINATION.ORDER,
      search: search.trim(),
    });

    return {
      notifications: notifications.map(notificationFormatter),
      total,
      message: MESSAGES.NOTIFICATIONS_FETCHED,
    };
  }

  /**
   * Get a single notification by ID.
   * @param {string} userId - User ID.
   * @param {string} notificationId - Notification ID.
   * @returns {Promise<object>} Notification data.
   */
  async getNotification(userId, notificationId) {
    const notification = await notificationRepository.findById(notificationId);

    if (!notification || notification.recipient.toString() !== userId.toString()) {
      throw new NotFoundError(MESSAGES.NOTIFICATION_NOT_FOUND);
    }

    return {
      notification: notificationFormatter(notification),
      message: MESSAGES.NOTIFICATION_FETCHED,
    };
  }

  /**
   * Get unread notifications for a user.
   * @param {string} userId - User ID.
   * @param {object} query - Query parameters.
   * @returns {Promise<object>} Unread notifications list.
   */
  async getUnreadNotifications(userId, query = {}) {
    const { page = DEFAULTS.PAGINATION.PAGE, limit = DEFAULTS.PAGINATION.LIMIT } = query;

    const { notifications, total } = await notificationRepository.findUnread(userId, {
      page: Number(page),
      limit: Number(limit),
      sortBy: query.sortBy || DEFAULTS.PAGINATION.SORT_BY,
      order: query.order || DEFAULTS.PAGINATION.ORDER,
    });

    return {
      notifications: notifications.map(notificationFormatter),
      total,
      message: MESSAGES.NOTIFICATIONS_FETCHED,
    };
  }

  /**
   * Count unread notifications for a user.
   * @param {string} userId - User ID.
   * @returns {Promise<object>} Count object.
   */
  async getUnreadCount(userId) {
    const count = await notificationRepository.countUnread(userId);
    return { count };
  }

  /**
   * Mark a notification as read.
   * @param {string} userId - User ID.
   * @param {string} notificationId - Notification ID.
   * @returns {Promise<object>} Updated notification.
   */
  async markAsRead(userId, notificationId) {
    const notification = await notificationRepository.findById(notificationId);

    if (!notification || notification.recipient.toString() !== userId.toString()) {
      throw new NotFoundError(MESSAGES.NOTIFICATION_NOT_FOUND);
    }

    if (notification.isRead) {
      return {
        notification: notificationFormatter(notification),
        message: MESSAGES.NOTIFICATION_UPDATED,
      };
    }

    const updated = await notificationRepository.markAsRead(notificationId);

    return {
      notification: notificationFormatter(updated),
      message: MESSAGES.NOTIFICATION_UPDATED,
    };
  }

  /**
   * Mark all notifications as read for a user.
   * @param {string} userId - User ID.
   * @returns {Promise<object>} Result object.
   */
  async markAllAsRead(userId) {
    const result = await notificationRepository.markAllAsRead(userId);

    return {
      modifiedCount: result.modifiedCount,
      message: MESSAGES.ALL_NOTIFICATIONS_READ,
    };
  }

  /**
   * Soft delete a notification.
   * @param {string} userId - User ID.
   * @param {string} notificationId - Notification ID.
   * @returns {Promise<object>} Deleted notification confirmation.
   */
  async deleteNotification(userId, notificationId) {
    const notification = await notificationRepository.findById(notificationId);

    if (!notification || notification.recipient.toString() !== userId.toString()) {
      throw new NotFoundError(MESSAGES.NOTIFICATION_NOT_FOUND);
    }

    await notificationRepository.softDelete(notificationId, userId);

    return {
      message: MESSAGES.NOTIFICATION_DELETED,
    };
  }

  /**
   * Restore a soft-deleted notification.
   * @param {string} userId - User ID.
   * @param {string} notificationId - Notification ID.
   * @returns {Promise<object>} Restored notification.
   */
  async restoreNotification(userId, notificationId) {
    const notification = await notificationRepository.findById(notificationId);

    if (!notification) {
      throw new NotFoundError(MESSAGES.NOTIFICATION_NOT_FOUND);
    }

    if (notification.recipient.toString() !== userId.toString()) {
      throw new NotFoundError(MESSAGES.NOTIFICATION_NOT_FOUND);
    }

    if (!notification.isDeleted) {
      return {
        notification: notificationFormatter(notification),
        message: 'Notification is not deleted',
      };
    }

    const restored = await notificationRepository.restore(notificationId);

    return {
      notification: notificationFormatter(restored),
      message: 'Notification restored successfully',
    };
  }

  /**
   * Find pending notifications for processing.
   * @param {object} options - Query options.
   * @returns {Promise<Array>} Array of pending notifications.
   */
  async findPendingNotifications(options = {}) {
    return notificationRepository.findPendingNotifications(options);
  }

  /**
   * Mark a notification as sent.
   * @param {string} notificationId - Notification ID.
   * @returns {Promise<object>} Updated notification.
   */
  async markNotificationAsSent(notificationId) {
    const notification = await notificationRepository.markAsSent(notificationId);

    return {
      notification: notificationFormatter(notification),
      message: MESSAGES.NOTIFICATION_UPDATED,
    };
  }

  async broadcastNotification({ recipient, title, message, type, priority, category, actionUrl, icon, sender }) {
    const filter = {};
    if (recipient) {
      filter.recipient = recipient;
    }

    const usersFound = await User.find(filter);
    const users = usersFound.map((u) => u._id);
    const notifications = [];

    for (const userId of users) {
      notifications.push({
        recipient: userId,
        sender,
        title,
        message,
        type: type || 'admin_announcement',
        category: category || CATEGORY.ANNOUNCEMENT,
        priority: priority || PRIORITY.MEDIUM,
        actionUrl,
        icon,
        channel: 'in-app',
        status: STATUS.SENT,
        isRead: false,
        sentAt: new Date(),
        metadata: {},
      });
    }

    const created = await notificationRepository.bulkCreate(notifications);

    return {
      count: created.length,
      message: MESSAGES.NOTIFICATION_CREATED,
    };
  }

  async notifyApplicationApproved(recipientId, programName, applicationId) {
     return this.sendInAppNotification('buildApplicationApproved', { recipientId, programName, applicationId });
  }

  async notifyApplicationRejected(recipientId, programName, applicationId, reason) {
     return this.sendInAppNotification('buildApplicationRejected', { recipientId, programName, applicationId, reason });
  }

  async notifyCertificateGenerated(recipientId, programName, certificateId, certificateNumber) {
     return this.sendInAppNotification('buildCertificateGenerated', { recipientId, programName, certificateId, certificateNumber });
  }

  async notifyRewardEarned(recipientId, rewardType, amount) {
     return this.sendInAppNotification('buildRewardEarned', { recipientId, rewardType, amount });
  }

  async notifyAttendanceMarked(recipientId, programName, attendanceId, totalHours) {
     return this.sendInAppNotification('buildAttendanceMarked', { recipientId, programName, attendanceId, totalHours });
  }

  async notifyProgramReminder(recipientId, programName, programId, dateTime) {
    const payload = {
      recipient: recipientId,
      title: 'Program Reminder',
      message: `Reminder: "${programName}" is coming up on ${dateTime || 'soon'}. Don't forget to attend!`,
      type: 'program_reminder',
      category: CATEGORY.PROGRAM,
      priority: PRIORITY.HIGH,
      channel: 'in-app',
      status: STATUS.SENT,
      relatedEntityType: 'program',
      relatedEntityId: programId,
      metadata: { programName, programId, dateTime },
    };
    const notification = await notificationRepository.create({
      ...payload,
      notificationId: generateNotificationId(),
      sentAt: new Date(),
    });
    return {
      notification: notificationFormatter(notification),
      message: MESSAGES.NOTIFICATION_CREATED,
    };
  }

  async notifyLeaderboardChanged(recipientId, newPosition, leaderboardType) {
     return this.sendInAppNotification('buildLeaderboardPositionChanged', { recipientId, newPosition, leaderboardType });
  }

  async notifyAnnouncement(recipientId, title, message, actionUrl, icon, sender) {
    const payload = {
      recipient: recipientId,
      title: title || 'Announcement',
      message,
      type: NOTIFICATION_TYPES.ADMIN_ANNOUNCEMENT,
      category: CATEGORY.ANNOUNCEMENT,
      priority: PRIORITY.HIGH,
      channel: 'in-app',
      status: STATUS.SENT,
      sender,
      actionUrl,
      icon,
      metadata: {},
    };
    const notification = await notificationRepository.create({
      ...payload,
      notificationId: generateNotificationId(),
      sentAt: new Date(),
    });
    return {
      notification: notificationFormatter(notification),
      message: MESSAGES.NOTIFICATION_CREATED,
    };
  }

  // ── Redemption lifecycle helpers ─────────────────────────────────────────

  async notifyRedemptionConfirmed(recipientId, rewardName, totalCoins, redemptionId) {
    return this.sendInAppNotification('buildRedemptionConfirmed', {
      recipientId, rewardName, totalCoins, redemptionId,
    }).catch(() => {});
  }

  /**
   * Fire the right template based on the new status (approved/shipped/delivered/cancelled).
   * Called by the admin controller after a status update.
   */
  async notifyRedemptionStatusUpdated(recipientId, status, { rewardName, trackingNumber, notes, redemptionId }) {
    const templateMap = {
      approved:  'buildRedemptionApproved',
      shipped:   'buildRedemptionShipped',
      delivered: 'buildRedemptionDelivered',
      cancelled: 'buildRedemptionCancelled',
    };
    const templateKey = templateMap[status];
    if (!templateKey) return null;
    return this.sendInAppNotification(templateKey, {
      recipientId, rewardName, trackingNumber, notes, redemptionId,
    }).catch(() => {});
  }
}

module.exports = new NotificationService();
