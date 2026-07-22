const crypto = require('crypto');

const generateLeaderboardId = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `LB-${dateStr}-${randomStr}`;
};

const calculateLeaderboardScore = (totalImpact, totalPoints, totalVolunteerHours, totalProgramsCompleted, totalCoins) => {
  const weights = {
    impact: 100,
    points: 10,
    hours: 5,
    programs: 50,
    coins: 1,
  };

  const score =
    (totalImpact || 0) * weights.impact +
    (totalPoints || 0) * weights.points +
    (totalVolunteerHours || 0) * weights.hours +
    (totalProgramsCompleted || 0) * weights.programs +
    (totalCoins || 0) * weights.coins;

  return Math.round(score * 100) / 100;
};

module.exports = {
  generateLeaderboardId,
  calculateLeaderboardScore,
};
