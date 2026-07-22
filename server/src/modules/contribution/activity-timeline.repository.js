const ActivityTimeline = require('./activity-timeline.model');

class ActivityTimelineRepository {
  async create(activityData) {
    return ActivityTimeline.create(activityData);
  }

  async findByUser(userId, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      ActivityTimeline.find({ userId, isDeleted: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ActivityTimeline.countDocuments({ userId, isDeleted: false }),
    ]);

    return { activities, total, page, limit };
  }
}

module.exports = new ActivityTimelineRepository();
