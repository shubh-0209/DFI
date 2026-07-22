const ApiError = require('./ApiError');

class AuthorizationError extends ApiError {
  constructor(message = 'Not Authorized to access this resource') {
    super(403, message);
  }
}

module.exports = AuthorizationError;
