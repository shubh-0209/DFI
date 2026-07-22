const programService = require('./program.service');
const { MESSAGES } = require('./program.constants');
const { successResponse } = require('../../utils/response');

class ProgramController {
  createProgram = async (req, res, next) => {
    try {
      const result = await programService.createProgram(req.user.id, req.body);
      return successResponse(res, 201, MESSAGES.PROGRAM_CREATED, result);
    } catch (error) {
      return next(error);
    }
  };

  updateProgram = async (req, res, next) => {
    try {
      const result = await programService.updateProgram(req.user.id, req.params.id, req.body);
      return successResponse(res, 200, MESSAGES.PROGRAM_UPDATED, result);
    } catch (error) {
      return next(error);
    }
  };

  deleteProgram = async (req, res, next) => {
    try {
      const result = await programService.deleteProgram(req.user.id, req.params.id);
      return successResponse(res, 200, MESSAGES.PROGRAM_DELETED, result);
    } catch (error) {
      return next(error);
    }
  };

  restoreProgram = async (req, res, next) => {
    try {
      const result = await programService.restoreProgram(req.user.id, req.params.id);
      return successResponse(res, 200, MESSAGES.PROGRAM_RESTORED, result);
    } catch (error) {
      return next(error);
    }
  };

  publishProgram = async (req, res, next) => {
    try {
      const result = await programService.publishProgram(req.user.id, req.params.id);
      return successResponse(res, 200, MESSAGES.PROGRAM_PUBLISHED, result);
    } catch (error) {
      return next(error);
    }
  };

  archiveProgram = async (req, res, next) => {
    try {
      const result = await programService.archiveProgram(req.user.id, req.params.id);
      return successResponse(res, 200, MESSAGES.PROGRAM_ARCHIVED, result);
    } catch (error) {
      return next(error);
    }
  };

  getProgram = async (req, res, next) => {
    try {
      const result = await programService.getProgram(req.params.id, req.user.role);
      return successResponse(res, 200, MESSAGES.PROGRAM_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  listPrograms = async (req, res, next) => {
    try {
      const result = await programService.listPrograms(req.query, req.user.role);
      return successResponse(res, 200, MESSAGES.PROGRAMS_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  changeProgramStatus = async (req, res, next) => {
    try {
      const { status } = req.body;
      const result = await programService.changeProgramStatus(req.user.id, req.params.id, status);
      return successResponse(res, 200, MESSAGES.PROGRAM_UPDATED, result);
    } catch (error) {
      return next(error);
    }
  };

  getStatistics = async (req, res, next) => {
    try {
      const result = await programService.getStatistics();
      return successResponse(res, 200, 'Program statistics retrieved successfully', result);
    } catch (error) {
      return next(error);
    }
  };

  getMyPrograms = async (req, res, next) => {
    try {
      const result = await programService.getMyPrograms(req.user.id, req.query);
      return successResponse(res, 200, 'My programs retrieved successfully', result);
    } catch (error) {
      return next(error);
    }
  };

  generateQrToken = async (req, res, next) => {
    try {
      const { type } = req.body;
      if (!type || !['checkin', 'checkout'].includes(type)) {
        const { ValidationError } = require('../../utils/errors');
        throw new ValidationError('Valid QR token type ("checkin" or "checkout") is required');
      }
      const result = await programService.generateQrToken(req.params.id, type);
      return successResponse(res, 200, 'Dynamic QR token generated successfully', result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new ProgramController();
