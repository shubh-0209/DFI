/**
 * Utility to calculate user profile completion percentage.
 * Each completed field contributes an equal weight to the total score.
 * @param {object} user - The user document.
 * @returns {number} Completion percentage (0 to 100).
 */
const calculateProfileCompletion = (user) => {
  if (!user) return 0;

  const fields = [
    // Basic Info (4 fields = 4 points)
    { value: user.name, check: (v) => typeof v === 'string' && v.trim() !== '' },
    { value: user.phone, check: (v) => typeof v === 'string' && v.trim() !== '' },
    { value: user.about, check: (v) => typeof v === 'string' && v.trim() !== '' },
    { value: user.city, check: (v) => typeof v === 'string' && v.trim() !== '' },

    // Education (2 fields = 2 points)
    { value: user.college, check: (v) => typeof v === 'string' && v.trim() !== '' },
    { value: user.course, check: (v) => typeof v === 'string' && v.trim() !== '' },

    // Volunteer Profile (6 fields = 6 points)
    { value: user.skills, check: (v) => Array.isArray(v) && v.length > 0 },
    { value: user.languages, check: (v) => Array.isArray(v) && v.length > 0 },
    { value: user.interests, check: (v) => Array.isArray(v) && v.length > 0 },
    { value: user.availability, check: (v) => Array.isArray(v) && v.length > 0 },
    { value: user.linkedin, check: (v) => typeof v === 'string' && v.trim() !== '' },
    { value: user.portfolio, check: (v) => typeof v === 'string' && v.trim() !== '' },

    // Assets (2 fields = 2 points)
    { value: user.profilePhoto, check: (v) => typeof v === 'string' && v.trim() !== '' },
    { value: user.resume, check: (v) => typeof v === 'string' && v.trim() !== '' },
  ];

  const completed = fields.filter((f) => f.check(f.value)).length;
  const total = fields.length;

  return Math.round((completed / total) * 100);
};

module.exports = {
  calculateProfileCompletion,
};
