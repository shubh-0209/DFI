const ValidationError = require('../../utils/errors/ValidationError');

const validateCreateReply = (req, res, next) => {
  const errors = [];
  const { message, isInternal } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    errors.push({ field: 'message', message: 'Reply message is required' });
  } else if (message.trim().length > 2000) {
    errors.push({ field: 'message', message: 'Reply message cannot exceed 2000 characters' });
  }

  if (isInternal !== undefined && typeof isInternal !== 'boolean') {
    errors.push({ field: 'isInternal', message: 'isInternal must be a boolean' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Create reply validation failed', errors));
  }

  return next();
};

const validateUpdateReply = (req, res, next) => {
  const errors = [];
  const { message, isInternal } = req.body;

  if (message !== undefined && (typeof message !== 'string' || message.trim().length === 0)) {
    errors.push({ field: 'message', message: 'Message must be a non-empty string' });
  }

  if (isInternal !== undefined && typeof isInternal !== 'boolean') {
    errors.push({ field: 'isInternal', message: 'isInternal must be a boolean' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Update reply validation failed', errors));
  }

  return next();
};

module.exports = {
  validateCreateReply,
  validateUpdateReply,
};
