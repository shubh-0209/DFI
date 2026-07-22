const ValidationError = require('../../utils/errors/ValidationError');
const { VALIDATION } = require('./conversation.constants');

const validateCreateConversation = (req, res, next) => {
  const errors = [];
  const { participantIds, type, title } = req.body;

  if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
    errors.push({ field: 'participantIds', message: 'At least one participant is required' });
  }

  if (type && !['private', 'support', 'group'].includes(type)) {
    errors.push({ field: 'type', message: 'Invalid conversation type' });
  }

  if (title !== undefined && typeof title !== 'string') {
    errors.push({ field: 'title', message: 'Title must be a string' });
  } else if (title && title.trim().length > VALIDATION.TITLE_MAX_LENGTH) {
    errors.push({
      field: 'title',
      message: `Title cannot exceed ${VALIDATION.TITLE_MAX_LENGTH} characters`,
    });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Create conversation validation failed', errors));
  }

  return next();
};

const validateGetConversations = (req, res, next) => {
  const errors = [];
  const { page, limit, type, sortBy, order } = req.query;

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

  if (type !== undefined && !['private', 'support', 'group'].includes(type)) {
    errors.push({ field: 'type', message: 'Invalid conversation type filter' });
  }

  if (sortBy !== undefined && !['createdAt', 'updatedAt', 'lastMessageAt'].includes(sortBy)) {
    errors.push({ field: 'sortBy', message: 'sortBy must be one of: createdAt, updatedAt, lastMessageAt' });
  }

  if (order !== undefined && !['asc', 'desc'].includes(order)) {
    errors.push({ field: 'order', message: 'Order must be asc or desc' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Get conversations validation failed', errors));
  }

  return next();
};

const validateGetConversation = (req, res, next) => {
  const { id } = req.params;

  if (!id || id.trim() === '') {
    return next(new ValidationError('Conversation ID is required'));
  }

  return next();
};

const validateUpdateConversation = (req, res, next) => {
  const errors = [];
  const { id } = req.params;
  const { title, status } = req.body;

  if (!id || id.trim() === '') {
    errors.push({ field: 'id', message: 'Conversation ID is required' });
  }

  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
    errors.push({ field: 'title', message: 'Title must be a non-empty string' });
  }

  if (status !== undefined && !['active', 'archived', 'deleted'].includes(status)) {
    errors.push({ field: 'status', message: 'Invalid status' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Update conversation validation failed', errors));
  }

  return next();
};

module.exports = {
  validateCreateConversation,
  validateGetConversations,
  validateGetConversation,
  validateUpdateConversation,
};
