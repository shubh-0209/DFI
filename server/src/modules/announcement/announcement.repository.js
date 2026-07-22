const Announcement = require('./announcement.model');
const mongoose = require('mongoose');

class AnnouncementRepository {
  async create(announcementData) {
    return Announcement.create(announcementData);
  }

  async findById(id) {
    return Announcement.findById(id);
  }

  async findActiveAnnouncements(options = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
      type,
      priority,
      targetAudience,
      status,
      search,
    } = options;

    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const filter = { isDeleted: false };

    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (targetAudience) filter.targetAudience = targetAudience;
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    // Pinned items first, then by the requested sort field
    const [announcements, total] = await Promise.all([
      Announcement.find(filter)
        .select('announcementId title message type priority status targetAudience isPinned createdAt readBy createdBy')
        .sort({ isPinned: -1, [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email role'),
      Announcement.countDocuments(filter),
    ]);

    return { announcements, total };
  }

  async findByIdentifier(identifier) {
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier) && String(new mongoose.Types.ObjectId(identifier)) === identifier;
    const query = { isDeleted: false };
    if (isObjectId) {
      query.$or = [{ _id: identifier }, { announcementId: identifier }];
    } else {
      query.announcementId = identifier;
    }
    return Announcement.findOne(query);
  }

  async update(id, updateData) {
    return Announcement.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Add a userId to the readBy array (idempotent — $addToSet prevents duplicates).
   */
  async markReadByUser(announcementId, userId) {
    return Announcement.findByIdAndUpdate(
      announcementId,
      { $addToSet: { readBy: new mongoose.Types.ObjectId(userId) } },
      { new: true }
    );
  }

  /**
   * Ensure only one announcement is pinned at a time.
   * Unpins all others, then pins the target.
   */
  async pinAnnouncement(id) {
    await Announcement.updateMany({ isPinned: true, _id: { $ne: id } }, { isPinned: false });
    return Announcement.findByIdAndUpdate(id, { isPinned: true }, { new: true });
  }

  async unpinAnnouncement(id) {
    return Announcement.findByIdAndUpdate(id, { isPinned: false }, { new: true });
  }

  async softDelete(id, deletedBy) {
    return Announcement.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }

  async restore(id) {
    return Announcement.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: null },
      { new: true }
    );
  }
}

module.exports = new AnnouncementRepository();
