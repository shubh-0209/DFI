const ContributionStatistics = require('./contribution-statistics.model');

class ContributionStatisticsRepository {
  async create(statisticsData) {
    return ContributionStatistics.create(statisticsData);
  }

  async findByUser(userId) {
    return ContributionStatistics.findOne({ userId, isDeleted: false });
  }

  async update(userId, updateData) {
    return ContributionStatistics.findOneAndUpdate(
      { userId, isDeleted: false },
      { $set: updateData },
      { new: true, upsert: true }
    );
  }

  async increment(userId, updateData) {
    return ContributionStatistics.findOneAndUpdate(
      { userId, isDeleted: false },
      { $inc: updateData },
      { new: true, upsert: true }
    );
  }
}

module.exports = new ContributionStatisticsRepository();
