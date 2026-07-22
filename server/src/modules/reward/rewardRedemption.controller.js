const rewardRedemptionService = require('./rewardRedemption.service');
const { MESSAGES } = require('./reward.constants');
const { successResponse, errorResponse } = require('../../utils/response');
const notificationService = require('../notification/notification.service');

class RewardRedemptionController {
  // ── User-facing ──────────────────────────────────────────────────────────

  getRedemptionHistory = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const options = {
        page:   Number(req.query.page)  || 1,
        limit:  Number(req.query.limit) || 10,
        status: req.query.status        || 'all',
      };
      const result = await rewardRedemptionService.getRedemptionHistory(userId, options);
      return successResponse(res, 200, MESSAGES.TRANSACTIONS_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  getRedemptionById = async (req, res, next) => {
    try {
      const redemption = await rewardRedemptionService.getRedemptionById(req.params.id);
      return successResponse(res, 200, 'Redemption details retrieved', redemption);
    } catch (error) {
      return next(error);
    }
  };

  // ── Admin-facing ─────────────────────────────────────────────────────────

  /**
   * GET /admin/redemptions
   * Returns all redemptions across all users, paginated, with optional
   * status and search filters.
   */
  getAllRedemptions = async (req, res, next) => {
    try {
      const options = {
        page:   Number(req.query.page)  || 1,
        limit:  Number(req.query.limit) || 20,
        status: req.query.status        || 'all',
        search: req.query.search        || '',
      };
      const result = await rewardRedemptionService.getAllRedemptions(options);

      // Attach status counts so the admin page can show badge numbers without
      // a separate request.
      const statusCounts = await rewardRedemptionService.getRedemptionStatusCounts();
      return successResponse(res, 200, MESSAGES.REDEMPTIONS_FETCHED, {
        ...result,
        statusCounts,
      });
    } catch (error) {
      return next(error);
    }
  };

  /**
   * PATCH /admin/redemptions/:id/status
   * Body: { status, notes?, trackingNumber? }
   * Advances the redemption lifecycle and fires a notification to the user.
   */
  adminUpdateRedemptionStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, notes = '', trackingNumber = '' } = req.body;

      const VALID_STATUSES = ['approved', 'shipped', 'delivered', 'cancelled'];
      if (!VALID_STATUSES.includes(status)) {
        return errorResponse(res, 400, `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
      }

      const updated = await rewardRedemptionService.adminUpdateStatus(id, status, {
        notes,
        trackingNumber,
      });

      // Notify the volunteer — non-blocking
      if (updated?.user) {
        const userId      = updated.user._id || updated.user;
        const rewardName  = updated.rewardSnapshot?.name || 'your reward';
        const redemptionId = updated.redemptionId;

        notificationService.notifyRedemptionStatusUpdated(userId, status, {
          rewardName,
          trackingNumber,
          notes,
          redemptionId,
        }).catch(() => {});
      }

      return successResponse(res, 200, MESSAGES.REDEMPTION_STATUS_UPDATED, updated);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new RewardRedemptionController();
