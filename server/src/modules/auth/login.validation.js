const ValidationError = require('../../utils/errors/ValidationError');

/**
 * Validator for User Login.
 */
const validateLogin = (req, res, next) => {
  const { email, username, password } = req.body;
  const errors = [];

  if (!email && !username) {
    errors.push({ field: 'emailOrUsername', message: 'Email or Username is required' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Login validation failed', errors));
  }

  return next();
};

module.exports = validateLogin;
