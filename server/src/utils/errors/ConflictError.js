const ApiError = require('./ApiError');

class ConflictError extends ApiError {
  constructor(message = 'Resource already exists') {
    super(409, message);
  }
}

module.exports = ConflictError;
