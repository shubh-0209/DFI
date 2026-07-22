const crypto = require('crypto');

const generateBadgeId = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `BDG-${dateStr}-${randomStr}`;
};

const generateAchievementId = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `ACH-${dateStr}-${randomStr}`;
};

module.exports = {
  generateBadgeId,
  generateAchievementId,
};
