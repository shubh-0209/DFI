const ContributionReward = require('./contribution-reward.model');

class ContributionRewardRepository {
  async create(rewardData) {
    return ContributionReward.create(rewardData);
  }

  async findById(id) {
    return ContributionReward.findById(id);
  }

  async findByContribution(contributionId) {
    return ContributionReward.findOne({ contributionId, isDeleted: false });
  }

  async updateStatus(id, status, failureReason = null) {
    const updateData = { status };
    if (failureReason) {
      updateData.failureReason = failureReason;
    }
    if (status === 'completed') {
      updateData.retryCount = 0;
    } else if (status === 'failed') {
      updateData.retryCount = (await ContributionReward.findById(id)).retryCount + 1;
    }
    return ContributionReward.findByIdAndUpdate(id, updateData, { new: true });
  }

  async updateTransaction(id, rewardTransactionId) {
    return ContributionReward.findByIdAndUpdate(
      id,
      { rewardTransactionId, status: 'completed' },
      { new: true }
    );
  }
}

module.exports = new ContributionRewardRepository();
