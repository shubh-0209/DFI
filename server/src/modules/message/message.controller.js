const messageService = require('./message.service');
const { successResponse } = require('../../utils/response');

class MessageController {
  sendMessage = async (req, res, next) => {
    try {
      const conversationId = req.params.conversationId;
      const result = await messageService.sendMessage(req.user.id, conversationId, req.body);
      return successResponse(res, 201, result.successMessage, { message: result.message });
    } catch (error) {
      return next(error);
    }
  };

  getMessages = async (req, res, next) => {
    try {
      const conversationId = req.params.conversationId;
      const result = await messageService.getMessages(req.user.id, conversationId, req.query);
      return successResponse(res, 200, result.successMessage, result);
    } catch (error) {
      return next(error);
    }
  };

  getMessage = async (req, res, next) => {
    try {
      const { conversationId, messageId } = req.params;
      const result = await messageService.getMessage(req.user.id, conversationId, messageId);
      return successResponse(res, 200, result.successMessage, { message: result.message });
    } catch (error) {
      return next(error);
    }
  };

  updateMessage = async (req, res, next) => {
    try {
      const { conversationId, messageId } = req.params;
      const { content } = req.body;
      const result = await messageService.updateMessage(req.user.id, conversationId, messageId, content);
      return successResponse(res, 200, result.successMessage, { message: result.message });
    } catch (error) {
      return next(error);
    }
  };

  deleteMessage = async (req, res, next) => {
    try {
      const { conversationId, messageId } = req.params;
      const result = await messageService.deleteMessage(req.user.id, conversationId, messageId);
      return successResponse(res, 200, result.successMessage);
    } catch (error) {
      return next(error);
    }
  };

  pinMessage = async (req, res, next) => {
    try {
      const { conversationId, messageId } = req.params;
      const result = await messageService.pinMessage(req.user.id, conversationId, messageId);
      return successResponse(res, 200, result.successMessage, { message: result.message });
    } catch (error) {
      return next(error);
    }
  };

  unpinMessage = async (req, res, next) => {
    try {
      const { conversationId, messageId } = req.params;
      const result = await messageService.unpinMessage(req.user.id, conversationId, messageId);
      return successResponse(res, 200, result.successMessage, { message: result.message });
    } catch (error) {
      return next(error);
    }
  };

  markAsRead = async (req, res, next) => {
    try {
      const { conversationId, messageId } = req.params;
      const result = await messageService.markAsRead(req.user.id, conversationId, messageId);
      return successResponse(res, 200, result.successMessage);
    } catch (error) {
      return next(error);
    }
  };

  getPinnedMessages = async (req, res, next) => {
    try {
      const conversationId = req.params.conversationId;
      const result = await messageService.getPinnedMessages(req.user.id, conversationId);
      return successResponse(res, 200, result.successMessage, { messages: result.messages });
    } catch (error) {
      return next(error);
    }
  };

  searchMessages = async (req, res, next) => {
    try {
      const conversationId = req.params.conversationId;
      const { search } = req.query;
      const result = await messageService.searchMessages(req.user.id, conversationId, search, req.query);
      return successResponse(res, 200, result.successMessage, result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new MessageController();
