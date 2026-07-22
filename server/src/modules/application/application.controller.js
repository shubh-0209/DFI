const applicationService = require('./application.service');
const { MESSAGES } = require('./application.constants');
const { successResponse } = require('../../utils/response');
const ROLES = require('../../constants/roles.constants');

const ADMIN_ROLES = [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR];

class ApplicationController {
  applyToProgram = async (req, res, next) => {
    try {
      const result = await applicationService.applyToProgram(
        req.user.id,
        req.body.programId,
        req.body.answers
      );
      return successResponse(res, 201, MESSAGES.APPLICATION_CREATED, result);
    } catch (error) {
      return next(error);
    }
  };

  withdrawApplication = async (req, res, next) => {
    try {
      const result = await applicationService.withdrawApplication(req.user.id, req.params.id);
      return successResponse(res, 200, MESSAGES.APPLICATION_WITHDRAWN, result);
    } catch (error) {
      return next(error);
    }
  };

  getApplication = async (req, res, next) => {
    try {
      const result = await applicationService.getApplication(
        req.user.id,
        req.params.id,
        req.user.role
      );
      return successResponse(res, 200, MESSAGES.APPLICATION_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  getMyApplications = async (req, res, next) => {
    try {
      const result = await applicationService.getMyApplications(req.user.id, req.query);
      return successResponse(res, 200, 'My applications retrieved successfully', result);
    } catch (error) {
      return next(error);
    }
  };

  getMyPrograms = async (req, res, next) => {
    try {
      const result = await applicationService.getMyPrograms(req.user.id, req.query);
      return successResponse(res, 200, 'My programs retrieved successfully', result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * GET /api/v1/applications
   * Admins/Coordinators → all applications with filters.
   * Volunteers → their own applications (same as /me).
   */
  getApplications = async (req, res, next) => {
    try {
      if (ADMIN_ROLES.includes(req.user.role)) {
        const result = await applicationService.getAdminApplications(req.query);
        return successResponse(res, 200, 'Applications retrieved successfully', result);
      }
      // Volunteer: return their own applications
      const result = await applicationService.getMyApplications(req.user.id, req.query);
      return successResponse(res, 200, 'My applications retrieved successfully', result);
    } catch (error) {
      return next(error);
    }
  };

  getAdminApplications = async (req, res, next) => {
    try {
      const result = await applicationService.getAdminApplications(req.query);
      return successResponse(res, 200, 'Applications retrieved successfully', result);
    } catch (error) {
      return next(error);
    }
  };

  bulkUpdateApplications = async (req, res, next) => {
    try {
      const { ids, status } = req.body;
      const result = await applicationService.bulkUpdateApplications(req.user.id, ids, status);
      return successResponse(res, 200, 'Bulk update completed successfully', result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * GET /api/v1/applications/stats
   * Admins/Coordinators → aggregate statistics.
   * Volunteers → their own application counts.
   */
  getApplicationStatistics = async (req, res, next) => {
    try {
      if (ADMIN_ROLES.includes(req.user.role)) {
        const result = await applicationService.getApplicationStatistics();
        return successResponse(res, 200, 'Application statistics retrieved successfully', result);
      }
      // Volunteer: return their own stats
      const result = await applicationService.getMyApplicationStats(req.user.id);
      return successResponse(res, 200, 'Application statistics retrieved successfully', result);
    } catch (error) {
      return next(error);
    }
  };

  approveApplication = async (req, res, next) => {
    try {
      const result = await applicationService.approveApplication(req.user.id, req.params.id);
      return successResponse(res, 200, 'Application approved successfully', result);
    } catch (error) {
      return next(error);
    }
  };

  rejectApplication = async (req, res, next) => {
    try {
      const { reason } = req.body;
      const result = await applicationService.rejectApplication(req.user.id, req.params.id, reason);
      return successResponse(res, 200, 'Application rejected', result);
    } catch (error) {
      return next(error);
    }
  };

  submitProof = async (req, res, next) => {
    try {
      const { proofUrl, proofNotes } = req.body;
      const result = await applicationService.submitProof(req.user.id, req.params.id, {
        proofUrl,
        proofNotes,
      });
      return successResponse(res, 200, 'Proof submitted successfully', result);
    } catch (error) {
      return next(error);
    }
  };

  verifyCompletion = async (req, res, next) => {
    try {
      const { status, reason } = req.body;
      const host = `${req.protocol}://${req.get('host')}`;
      const result = await applicationService.verifyCompletion(req.user.id, req.params.id, {
        status,
        reason,
        host,
      });
      return successResponse(res, 200, 'Application completion status verified', result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new ApplicationController();
