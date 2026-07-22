const ValidationError = require('../../utils/errors/ValidationError');
const { PROGRAM_MODE, PROGRAM_STATUS } = require('./program.constants');

const validateCreateProgram = (req, res, next) => {
  const {
    title,
    shortDescription,
    description,
    category,
    tags,
    mode,
    maxVolunteers,
    startDate,
    endDate,
    registrationDeadline,
    customFields,
    rewardCoins,
  } = req.body;

  const errors = [];

  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (title.trim().length < 3 || title.trim().length > 150) {
    errors.push({ field: 'title', message: 'Title must be between 3 and 150 characters' });
  }

  if (shortDescription !== undefined) {
    if (typeof shortDescription !== 'string') {
      errors.push({ field: 'shortDescription', message: 'Short description must be a string' });
    } else if (shortDescription.trim().length > 300) {
      errors.push({
        field: 'shortDescription',
        message: 'Short description cannot exceed 300 characters',
      });
    }
  }

  if (description !== undefined) {
    if (typeof description !== 'string') {
      errors.push({ field: 'description', message: 'Description must be a string' });
    } else if (description.trim().length > 10000) {
      errors.push({ field: 'description', message: 'Description cannot exceed 10000 characters' });
    }
  }

  if (category !== undefined) {
    if (typeof category !== 'string' || category.trim() === '') {
      errors.push({ field: 'category', message: 'Category must be a non-empty string' });
    } else if (category.trim().length > 50) {
      errors.push({ field: 'category', message: 'Category cannot exceed 50 characters' });
    }
  }

  if (tags !== undefined) {
    if (!Array.isArray(tags)) {
      errors.push({ field: 'tags', message: 'Tags must be an array of strings' });
    } else {
      tags.forEach((tag, index) => {
        if (typeof tag !== 'string') {
          errors.push({ field: `tags[${index}]`, message: 'Each tag must be a string' });
        } else if (tag.trim().length > 30) {
          errors.push({ field: `tags[${index}]`, message: 'Each tag cannot exceed 30 characters' });
        }
      });
    }
  }

  if (mode !== undefined && !Object.values(PROGRAM_MODE).includes(mode)) {
    errors.push({
      field: 'mode',
      message: `Mode must be one of: ${Object.values(PROGRAM_MODE).join(', ')}`,
    });
  }

  if (maxVolunteers !== undefined) {
    if (typeof maxVolunteers !== 'number' || !Number.isInteger(maxVolunteers)) {
      errors.push({ field: 'maxVolunteers', message: 'Max volunteers must be an integer' });
    } else if (maxVolunteers < 1 || maxVolunteers > 100000) {
      errors.push({
        field: 'maxVolunteers',
        message: 'Max volunteers must be between 1 and 100000',
      });
    }
  }

  if (rewardCoins !== undefined) {
    if (typeof rewardCoins !== 'number' || !Number.isInteger(rewardCoins)) {
      errors.push({ field: 'rewardCoins', message: 'Reward coins must be an integer' });
    } else if (rewardCoins < 0 || rewardCoins > 10000) {
      errors.push({
        field: 'rewardCoins',
        message: 'Reward coins must be between 0 and 10000',
      });
    }
  }

  if (startDate !== undefined) {
    const parsedDate = new Date(startDate);
    if (isNaN(parsedDate.getTime())) {
      errors.push({ field: 'startDate', message: 'Start date must be a valid date' });
    }
  }

  if (endDate !== undefined) {
    const parsedDate = new Date(endDate);
    if (isNaN(parsedDate.getTime())) {
      errors.push({ field: 'endDate', message: 'End date must be a valid date' });
    }
  }

  if (registrationDeadline !== undefined) {
    const parsedDate = new Date(registrationDeadline);
    if (isNaN(parsedDate.getTime())) {
      errors.push({
        field: 'registrationDeadline',
        message: 'Registration deadline must be a valid date',
      });
    }
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start >= end) {
      errors.push({ field: 'endDate', message: 'End date must be after start date' });
    }
  }

  if (customFields !== undefined) {
    if (typeof customFields !== 'object' || customFields === null || Array.isArray(customFields)) {
      errors.push({ field: 'customFields', message: 'Custom fields must be an object' });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError('Program creation validation failed', errors));
  }

  return next();
};

const validateUpdateProgram = (req, res, next) => {
  const {
    title,
    shortDescription,
    description,
    category,
    tags,
    mode,
    approvalRequired,
    maxVolunteers,
    startDate,
    endDate,
    registrationDeadline,
    customFields,
    rewardCoins,
  } = req.body;

  const errors = [];

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      errors.push({ field: 'title', message: 'Title cannot be empty' });
    } else if (title.trim().length < 3 || title.trim().length > 150) {
      errors.push({ field: 'title', message: 'Title must be between 3 and 150 characters' });
    }
  }

  if (shortDescription !== undefined) {
    if (typeof shortDescription !== 'string') {
      errors.push({ field: 'shortDescription', message: 'Short description must be a string' });
    } else if (shortDescription.trim().length > 300) {
      errors.push({
        field: 'shortDescription',
        message: 'Short description cannot exceed 300 characters',
      });
    }
  }

  if (description !== undefined) {
    if (typeof description !== 'string') {
      errors.push({ field: 'description', message: 'Description must be a string' });
    } else if (description.trim().length > 10000) {
      errors.push({ field: 'description', message: 'Description cannot exceed 10000 characters' });
    }
  }

  if (category !== undefined) {
    if (typeof category !== 'string' || category.trim() === '') {
      errors.push({ field: 'category', message: 'Category must be a non-empty string' });
    } else if (category.trim().length > 50) {
      errors.push({ field: 'category', message: 'Category cannot exceed 50 characters' });
    }
  }

  if (tags !== undefined) {
    if (!Array.isArray(tags)) {
      errors.push({ field: 'tags', message: 'Tags must be an array of strings' });
    } else {
      tags.forEach((tag, index) => {
        if (typeof tag !== 'string') {
          errors.push({ field: `tags[${index}]`, message: 'Each tag must be a string' });
        } else if (tag.trim().length > 30) {
          errors.push({ field: `tags[${index}]`, message: 'Each tag cannot exceed 30 characters' });
        }
      });
    }
  }

  if (mode !== undefined && !Object.values(PROGRAM_MODE).includes(mode)) {
    errors.push({
      field: 'mode',
      message: `Mode must be one of: ${Object.values(PROGRAM_MODE).join(', ')}`,
    });
  }

  if (approvalRequired !== undefined && typeof approvalRequired !== 'boolean') {
    errors.push({ field: 'approvalRequired', message: 'Approval required must be a boolean' });
  }

  if (maxVolunteers !== undefined) {
    if (typeof maxVolunteers !== 'number' || !Number.isInteger(maxVolunteers)) {
      errors.push({ field: 'maxVolunteers', message: 'Max volunteers must be an integer' });
    } else if (maxVolunteers < 1 || maxVolunteers > 100000) {
      errors.push({
        field: 'maxVolunteers',
        message: 'Max volunteers must be between 1 and 100000',
      });
    }
  }

  if (rewardCoins !== undefined) {
    if (typeof rewardCoins !== 'number' || !Number.isInteger(rewardCoins)) {
      errors.push({ field: 'rewardCoins', message: 'Reward coins must be an integer' });
    } else if (rewardCoins < 0 || rewardCoins > 10000) {
      errors.push({
        field: 'rewardCoins',
        message: 'Reward coins must be between 0 and 10000',
      });
    }
  }

  if (startDate !== undefined) {
    const parsedDate = new Date(startDate);
    if (isNaN(parsedDate.getTime())) {
      errors.push({ field: 'startDate', message: 'Start date must be a valid date' });
    }
  }

  if (endDate !== undefined) {
    const parsedDate = new Date(endDate);
    if (isNaN(parsedDate.getTime())) {
      errors.push({ field: 'endDate', message: 'End date must be a valid date' });
    }
  }

  if (registrationDeadline !== undefined) {
    const parsedDate = new Date(registrationDeadline);
    if (isNaN(parsedDate.getTime())) {
      errors.push({
        field: 'registrationDeadline',
        message: 'Registration deadline must be a valid date',
      });
    }
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start >= end) {
      errors.push({ field: 'endDate', message: 'End date must be after start date' });
    }
  }

  if (customFields !== undefined) {
    if (typeof customFields !== 'object' || customFields === null || Array.isArray(customFields)) {
      errors.push({ field: 'customFields', message: 'Custom fields must be an object' });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError('Program update validation failed', errors));
  }

  return next();
};

const validateGetProgram = (req, res, next) => {
  const { id } = req.params;
  const errors = [];

  if (!id || id.trim() === '') {
    errors.push({ field: 'id', message: 'Program ID is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Program validation failed', errors));
  }

  return next();
};

const validateListPrograms = (req, res, next) => {
  const { page, limit, sortBy, sortOrder, mode, status } = req.query;
  const errors = [];

  const validSortFields = ['createdAt', 'startDate', 'registrationDeadline', 'title', 'status'];
  const validSortOrders = ['asc', 'desc'];
  const validModes = Object.values(PROGRAM_MODE);
  const validStatuses = Object.values(PROGRAM_STATUS);

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

  if (sortBy !== undefined && !validSortFields.includes(sortBy)) {
    errors.push({
      field: 'sortBy',
      message: `Invalid sortBy. Valid fields: ${validSortFields.join(', ')}`,
    });
  }

  if (sortOrder !== undefined && !validSortOrders.includes(sortOrder)) {
    errors.push({
      field: 'sortOrder',
      message: `Invalid sortOrder. Valid values: ${validSortOrders.join(', ')}`,
    });
  }

  if (mode !== undefined && !validModes.includes(mode)) {
    errors.push({ field: 'mode', message: `Invalid mode. Valid values: ${validModes.join(', ')}` });
  }

  if (status !== undefined && !validStatuses.includes(status)) {
    errors.push({
      field: 'status',
      message: `Invalid status. Valid values: ${validStatuses.join(', ')}`,
    });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Program list validation failed', errors));
  }

  return next();
};

const validateChangeProgramStatus = (req, res, next) => {
  const { status } = req.body;
  const { id } = req.params;
  const errors = [];

  const validStatuses = Object.values(PROGRAM_STATUS);

  if (!id || id.trim() === '') {
    errors.push({ field: 'id', message: 'Program ID is required' });
  }

  if (status === undefined) {
    errors.push({ field: 'status', message: 'Status is required' });
  } else if (!validStatuses.includes(status)) {
    errors.push({
      field: 'status',
      message: `Invalid status. Valid values: ${validStatuses.join(', ')}`,
    });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Program status change validation failed', errors));
  }

  return next();
};

const validatePublishProgram = (req, res, next) => {
  const { id } = req.params;
  const errors = [];

  if (!id || id.trim() === '') {
    errors.push({ field: 'id', message: 'Program ID is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Program validation failed', errors));
  }

  return next();
};

const validateArchiveProgram = (req, res, next) => {
  const { id } = req.params;
  const errors = [];

  if (!id || id.trim() === '') {
    errors.push({ field: 'id', message: 'Program ID is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Program validation failed', errors));
  }

  return next();
};

const validateRestoreProgram = (req, res, next) => {
  const { id } = req.params;
  const errors = [];

  if (!id || id.trim() === '') {
    errors.push({ field: 'id', message: 'Program ID is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Program validation failed', errors));
  }

  return next();
};

const validateDeleteProgram = (req, res, next) => {
  const { id } = req.params;
  const errors = [];

  if (!id || id.trim() === '') {
    errors.push({ field: 'id', message: 'Program ID is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Program validation failed', errors));
  }

  return next();
};

module.exports = {
  validateCreateProgram,
  validateUpdateProgram,
  validateGetProgram,
  validateListPrograms,
  validatePublishProgram,
  validateArchiveProgram,
  validateRestoreProgram,
  validateDeleteProgram,
  validateChangeProgramStatus,
};
