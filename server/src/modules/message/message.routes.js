const express = require('express');
const messageController = require('./message.controller');
const {
  validateSendMessage,
  validateGetMessages,
  validateGetMessage,
  validateUpdateMessage,
  validateSearchMessages,
} = require('./message.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');

const router = express.Router();

router.post('/:conversationId/messages', authenticate, authenticatedLimiter, validateSendMessage, messageController.sendMessage);

router.get('/:conversationId/messages', authenticate, authenticatedLimiter, validateGetMessages, messageController.getMessages);

router.get('/:conversationId/messages/search', authenticate, authenticatedLimiter, validateSearchMessages, messageController.searchMessages);

router.get('/:conversationId/messages/:messageId', authenticate, authenticatedLimiter, validateGetMessage, messageController.getMessage);

router.patch('/:conversationId/messages/:messageId', authenticate, authenticatedLimiter, validateUpdateMessage, messageController.updateMessage);

router.delete('/:conversationId/messages/:messageId', authenticate, authenticatedLimiter, validateGetMessage, messageController.deleteMessage);

router.post('/:conversationId/messages/:messageId/pin', authenticate, authenticatedLimiter, validateGetMessage, messageController.pinMessage);

router.delete('/:conversationId/messages/:messageId/pin', authenticate, authenticatedLimiter, validateGetMessage, messageController.unpinMessage);

router.post('/:conversationId/messages/:messageId/read', authenticate, authenticatedLimiter, validateGetMessage, messageController.markAsRead);

router.get('/:conversationId/pinned', authenticate, authenticatedLimiter, validateGetMessage, messageController.getPinnedMessages);

module.exports = router;
