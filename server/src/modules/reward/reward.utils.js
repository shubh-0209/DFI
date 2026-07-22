const crypto = require('crypto');

/**
 * Generate a unique Reward ID.
 * @returns {string}
 */
const generateRewardId = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `RWD-${dateStr}-${randomStr}`;
};

module.exports = {
  generateRewardId,
};
