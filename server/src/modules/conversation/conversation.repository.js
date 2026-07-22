const Conversation = require('./conversation.model');

class ConversationRepository {
  async create(data) {
    return Conversation.create(data);
  }

  async findById(id) {
    return Conversation.findById(id);
  }

  async findByIdAndUser(id, userId) {
    return Conversation.findOne({
      _id: id,
      participants: userId,
      isDeleted: false,
    });
  }

  async findByUser(userId, options = {}) {
    const { page = 1, limit = 20, type, sortBy = 'lastMessageAt', order = 'desc' } = options;
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const filter = {
      participants: userId,
      isDeleted: false,
      ...(type && { type }),
    };

    const [conversations, total] = await Promise.all([
      Conversation.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate('participants', 'name email avatar role volunteerId'),
      Conversation.countDocuments(filter),
    ]);

    return { conversations, total };
  }

  async findExistingConversation(userId, otherUserIds, type = 'private') {
    const allParticipants = [userId, ...otherUserIds].filter(Boolean);
    const count = allParticipants.length;

    return Conversation.findOne({
      type,
      isDeleted: false,
      $expr: {
        $and: [
          { $setIsSubset: [allParticipants, '$participants'] },
          { $eq: [{ $size: '$participants' }, count] },
        ],
      },
    }).populate('participants', 'name email avatar role volunteerId');
  }

  async update(id, updateData) {
    return Conversation.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async softDelete(id, deletedBy) {
    return Conversation.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }

  async findByIds(ids) {
    return Conversation.find({ _id: { $in: ids } });
  }
}

module.exports = new ConversationRepository();
