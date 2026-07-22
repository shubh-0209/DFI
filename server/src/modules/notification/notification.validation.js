const ValidationError = require('../../utils/errors/ValidationError');
const { NOTIFICATION_TYPES, CATEGORY, PRIORITY, CHANNEL, VALIDATION } = require('./notification.constants');

const validateCreateNotification = (req, res, next) => {
  const errors = [];
  const {
    recipientId,
    senderId,
    title,
    message,
    type,
    category,
    priority,
    channel,
    relatedEntityType,
    relatedEntityId,
    scheduledFor,
    expiresAt,
    metadata,
  } = req.body;

  if (recipientId !== undefined) {
    if (typeof recipientId !== 'string' || recipientId.trim() === '') {
      errors.push({ field: 'recipientId', message: 'Recipient ID is required' });
    }
  }

  if (senderId !== undefined && senderId !== null) {
    if (typeof senderId !== 'string' || senderId.trim() === '') {
      errors.push({ field: 'senderId', message: 'Sender ID must be a valid string' });
    }
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      errors.push({ field: 'title', message: 'Title is required' });
    } else if (title.trim().length > VALIDATION.TITLE_MAX_LENGTH) {
      errors.push({
        field: 'title',
        message: `Title cannot exceed ${VALIDATION.TITLE_MAX_LENGTH} characters`,
      });
    }
  }

  if (message !== undefined) {
    if (typeof message !== 'string' || message.trim() === '') {
      errors.push({ field: 'message', message: 'Message is required' });
    } else if (message.trim().length > VALIDATION.MESSAGE_MAX_LENGTH) {
      errors.push({
        field: 'message',
        message: `Message cannot exceed ${VALIDATION.MESSAGE_MAX_LENGTH} characters`,
      });
    }
  }

  if (type !== undefined) {
    if (!Object.values(NOTIFICATION_TYPES).includes(type)) {
      errors.push({ field: 'type', message: 'Invalid notification type' });
    }
  }

  if (category !== undefined) {
    if (!Object.values(CATEGORY).includes(category)) {
      errors.push({ field: 'category', message: 'Invalid category' });
    }
  }

  if (priority !== undefined) {
    if (!Object.values(PRIORITY).includes(priority)) {
      errors.push({ field: 'priority', message: 'Invalid priority level' });
    }
  }

  if (channel !== undefined) {
    if (!Object.values(CHANNEL).includes(channel)) {
      errors.push({ field: 'channel', message: 'Invalid channel' });
    }
  }

  if (relatedEntityType !== undefined && relatedEntityType !== null) {
    if (typeof relatedEntityType !== 'string' || relatedEntityType.trim() === '') {
      errors.push({ field: 'relatedEntityType', message: 'Related entity type must be a valid string' });
    }
  }

  if (relatedEntityId !== undefined && relatedEntityId !== null) {
    if (typeof relatedEntityId !== 'string' || relatedEntityId.trim() === '') {
      errors.push({ field: 'relatedEntityId', message: 'Related entity ID must be a valid string' });
    }
  }

  if (scheduledFor !== undefined && scheduledFor !== null) {
    const date = new Date(scheduledFor);
    if (isNaN(date.getTime())) {
      errors.push({ field: 'scheduledFor', message: 'Scheduled for must be a valid date' });
    }
  }

  if (expiresAt !== undefined && expiresAt !== null) {
    const date = new Date(expiresAt);
    if (isNaN(date.getTime())) {
      errors.push({ field: 'expiresAt', message: 'Expires at must be a valid date' });
    }
  }

  if (metadata !== undefined && metadata !== null && typeof metadata !== 'object') {
    errors.push({ field: 'metadata', message: 'Metadata must be an object' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Notification creation validation failed', errors));
  }

  return next();
};

const validateGetNotifications = (req, res, next) => {
  const errors = [];
  const { page, limit, type, category, priority, isRead, startDate, endDate, sortBy, order } = req.query;

  if (page !== undefined) {
    const pageNum = Number(page);
    if (!Number.isInteger(pageNum) || pageNum < 1) {
      errors.push({ field: 'page', message: 'Page must be a positive integer' });
    }
  }

  if (limit !== undefined) {
    const limitNum = Number(limit);
    if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push({ field: 'limit', message: 'Limit must be an integer between 1 and 100' });
    }
  }

  if (type !== undefined && type !== '') {
    if (!Object.values(NOTIFICATION_TYPES).includes(type)) {
      errors.push({ field: 'type', message: 'Invalid notification type filter' });
    }
  }

  if (category !== undefined && category !== '') {
    if (!Object.values(CATEGORY).includes(category)) {
      errors.push({ field: 'category', message: 'Invalid category filter' });
    }
  }

  if (priority !== undefined && priority !== '') {
    if (!Object.values(PRIORITY).includes(priority)) {
      errors.push({ field: 'priority', message: 'Invalid priority filter' });
    }
  }

  if (isRead !== undefined && isRead !== '') {
    if (isRead !== 'true' && isRead !== 'false') {
      errors.push({ field: 'isRead', message: 'isRead must be true or false' });
    }
  }

  if (startDate !== undefined && startDate !== '') {
    const date = new Date(startDate);
    if (isNaN(date.getTime())) {
      errors.push({ field: 'startDate', message: 'startDate must be a valid date' });
    }
  }

  if (endDate !== undefined && endDate !== '') {
    const date = new Date(endDate);
    if (isNaN(date.getTime())) {
      errors.push({ field: 'endDate', message: 'endDate must be a valid date' });
    }
  }

  if (sortBy !== undefined && sortBy !== '') {
    const allowedSortFields = ['createdAt', 'updatedAt', 'priority', 'type', 'isRead'];
    if (!allowedSortFields.includes(sortBy)) {
      errors.push({ field: 'sortBy', message: `sortBy must be one of: ${allowedSortFields.join(', ')}` });
    }
  }

  if (order !== undefined && order !== '') {
    if (order !== 'asc' && order !== 'desc') {
      errors.push({ field: 'order', message: 'Order must be asc or desc' });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError('Notification query validation failed', errors));
  }

  return next();
};

const validateGetNotification = (req, res, next) => {
  const { id } = req.params;

  if (!id || id.trim() === '') {
    return next(new ValidationError('Notification ID is required', [
      { field: 'id', message: 'Notification ID is required' },
    ]));
  }

  return next();
};

const validateSearchNotifications = (req, res, next) => {
  const errors = [];
  const { search, page, limit, sortBy, order } = req.query;

  if (!search || search.trim() === '') {
    errors.push({ field: 'search', message: 'Search query is required' });
  }

  if (search !== undefined && typeof search !== 'string') {
    errors.push({ field: 'search', message: 'Search must be a string' });
  }

  if (page !== undefined) {
    const pageNum = Number(page);
    if (!Number.isInteger(pageNum) || pageNum < 1) {
      errors.push({ field: 'page', message: 'Page must be a positive integer' });
    }
  }

  if (limit !== undefined) {
    const limitNum = Number(limit);
    if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push({ field: 'limit', message: 'Limit must be an integer between 1 and 100' });
    }
  }

  if (sortBy !== undefined && sortBy !== '') {
    const allowedSortFields = ['createdAt', 'updatedAt', 'priority', 'type', 'isRead'];
    if (!allowedSortFields.includes(sortBy)) {
      errors.push({ field: 'sortBy', message: `sortBy must be one of: ${allowedSortFields.join(', ')}` });
    }
  }

  if (order !== undefined && order !== '') {
    if (order !== 'asc' && order !== 'desc') {
      errors.push({ field: 'order', message: 'Order must be asc or desc' });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError('Notification search validation failed', errors));
  }

  return next();
};

const validateMarkAsRead = (req, res, next) => {
  const { id } = req.params;

  if (!id || id.trim() === '') {
    return next(new ValidationError('Notification ID is required', [
      { field: 'id', message: 'Notification ID is required' },
    ]));
  }

  return next();
};

const validateMarkAllAsRead = (req, res, next) => {
  return next();
};

const validateDeleteNotification = (req, res, next) => {
  const { id } = req.params;

  if (!id || id.trim() === '') {
    return next(new ValidationError('Notification ID is required', [
      { field: 'id', message: 'Notification ID is required' },
    ]));
  }

  return next();
};

const validateRestoreNotification = (req, res, next) => {
  const { id } = req.params;

  if (!id || id.trim() === '') {
    return next(new ValidationError('Notification ID is required', [
      { field: 'id', message: 'Notification ID is required' },
    ]));
  }

  return next();
};

const validateBroadcastNotification = (req, res, next) => {
  const errors = [];
  const { title, message, type, priority } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (title.trim().length > VALIDATION.TITLE_MAX_LENGTH) {
    errors.push({ field: 'title', message: `Title cannot exceed ${VALIDATION.TITLE_MAX_LENGTH} characters` });
  }

  if (!message || typeof message !== 'string' || message.trim() === '') {
    errors.push({ field: 'message', message: 'Message is required' });
  } else if (message.trim().length > VALIDATION.MESSAGE_MAX_LENGTH) {
    errors.push({ field: 'message', message: `Message cannot exceed ${VALIDATION.MESSAGE_MAX_LENGTH} characters` });
  }

  if (type && !Object.values(NOTIFICATION_TYPES).includes(type)) {
    errors.push({ field: 'type', message: 'Invalid notification type' });
  }

  if (priority && !Object.values(PRIORITY).includes(priority)) {
    errors.push({ field: 'priority', message: 'Invalid priority level' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Broadcast notification validation failed', errors));
  }

  return next();
};

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
  validateCreateNotification,
  validateGetNotifications,
  validateGetNotification,
  validateSearchNotifications,
  validateMarkAsRead,
  validateMarkAllAsRead,
  validateDeleteNotification,
  validateRestoreNotification,
  validateBroadcastNotification,
  validateGetPreferences,
  validateUpdatePreferences,
};
