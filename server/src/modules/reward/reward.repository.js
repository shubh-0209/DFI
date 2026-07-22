const Reward = require('./reward.model');
const { generateRewardId } = require('./reward.utils');

class RewardRepository {
  async create(rewardData) {
    return Reward.create(rewardData);
  }

  async findByUser(userId) {
    return Reward.findOne({ user: userId }).populate('user', 'name email volunteerId');
  }

  async update(userId, updateData) {
    return Reward.findOneAndUpdate({ user: userId }, updateData, {
      new: true,
      runValidators: true,
      upsert: false,
    });
  }

  /**
   * Atomically increment reward fields. Creates the reward profile if it
   * doesn't exist yet (upsert). Safe to call without a prior findByUser check.
   */
  async incrementCoins(userId, coinsToAdd) {
    const existing = await this.findByUser(userId);
    if (existing) {
      return this.update(userId, {
        currentCoins: (existing.currentCoins || 0) + coinsToAdd,
      });
    }
    return this.create({
      rewardId: generateRewardId(),
      user: userId,
      currentCoins: coinsToAdd,
      currentPoints: 0,
      currentImpactScore: 0,
    });
  }
}

module.exports = new RewardRepository();
