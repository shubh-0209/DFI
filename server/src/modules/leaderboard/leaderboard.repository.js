const Leaderboard = require('./leaderboard.model');

class LeaderboardRepository {
  async create(leaderboardData) {
    return Leaderboard.create(leaderboardData);
  }

  async findByUser(userId) {
    return Leaderboard.findOne({ user: userId, isDeleted: false });
  }

  async findUserRank(userId, rankField = 'nationalRank') {
    const entry = await Leaderboard.findOne({ user: userId, isDeleted: false }).lean();
    if (!entry) return null;
    return {
      ...entry,
      rank: entry[rankField] || null,
    };
  }

  async findLeaderboard(filters = {}, options = {}) {
    const { page = 1, limit = 50, sortBy = 'currentRank', sortOrder = 'asc' } = options;
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [leaderboard, total] = await Promise.all([
      Leaderboard.find({ ...filters, isDeleted: false })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email volunteerId city state')
        .lean(),
      Leaderboard.countDocuments({ ...filters, isDeleted: false }),
    ]);

    return { leaderboard, total, page, limit };
  }

  async findTopUsers(rankField = 'currentRank', limit = 10, filters = {}) {
    return Leaderboard.find({ ...filters, isDeleted: false, [rankField]: { $ne: null } })
      .sort({ [rankField]: 1 })
      .limit(limit)
      .populate('user', 'name email volunteerId city state')
      .lean();
  }

  async update(userId, updateData) {
    return Leaderboard.findOneAndUpdate(
      { user: userId, isDeleted: false },
      updateData,
      { new: true, runValidators: true }
    );
  }

  async bulkUpsert(entries) {
    const bulkOps = entries.map((entry) => ({
      updateOne: {
        filter: { user: entry.user, isDeleted: false },
        update: {
          $set: {
            ...entry,
            updatedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    if (bulkOps.length === 0) return { modified: 0, upserted: 0 };

    const result = await Leaderboard.bulkWrite(bulkOps, { ordered: false });
    return {
      modified: result.modifiedCount || 0,
      upserted: result.upsertedCount || 0,
    };
  }

  async softDelete(id, deletedById) {
    return Leaderboard.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedById },
      { new: true }
    );
  }

  async deleteMany(filters) {
    return Leaderboard.deleteMany(filters);
  }

  async countDocuments(filters = {}) {
    return Leaderboard.countDocuments({ ...filters, isDeleted: false });
  }

  async aggregate(pipeline) {
    return Leaderboard.aggregate(pipeline);
  }
}

module.exports = new LeaderboardRepository();
