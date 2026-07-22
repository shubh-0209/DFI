const TicketReply = require('./ticket-reply.model');

class TicketReplyRepository {
  async create(data) {
    return TicketReply.create(data);
  }

  async findByTicket(ticketId, options = {}) {
    const { page = 1, limit = 50, sortBy = 'createdAt', order = 'asc' } = options;
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const [replies, total] = await Promise.all([
      TicketReply.find({ ticketId })
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email avatar role'),
      TicketReply.countDocuments({ ticketId }),
    ]);

    return { replies, total };
  }

  async findById(id) {
    return TicketReply.findById(id);
  }

  async findByIdAndTicket(id, ticketId) {
    return TicketReply.findOne({ _id: id, ticketId });
  }

  async update(id, updateData) {
    return TicketReply.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async delete(id) {
    return TicketReply.findByIdAndDelete(id);
  }
}

module.exports = new TicketReplyRepository();
