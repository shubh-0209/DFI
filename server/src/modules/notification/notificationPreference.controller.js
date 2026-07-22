const notificationPreferenceService = require('./notificationPreference.service');
const { successResponse } = require('../../utils/response');

class NotificationPreferenceController {
  /**
   * Get notification preferences for the current user.
   */
  getPreferences = async (req, res, next) => {
    try {
      const result = await notificationPreferenceService.getPreferences(req.user.id);
      return successResponse(res, 200, result.message, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Update notification preferences for the current user.
   */
  updatePreferences = async (req, res, next) => {
    try {
      const result = await notificationPreferenceService.updatePreferences(req.user.id, req.body);
      return successResponse(res, 200, result.message, result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new NotificationPreferenceController();
