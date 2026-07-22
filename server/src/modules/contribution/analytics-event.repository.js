const AnalyticsEvent = require('./analytics-event.model');

class AnalyticsEventRepository {
  async create(eventData) {
    return AnalyticsEvent.create(eventData);
  }

  async findEvents(options = {}) {
    const { page = 1, limit = 10, eventType, entityType, userId } = options;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };
    if (eventType) query.eventType = eventType;
    if (entityType) query.entityType = entityType;
    if (userId) query.userId = userId;

    const [events, total] = await Promise.all([
      AnalyticsEvent.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      AnalyticsEvent.countDocuments(query),
    ]);

    return { events, total, page, limit };
  }
}

module.exports = new AnalyticsEventRepository();
