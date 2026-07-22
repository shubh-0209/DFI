const gamificationService = require('./gamification.service');
const { MESSAGES } = require('./gamification.constants');
const { successResponse } = require('../../utils/response');

class GamificationController {
  getBadges = async (req, res, next) => {
    try {
      const result = await gamificationService.getBadges(req.user.id, req.query);
      return successResponse(res, 200, MESSAGES.BADGES_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  getAchievements = async (req, res, next) => {
    try {
      const result = await gamificationService.getAchievements(req.user.id, req.query);
      return successResponse(res, 200, MESSAGES.ACHIEVEMENTS_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  getVolunteerLevel = async (req, res, next) => {
    try {
      const result = await gamificationService.getVolunteerLevel(req.user.id);
      return successResponse(res, 200, MESSAGES.LEVEL_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  evaluateGamification = async (req, res, next) => {
    try {
      const result = await gamificationService.evaluateAll(req.user.id);
      return successResponse(res, 200, MESSAGES.EVALUATION_COMPLETED, result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new GamificationController();
