const ValidationError = require('../../utils/errors/ValidationError');
const { NOTIFICATION_TYPES } = require('./notification.constants');

const validateGetPreferences = (req, res, next) => {
  return next();
};

const validateUpdatePreferences = (req, res, next) => {
  const errors = [];
  const { inAppEnabled, emailEnabled, pushEnabled, smsEnabled, types, quietHours, digestFrequency } = req.body;

  if (inAppEnabled !== undefined && typeof inAppEnabled !== 'boolean') {
    errors.push({ field: 'inAppEnabled', message: 'inAppEnabled must be a boolean' });
  }

  if (emailEnabled !== undefined && typeof emailEnabled !== 'boolean') {
    errors.push({ field: 'emailEnabled', message: 'emailEnabled must be a boolean' });
  }

  if (pushEnabled !== undefined && typeof pushEnabled !== 'boolean') {
    errors.push({ field: 'pushEnabled', message: 'pushEnabled must be a boolean' });
  }

  if (smsEnabled !== undefined && typeof smsEnabled !== 'boolean') {
    errors.push({ field: 'smsEnabled', message: 'smsEnabled must be a boolean' });
  }

  if (types !== undefined) {
    if (typeof types !== 'object' || Array.isArray(types)) {
      errors.push({ field: 'types', message: 'types must be an object' });
    } else {
      const validTypes = Object.values(NOTIFICATION_TYPES);
      const invalidKeys = Object.keys(types).filter((key) => !validTypes.includes(key));
      if (invalidKeys.length > 0) {
        errors.push({ field: 'types', message: `Invalid notification types: ${invalidKeys.join(', ')}` });
      }
      for (const [key, value] of Object.entries(types)) {
        if (typeof value !== 'boolean') {
          errors.push({ field: `types.${key}`, message: 'Each type value must be a boolean' });
        }
      }
    }
  }

  if (quietHours !== undefined && typeof quietHours !== 'object') {
    errors.push({ field: 'quietHours', message: 'quietHours must be an object' });
  } else if (quietHours && typeof quietHours === 'object') {
    if (quietHours.enabled !== undefined && typeof quietHours.enabled !== 'boolean') {
      errors.push({ field: 'quietHours.enabled', message: 'quietHours.enabled must be a boolean' });
    }
    if (quietHours.startTime !== undefined && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(quietHours.startTime)) {
      errors.push({ field: 'quietHours.startTime', message: 'quietHours.startTime must be in HH:MM format' });
    }
    if (quietHours.endTime !== undefined && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(quietHours.endTime)) {
      errors.push({ field: 'quietHours.endTime', message: 'quietHours.endTime must be in HH:MM format' });
    }
  }

  if (digestFrequency !== undefined) {
    const validFrequencies = ['instant', 'daily', 'weekly'];
    if (!validFrequencies.includes(digestFrequency)) {
      errors.push({ field: 'digestFrequency', message: 'digestFrequency must be one of: instant, daily, weekly' });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError('Notification preferences validation failed', errors));
  }

  return next();
};

module.exports = {
  validateGetPreferences,
  validateUpdatePreferences,
};
