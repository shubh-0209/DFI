const RewardRedemption = require('./rewardRedemption.model');

class RewardRedemptionRepository {
  async create(redemptionData) {
    return RewardRedemption.create(redemptionData);
  }

  async findByUser(userId, options = {}) {
    const { page = 1, limit = 10, status } = options;
    const skip = (page - 1) * limit;

    const query = { user: userId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const [redemptions, total] = await Promise.all([
      RewardRedemption.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('reward', 'name category image coinCost')
        .lean(),
      RewardRedemption.countDocuments(query),
    ]);

    return { redemptions, total, page, limit };
  }

  async findById(id) {
    return RewardRedemption.findById(id).populate('reward', 'name category image coinCost termsAndConditions estimatedDelivery').lean();
  }

  async updateStatus(id, status, extra = {}) {
    const updateData = { status, ...extra };
    if (status === 'approved') updateData.approvedAt = new Date();
    if (status === 'shipped') updateData.shippedAt = new Date();
    if (status === 'delivered') updateData.deliveredAt = new Date();
    if (status === 'cancelled') updateData.cancelledAt = new Date();

    return RewardRedemption.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async countByUser(userId) {
    return RewardRedemption.countDocuments({ user: userId });
  }

  // ── Admin methods ────────────────────────────────────────────────────────

  /**
   * Return all redemptions across all users, with optional status filter and
   * pagination. Populates user name/email and reward name for the admin table.
   */
  async findAll(options = {}) {
    const { page = 1, limit = 20, status, search } = options;
    const skip = (page - 1) * limit;

    const query = {};
    if (status && status !== 'all') query.status = status;

    // If admin searches by redemptionId or user name we do a two-step approach:
    // first resolve matching user IDs then filter.
    if (search && search.trim()) {
      // Allow searching by the human-readable redemptionId prefix
      query.redemptionId = { $regex: search.trim(), $options: 'i' };
    }

    const [redemptions, total] = await Promise.all([
      RewardRedemption.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email')
        .populate('reward', 'name category image coinCost')
        .lean(),
      RewardRedemption.countDocuments(query),
    ]);

    return { redemptions, total, page, limit };
  }

  async countByStatus() {
    const result = await RewardRedemption.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    // Normalise into { pending: N, approved: N, ... }
    return result.reduce((acc, { _id, count }) => {
      acc[_id] = count;
      return acc;
    }, {});
  }
}

module.exports = new RewardRedemptionRepository();
