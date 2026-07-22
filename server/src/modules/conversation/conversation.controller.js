const conversationService = require('./conversation.service');
const { successResponse } = require('../../utils/response');

class ConversationController {
  createConversation = async (req, res, next) => {
    try {
      const result = await conversationService.createConversation(req.user.id, req.body);
      return successResponse(res, 201, result.message, { conversation: result.conversation });
    } catch (error) {
      return next(error);
    }
  };

  getConversations = async (req, res, next) => {
    try {
      const result = await conversationService.getUserConversations(req.user.id, req.query);
      return successResponse(res, 200, result.message, result);
    } catch (error) {
      return next(error);
    }
  };

  getConversation = async (req, res, next) => {
    try {
      const result = await conversationService.getConversation(req.user.id, req.params.id);
      return successResponse(res, 200, result.message, { conversation: result.conversation });
    } catch (error) {
      return next(error);
    }
  };

  updateConversation = async (req, res, next) => {
    try {
      const result = await conversationService.updateConversation(req.user.id, req.params.id, req.body);
      return successResponse(res, 200, result.message, { conversation: result.conversation });
    } catch (error) {
      return next(error);
    }
  };

  archiveConversation = async (req, res, next) => {
    try {
      const result = await conversationService.archiveConversation(req.user.id, req.params.id);
      return successResponse(res, 200, result.message, { conversation: result.conversation });
    } catch (error) {
      return next(error);
    }
  };

  deleteConversation = async (req, res, next) => {
    try {
      const result = await conversationService.deleteConversation(req.user.id, req.params.id);
      return successResponse(res, 200, result.message);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new ConversationController();
