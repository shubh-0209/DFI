const ValidationError = require('../../utils/errors/ValidationError');
const { STATUS, TASK_STATUS, MEMBER_ROLE } = require('./collaboration.constants');

const validateCreateWorkspace = (req, res, next) => {
  const { name, description } = req.body;
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push({ field: 'name', message: 'Workspace name is required' });
  }

  if (name && name.length > 100) {
    errors.push({ field: 'name', message: 'Workspace name cannot exceed 100 characters' });
  }

  if (description && description.length > 500) {
    errors.push({ field: 'description', message: 'Description cannot exceed 500 characters' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Workspace validation failed', errors));
  }

  return next();
};

const validateUpdateWorkspace = (req, res, next) => {
  const { name, description } = req.body;
  const errors = [];

  if (name !== undefined && (name === null || name.trim() === '')) {
    errors.push({ field: 'name', message: 'Workspace name cannot be empty' });
  }

  if (name && name.length > 100) {
    errors.push({ field: 'name', message: 'Workspace name cannot exceed 100 characters' });
  }

  if (description && description.length > 500) {
    errors.push({ field: 'description', message: 'Description cannot exceed 500 characters' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Workspace update validation failed', errors));
  }

  return next();
};

const validateGetWorkspaces = (req, res, next) => {
  const { page, limit, status } = req.query;
  const errors = [];

  if (page !== undefined) {
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      errors.push({ field: 'page', message: 'Page must be a positive integer' });
    }
  }

  if (limit !== undefined) {
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push({ field: 'limit', message: 'Limit must be between 1 and 100' });
    }
  }

  if (status !== undefined && status !== '' && !Object.values(STATUS).includes(status)) {
    errors.push({ field: 'status', message: 'Invalid status value' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

const validateGetWorkspace = (req, res, next) => {
  const { id } = req.params;
  const errors = [];

  if (!id || id.trim() === '') {
    errors.push({ field: 'id', message: 'Workspace ID is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

const validateAddNote = (req, res, next) => {
  const { title, content } = req.body;
  const errors = [];

  if (!content || content.trim() === '') {
    errors.push({ field: 'content', message: 'Note content is required' });
  }

  if (title && title.length > 100) {
    errors.push({ field: 'title', message: 'Note title cannot exceed 100 characters' });
  }

  if (content && content.length > 2000) {
    errors.push({ field: 'content', message: 'Note content cannot exceed 2000 characters' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Note validation failed', errors));
  }

  return next();
};

const validateAddFile = (req, res, next) => {
  const { name, url, size } = req.body;
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push({ field: 'name', message: 'File name is required' });
  }

  if (url && url.trim() === '') {
    errors.push({ field: 'url', message: 'File URL cannot be empty' });
  }

  if (size !== undefined && (typeof size !== 'number' || size < 0)) {
    errors.push({ field: 'size', message: 'File size must be a non-negative number' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('File validation failed', errors));
  }

  return next();
};

const validateAssignTask = (req, res, next) => {
  const { title, description, status } = req.body;
  const errors = [];

  if (!title || title.trim() === '') {
    errors.push({ field: 'title', message: 'Task title is required' });
  }

  if (title && title.length > 100) {
    errors.push({ field: 'title', message: 'Task title cannot exceed 100 characters' });
  }

  if (description && description.length > 500) {
    errors.push({ field: 'description', message: 'Task description cannot exceed 500 characters' });
  }

  if (status !== undefined && status !== '' && !Object.values(TASK_STATUS).includes(status)) {
    errors.push({ field: 'status', message: 'Invalid status value' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Task validation failed', errors));
  }

  return next();
};

const validateUpdateTask = (req, res, next) => {
  const { status, description } = req.body;
  const errors = [];

  if (status !== undefined && status !== '' && !Object.values(TASK_STATUS).includes(status)) {
    errors.push({ field: 'status', message: 'Invalid status value' });
  }

  if (description && description.length > 500) {
    errors.push({ field: 'description', message: 'Task description cannot exceed 500 characters' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Task update validation failed', errors));
  }

  return next();
};

const validateInviteUser = (req, res, next) => {
  const { email, userId, role } = req.body;
  const errors = [];

  if (!email && !userId) {
    errors.push({ field: 'emailOrUserId', message: 'Email or user ID is required' });
  }

  if (email && email.trim() === '') {
    errors.push({ field: 'email', message: 'Email cannot be empty' });
  }

  if (role && !Object.values(MEMBER_ROLE).includes(role)) {
    errors.push({ field: 'role', message: 'Invalid role value' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Invitation validation failed', errors));
  }

  return next();
};

const validateJoinRequest = (req, res, next) => {
  const { message } = req.body;
  const errors = [];

  if (message && message.length > 200) {
    errors.push({ field: 'message', message: 'Message cannot exceed 200 characters' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Join request validation failed', errors));
  }

  return next();
};

const validateReviewJoinRequest = (req, res, next) => {
  const { action } = req.body;
  const errors = [];

  if (!action || !['approved', 'declined'].includes(action)) {
    errors.push({ field: 'action', message: 'Action must be either approved or declined' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Review validation failed', errors));
  }

  return next();
};

const validateUpdateMemberRole = (req, res, next) => {
  const { role } = req.body;
  const errors = [];

  if (!role || !Object.values(MEMBER_ROLE).includes(role)) {
    errors.push({ field: 'role', message: 'Valid role is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Role update validation failed', errors));
  }

  return next();
};

const validateTimeline = (req, res, next) => {
  const { page, limit } = req.query;
  const errors = [];

  if (page !== undefined) {
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      errors.push({ field: 'page', message: 'Page must be a positive integer' });
    }
  }

  if (limit !== undefined) {
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push({ field: 'limit', message: 'Limit must be between 1 and 100' });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

module.exports = {
  validateCreateWorkspace,
  validateUpdateWorkspace,
  validateGetWorkspace,
  validateGetWorkspaces,
  validateAddNote,
  validateAddFile,
  validateAssignTask,
  validateUpdateTask,
  validateInviteUser,
  validateJoinRequest,
  validateReviewJoinRequest,
  validateUpdateMemberRole,
  validateTimeline,
};
