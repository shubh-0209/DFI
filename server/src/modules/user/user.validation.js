const ValidationError = require('../../utils/errors/ValidationError');

const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

/**
 * Validation skeleton for getting current profile.
 */
const validateGetCurrentProfile = (req, res, next) => {
  return next();
};

/**
 * Validation for updating profile.
 */
const validateUpdateProfile = (req, res, next) => {
  const errors = [];
  const {
    name,
    username,
    phone,
    about,
    linkedin,
    portfolio,
    skills,
    languages,
    interests,
    availability,
    graduationYear,
    dateOfBirth,
    gender,
    notificationPreferences,
    privacySettings,
    appearance,
  } = req.body;

  // Settings validation
  if (notificationPreferences !== undefined && typeof notificationPreferences !== 'object') {
    errors.push({ field: 'notificationPreferences', message: 'Notification preferences must be an object' });
  }
  if (privacySettings !== undefined && typeof privacySettings !== 'object') {
    errors.push({ field: 'privacySettings', message: 'Privacy settings must be an object' });
  }
  if (appearance !== undefined && typeof appearance !== 'object') {
    errors.push({ field: 'appearance', message: 'Appearance must be an object' });
  }

  // Name validation
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      errors.push({ field: 'name', message: 'Name cannot be empty' });
    } else if (name.trim().length < 2 || name.trim().length > 100) {
      errors.push({ field: 'name', message: 'Name must be between 2 and 100 characters' });
    }
  }

  // Username validation
  if (username !== undefined) {
    if (typeof username !== 'string' || username.trim() === '') {
      errors.push({ field: 'username', message: 'Username cannot be empty' });
    } else if (username.trim().length < 3 || username.trim().length > 30) {
      errors.push({ field: 'username', message: 'Username must be between 3 and 30 characters' });
    } else if (!/^[a-z0-9_]+$/.test(username.trim().toLowerCase())) {
      errors.push({
        field: 'username',
        message: 'Username can only contain lowercase letters, numbers, and underscores',
      });
    }
  }

  // Phone validation
  if (phone !== undefined) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (phone.trim() !== '' && !phoneRegex.test(phone)) {
      errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
    }
  }

  // About validation
  if (about !== undefined) {
    if (typeof about !== 'string') {
      errors.push({ field: 'about', message: 'About must be a string' });
    } else if (about.trim().length > 500) {
      errors.push({ field: 'about', message: 'About section cannot exceed 500 characters' });
    }
  }

  // LinkedIn URL validation
  if (linkedin !== undefined && linkedin !== '') {
    if (!URL_REGEX.test(linkedin)) {
      errors.push({ field: 'linkedin', message: 'LinkedIn must be a valid URL' });
    }
  }

  // Portfolio URL validation
  if (portfolio !== undefined && portfolio !== '') {
    if (!URL_REGEX.test(portfolio)) {
      errors.push({ field: 'portfolio', message: 'Portfolio must be a valid URL' });
    }
  }

  // Skills validation (array of strings)
  if (skills !== undefined) {
    if (!Array.isArray(skills)) {
      errors.push({ field: 'skills', message: 'Skills must be an array of strings' });
    } else if (skills.some((s) => typeof s !== 'string')) {
      errors.push({ field: 'skills', message: 'Each skill must be a string' });
    }
  }

  // Languages validation (array of strings)
  if (languages !== undefined) {
    if (!Array.isArray(languages)) {
      errors.push({ field: 'languages', message: 'Languages must be an array of strings' });
    } else if (languages.some((l) => typeof l !== 'string')) {
      errors.push({ field: 'languages', message: 'Each language must be a string' });
    }
  }

  // Interests validation (array of strings)
  if (interests !== undefined) {
    if (!Array.isArray(interests)) {
      errors.push({ field: 'interests', message: 'Interests must be an array of strings' });
    } else if (interests.some((i) => typeof i !== 'string')) {
      errors.push({ field: 'interests', message: 'Each interest must be a string' });
    }
  }

  // Availability validation (array of strings)
  if (availability !== undefined) {
    if (!Array.isArray(availability)) {
      errors.push({ field: 'availability', message: 'Availability must be an array of strings' });
    } else if (availability.some((a) => typeof a !== 'string')) {
      errors.push({ field: 'availability', message: 'Each availability entry must be a string' });
    }
  }

  // Graduation year validation
  if (graduationYear !== undefined) {
    const year = Number(graduationYear);
    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      errors.push({ field: 'graduationYear', message: 'Graduation year must be a valid year' });
    }
  }

  // Date of birth validation
  if (dateOfBirth !== undefined) {
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      errors.push({ field: 'dateOfBirth', message: 'Date of birth must be a valid date' });
    } else if (dob >= new Date()) {
      errors.push({ field: 'dateOfBirth', message: 'Date of birth must be in the past' });
    }
  }

  // Gender validation
  if (gender !== undefined) {
    const validGenders = ['male', 'female', 'other', 'prefer_not_to_say'];
    if (!validGenders.includes(gender)) {
      errors.push({
        field: 'gender',
        message: 'Gender must be one of: male, female, other, prefer_not_to_say',
      });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError('Profile update validation failed', errors));
  }

  return next();
};

/**
 * Validation for uploading profile photo.
 */
const validateUploadProfilePhoto = (req, res, next) => {
  if (!req.file) {
    return next(new ValidationError('Profile photo is required', [{ field: 'profilePhoto', message: 'No file uploaded' }]));
  }
  
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return next(new ValidationError('Invalid file type', [{ field: 'profilePhoto', message: 'Only JPG, PNG and WebP files are allowed' }]));
  }
  
  return next();
};

/**
 * Validation skeleton for uploading resume.
 */
const validateUploadResume = (req, res, next) => {
  return next();
};

/**
 * Validation for retrieving public profile.
 */
const validatePublicProfile = (req, res, next) => {
  const { username } = req.params;
  const errors = [];

  if (!username || username.trim() === '') {
    errors.push({ field: 'username', message: 'Username parameter is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Public profile validation failed', errors));
  }

  return next();
};

/**
 * Validation skeleton for admin searching users.
 */
const validateAdminUserSearch = (req, res, next) => {
  return next();
};

module.exports = {
  validateGetCurrentProfile,
  validateUpdateProfile,
  validateUploadProfilePhoto,
  validateUploadResume,
  validatePublicProfile,
  validateAdminUserSearch,
};
