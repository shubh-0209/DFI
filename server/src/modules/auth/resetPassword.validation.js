const ValidationError = require('../../utils/errors/ValidationError');

/**
 * Validator for Reset Password request.
 */
const validateResetPassword = (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const errors = [];

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else {
    // Password strength check: min 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      errors.push({
        field: 'password',
        message:
          'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
      });
    }
  }

  if (!confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Confirm password is required' });
  }

  if (password && confirmPassword && password !== confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Reset password validation failed', errors));
  }

  return next();
};

module.exports = validateResetPassword;
