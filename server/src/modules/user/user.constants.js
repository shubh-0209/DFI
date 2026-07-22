const ROLES = require('../../constants/roles.constants');

const STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

const MESSAGES = {
  PROFILE_RETRIEVED: 'User profile retrieved successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PROFILE_PHOTO_UPLOADED: 'Profile photo uploaded successfully',
  RESUME_UPLOADED: 'Resume uploaded successfully',
  PUBLIC_PROFILE_RETRIEVED: 'Public profile retrieved successfully',
  USERS_FOUND: 'Users retrieved successfully',
  PROFILE_COMPLETION_RETRIEVED: 'Profile completion retrieved successfully',
  STATISTICS_RETRIEVED: 'Volunteer statistics retrieved successfully',
};

const DEFAULTS = {
  PAGINATION: {
    PAGE: 1,
    LIMIT: 10,
    SORT_BY: 'createdAt',
    ORDER: 'desc',
  },
  PROFILE_PHOTO: '',
  POINTS: 0,
  HOURS_COMPLETED: 0,
  PROGRAMS_COMPLETED: 0,
};

const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  ABOUT_MAX_LENGTH: 500,
};

const VOLUNTEER_LEVELS = ['Beginner', 'Contributor', 'Mentor', 'Leader', 'Ambassador'];

const PROFILE_STRENGTH_LABELS = ['Weak', 'Average', 'Good', 'Excellent'];

const PROFILE_COMPLETION_FIELDS = [
  'name',
  'phone',
  'about',
  'city',
  'college',
  'course',
  'skills',
  'languages',
  'interests',
  'availability',
  'linkedin',
  'portfolio',
  'profilePhoto',
  'resume',
];

module.exports = {
  ROLES,
  STATUS,
  MESSAGES,
  DEFAULTS,
  VALIDATION,
  VOLUNTEER_LEVELS,
  PROFILE_STRENGTH_LABELS,
  PROFILE_COMPLETION_FIELDS,
};
