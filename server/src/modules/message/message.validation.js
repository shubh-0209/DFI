const ValidationError = require('../../utils/errors/ValidationError');
const { VALIDATION, MESSAGE_TYPES } = require('./message.constants');

const validateSendMessage = (req, res, next) => {
  const errors = [];
  const { content, type, attachments } = req.body;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    if (!attachments || attachments.length === 0) {
      errors.push({ field: 'content', message: 'Message content or attachments are required' });
    }
  } else if (content.trim().length > VALIDATION.CONTENT_MAX_LENGTH) {
    errors.push({
      field: 'content',
      message: `Message content cannot exceed ${VALIDATION.CONTENT_MAX_LENGTH} characters`,
    });
  }

  if (type && !Object.values(MESSAGE_TYPES).includes(type)) {
    errors.push({ field: 'type', message: 'Invalid message type' });
  }

  if (attachments !== undefined && Array.isArray(attachments) && attachments.length > VALIDATION.ATTACHMENTS_MAX_COUNT) {
    errors.push({
      field: 'attachments',
      message: `Cannot attach more than ${VALIDATION.ATTACHMENTS_MAX_COUNT} files`,
    });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Send message validation failed', errors));
  }

  return next();
};

const validateGetMessages = (req, res, next) => {
  const errors = [];
  const { page, limit, sortBy, order } = req.query;

  if (page !== undefined) {
    const pageNum = Number(page);
    if (!Number.isInteger(pageNum) || pageNum < 1) {
      errors.push({ field: 'page', message: 'Page must be a positive integer' });
    }
  }

  if (limit !== undefined) {
    const limitNum = Number(limit);
    if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push({ field: 'limit', message: 'Limit must be an integer between 1 and 100' });
    }
  }

  if (sortBy !== undefined && !['createdAt', 'updatedAt'].includes(sortBy)) {
    errors.push({ field: 'sortBy', message: 'sortBy must be one of: createdAt, updatedAt' });
  }

  if (order !== undefined && !['asc', 'desc'].includes(order)) {
    errors.push({ field: 'order', message: 'Order must be asc or desc' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Get messages validation failed', errors));
  }

  return next();
};

const validateGetMessage = (req, res, next) => {
  const errors = [];
  const { conversationId, messageId } = req.params;

  if (!conversationId || conversationId.trim() === '') {
    errors.push({ field: 'conversationId', message: 'Conversation ID is required' });
  }

  if (!messageId || messageId.trim() === '') {
    errors.push({ field: 'messageId', message: 'Message ID is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Message ID is required', errors));
  }

  return next();
};

const validateUpdateMessage = (req, res, next) => {
  const errors = [];
  const { content } = req.body;
  const { conversationId, messageId } = req.params;

  if (!conversationId || conversationId.trim() === '') {
    errors.push({ field: 'conversationId', message: 'Conversation ID is required' });
  }

  if (!messageId || messageId.trim() === '') {
    errors.push({ field: 'messageId', message: 'Message ID is required' });
  }

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    errors.push({ field: 'content', message: 'Message content is required' });
  } else if (content.trim().length > VALIDATION.CONTENT_MAX_LENGTH) {
    errors.push({
      field: 'content',
      message: `Message content cannot exceed ${VALIDATION.CONTENT_MAX_LENGTH} characters`,
    });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Update message validation failed', errors));
  }

  return next();
};

const validateSearchMessages = (req, res, next) => {
  const errors = [];
  const { search, page, limit } = req.query;

  if (!search || search.trim().length === 0) {
    errors.push({ field: 'search', message: 'Search query is required' });
  }

  if (page !== undefined) {
    const pageNum = Number(page);
    if (!Number.isInteger(pageNum) || pageNum < 1) {
      errors.push({ field: 'page', message: 'Page must be a positive integer' });
    }
  }

  if (limit !== undefined) {
    const limitNum = Number(limit);
    if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push({ field: 'limit', message: 'Limit must be an integer between 1 and 100' });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError('Search messages validation failed', errors));
  }

  return next();
};

module.exports = {
  validateSendMessage,
  validateGetMessages,
  validateGetMessage,
  validateUpdateMessage,
  validateSearchMessages,
};
