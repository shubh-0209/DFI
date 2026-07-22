const ValidationError = require('../../utils/errors/ValidationError');
const {
  TYPES,
  PRIORITY,
  TARGET_AUDIENCE,
  STATUS,
  VALIDATION,
} = require('./announcement.constants');

const validateCreateAnnouncement = (req, res, next) => {
  const errors = [];
  const {
    title,
    message,
    type,
    priority,
    targetAudience,
    scheduledAt,
    expiresAt,
    specificUsers,
    attachments,
    status,
  } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (title.trim().length > VALIDATION.TITLE_MAX_LENGTH) {
    errors.push({
      field: 'title',
      message: `Title cannot exceed ${VALIDATION.TITLE_MAX_LENGTH} characters`,
    });
  }

  if (!message || typeof message !== 'string' || message.trim() === '') {
    errors.push({ field: 'message', message: 'Message is required' });
  } else if (message.trim().length > VALIDATION.MESSAGE_MAX_LENGTH) {
    errors.push({
      field: 'message',
      message: `Message cannot exceed ${VALIDATION.MESSAGE_MAX_LENGTH} characters`,
    });
  }

  if (type && !Object.values(TYPES).includes(type)) {
    errors.push({ field: 'type', message: 'Invalid announcement type' });
  }

  if (priority && !Object.values(PRIORITY).includes(priority)) {
    errors.push({ field: 'priority', message: 'Invalid priority level' });
  }

  if (targetAudience && !Object.values(TARGET_AUDIENCE).includes(targetAudience)) {
    errors.push({ field: 'targetAudience', message: 'Invalid target audience' });
  }

  if (targetAudience === TARGET_AUDIENCE.SPECIFIC_USERS) {
    if (!Array.isArray(specificUsers) || specificUsers.length === 0) {
      errors.push({
        field: 'specificUsers',
        message: 'specificUsers must be a non-empty array when targetAudience is specific_users',
      });
    }
  }

  if (scheduledAt !== undefined && scheduledAt !== null && scheduledAt !== '') {
    const date = new Date(scheduledAt);
    if (isNaN(date.getTime())) {
      errors.push({ field: 'scheduledAt', message: 'scheduledAt must be a valid date' });
    }
  }

  if (expiresAt !== undefined && expiresAt !== null && expiresAt !== '') {
    const date = new Date(expiresAt);
    if (isNaN(date.getTime())) {
      errors.push({ field: 'expiresAt', message: 'expiresAt must be a valid date' });
    }
    if (new Date(expiresAt) <= new Date()) {
      errors.push({ field: 'expiresAt', message: 'expiresAt must be in the future' });
    }
  }

  if (attachments !== undefined && Array.isArray(attachments)) {
    if (attachments.length > VALIDATION.ATTACHMENTS_MAX) {
      errors.push({
        field: 'attachments',
        message: `Cannot exceed ${VALIDATION.ATTACHMENTS_MAX} attachments`,
      });
    }
    for (let i = 0; i < attachments.length; i++) {
      const a = attachments[i];
      if (!a || typeof a !== 'object') {
        errors.push({ field: `attachments[${i}]`, message: 'Each attachment must be an object' });
        continue;
      }
      if (!a.url || typeof a.url !== 'string' || a.url.trim() === '') {
        errors.push({ field: `attachments[${i}].url`, message: 'Attachment url is required' });
      }
    }
  }

  if (status && !Object.values(STATUS).includes(status)) {
    errors.push({ field: 'status', message: 'Invalid announcement status' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Announcement creation validation failed', errors));
  }

  return next();
};

const validateUpdateAnnouncement = (req, res, next) => {
  const errors = [];
  const {
    title,
    message,
    type,
    priority,
    targetAudience,
    scheduledAt,
    expiresAt,
    specificUsers,
    attachments,
    status,
  } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      errors.push({ field: 'title', message: 'Title cannot be empty' });
    } else if (title.trim().length > VALIDATION.TITLE_MAX_LENGTH) {
      errors.push({
        field: 'title',
        message: `Title cannot exceed ${VALIDATION.TITLE_MAX_LENGTH} characters`,
      });
    }
  }

  if (message !== undefined) {
    if (typeof message !== 'string' || message.trim() === '') {
      errors.push({ field: 'message', message: 'Message cannot be empty' });
    } else if (message.trim().length > VALIDATION.MESSAGE_MAX_LENGTH) {
      errors.push({
        field: 'message',
        message: `Message cannot exceed ${VALIDATION.MESSAGE_MAX_LENGTH} characters`,
      });
    }
  }

  if (type !== undefined && !Object.values(TYPES).includes(type)) {
    errors.push({ field: 'type', message: 'Invalid announcement type' });
  }

  if (priority !== undefined && !Object.values(PRIORITY).includes(priority)) {
    errors.push({ field: 'priority', message: 'Invalid priority level' });
  }

  if (targetAudience !== undefined && !Object.values(TARGET_AUDIENCE).includes(targetAudience)) {
    errors.push({ field: 'targetAudience', message: 'Invalid target audience' });
  }

  if (targetAudience === TARGET_AUDIENCE.SPECIFIC_USERS && !Array.isArray(specificUsers)) {
    errors.push({
      field: 'specificUsers',
      message: 'specificUsers must be an array when targetAudience is specific_users',
    });
  }

  if (scheduledAt !== undefined && scheduledAt !== null && scheduledAt !== '') {
    const date = new Date(scheduledAt);
    if (isNaN(date.getTime())) {
      errors.push({ field: 'scheduledAt', message: 'scheduledAt must be a valid date' });
    }
  }

  if (expiresAt !== undefined && expiresAt !== null && expiresAt !== '') {
    const date = new Date(expiresAt);
    if (isNaN(date.getTime())) {
      errors.push({ field: 'expiresAt', message: 'expiresAt must be a valid date' });
    }
  }

  if (attachments !== undefined && Array.isArray(attachments)) {
    if (attachments.length > VALIDATION.ATTACHMENTS_MAX) {
      errors.push({
        field: 'attachments',
        message: `Cannot exceed ${VALIDATION.ATTACHMENTS_MAX} attachments`,
      });
    }
    for (let i = 0; i < attachments.length; i++) {
      const a = attachments[i];
      if (!a || typeof a !== 'object') {
        errors.push({ field: `attachments[${i}]`, message: 'Each attachment must be an object' });
        continue;
      }
      if (!a.url || typeof a.url !== 'string' || a.url.trim() === '') {
        errors.push({ field: `attachments[${i}].url`, message: 'Attachment url is required' });
      }
    }
  }

  if (status !== undefined && !Object.values(STATUS).includes(status)) {
    errors.push({ field: 'status', message: 'Invalid announcement status' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Announcement update validation failed', errors));
  }

  return next();
};

const validateGetAnnouncement = (req, res, next) => {
  const { id } = req.params;

  if (!id || id.trim() === '') {
    return next(
      new ValidationError('Announcement ID is required', [
        { field: 'id', message: 'Announcement ID is required' },
      ])
    );
  }

  return next();
};

const validateGetAnnouncements = (req, res, next) => {
  const errors = [];
  const { page, limit, type, priority, targetAudience, status, sortBy, order } = req.query;

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

  if (type !== undefined && type !== '' && !Object.values(TYPES).includes(type)) {
    errors.push({ field: 'type', message: 'Invalid announcement type filter' });
  }

  if (priority !== undefined && priority !== '' && !Object.values(PRIORITY).includes(priority)) {
    errors.push({ field: 'priority', message: 'Invalid priority filter' });
  }

  if (targetAudience !== undefined && targetAudience !== '' && !Object.values(TARGET_AUDIENCE).includes(targetAudience)) {
    errors.push({ field: 'targetAudience', message: 'Invalid target audience filter' });
  }

  if (status !== undefined && status !== '' && !Object.values(STATUS).includes(status)) {
    errors.push({ field: 'status', message: 'Invalid announcement status filter' });
  }

  if (sortBy !== undefined && sortBy !== '') {
    const allowedSortFields = ['createdAt', 'updatedAt', 'priority', 'type', 'scheduledAt', 'expiresAt'];
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
    return next(new ValidationError('Announcements query validation failed', errors));
  }

  return next();
};

const validateStatusTransition = (req, res, next) => {
  const errors = [];
  const { status } = req.body;

  if (!status || !Object.values(STATUS).includes(status)) {
    errors.push({ field: 'status', message: 'Valid status is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Status transition validation failed', errors));
  }

  return next();
};

module.exports = {
  validateCreateAnnouncement,
  validateUpdateAnnouncement,
  validateGetAnnouncement,
  validateGetAnnouncements,
  validateStatusTransition,
};
