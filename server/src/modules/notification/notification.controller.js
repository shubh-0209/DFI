const notificationService = require('./notification.service');
const { MESSAGES } = require('./notification.constants');
const { successResponse } = require('../../utils/response');

class NotificationController {
  createNotification = async (req, res, next) => {
    try {
      const result = await notificationService.createNotification(req.body);
      return successResponse(res, 201, result.message, {
        notification: result.notification,
      });
    } catch (error) {
      return next(error);
    }
  };

  getNotifications = async (req, res, next) => {
    try {
      const { type, category, priority, isRead, startDate, endDate, page, limit, sortBy, order } = req.query;
      const result = await notificationService.getNotifications(req.user.id, {
        type,
        category,
        priority,
        isRead,
        startDate,
        endDate,
        page,
        limit,
        sortBy,
        order,
      });

      const { notifications, total } = result;
      const limitNum = Number(limit) || 10;
      const pageNum = Number(page) || 1;

      return successResponse(res, 200, MESSAGES.NOTIFICATIONS_FETCHED, {
        notifications,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      return next(error);
    }
  };

  getNotification = async (req, res, next) => {
    try {
      const result = await notificationService.getNotification(req.user.id, req.params.id);
      return successResponse(res, 200, result.message, result);
    } catch (error) {
      return next(error);
    }
  };

  searchNotifications = async (req, res, next) => {
    try {
      const { search, page, limit, sortBy, order } = req.query;
      const result = await notificationService.searchNotifications(req.user.id, {
        search,
        page,
        limit,
        sortBy,
        order,
      });

      const { notifications, total } = result;
      const limitNum = Number(limit) || 10;
      const pageNum = Number(page) || 1;

      return successResponse(res, 200, MESSAGES.NOTIFICATIONS_FETCHED, {
        notifications,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      return next(error);
    }
  };

  getUnreadNotifications = async (req, res, next) => {
    try {
      const { page, limit, sortBy, order } = req.query;
      const result = await notificationService.getUnreadNotifications(req.user.id, {
        page,
        limit,
        sortBy,
        order,
      });

      const { notifications, total } = result;
      const limitNum = Number(limit) || 10;
      const pageNum = Number(page) || 1;

      return successResponse(res, 200, MESSAGES.NOTIFICATIONS_FETCHED, {
        notifications,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      return next(error);
    }
  };

  getUnreadCount = async (req, res, next) => {
    try {
      const result = await notificationService.getUnreadCount(req.user.id);
      return successResponse(res, 200, 'Unread count retrieved successfully', result);
    } catch (error) {
      return next(error);
    }
  };

  markAsRead = async (req, res, next) => {
    try {
      const result = await notificationService.markAsRead(req.user.id, req.params.id);
      return successResponse(res, 200, result.message, result);
    } catch (error) {
      return next(error);
    }
  };

  markAllAsRead = async (req, res, next) => {
    try {
      const result = await notificationService.markAllAsRead(req.user.id);
      return successResponse(res, 200, result.message, result);
    } catch (error) {
      return next(error);
    }
  };

  deleteNotification = async (req, res, next) => {
    try {
      const result = await notificationService.deleteNotification(req.user.id, req.params.id);
      return successResponse(res, 200, result.message, result);
    } catch (error) {
      return next(error);
    }
  };

  restoreNotification = async (req, res, next) => {
    try {
      const result = await notificationService.restoreNotification(req.user.id, req.params.id);
      return successResponse(res, 200, result.message, result);
    } catch (error) {
      return next(error);
    }
  };

  broadcastNotification = async (req, res, next) => {
    try {
      const { title, message, type, priority, category, actionUrl, icon } = req.body;
      const adminId = req.user.id;

      const result = await notificationService.broadcastNotification({
        title,
        message,
        type,
        priority,
        category,
        actionUrl,
        icon,
        sender: adminId,
      });

      return successResponse(res, 200, 'Broadcast notification sent successfully', {
        adminId,
        ...result,
      });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new NotificationController();
