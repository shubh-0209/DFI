const ticketReplyService = require('./ticket-reply.service');
const { successResponse } = require('../../utils/response');

class TicketReplyController {
  createReply = async (req, res, next) => {
    try {
      const ticketId = req.params.id;
      const result = await ticketReplyService.createReply(req.user.id, ticketId, req.body);
      return successResponse(res, 201, result.successMessage, { reply: result.reply });
    } catch (error) {
      return next(error);
    }
  };

  getReplies = async (req, res, next) => {
    try {
      const ticketId = req.params.id;
      const result = await ticketReplyService.getReplies(req.user.id, ticketId, req.query);
      return successResponse(res, 200, result.successMessage, result);
    } catch (error) {
      return next(error);
    }
  };

  updateReply = async (req, res, next) => {
    try {
      const { replyId } = req.params;
      const result = await ticketReplyService.updateReply(req.user.id, replyId, req.body);
      return successResponse(res, 200, result.successMessage, { reply: result.reply });
    } catch (error) {
      return next(error);
    }
  };

  deleteReply = async (req, res, next) => {
    try {
      const { replyId } = req.params;
      const result = await ticketReplyService.deleteReply(req.user.id, replyId);
      return successResponse(res, 200, result.successMessage);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new TicketReplyController();
