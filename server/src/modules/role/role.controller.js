const roleService = require('./role.service');
const { MESSAGES } = require('./role.constants');
const { successResponse } = require('../../utils/response');

class RoleController {
  createRole = async (req, res, next) => {
    try {
      const result = await roleService.createRole(req.user.id, req.body);
      return successResponse(res, 201, MESSAGES.ROLE_CREATED, result);
    } catch (error) {
      return next(error);
    }
  };

  listRoles = async (req, res, next) => {
    try {
      const result = await roleService.getRoles(req.query);
      return successResponse(res, 200, MESSAGES.ROLES_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  getRole = async (req, res, next) => {
    try {
      const result = await roleService.getRole(req.params.id);
      return successResponse(res, 200, MESSAGES.ROLE_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  updateRole = async (req, res, next) => {
    try {
      const result = await roleService.updateRole(req.user.id, req.params.id, req.body);
      return successResponse(res, 200, MESSAGES.ROLE_UPDATED, result);
    } catch (error) {
      return next(error);
    }
  };

  deleteRole = async (req, res, next) => {
    try {
      const result = await roleService.deleteRole(req.user.id, req.params.id);
      return successResponse(res, 200, MESSAGES.ROLE_DELETED, result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new RoleController();