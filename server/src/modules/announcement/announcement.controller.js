const announcementService = require('./announcement.service');
const { successResponse } = require('../../utils/response');

class AnnouncementController {
  createAnnouncement = async (req, res, next) => {
    try {
      const result = await announcementService.createAnnouncement(req.body, req.user.id);
      return successResponse(res, 201, result.message, {
        announcement: result.announcement,
      });
    } catch (error) {
      return next(error);
    }
  };

  getAnnouncements = async (req, res, next) => {
    try {
      const { type, priority, targetAudience, status, search, page, limit, sortBy, order } = req.query;
      const result = await announcementService.getAnnouncements(
        {
          type,
          priority,
          targetAudience,
          status,
          search,
          page,
          limit,
          sortBy,
          order,
        },
        req.user.id
      );

      return successResponse(res, 200, result.message, {
        announcements: result.announcements,
        pagination: result.pagination,
      });
    } catch (error) {
      return next(error);
    }
  };

  getAnnouncement = async (req, res, next) => {
    try {
      const result = await announcementService.getAnnouncement(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, result);
    } catch (error) {
      return next(error);
    }
  };

  updateAnnouncement = async (req, res, next) => {
    try {
      const result = await announcementService.updateAnnouncement(req.params.id, req.body);
      return successResponse(res, 200, result.message, {
        announcement: result.announcement,
      });
    } catch (error) {
      return next(error);
    }
  };

  deleteAnnouncement = async (req, res, next) => {
    try {
      const result = await announcementService.deleteAnnouncement(req.params.id);
      return successResponse(res, 200, result.message, {});
    } catch (error) {
      return next(error);
    }
  };

  publishAnnouncement = async (req, res, next) => {
    try {
      const result = await announcementService.publishAnnouncement(req.params.id);
      return successResponse(res, 200, result.message, {
        announcement: result.announcement,
      });
    } catch (error) {
      return next(error);
    }
  };

  archiveAnnouncement = async (req, res, next) => {
    try {
      const result = await announcementService.archiveAnnouncement(req.params.id);
      return successResponse(res, 200, result.message, {
        announcement: result.announcement,
      });
    } catch (error) {
      return next(error);
    }
  };

  markRead = async (req, res, next) => {
    try {
      const result = await announcementService.markRead(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, {
        announcement: result.announcement,
      });
    } catch (error) {
      return next(error);
    }
  };

  pinAnnouncement = async (req, res, next) => {
    try {
      const result = await announcementService.pinAnnouncement(req.params.id);
      return successResponse(res, 200, result.message, {
        announcement: result.announcement,
      });
    } catch (error) {
      return next(error);
    }
  };

  unpinAnnouncement = async (req, res, next) => {
    try {
      const result = await announcementService.unpinAnnouncement(req.params.id);
      return successResponse(res, 200, result.message, {
        announcement: result.announcement,
      });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new AnnouncementController();
