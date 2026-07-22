const ValidationError = require('../../utils/errors/ValidationError');

/**
 * Validator for User Registration.
 */
const validateRegister = (req, res, next) => {
  const { name, username, email, password, phone } = req.body;
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if (!username || username.trim() === '') {
    errors.push({ field: 'username', message: 'Username is required' });
  } else if (username.length < 3 || username.length > 30) {
    errors.push({ field: 'username', message: 'Username must be between 3 and 30 characters' });
  }

  if (!email || email.trim() === '') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
  }

  if (!password || password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
  }

  if (phone) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError('Registration validation failed', errors));
  }

  return next();
};

module.exports = validateRegister;
