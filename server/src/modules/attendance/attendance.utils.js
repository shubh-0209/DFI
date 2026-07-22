const crypto = require('crypto');

/**
 * Generate a unique attendance ID.
 * Example format: ATD-20231012-ABC12
 * @returns {string} Generated attendance ID.
 */
const generateAttendanceId = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `ATD-${dateStr}-${randomStr}`;
};

module.exports = {
  generateAttendanceId,
};
