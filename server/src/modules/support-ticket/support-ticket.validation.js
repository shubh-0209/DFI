const ValidationError = require('../../utils/errors/ValidationError');
const { VALIDATION, TICKET_PRIORITIES, TICKET_CATEGORIES, TICKET_STATUS } = require('./support-ticket.constants');

const validateCreateSupportTicket = (req, res, next) => {
  const errors = [];
  const { subject, description, category, priority, participantIds } = req.body;

  if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
    errors.push({ field: 'subject', message: 'Subject is required' });
  } else if (subject.trim().length > VALIDATION.SUBJECT_MAX_LENGTH) {
    errors.push({
      field: 'subject',
      message: `Subject cannot exceed ${VALIDATION.SUBJECT_MAX_LENGTH} characters`,
    });
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Description is required' });
  } else if (description.trim().length > VALIDATION.DESCRIPTION_MAX_LENGTH) {
    errors.push({
      field: 'description',
      message: `Description cannot exceed ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters`,
    });
  }

  if (category && !Object.values(TICKET_CATEGORIES).includes(category)) {
    errors.push({ field: 'category', message: 'Invalid ticket category' });
  }

  if (priority && !Object.values(TICKET_PRIORITIES).includes(priority)) {
    errors.push({ field: 'priority', message: 'Invalid ticket priority' });
  }

  if (participantIds !== undefined && (!Array.isArray(participantIds) || participantIds.length > 10)) {
    errors.push({ field: 'participantIds', message: 'participantIds must be an array with at most 10 items' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Create support ticket validation failed', errors));
  }

  return next();
};

const validateGetSupportTickets = (req, res, next) => {
  const errors = [];
  const { page, limit, status, priority } = req.query;

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

  if (status !== undefined && !Object.values(TICKET_STATUS).includes(status)) {
    errors.push({ field: 'status', message: 'Invalid ticket status filter' });
  }

  if (priority !== undefined && !Object.values(TICKET_PRIORITIES).includes(priority)) {
    errors.push({ field: 'priority', message: 'Invalid ticket priority filter' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Get support tickets validation failed', errors));
  }

  return next();
};

const validateSearchTickets = (req, res, next) => {
  const errors = [];
  const { search, status, priority, category, page, limit } = req.query;

  if (search !== undefined && (typeof search !== 'string' || search.trim().length === 0)) {
    errors.push({ field: 'search', message: 'Search query must be a non-empty string' });
  }

  if (status !== undefined && !Object.values(TICKET_STATUS).includes(status)) {
    errors.push({ field: 'status', message: 'Invalid ticket status filter' });
  }

  if (priority !== undefined && !Object.values(TICKET_PRIORITIES).includes(priority)) {
    errors.push({ field: 'priority', message: 'Invalid ticket priority filter' });
  }

  if (category !== undefined && !Object.values(TICKET_CATEGORIES).includes(category)) {
    errors.push({ field: 'category', message: 'Invalid ticket category filter' });
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

  if (errors.length > 0) {
    return next(new ValidationError('Search tickets validation failed', errors));
  }

  return next();
};

const validateGetSupportTicket = (req, res, next) => {
  const { id } = req.params;

  if (!id || id.trim() === '') {
    return next(new ValidationError('Support ticket ID is required'));
  }

  return next();
};

const validateUpdateSupportTicket = (req, res, next) => {
  const errors = [];
  const { id } = req.params;
  const { subject, description, priority, category, status } = req.body;

  if (!id || id.trim() === '') {
    errors.push({ field: 'id', message: 'Support ticket ID is required' });
  }

  if (subject !== undefined && (typeof subject !== 'string' || subject.trim().length === 0)) {
    errors.push({ field: 'subject', message: 'Subject must be a non-empty string' });
  }

  if (description !== undefined && (typeof description !== 'string' || description.trim().length === 0)) {
    errors.push({ field: 'description', message: 'Description must be a non-empty string' });
  }

  if (priority !== undefined && !Object.values(TICKET_PRIORITIES).includes(priority)) {
    errors.push({ field: 'priority', message: 'Invalid ticket priority' });
  }

  if (category !== undefined && !Object.values(TICKET_CATEGORIES).includes(category)) {
    errors.push({ field: 'category', message: 'Invalid ticket category' });
  }

  if (status !== undefined && !Object.values(TICKET_STATUS).includes(status)) {
    errors.push({ field: 'status', message: 'Invalid ticket status' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Update support ticket validation failed', errors));
  }

  return next();
};

const validateStatusUpdate = (req, res, next) => {
  const errors = [];
  const { status } = req.body;

  if (!status || typeof status !== 'string' || status.trim().length === 0) {
    errors.push({ field: 'status', message: 'Status is required' });
  } else if (!Object.values(TICKET_STATUS).includes(status)) {
    errors.push({ field: 'status', message: 'Invalid ticket status' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Status update validation failed', errors));
  }

  return next();
};

const validateAssignTicket = (req, res, next) => {
  const errors = [];
  const { id } = req.params;
  const { assignToUserId } = req.body;

  if (!id || id.trim() === '') {
    errors.push({ field: 'id', message: 'Support ticket ID is required' });
  }

  if (!assignToUserId || typeof assignToUserId !== 'string' || assignToUserId.trim() === '') {
    errors.push({ field: 'assignToUserId', message: 'assignToUserId is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Assign ticket validation failed', errors));
  }

  return next();
};

module.exports = {
  validateCreateSupportTicket,
  validateGetSupportTickets,
  validateGetSupportTicket,
  validateUpdateSupportTicket,
  validateAssignTicket,
  validateSearchTickets,
  validateStatusUpdate,
};
