const rewardTransactionService = require('./rewardTransaction.service');
const { MESSAGES } = require('./rewardTransaction.constants');
const { successResponse } = require('../../utils/response');

class RewardTransactionController {
  /**
   * GET /api/v1/rewards/history
   * Get reward transaction history for the logged-in volunteer.
   */
  getHistory = async (req, res, next) => {
    try {
      const result = await rewardTransactionService.getHistory(req.user.id, req.query);
      return successResponse(res, 200, MESSAGES.TRANSACTIONS_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new RewardTransactionController();
