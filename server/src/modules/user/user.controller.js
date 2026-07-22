const userService = require('./user.service');
const { MESSAGES } = require('./user.constants');
const { successResponse } = require('../../utils/response');

class UserController {
  /**
   * Get current logged-in user profile.
   */
  getCurrentProfile = async (req, res, next) => {
    try {
      const result = await userService.getCurrentProfile(req.user.id);
      return successResponse(res, 200, MESSAGES.PROFILE_RETRIEVED, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Update user profile.
   */
  updateProfile = async (req, res, next) => {
    try {
      const result = await userService.updateProfile(req.user.id, req.body);
      return successResponse(res, 200, MESSAGES.PROFILE_UPDATED, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Upload profile photo.
   */
  uploadProfilePhoto = async (req, res, next) => {
    try {
      const result = await userService.uploadProfilePhoto(req.user.id, req.file);
      return successResponse(res, 200, MESSAGES.PROFILE_PHOTO_UPLOADED, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Upload resume.
   */
  uploadResume = async (req, res, next) => {
    try {
      const result = await userService.uploadResume(req.user.id, req.file);
      return successResponse(res, 200, MESSAGES.RESUME_UPLOADED, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Get public profile by username.
   */
  getPublicProfile = async (req, res, next) => {
    try {
      const result = await userService.getPublicProfile(req.params.username);
      return successResponse(res, 200, MESSAGES.PUBLIC_PROFILE_RETRIEVED, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Search users (Admin/Coordinator only).
   */
  searchUsers = async (req, res, next) => {
    try {
      const { page, limit, sortBy, order, ...filters } = req.query;
      const result = await userService.searchUsers(filters, { page, limit, sortBy, order });
      return successResponse(res, 200, MESSAGES.USERS_FOUND, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Get profile completion breakdown for current user.
   */
  getProfileCompletion = async (req, res, next) => {
    try {
      const result = await userService.getProfileCompletion(req.user.id);
      return successResponse(res, 200, MESSAGES.PROFILE_COMPLETION_RETRIEVED, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Get volunteer statistics for current user.
   */
  getVolunteerStatistics = async (req, res, next) => {
    try {
      const result = await userService.getVolunteerStatistics(req.user.id);
      return successResponse(res, 200, MESSAGES.STATISTICS_RETRIEVED, result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new UserController();
