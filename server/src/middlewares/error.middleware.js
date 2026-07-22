const ApiError = require('../utils/errors/ApiError');
const { errorResponse } = require('../utils/response');

/**
 * Normalize a raw error into a consistent shape before responding.
 * @param {Error} err - The incoming error.
 * @returns {{ statusCode: number, message: string, errors: Array }} Normalized error data.
 */
const normalizeError = (err) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // --- Mongoose Cast Error (invalid ObjectId) ---
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    errors = [];
  }

  // --- Mongoose Validation Error ---
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Failed';
    errors = Object.values(err.errors).map((el) => ({
      field: el.path,
      message: el.message,
    }));
  }

  // --- Mongoose Duplicate Key Error (11000) ---
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    errors = [{ field, message }];
  }

  // --- JWT Errors ---
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
    errors = [];
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired. Please log in again.';
    errors = [];
  }
  if (err.name === 'NotBeforeError') {
    statusCode = 401;
    message = 'Token not yet active. Please log in again.';
    errors = [];
  }

  // --- Hide raw internal errors in production ---
  if (!(err instanceof ApiError) && statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Something went wrong. Please try again later.';
    errors = [];
  }

  return { statusCode, message, errors };
};

/**
 * Global Error Handling Middleware.
 * Must have 4 arguments to be treated as error middleware by Express.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const { statusCode, message, errors } = normalizeError(err);

  // Log error details — never expose stack in production responses
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${req.method} ${req.originalUrl} — ${message}`, err.stack);
  } else {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${req.method} ${req.originalUrl} — ${statusCode}: ${message}`);
  }

  return errorResponse(res, statusCode, message, errors);
};

module.exports = errorHandler;
