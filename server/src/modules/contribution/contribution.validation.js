const ValidationError = require('../../utils/errors/ValidationError');
const { STATUS, CATEGORY, CONTRIBUTION_TYPE, REVIEW_ACTION, REJECT_REASON } = require('./contribution.constants');

const validateCreateContribution = (req, res, next) => {
  const errors = [];
  const { title, description, category, contributionType } = req.body;

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    errors.push({ field: 'title', message: 'Title cannot be empty' });
  }

  if (description !== undefined && (typeof description !== 'string' || description.trim() === '')) {
    errors.push({ field: 'description', message: 'Description cannot be empty' });
  }

  if (category && !Object.values(CATEGORY).includes(category)) {
    errors.push({ field: 'category', message: 'Invalid category' });
  }

  if (contributionType && !Object.values(CONTRIBUTION_TYPE).includes(contributionType)) {
    errors.push({ field: 'contributionType', message: 'Invalid contribution type' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

const validateSubmitContribution = (req, res, next) => {
  return next();
};

const validateUpdateContribution = (req, res, next) => {
  const errors = [];
  const { title, description, category, contributionType, skillsUsed, tags, hoursWorked } = req.body;

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    errors.push({ field: 'title', message: 'Title cannot be empty' });
  }

  if (description !== undefined && (typeof description !== 'string' || description.trim() === '')) {
    errors.push({ field: 'description', message: 'Description cannot be empty' });
  }

  if (category !== undefined && !Object.values(CATEGORY).includes(category)) {
    errors.push({ field: 'category', message: 'Invalid category' });
  }

  if (contributionType !== undefined && !Object.values(CONTRIBUTION_TYPE).includes(contributionType)) {
    errors.push({ field: 'contributionType', message: 'Invalid contribution type' });
  }

  if (skillsUsed !== undefined && !Array.isArray(skillsUsed)) {
    errors.push({ field: 'skillsUsed', message: 'skillsUsed must be an array' });
  }

  if (tags !== undefined && !Array.isArray(tags)) {
    errors.push({ field: 'tags', message: 'tags must be an array' });
  }

  if (hoursWorked !== undefined && (typeof hoursWorked !== 'number' || hoursWorked < 0)) {
    errors.push({ field: 'hoursWorked', message: 'hoursWorked must be a non-negative number' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

const validateGetContribution = (req, res, next) => {
  const { id } = req.params;

  if (!id || id.trim() === '') {
    return next(new ValidationError('Contribution ID is required', [
      { field: 'id', message: 'Contribution ID is required' },
    ]));
  }

  return next();
};

const validateGetContributions = (req, res, next) => {
  const errors = [];
  const { page, limit, status } = req.query;

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

  if (status !== undefined && status !== '' && !Object.values(STATUS).includes(status)) {
    errors.push({ field: 'status', message: 'Invalid status filter' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

const validateAdminContributions = (req, res, next) => {
  const errors = [];
  const { page, limit, status, category, contributionType, sortBy, sortOrder } = req.query;

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

  if (status && status !== '' && !Object.values(STATUS).includes(status)) {
    errors.push({ field: 'status', message: 'Invalid status filter' });
  }

  if (category && category !== '' && !Object.values(CATEGORY).includes(category)) {
    errors.push({ field: 'category', message: 'Invalid category filter' });
  }

  if (contributionType && contributionType !== '' && !Object.values(CONTRIBUTION_TYPE).includes(contributionType)) {
    errors.push({ field: 'contributionType', message: 'Invalid contribution type filter' });
  }

  if (sortBy && !['createdAt', 'updatedAt', 'title', 'status'].includes(sortBy)) {
    errors.push({ field: 'sortBy', message: 'Invalid sort field' });
  }

  if (sortOrder && !['asc', 'desc'].includes(sortOrder)) {
    errors.push({ field: 'sortOrder', message: 'Sort order must be asc or desc' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

const validateReviewContribution = (req, res, next) => {
  const errors = [];
  const { action, coinsAwarded, badgeAwarded, reason, feedback, internalNotes } = req.body;

  if (!action || !Object.values(REVIEW_ACTION).includes(action)) {
    errors.push({ field: 'action', message: `Action must be one of: ${Object.values(REVIEW_ACTION).join(', ')}` });
  }

  // coinsAwarded can be a number or a numeric string from JSON — normalise to number
  if (coinsAwarded !== undefined && coinsAwarded !== null) {
    const coinsNum = Number(coinsAwarded);
    if (Number.isNaN(coinsNum) || coinsNum < 0) {
      errors.push({ field: 'coinsAwarded', message: 'Coins awarded must be a non-negative number' });
    } else {
      // Coerce string to number so downstream code always gets a number
      req.body.coinsAwarded = coinsNum;
    }
  }

  if (badgeAwarded !== undefined && badgeAwarded !== null && typeof badgeAwarded !== 'string') {
    errors.push({ field: 'badgeAwarded', message: 'Badge awarded must be a string' });
  }

  if (reason && typeof reason === 'string' && reason.trim() !== '' && !Object.values(REJECT_REASON).includes(reason)) {
    errors.push({ field: 'reason', message: `Invalid reason. Must be one of: ${Object.values(REJECT_REASON).join(', ')}` });
  }

  if (feedback !== undefined && feedback !== null && typeof feedback !== 'string') {
    errors.push({ field: 'feedback', message: 'Feedback must be a string' });
  }

  if (internalNotes !== undefined && internalNotes !== null && typeof internalNotes !== 'string') {
    errors.push({ field: 'internalNotes', message: 'Internal notes must be a string' });
  }

  if (errors.length > 0) {
    // eslint-disable-next-line no-console
    console.error('[validateReviewContribution] Validation failed:', JSON.stringify(errors), '| body:', JSON.stringify(req.body));
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

const validateFeatureContribution = (req, res, next) => {
  return next();
};

const validateArchiveContribution = (req, res, next) => {
  return next();
};

const validateReviewHistory = (req, res, next) => {
  const errors = [];
  const { page, limit, reviewedBy, contributionId } = req.query;

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

  if (reviewedBy && reviewedBy !== '' && !/^[0-9a-fA-F]{24}$/.test(reviewedBy)) {
    errors.push({ field: 'reviewedBy', message: 'Invalid reviewer ID' });
  }

  if (contributionId && contributionId !== '' && !/^[0-9a-fA-F]{24}$/.test(contributionId)) {
    errors.push({ field: 'contributionId', message: 'Invalid contribution ID' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

module.exports = {
  validateCreateContribution,
  validateSubmitContribution,
  validateUpdateContribution,
  validateGetContribution,
  validateGetContributions,
  validateAdminContributions,
  validateReviewContribution,
  validateFeatureContribution,
  validateArchiveContribution,
  validateReviewHistory,
};
