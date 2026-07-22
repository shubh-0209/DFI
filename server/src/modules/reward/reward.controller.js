const rewardService = require('./reward.service');
const { MESSAGES } = require('./reward.constants');
const { successResponse } = require('../../utils/response');

class RewardController {
  /**
   * GET /api/v1/rewards/me
   * Get the reward profile of the logged-in volunteer.
   */
  getMyReward = async (req, res, next) => {
    try {
      const reward = await rewardService.getMyReward(req.user.id);
      const totalCoins = reward?.currentCoins || 0;
      const totalPoints = reward?.currentPoints || 0;
      const currentImpactScore = reward?.currentImpactScore || 0;
      return successResponse(res, 200, MESSAGES.REWARD_FETCHED, {
        // currentCoins is what WalletOverview reads
        currentCoins: totalCoins,
        // keep legacy field names so nothing else breaks
        totalCoins,
        totalPoints,
        currentPoints: totalPoints,
        currentImpactScore,
      });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new RewardController();
