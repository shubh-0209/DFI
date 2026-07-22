const rewardRedemptionRepository = require('./rewardRedemption.repository');
const NotFoundError = require('../../utils/errors/NotFoundError');

class RewardRedemptionService {
  async createRedemption(redemptionData) {
    return rewardRedemptionRepository.create(redemptionData);
  }

  async getRedemptionHistory(userId, options = {}) {
    return rewardRedemptionRepository.findByUser(userId, options);
  }

  async getRedemptionById(id) {
    const redemption = await rewardRedemptionRepository.findById(id);
    if (!redemption) {
      throw new NotFoundError('Redemption not found');
    }
    return redemption;
  }

  async updateRedemptionStatus(id, status, extra = {}) {
    return rewardRedemptionRepository.updateStatus(id, status, extra);
  }

  async getRedemptionCount(userId) {
    return rewardRedemptionRepository.countByUser(userId);
  }

  // ── Admin methods ────────────────────────────────────────────────────────

  async getAllRedemptions(options = {}) {
    return rewardRedemptionRepository.findAll(options);
  }

  async getRedemptionStatusCounts() {
    return rewardRedemptionRepository.countByStatus();
  }

  /**
   * Admin-side status update. Returns the updated redemption document.
   * `extra` may contain { notes, trackingNumber }.
   */
  async adminUpdateStatus(id, status, extra = {}) {
    const redemption = await rewardRedemptionRepository.findById(id);
    if (!redemption) {
      throw new NotFoundError('Redemption not found');
    }
    return rewardRedemptionRepository.updateStatus(id, status, extra);
  }
}

module.exports = new RewardRedemptionService();
