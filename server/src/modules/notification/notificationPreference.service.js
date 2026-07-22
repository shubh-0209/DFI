const notificationPreferenceRepository = require('./notificationPreference.repository');
const { NOTIFICATION_TYPES } = require('./notification.constants');
const ValidationError = require('../../utils/errors/ValidationError');

class NotificationPreferenceService {
  /**
   * Get notification preferences for a user.
   * Creates default preferences if none exist.
   * @param {string} userId - User ID.
   * @returns {Promise<object>} Notification preferences.
   */
  async getPreferences(userId) {
    let preferences = await notificationPreferenceRepository.getPreferences(userId);

    if (!preferences) {
      preferences = await notificationPreferenceRepository.createPreferences(userId);
    }

    return {
      preferences: this._formatPreferences(preferences),
      message: 'Notification preferences retrieved successfully',
    };
  }

  /**
   * Update notification preferences for a user.
   * @param {string} userId - User ID.
   * @param {object} updateData - Preference data to update.
   * @returns {Promise<object>} Updated preferences.
   */
  async updatePreferences(userId, updateData) {
    const allowedFields = [
      'inAppEnabled',
      'emailEnabled',
      'pushEnabled',
      'smsEnabled',
      'types',
      'quietHours',
      'digestFrequency',
    ];

    const safeUpdate = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        safeUpdate[field] = updateData[field];
      }
    }

    if (safeUpdate.types && typeof safeUpdate.types === 'object') {
      const validTypes = Object.values(NOTIFICATION_TYPES);
      const invalidKeys = Object.keys(safeUpdate.types).filter((key) => !validTypes.includes(key));
      if (invalidKeys.length > 0) {
        throw new ValidationError(`Invalid notification types: ${invalidKeys.join(', ')}`);
      }
    }

    if (safeUpdate.quietHours && typeof safeUpdate.quietHours === 'object') {
      if (safeUpdate.quietHours.enabled === false) {
        safeUpdate['quietHours.enabled'] = false;
        delete safeUpdate.quietHours;
      }
    }

    const preferences = await notificationPreferenceRepository.upsertPreferences(userId, safeUpdate);

    return {
      preferences: this._formatPreferences(preferences),
      message: 'Notification preferences updated successfully',
    };
  }

  /**
   * Check if a notification type is enabled for a user.
   * @param {string} userId - User ID.
   * @param {string} type - Notification type.
   * @returns {Promise<boolean>} Whether the notification type is enabled.
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
   * Format preferences for response.
   * @param {object} preferences - Preferences document.
   * @returns {object} Formatted preferences.
   */
  _formatPreferences(preferences) {
    if (!preferences) {
      return null;
    }

    const types = {};
    if (preferences.types && typeof preferences.types.toObject === 'function') {
      const typesObj = preferences.types.toObject();
      for (const [key, value] of Object.entries(typesObj)) {
        types[key] = value;
      }
    } else if (preferences.types) {
      Object.assign(types, preferences.types);
    }

    return {
      id: preferences._id,
      user: preferences.user,
      inAppEnabled: preferences.inAppEnabled,
      emailEnabled: preferences.emailEnabled,
      pushEnabled: preferences.pushEnabled,
      smsEnabled: preferences.smsEnabled,
      types,
      quietHours: preferences.quietHours || null,
      digestFrequency: preferences.digestFrequency,
      createdAt: preferences.createdAt,
      updatedAt: preferences.updatedAt,
    };
  }
}

module.exports = new NotificationPreferenceService();
