const ValidationError = require('../../utils/errors/ValidationError');

const validateGetBadges = (req, res, next) => {
  const { page, limit } = req.query;
  const errors = [];

  if (page !== undefined) {
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      errors.push({ field: 'page', message: 'Page must be a positive integer' });
    }
  }

  if (limit !== undefined) {
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push({ field: 'limit', message: 'Limit must be between 1 and 100' });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError('Badges validation failed', errors));
  }

  return next();
};

const validateGetAchievements = (req, res, next) => {
  const { page, limit, completed } = req.query;
  const errors = [];

  if (page !== undefined) {
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      errors.push({ field: 'page', message: 'Page must be a positive integer' });
    }
  }

  if (limit !== undefined) {
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push({ field: 'limit', message: 'Limit must be between 1 and 100' });
    }
  }

  if (completed !== undefined && !['true', 'false'].includes(completed)) {
    errors.push({ field: 'completed', message: 'Completed must be true or false' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Achievements validation failed', errors));
  }

  return next();
};

const validateGetVolunteerLevel = (req, res, next) => next();

const validateEvaluateGamification = (req, res, next) => next();

module.exports = {
  validateGetBadges,
  validateGetAchievements,
  validateGetVolunteerLevel,
  validateEvaluateGamification,
};
