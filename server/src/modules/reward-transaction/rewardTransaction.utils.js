const crypto = require('crypto');

/**
 * Generate a unique Reward Transaction ID.
 * @returns {string}
 */
const generateTransactionId = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `TXN-${dateStr}-${randomStr}`;
};

module.exports = {
  generateTransactionId,
};
