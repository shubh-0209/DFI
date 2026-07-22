const matchingService = require('./matching.service');
const { MESSAGES } = require('./matching.constants');
const { successResponse } = require('../../utils/response');

class MatchingController {
  getProgramRecommendations = async (req, res, next) => {
    try {
      const result = await matchingService.getProgramRecommendations(req.user, req.query);
      return successResponse(res, 200, MESSAGES.PROGRAMS_RECOMMENDED, result);
    } catch (error) {
      return next(error);
    }
  };

  getVolunteerRecommendations = async (req, res, next) => {
    try {
      const result = await matchingService.getVolunteerRecommendations(req.user, req.query);
      return successResponse(res, 200, MESSAGES.VOLUNTEERS_RECOMMENDED, result);
    } catch (error) {
      return next(error);
    }
  };

  getDetailedRecommendation = async (req, res, next) => {
    try {
      const result = await matchingService.getDetailedRecommendation(req.user, req.query);
      return successResponse(res, 200, MESSAGES.RECOMMENDATION_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  saveRecommendation = async (req, res, next) => {
    try {
      const result = await matchingService.saveRecommendation(req.user, req.body);
      return successResponse(res, 201, MESSAGES.RECOMMENDATION_SAVED, result);
    } catch (error) {
      return next(error);
    }
  };

  unsaveRecommendation = async (req, res, next) => {
    try {
      const result = await matchingService.unsaveRecommendation(req.user, req.params.id);
      return successResponse(res, 200, MESSAGES.RECOMMENDATION_UNSAVED, result);
    } catch (error) {
      return next(error);
    }
  };

  getSavedRecommendations = async (req, res, next) => {
    try {
      const result = await matchingService.getSavedRecommendations(req.user, req.query);
      return successResponse(res, 200, MESSAGES.SAVED_RECOMMENDATIONS_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  getRecommendationHistory = async (req, res, next) => {
    try {
      const result = await matchingService.getRecommendationHistory(req.user, req.query);
      return successResponse(res, 200, MESSAGES.RECOMMENDATION_HISTORY_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  refreshRecommendations = async (req, res, next) => {
    try {
      const type = req.query.type || 'programs';
      const result = await matchingService.refreshRecommendations(req.user, type);
      return successResponse(res, 200, MESSAGES.RECOMMENDATIONS_REFRESHED, { recommendations: result });
    } catch (error) {
      return next(error);
    }
  };

  submitFeedback = async (req, res, next) => {
    try {
      const result = await matchingService.submitFeedback(req.user, req.body);
      return successResponse(res, 200, MESSAGES.FEEDBACK_SUBMITTED, result);
    } catch (error) {
      return next(error);
    }
  };

  dismissRecommendation = async (req, res, next) => {
    try {
      const result = await matchingService.dismissRecommendation(req.user, req.body);
      return successResponse(res, 200, MESSAGES.RECOMMENDATION_DISMISSED, result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new MatchingController();
