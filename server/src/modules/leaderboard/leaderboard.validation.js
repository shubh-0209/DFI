const { LEADERBOARD_TYPE, VALIDATION } = require('./leaderboard.constants');
const ValidationError = require('../../utils/errors/ValidationError');

const validateGetLeaderboard = (req, res, next) => {
  const { page, limit, type, city, state, sortBy, sortOrder } = req.query;
  const errors = [];

  if (page !== undefined) {
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      errors.push({ field: 'page', message: 'Page must be a positive integer' });
    }
  }

  if (limit !== undefined) {
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > VALIDATION.MAX_LIMIT) {
      errors.push({ field: 'limit', message: `Limit must be between 1 and ${VALIDATION.MAX_LIMIT}` });
    }
  }

  if (type && !Object.values(LEADERBOARD_TYPE).includes(type)) {
    errors.push({ field: 'type', message: 'Invalid leaderboard type. Must be city, state, or national' });
  }

  if (city && typeof city !== 'string') {
    errors.push({ field: 'city', message: 'City must be a string' });
  }

  if (state && typeof state !== 'string') {
    errors.push({ field: 'state', message: 'State must be a string' });
  }

  if (sortBy && !['currentRank', 'nationalRank', 'stateRank', 'cityRank', 'totalImpact', 'totalPoints', 'totalVolunteerHours', 'totalProgramsCompleted', 'totalCoins'].includes(sortBy)) {
    errors.push({ field: 'sortBy', message: 'Invalid sort field' });
  }

  if (sortOrder && !['asc', 'desc'].includes(sortOrder)) {
    errors.push({ field: 'sortOrder', message: 'Sort order must be asc or desc' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Leaderboard validation failed', errors));
  }

  return next();
};

const validateGetMyRank = (req, res, next) => next();

const validateGetTopVolunteers = (req, res, next) => {
  const { type, limit, city, state } = req.query;
  const errors = [];

  if (type && !Object.values(LEADERBOARD_TYPE).includes(type)) {
    errors.push({ field: 'type', message: 'Invalid leaderboard type. Must be city, state, or national' });
  }

  if (limit !== undefined) {
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > VALIDATION.MAX_LIMIT) {
      errors.push({ field: 'limit', message: `Limit must be between 1 and ${VALIDATION.MAX_LIMIT}` });
    }
  }

  if (city && typeof city !== 'string') {
    errors.push({ field: 'city', message: 'City must be a string' });
  }

  if (state && typeof state !== 'string') {
    errors.push({ field: 'state', message: 'State must be a string' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Top volunteers validation failed', errors));
  }

  return next();
};

const validateRefreshLeaderboard = (req, res, next) => next();

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
  validateGetLeaderboard,
  validateGetMyRank,
  validateGetTopVolunteers,
  validateRefreshLeaderboard,
  validateGetBadges,
  validateGetAchievements,
  validateGetVolunteerLevel,
  validateEvaluateGamification,
};
