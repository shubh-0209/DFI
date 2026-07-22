const ApiError = require('./ApiError');

class AuthenticationError extends ApiError {
  constructor(message = 'Authentication Failed') {
    super(401, message);
  }
}

module.exports = AuthenticationError;
