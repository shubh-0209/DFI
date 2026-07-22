const announcementRepository = require('./announcement.repository');
const User = require('../user/user.model');
const {
  generateAnnouncementId,
  announcementFormatter,
  announcementFormatterForUser,
} = require('./announcement.utils');
const { TARGET_AUDIENCE, STATUS, MESSAGES, DEFAULTS } = require('./announcement.constants');
const NotFoundError = require('../../utils/errors/NotFoundError');
const ValidationError = require('../../utils/errors/ValidationError');

class AnnouncementService {
  async createAnnouncement(announcementData, createdBy) {
    let targetAudienceValue = announcementData.targetAudience || DEFAULTS.TARGET_AUDIENCE;
    let typeValue = announcementData.type || DEFAULTS.TYPE;
    let priorityValue = announcementData.priority || DEFAULTS.PRIORITY;
    let statusValue = announcementData.status || DEFAULTS.STATUS;

    if (announcementData.scheduledAt && statusValue === STATUS.DRAFT) {
      statusValue = STATUS.SCHEDULED;
    }

    const specificUsers = targetAudienceValue === TARGET_AUDIENCE.SPECIFIC_USERS
      ? announcementData.specificUsers || []
      : [];

    const announcement = await announcementRepository.create({
      ...announcementData,
      announcementId: generateAnnouncementId(),
      type: typeValue,
      priority: priorityValue,
      targetAudience: targetAudienceValue,
      status: statusValue,
      specificUsers,
      createdBy,
      updatedBy: createdBy,
      publishedAt: statusValue === STATUS.PUBLISHED ? new Date() : null,
    });

    if (statusValue === STATUS.PUBLISHED) {
      const { announcementAutomation } = require('./announcement.automation');
      announcementAutomation._notifyAudience(announcement).catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to notify audience for new announcement:', err.message);
      });
    }

    return {
      announcement: announcementFormatter(announcement),
      message: MESSAGES.ANNOUNCEMENT_CREATED,
    };
  }

  async getAnnouncements(query = {}, currentUserId) {
    const {
      page = 1,
      limit = 10,
      sortBy,
      order,
      type,
      priority,
      targetAudience,
      status,
      search,
    } = query;

    const user = await User.findById(currentUserId).select('role');
    const isAdmin = user && ['admin', 'super_admin', 'coordinator'].includes(user.role?.toLowerCase());

    let effectiveTargetAudience = targetAudience;
    if (!targetAudience) {
      if (isAdmin) {
        effectiveTargetAudience = undefined;
      } else {
        effectiveTargetAudience = { $in: [TARGET_AUDIENCE.ALL_USERS, TARGET_AUDIENCE.VOLUNTEERS] };
      }
    }

    // Volunteers only see published, non-expired announcements
    // Admins can filter by status explicitly; if not specified see everything
    let effectiveStatus = status;
    if (!isAdmin && !status) {
      effectiveStatus = STATUS.PUBLISHED;
    }

    const result = await announcementRepository.findActiveAnnouncements({
      page: Number(page),
      limit: Number(limit),
      sortBy: sortBy || 'createdAt',
      order: order || 'desc',
      type,
      priority,
      targetAudience: effectiveTargetAudience,
      status: effectiveStatus,
      search,
    });

    const { announcements, total } = result;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;

    // For volunteers, filter out expired items in-process (belt-and-suspenders)
    const now = new Date();
    const filtered = isAdmin
      ? announcements
      : announcements.filter((a) => !a.expiresAt || a.expiresAt > now);

    return {
      announcements: filtered.map((a) => announcementFormatterForUser(a, currentUserId)),
      total: isAdmin ? total : filtered.length,
      message: MESSAGES.ANNOUNCEMENTS_FETCHED,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: isAdmin ? total : filtered.length,
        totalPages: Math.ceil((isAdmin ? total : filtered.length) / limitNum),
      },
    };
  }

  async getAnnouncement(announcementId, currentUserId) {
    const announcement = await announcementRepository.findByIdentifier(announcementId);

    if (!announcement) {
      throw new NotFoundError(MESSAGES.ANNOUNCEMENT_NOT_FOUND);
    }

    return {
      announcement: announcementFormatterForUser(announcement, currentUserId),
      message: MESSAGES.ANNOUNCEMENT_FETCHED,
    };
  }

  async updateAnnouncement(announcementId, updateData) {
    const announcement = await announcementRepository.findById(announcementId);

    if (!announcement) {
      throw new NotFoundError(MESSAGES.ANNOUNCEMENT_NOT_FOUND);
    }

    if (announcement.status === STATUS.ARCHIVED) {
      throw new ValidationError('Cannot update an archived announcement');
    }

    const updatePayload = { ...updateData };

    if (updatePayload.status === STATUS.PUBLISHED && !announcement.publishedAt) {
      updatePayload.publishedAt = new Date();
    }

    if (updatePayload.targetAudience === TARGET_AUDIENCE.SPECIFIC_USERS) {
      updatePayload.specificUsers = updateData.specificUsers || announcement.specificUsers;
    }

    const updated = await announcementRepository.update(announcementId, updatePayload);

    if (updatePayload.status === STATUS.PUBLISHED && announcement.status !== STATUS.PUBLISHED) {
      const { announcementAutomation } = require('./announcement.automation');
      announcementAutomation._notifyAudience(updated).catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to notify audience for updated announcement:', err.message);
      });
    }

    return {
      announcement: announcementFormatter(updated),
      message: MESSAGES.ANNOUNCEMENT_UPDATED,
    };
  }

  async publishAnnouncement(announcementId) {
    const announcement = await announcementRepository.findById(announcementId);

    if (!announcement) {
      throw new NotFoundError(MESSAGES.ANNOUNCEMENT_NOT_FOUND);
    }

    if (announcement.status === STATUS.PUBLISHED) {
      return {
        announcement: announcementFormatter(announcement),
        message: 'Announcement is already published',
      };
    }

    if (announcement.status === STATUS.ARCHIVED) {
      throw new ValidationError('Cannot publish an archived announcement');
    }

    const updated = await announcementRepository.update(announcementId, {
      status: STATUS.PUBLISHED,
      publishedAt: new Date(),
    });

    const { announcementAutomation } = require('./announcement.automation');
    announcementAutomation._notifyAudience(updated).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Failed to notify audience for published announcement:', err.message);
    });

    return {
      announcement: announcementFormatter(updated),
      message: MESSAGES.ANNOUNCEMENT_PUBLISHED,
    };
  }

  async archiveAnnouncement(announcementId) {
    const announcement = await announcementRepository.findById(announcementId);

    if (!announcement) {
      throw new NotFoundError(MESSAGES.ANNOUNCEMENT_NOT_FOUND);
    }

    if (announcement.status === STATUS.ARCHIVED) {
      return {
        announcement: announcementFormatter(announcement),
        message: 'Announcement is already archived',
      };
    }

    const updated = await announcementRepository.update(announcementId, {
      status: STATUS.ARCHIVED,
    });

    return {
      announcement: announcementFormatter(updated),
      message: MESSAGES.ANNOUNCEMENT_ARCHIVED,
    };
  }

  async expireAnnouncement(announcementId) {
    const announcement = await announcementRepository.findById(announcementId);

    if (!announcement) {
      throw new NotFoundError(MESSAGES.ANNOUNCEMENT_NOT_FOUND);
    }

    if (announcement.status === STATUS.EXPIRED) {
      return {
        announcement: announcementFormatter(announcement),
        message: 'Announcement is already expired',
      };
    }

    const updated = await announcementRepository.update(announcementId, {
      status: STATUS.EXPIRED,
    });

    return {
      announcement: announcementFormatter(updated),
      message: 'Announcement expired successfully',
    };
  }

  async deleteAnnouncement(announcementId) {
    const announcement = await announcementRepository.findById(announcementId);

    if (!announcement) {
      throw new NotFoundError(MESSAGES.ANNOUNCEMENT_NOT_FOUND);
    }

    if (announcement.isDeleted) {
      return {
        message: MESSAGES.ANNOUNCEMENT_DELETED,
      };
    }

    await announcementRepository.softDelete(announcementId);

    return {
      message: MESSAGES.ANNOUNCEMENT_DELETED,
    };
  }

  async searchAnnouncements(searchQuery, options = {}) {
    return announcementRepository.findActiveAnnouncements({
      ...options,
      search: searchQuery.trim(),
    });
  }

  async markRead(announcementId, userId) {
    const announcement = await announcementRepository.findByIdentifier(announcementId);
    if (!announcement) throw new NotFoundError(MESSAGES.ANNOUNCEMENT_NOT_FOUND);
    const updated = await announcementRepository.markReadByUser(announcement._id, userId);
    return {
      announcement: announcementFormatterForUser(updated, userId),
      message: 'Announcement marked as read',
    };
  }

  async pinAnnouncement(announcementId) {
    const announcement = await announcementRepository.findByIdentifier(announcementId);
    if (!announcement) throw new NotFoundError(MESSAGES.ANNOUNCEMENT_NOT_FOUND);
    const updated = await announcementRepository.pinAnnouncement(announcement._id);
    return {
      announcement: announcementFormatter(updated),
      message: 'Announcement pinned',
    };
  }

  async unpinAnnouncement(announcementId) {
    const announcement = await announcementRepository.findByIdentifier(announcementId);
    if (!announcement) throw new NotFoundError(MESSAGES.ANNOUNCEMENT_NOT_FOUND);
    const updated = await announcementRepository.unpinAnnouncement(announcement._id);
    return {
      announcement: announcementFormatter(updated),
      message: 'Announcement unpinned',
    };
  }
}

module.exports = new AnnouncementService();
