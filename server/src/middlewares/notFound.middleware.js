const NotFoundError = require('../utils/errors/NotFoundError');

/**
 * Middleware to handle all 404 Not Found routes.
 * Must be placed after all valid routes.
 */
const notFoundHandler = (req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
};

module.exports = notFoundHandler;
