const permissionService = require('./permission.service');
const { MESSAGES } = require('./permission.constants');
const { successResponse } = require('../../utils/response');

class PermissionController {
  listPermissions = async (req, res, next) => {
    try {
      const result = await permissionService.getPermissions(req.query);
      return successResponse(res, 200, MESSAGES.PERMISSIONS_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  createPermission = async (req, res, next) => {
    try {
      const result = await permissionService.createPermission(req.body);
      return successResponse(res, 201, MESSAGES.PERMISSION_CREATED, result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new PermissionController();