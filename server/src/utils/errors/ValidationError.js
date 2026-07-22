const ApiError = require('./ApiError');

class ValidationError extends ApiError {
  constructor(message = 'Validation Failed', errors = []) {
    super(400, message);
    this.errors = errors;
  }
}

module.exports = ValidationError;
