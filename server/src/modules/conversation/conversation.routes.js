const express = require('express');
const conversationController = require('./conversation.controller');
const {
  validateCreateConversation,
  validateGetConversations,
  validateGetConversation,
  validateUpdateConversation,
} = require('./conversation.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');

const router = express.Router();

router.post('/', authenticate, authenticatedLimiter, validateCreateConversation, conversationController.createConversation);

router.get('/', authenticate, authenticatedLimiter, validateGetConversations, conversationController.getConversations);

router.get('/:id', authenticate, authenticatedLimiter, validateGetConversation, conversationController.getConversation);

router.patch('/:id', authenticate, authenticatedLimiter, validateUpdateConversation, conversationController.updateConversation);

router.patch('/:id/archive', authenticate, authenticatedLimiter, validateGetConversation, conversationController.archiveConversation);

router.delete('/:id', authenticate, authenticatedLimiter, validateGetConversation, conversationController.deleteConversation);

module.exports = router;
