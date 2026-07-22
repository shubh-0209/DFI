const crypto = require('crypto');

const generateRedemptionId = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `RDM-${dateStr}-${randomStr}`;
};

module.exports = {
  generateRedemptionId,
};
