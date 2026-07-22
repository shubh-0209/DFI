const Notification = require('./notification.model');

class NotificationRepository {
  /**
   * Create a new notification.
   * @param {object} notificationData - Notification data.
   * @returns {Promise<Notification>} The created notification.
   */
  async create(notificationData) {
    const data = { ...notificationData };
    if (!data.expiresAt) {
      const now = new Date();
      if (data.isRead) {
        data.expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      } else {
        data.expiresAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      }
    }
    return Notification.create(data);
  }

  /**
   * Create multiple notifications in bulk.
   * @param {array} notificationsData - Array of notification data.
   * @returns {Promise<Array>} Created notifications.
   */
  async bulkCreate(notificationsData) {
    const now = new Date();
    const formatted = notificationsData.map((data) => {
      const copy = { ...data };
      if (!copy.expiresAt) {
        if (copy.isRead) {
          copy.expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        } else {
          copy.expiresAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        }
      }
      return copy;
    });
    return Notification.insertMany(formatted);
  }

  /**
   * Find a notification by ID.
   * @param {string} id - Notification ID.
   * @returns {Promise<Notification|null>} The notification document.
   */
  async findById(id) {
    return Notification.findById(id);
  }

  /**
   * Find notifications for a specific user with advanced filters.
   * @param {string} userId - User ID.
   * @param {object} options - Query options.
   * @returns {Promise<object>} Notifications with pagination.
   */
  async findNotifications(userId, options = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
      type,
      category,
      priority,
      isRead,
      startDate,
      endDate,
      search,
      includeDeleted = false,
    } = options;

    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const filter = { recipient: userId };

    if (!includeDeleted) {
      filter.isDeleted = false;
    }

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (isRead !== undefined && isRead !== '') {
      filter.isRead = isRead === 'true';
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments(filter),
    ]);

    return { notifications, total };
  }

  /**
   * Find notifications for a specific user (legacy method).
   * @param {string} userId - User ID.
   * @param {object} options - Pagination options.
   * @returns {Promise<object>} Notifications with pagination.
   */
  async findByUser(userId, options = {}) {
    return this.findNotifications(userId, options);
  }

  /**
   * Find unread notifications for a specific user.
   * @param {string} userId - User ID.
   * @param {object} options - Pagination options.
   * @returns {Promise<object>} Unread notifications with pagination.
   */
  async findUnread(userId, options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = options;
    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const [notifications, total] = await Promise.all([
      Notification.find({ recipient: userId, isRead: false, isDeleted: false })
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments({ recipient: userId, isRead: false, isDeleted: false }),
    ]);

    return { notifications, total };
  }

  /**
   * Count unread notifications for a user.
   * @param {string} userId - User ID.
   * @returns {Promise<number>} Unread count.
   */
  async countUnread(userId) {
    return Notification.countDocuments({ recipient: userId, isRead: false, isDeleted: false });
  }

  /**
   * Find pending notifications that need to be sent.
   * @param {object} options - Query options.
   * @returns {Promise<Array>} Array of pending notifications.
   */
  async findPendingNotifications(options = {}) {
    const { limit = 100 } = options;
    return Notification.find({ status: 'pending', isDeleted: false })
      .sort({ createdAt: 1 })
      .limit(limit);
  }

  /**
   * Update a notification by ID.
   * @param {string} id - Notification ID.
   * @param {object} updateData - Data to update.
   * @returns {Promise<Notification|null>} The updated notification.
   */
  async update(id, updateData) {
    return Notification.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Mark a notification as sent.
   * @param {string} id - Notification ID.
   * @returns {Promise<Notification|null>} The updated notification.
   */
  async markAsSent(id) {
    return Notification.findByIdAndUpdate(
      id,
      { status: 'sent', sentAt: new Date() },
      { new: true, runValidators: true }
    );
  }

  /**
   * Mark a notification as failed.
   * @param {string} id - Notification ID.
   * @param {string} failureReason - Reason for failure.
   * @returns {Promise<Notification|null>} The updated notification.
   */
  async markAsFailed(id, failureReason) {
    return Notification.findByIdAndUpdate(
      id,
      { status: 'failed', failureReason },
      { new: true, runValidators: true }
    );
  }

  /**
   * Mark a notification as read.
   * @param {string} id - Notification ID.
   * @returns {Promise<Notification|null>} The updated notification.
   */
  async markAsRead(id) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return Notification.findByIdAndUpdate(
      id,
      { isRead: true, readAt: now, expiresAt },
      { new: true, runValidators: true }
    );
  }

  /**
   * Mark all notifications as read for a user.
   * @param {string} userId - User ID.
   * @returns {Promise<object>} Update result.
   */
  async markAllAsRead(userId) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true, readAt: now, expiresAt }
    );
  }

  /**
   * Soft delete a notification.
   * @param {string} id - Notification ID.
   * @param {string} deletedBy - User ID who deleted.
   * @returns {Promise<Notification|null>} The deleted notification.
   */
  async softDelete(id, deletedBy) {
    return Notification.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }

  /**
   * Restore a soft-deleted notification.
   * @param {string} id - Notification ID.
   * @returns {Promise<Notification|null>} The restored notification.
   */
  async restore(id) {
    return Notification.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: null },
      { new: true }
    );
  }
}

module.exports = new NotificationRepository();
