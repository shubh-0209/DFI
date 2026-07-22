const TicketHistory = require('./ticket-history.model');

class TicketHistoryRepository {
  async create(data) {
    return TicketHistory.create(data);
  }

  async findByTicket(ticketId, query = {}) {
    const { page = 1, limit = 50, action, field, userId } = query;
    const skip = (page - 1) * limit;

    const filter = { ticketId };
    if (action) filter.action = action;
    if (field) filter.field = field;
    if (userId) filter.userId = userId;

    const [history, total] = await Promise.all([
      TicketHistory.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email avatar role'),
      TicketHistory.countDocuments(filter),
    ]);

    return { history, total };
  }

  async findById(id) {
    return TicketHistory.findById(id);
  }
}

module.exports = new TicketHistoryRepository();
