const NotificationPreference = require('./notificationPreference.model');

class NotificationPreferenceRepository {
  /**
   * Create default notification preferences for a user.
   * @param {string} userId - User ID.
   * @returns {Promise<NotificationPreference>} Created preferences.
   */
  async createPreferences(userId) {
    return NotificationPreference.create({ user: userId });
  }

  /**
   * Find notification preferences by user ID.
   * @param {string} userId - User ID.
   * @returns {Promise<NotificationPreference|null>} Preferences document.
   */
  async getPreferences(userId) {
    return NotificationPreference.findOne({ user: userId, isDeleted: false });
  }

  /**
   * Update notification preferences.
   * @param {string} userId - User ID.
   * @param {object} updateData - Fields to update.
   * @returns {Promise<NotificationPreference|null>} Updated preferences.
   */
  async updatePreferences(userId, updateData) {
    return NotificationPreference.findOneAndUpdate(
      { user: userId, isDeleted: false },
      updateData,
      { new: true, runValidators: true }
    );
  }

  /**
   * Soft delete notification preferences.
   * @param {string} userId - User ID.
   * @param {string} deletedBy - User ID who deleted.
   * @returns {Promise<NotificationPreference|null>} Deleted preferences.
   */
  async softDelete(userId, deletedBy) {
    return NotificationPreference.findOneAndUpdate(
      { user: userId, isDeleted: false },
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }

  /**
   * Create or update preferences (upsert).
   * @param {string} userId - User ID.
   * @param {object} updateData - Fields to update.
   * @returns {Promise<NotificationPreference>} Updated/created preferences.
   */
  async upsertPreferences(userId, updateData) {
    return NotificationPreference.findOneAndUpdate(
      { user: userId, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true, upsert: true }
    );
  }
}

module.exports = new NotificationPreferenceRepository();
