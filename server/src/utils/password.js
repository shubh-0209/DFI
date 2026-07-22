const bcrypt = require('bcrypt');

/**
 * Hash a plain text password using bcrypt.
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} The hashed password.
 */
const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compare a plain text password with a hashed password.
 * @param {string} password - The plain text password.
 * @param {string} hashedPassword - The hashed password.
 * @returns {Promise<boolean>} True if passwords match, false otherwise.
 */
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
