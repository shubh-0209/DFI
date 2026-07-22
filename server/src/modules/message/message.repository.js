const Message = require('./message.model');

class MessageRepository {
  async create(data) {
    return Message.create(data);
  }

  async findById(id) {
    return Message.findById(id);
  }

  async findByConversationId(conversationId, options = {}) {
    const { limit = 50, cursor, sortBy = 'createdAt', order = 'asc' } = options;
    const limitNum = Math.min(Number(limit) || 50, 100);

    const filter = {
      conversationId,
      isDeleted: false,
      ...(cursor && {
        [order === 'asc' ? 'createdAt' : '_id']:
          order === 'asc' ? { $gt: new Date(cursor) } : { $lt: new Date(cursor) },
      }),
    };

    const sortField = order === 'asc' ? 'createdAt' : 'createdAt';
    const sortDir = order === 'asc' ? 1 : -1;

    const [messages] = await Promise.all([
      Message.find(filter)
        .sort({ [sortBy === 'createdAt' ? sortField : sortBy]: sortDir })
        .limit(limitNum)
        .populate('senderId', 'name email avatar role'),
      Message.countDocuments(filter),
    ]);

    const totalMsg = await Message.countDocuments(filter);
    const first = messages[0];
    const last = messages[messages.length - 1];

    return {
      messages,
      hasMore: messages.length >= limitNum,
      nextCursor: last ? last.createdAt.toISOString() : null,
      prevCursor: first ? first.createdAt.toISOString() : null,
      total: totalMsg,
    };
  }

  async findPinnedByConversationId(conversationId, limit = 50) {
    return Message.find({
      conversationId,
      isPinned: true,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('senderId', 'name email avatar role');
  }

  async findByIdAndConversation(id, conversationId) {
    return Message.findOne({ _id: id, conversationId, isDeleted: false });
  }

  async update(id, updateData) {
    return Message.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async softDelete(id, deletedBy) {
    return Message.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }

  async markAsRead(messageId, userId) {
    return Message.findByIdAndUpdate(
      messageId,
      { $addToSet: { readBy: { userId, readAt: new Date() } } },
      { new: true }
    );
  }

  async markConversationAsRead(conversationId, userId) {
    return Message.updateMany(
      {
        conversationId,
        isDeleted: false,
        senderId: { $ne: userId },
        'readBy.userId': { $ne: userId },
      },
      { $addToSet: { readBy: { userId, readAt: new Date() } } }
    );
  }

  async searchMessages(conversationId, searchQuery, options = {}) {
    const { page = 1, limit = 50 } = options;
    const skip = (page - 1) * limit;

    const filter = {
      conversationId,
      isDeleted: false,
      $or: [
        { content: { $regex: searchQuery, $options: 'i' } },
        { 'attachments.name': { $regex: searchQuery, $options: 'i' } },
      ],
    };

    const [messages, total] = await Promise.all([
      Message.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('senderId', 'name email avatar role'),
      Message.countDocuments(filter),
    ]);

    return { messages, total };
  }
}

module.exports = new MessageRepository();
