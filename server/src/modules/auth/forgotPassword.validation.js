const ValidationError = require('../../utils/errors/ValidationError');

/**
 * Validator for Forgot Password request.
 */
const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;
  const errors = [];

  if (!email || email.trim() === '') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError('Forgot password validation failed', errors));
  }

  return next();
};

module.exports = validateForgotPassword;
