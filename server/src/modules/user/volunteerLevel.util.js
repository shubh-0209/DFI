/**
 * Volunteer levels based on accumulated points.
 */
const VOLUNTEER_LEVELS = [
  { level: 'Ambassador', minPoints: 5000 },
  { level: 'Leader', minPoints: 2000 },
  { level: 'Mentor', minPoints: 500 },
  { level: 'Contributor', minPoints: 100 },
  { level: 'Beginner', minPoints: 0 },
];

/**
 * Determine the volunteer level based on total points.
 * @param {number} points - Total accumulated points.
 * @returns {string} Volunteer level label.
 */
const calculateVolunteerLevel = (points = 0) => {
  for (const { level, minPoints } of VOLUNTEER_LEVELS) {
    if (points >= minPoints) {
      return level;
    }
  }
  return 'Beginner';
};

/**
 * Get the minimum points required for each level.
 * @returns {Array} Array of level objects with name and minPoints.
 */
const getVolunteerLevelBrackets = () => {
  return VOLUNTEER_LEVELS.map(({ level, minPoints }) => ({ level, minPoints }));
};

module.exports = {
  calculateVolunteerLevel,
  getVolunteerLevelBrackets,
};
