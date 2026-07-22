/**
 * Profile strength thresholds based on completion percentage.
 */
const STRENGTH_THRESHOLDS = [
  { label: 'Excellent', minPercent: 80 },
  { label: 'Good', minPercent: 50 },
  { label: 'Average', minPercent: 25 },
  { label: 'Weak', minPercent: 0 },
];

/**
 * Calculate profile strength based on completion percentage.
 * @param {number} completionPercent - Profile completion percentage (0 to 100).
 * @returns {string} Strength label: 'Weak' | 'Average' | 'Good' | 'Excellent'
 */
const calculateProfileStrength = (completionPercent = 0) => {
  for (const { label, minPercent } of STRENGTH_THRESHOLDS) {
    if (completionPercent >= minPercent) {
      return label;
    }
  }
  return 'Weak';
};

module.exports = {
  calculateProfileStrength,
};
