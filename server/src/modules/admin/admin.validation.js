const mongoose = require('mongoose');
const ValidationError = require('../../utils/errors/ValidationError');
const { ALLOWED_STATUSES, ALLOWED_ROLES, SORT_FIELDS, SORT_ORDERS } = require('./admin.constants');

/**
 * Validate MongoDB ObjectId format.
 */
const validateObjectId = (id, fieldName = 'id') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { field: fieldName, message: `Invalid ${fieldName} format` };
  }
  return null;
};

/**
 * Validate pagination and filtering query parameters.
 */
const validateGetAllUsers = (req, res, next) => {
  const errors = [];
  const { page, limit, sortBy, sortOrder } = req.query;

  if (page !== undefined) {
    const p = Number(page);
    if (!Number.isInteger(p) || p < 1) {
      errors.push({ field: 'page', message: 'Page must be a positive integer' });
    }
  }

  if (limit !== undefined) {
    const l = Number(limit);
    if (!Number.isInteger(l) || l < 1 || l > 100) {
      errors.push({ field: 'limit', message: 'Limit must be an integer between 1 and 100' });
    }
  }

  if (sortBy !== undefined && !SORT_FIELDS.includes(sortBy)) {
    errors.push({ field: 'sortBy', message: `sortBy must be one of: ${SORT_FIELDS.join(', ')}` });
  }

  if (sortOrder !== undefined && !SORT_ORDERS.includes(sortOrder)) {
    errors.push({ field: 'sortOrder', message: 'sortOrder must be asc or desc' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Invalid query parameters', errors));
  }

  return next();
};

/**
 * Validate :id param as a valid MongoDB ObjectId.
 */
const validateUserId = (req, res, next) => {
  const err = validateObjectId(req.params.id, 'id');
  if (err) {
    return next(new ValidationError('Validation failed', [err]));
  }
  return next();
};

/**
 * Validate status update request body.
 */
const validateUpdateStatus = (req, res, next) => {
  const errors = [];

  const err = validateObjectId(req.params.id, 'id');
  if (err) errors.push(err);

  const { status } = req.body;
  if (!status) {
    errors.push({ field: 'status', message: 'Status is required' });
  } else if (!ALLOWED_STATUSES.includes(status)) {
    errors.push({
      field: 'status',
      message: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`,
    });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Status update validation failed', errors));
  }

  return next();
};

/**
 * Validate role update request body.
 */
const validateUpdateRole = (req, res, next) => {
  const errors = [];

  const err = validateObjectId(req.params.id, 'id');
  if (err) errors.push(err);

  const { role } = req.body;
  if (!role) {
    errors.push({ field: 'role', message: 'Role is required' });
  } else if (!ALLOWED_ROLES.includes(role)) {
    errors.push({
      field: 'role',
      message: `Role must be one of: ${ALLOWED_ROLES.join(', ')}`,
    });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Role update validation failed', errors));
  }

  return next();
};

module.exports = {
  validateGetAllUsers,
  validateUserId,
  validateUpdateStatus,
  validateUpdateRole,
};
