const rewardCatalogRepository = require('./rewardCatalog.repository');
const NotFoundError = require('../../utils/errors/NotFoundError');
const ValidationError = require('../../utils/errors/ValidationError');

class RewardCatalogService {
  async getCatalog(filters = {}, options = {}) {
    return rewardCatalogRepository.findAll(filters, options);
  }

  async getRewardById(id) {
    const reward = await rewardCatalogRepository.findById(id);
    if (!reward) {
      throw new NotFoundError('Reward not found');
    }
    return reward;
  }

  async getFeaturedRewards(limit = 10) {
    return rewardCatalogRepository.findFeatured(limit);
  }

  async createReward(rewardData) {
    return rewardCatalogRepository.create(rewardData);
  }

  async updateReward(id, updateData) {
    const reward = await rewardCatalogRepository.findById(id);
    if (!reward) {
      throw new NotFoundError('Reward not found');
    }
    return rewardCatalogRepository.findByIdAndUpdate(id, updateData);
  }

  async redeemReward(userId, rewardId, quantity = 1) {
    const reward = await rewardCatalogRepository.findById(rewardId);
    if (!reward) {
      throw new NotFoundError('Reward not found');
    }
    if (reward.status !== 'active') {
      throw new ValidationError('This reward is currently not available');
    }
    if (reward.stock < quantity) {
      throw new ValidationError('Insufficient stock for this reward');
    }

    await rewardCatalogRepository.updateStock(rewardId, quantity);
    await rewardCatalogRepository.incrementPopularity(rewardId);

    return reward;
  }
}

module.exports = new RewardCatalogService();
