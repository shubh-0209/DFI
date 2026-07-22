const SupportTicket = require('./support-ticket.model');

const generateTicketId = () => {
  const { v4: uuidv4 } = require('uuid');
  const prefix = 'TKT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = uuidv4().split('-')[0].toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

class SupportTicketRepository {
  async create(data) {
    return SupportTicket.create({ ...data, ticketId: generateTicketId() });
  }

  async findById(id) {
    return SupportTicket.findById(id);
  }

  async findByUser(userId, options = {}) {
    const { page = 1, limit = 20, status, sortBy = 'createdAt', order = 'desc' } = options;
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const filter = { userId, isDeleted: false, ...(status && { status }) };

    const [tickets, total] = await Promise.all([
      SupportTicket.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate('assignedTo', 'name email avatar role')
        .populate('conversationId'),
      SupportTicket.countDocuments(filter),
    ]);

    return { tickets, total };
  }

  async findAll(options = {}) {
    const { page = 1, limit = 20, status, priority, assignedTo, sortBy = 'createdAt', order = 'desc' } = options;
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const filter = { isDeleted: false };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const [tickets, total] = await Promise.all([
      SupportTicket.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email avatar role')
        .populate('assignedTo', 'name email avatar role')
        .populate('conversationId'),
      SupportTicket.countDocuments(filter),
    ]);

    return { tickets, total };
  }

  async update(id, updateData) {
    return SupportTicket.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async softDelete(id, deletedBy) {
    return SupportTicket.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }

  async findByIdAndUser(id, userId) {
    return SupportTicket.findOne({ _id: id, userId, isDeleted: false });
  }

  async search(query = {}) {
    const { search, page = 1, limit = 20, status, priority, category, assignedTo, sortBy = 'createdAt', order = 'desc' } = query;
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const filter = { isDeleted: false };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (assignedTo) filter.assignedTo = assignedTo;

    if (search) {
      filter.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ticketId: { $regex: search, $options: 'i' } },
      ];
    }

    const [tickets, total] = await Promise.all([
      SupportTicket.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email avatar role')
        .populate('assignedTo', 'name email avatar role')
        .populate('conversationId'),
      SupportTicket.countDocuments(filter),
    ]);

    return { tickets, total };
  }
}

module.exports = new SupportTicketRepository();
