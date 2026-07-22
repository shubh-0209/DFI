const leaderboardService = require('./leaderboard.service');
const { MESSAGES } = require('./leaderboard.constants');
const { successResponse } = require('../../utils/response');

class LeaderboardController {
  getLeaderboard = async (req, res, next) => {
    try {
      const result = await leaderboardService.getLeaderboard(req.query);
      return successResponse(res, 200, MESSAGES.LEADERBOARD_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  getMyRank = async (req, res, next) => {
    try {
      const result = await leaderboardService.getMyRank(req.user.id);
      if (!result) {
        return successResponse(res, 200, MESSAGES.MY_RANK_FETCHED, null);
      }
      return successResponse(res, 200, MESSAGES.MY_RANK_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  refreshLeaderboard = async (req, res, next) => {
    try {
      const result = await leaderboardService.refreshLeaderboard(req.user.id);
      return successResponse(res, 200, MESSAGES.LEADERBOARD_REFRESHED, result);
    } catch (error) {
      return next(error);
    }
  };

  getTopVolunteers = async (req, res, next) => {
    try {
      const result = await leaderboardService.getTopVolunteers(req.query);
      return successResponse(res, 200, MESSAGES.TOP_VOLUNTEERS_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new LeaderboardController();
