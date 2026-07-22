const supportTicketService = require('./support-ticket.service');
const { successResponse } = require('../../utils/response');

class SupportTicketController {
  createSupportTicket = async (req, res, next) => {
    try {
      const result = await supportTicketService.createSupportTicket(req.user.id, req.body);
      return successResponse(res, 201, result.successMessage, {
        ticket: result.ticket,
        conversation: result.conversation,
      });
    } catch (error) {
      return next(error);
    }
  };

  getUserTickets = async (req, res, next) => {
    try {
      const result = await supportTicketService.getUserTickets(req.user.id, req.query);
      return successResponse(res, 200, result.successMessage, result);
    } catch (error) {
      return next(error);
    }
  };

  getAllTickets = async (req, res, next) => {
    try {
      const result = await supportTicketService.getAllTickets(req.query);
      return successResponse(res, 200, result.successMessage, result);
    } catch (error) {
      return next(error);
    }
  };

  searchTickets = async (req, res, next) => {
    try {
      const result = await supportTicketService.searchTickets(req.query);
      return successResponse(res, 200, result.successMessage, result);
    } catch (error) {
      return next(error);
    }
  };

  getTicket = async (req, res, next) => {
    try {
      const result = await supportTicketService.getTicket(req.user.id, req.params.id);
      return successResponse(res, 200, result.successMessage, { ticket: result.ticket });
    } catch (error) {
      return next(error);
    }
  };

  updateTicket = async (req, res, next) => {
    try {
      const result = await supportTicketService.updateTicket(req.user.id, req.params.id, req.body);
      return successResponse(res, 200, result.successMessage, { ticket: result.ticket });
    } catch (error) {
      return next(error);
    }
  };

  updateTicketStatus = async (req, res, next) => {
    try {
      const { status } = req.body;
      const result = await supportTicketService.updateTicketStatus(req.user.id, req.params.id, status);
      return successResponse(res, 200, result.successMessage, { ticket: result.ticket });
    } catch (error) {
      return next(error);
    }
  };

  assignTicket = async (req, res, next) => {
    try {
      const { assignToUserId } = req.body;
      const result = await supportTicketService.assignTicket(req.user.id, req.params.id, assignToUserId);
      return successResponse(res, 200, result.successMessage, { ticket: result.ticket });
    } catch (error) {
      return next(error);
    }
  };

  resolveTicket = async (req, res, next) => {
    try {
      const { resolution } = req.body;
      const result = await supportTicketService.resolveTicket(req.user.id, req.params.id, resolution);
      return successResponse(res, 200, result.successMessage, { ticket: result.ticket });
    } catch (error) {
      return next(error);
    }
  };

  closeTicket = async (req, res, next) => {
    try {
      const result = await supportTicketService.closeTicket(req.user.id, req.params.id);
      return successResponse(res, 200, result.successMessage, { ticket: result.ticket });
    } catch (error) {
      return next(error);
    }
  };

  deleteTicket = async (req, res, next) => {
    try {
      const result = await supportTicketService.deleteTicket(req.user.id, req.params.id);
      return successResponse(res, 200, result.successMessage);
    } catch (error) {
      return next(error);
    }
  };

  getTicketHistory = async (req, res, next) => {
    try {
      const result = await supportTicketService.getTicketHistory(req.user.id, req.params.id, req.query);
      return successResponse(res, 200, result.successMessage, result);
    } catch (error) {
      return next(error);
    }
  };

  escalateTicket = async (req, res, next) => {
    try {
      const result = await supportTicketService.escalateTicket(req.user.id, req.params.id);
      return successResponse(res, 200, result.successMessage, { ticket: result.ticket });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new SupportTicketController();
