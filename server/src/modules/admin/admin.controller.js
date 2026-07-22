const adminService = require('./admin.service');
const { MESSAGES } = require('./admin.constants');
const { successResponse } = require('../../utils/response');

class AdminController {
  /**
   * GET /api/v1/admin/users
   * Get all users with pagination, search, filters, and sorting.
   */
  getAllUsers = async (req, res, next) => {
    try {
      const result = await adminService.getAllUsers(req.query);
      return successResponse(res, 200, MESSAGES.USERS_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * GET /api/v1/admin/users/statistics
   * Get dashboard statistics.
   */
  getDashboardStatistics = async (req, res, next) => {
    try {
      const result = await adminService.getDashboardStatistics();
      return successResponse(res, 200, MESSAGES.STATISTICS_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * GET /api/v1/admin/users/:id
   * Get full details for a specific user.
   */
  getUserDetails = async (req, res, next) => {
    try {
      const result = await adminService.getUserDetails(req.params.id);
      return successResponse(res, 200, MESSAGES.USER_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * PATCH /api/v1/admin/users/:id/status
   * Update a user's account status.
   */
  changeUserStatus = async (req, res, next) => {
    try {
      const result = await adminService.changeUserStatus(
        req.params.id,
        req.user.id,
        req.body.status
      );
      return successResponse(res, 200, MESSAGES.STATUS_UPDATED, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * PATCH /api/v1/admin/users/:id/role
   * Update a user's role.
   */
  changeUserRole = async (req, res, next) => {
    try {
      const result = await adminService.changeUserRole(req.params.id, req.user.id, req.body.role);
      return successResponse(res, 200, MESSAGES.ROLE_UPDATED, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * DELETE /api/v1/admin/users/:id
   * Soft delete a user.
   */
  deleteUser = async (req, res, next) => {
    try {
      const result = await adminService.deleteUser(req.params.id, req.user.id);
      return successResponse(res, 200, MESSAGES.USER_DELETED, result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * PATCH /api/v1/admin/users/:id/restore
   * Restore a soft-deleted user.
   */
  restoreUser = async (req, res, next) => {
    try {
      const result = await adminService.restoreUser(req.params.id);
      return successResponse(res, 200, MESSAGES.USER_RESTORED, result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new AdminController();
