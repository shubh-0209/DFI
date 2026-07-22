const organizationService = require('./organization.service');
const { MESSAGES } = require('./organization.constants');
const { successResponse } = require('../../utils/response');

class OrganizationController {
  createOrganization = async (req, res, next) => {
    try {
      const result = await organizationService.createOrganization(req.user.id, req.body);
      return successResponse(res, 201, MESSAGES.ORGANIZATION_CREATED, result);
    } catch (error) {
      return next(error);
    }
  };

  getOrganization = async (req, res, next) => {
    try {
      const result = await organizationService.getOrganization(req.params.id, req.user.role);
      return successResponse(res, 200, MESSAGES.ORGANIZATION_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  updateOrganization = async (req, res, next) => {
    try {
      const result = await organizationService.updateOrganization(
        req.user.id,
        req.params.id,
        req.body
      );
      return successResponse(res, 200, MESSAGES.ORGANIZATION_UPDATED, result);
    } catch (error) {
      return next(error);
    }
  };

  deleteOrganization = async (req, res, next) => {
    try {
      const result = await organizationService.deleteOrganization(req.user.id, req.params.id);
      return successResponse(res, 200, MESSAGES.ORGANIZATION_DELETED, result);
    } catch (error) {
      return next(error);
    }
  };

  listOrganizations = async (req, res, next) => {
    try {
      const result = await organizationService.listOrganizations(req.query);
      return successResponse(res, 200, 'Organizations retrieved successfully', result);
    } catch (error) {
      return next(error);
    }
  };

  approveOrganization = async (req, res, next) => {
    try {
      const { reviewNotes } = req.body;
      const result = await organizationService.approveOrganization(
        req.user.id,
        req.params.id,
        reviewNotes
      );
      return successResponse(res, 200, result.message, result);
    } catch (error) {
      return next(error);
    }
  };

  rejectOrganization = async (req, res, next) => {
    try {
      const { rejectionReason, reviewNotes } = req.body;
      const result = await organizationService.rejectOrganization(
        req.user.id,
        req.params.id,
        rejectionReason,
        reviewNotes
      );
      return successResponse(res, 200, result.message, result);
    } catch (error) {
      return next(error);
    }
  };

  activateOrganization = async (req, res, next) => {
    try {
      const result = await organizationService.activateOrganization(req.user.id, req.params.id);
      return successResponse(res, 200, result.message, result);
    } catch (error) {
      return next(error);
    }
  };

  deactivateOrganization = async (req, res, next) => {
    try {
      const result = await organizationService.deactivateOrganization(req.user.id, req.params.id);
      return successResponse(res, 200, result.message, result);
    } catch (error) {
      return next(error);
    }
  };

  archiveOrganization = async (req, res, next) => {
    try {
      const result = await organizationService.archiveOrganization(req.user.id, req.params.id);
      return successResponse(res, 200, result.message, result);
    } catch (error) {
      return next(error);
    }
  };

  restoreOrganization = async (req, res, next) => {
    try {
      const result = await organizationService.restoreOrganization(req.user.id, req.params.id);
      return successResponse(res, 200, result.message, result);
    } catch (error) {
      return next(error);
    }
  };

  assignAdmin = async (req, res, next) => {
    try {
      const { userId } = req.body;
      const result = await organizationService.assignAdmin(req.user.id, req.params.id, userId);
      return successResponse(res, 200, result.message, result);
    } catch (error) {
      return next(error);
    }
  };

  removeAdmin = async (req, res, next) => {
    try {
      const { userId } = req.body;
      const result = await organizationService.removeAdmin(req.user.id, req.params.id, userId);
      return successResponse(res, 200, result.message, result);
    } catch (error) {
      return next(error);
    }
  };

  transferOwnership = async (req, res, next) => {
    try {
      const { newOwnerId } = req.body;
      const result = await organizationService.transferOwnership(
        req.user.id,
        req.params.id,
        newOwnerId
      );
      return successResponse(res, 200, result.message, result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new OrganizationController();