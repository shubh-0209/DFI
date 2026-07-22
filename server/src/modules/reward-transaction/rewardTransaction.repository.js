const RewardTransaction = require('./rewardTransaction.model');

class RewardTransactionRepository {
  async create(txnData) {
    return RewardTransaction.create(txnData);
  }

  async findByUser(userId, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      RewardTransaction.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('program', 'title programId')
        .populate('certificate', 'certificateNumber')
        .lean(),
      RewardTransaction.countDocuments({ user: userId }),
    ]);

    return { transactions, total, page, limit };
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      RewardTransaction.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email volunteerId')
        .populate('program', 'title programId')
        .lean(),
      RewardTransaction.countDocuments(filters),
    ]);

    return { transactions, total, page, limit };
  }
}

module.exports = new RewardTransactionRepository();
