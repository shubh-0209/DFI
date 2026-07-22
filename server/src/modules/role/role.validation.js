const ValidationError = require('../../utils/errors/ValidationError');

const validateCreateRole = (req, res, next) => {
  const { name, slug, description, permissions } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push({ field: 'name', message: 'Role name is required' });
  } else if (name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Role name cannot exceed 100 characters' });
  }

  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    errors.push({ field: 'slug', message: 'Role slug is required' });
  } else if (!/^[a-z0-9_]+$/.test(slug.trim())) {
    errors.push({ field: 'slug', message: 'Slug must be lowercase letters, numbers, and underscores only' });
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.push({ field: 'description', message: 'Description must be a string' });
  }

  if (permissions && !Array.isArray(permissions)) {
    errors.push({ field: 'permissions', message: 'Permissions must be an array' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Role validation failed', errors));
  }

  return next();
};

const validateRoleId = (req, res, next) => {
  const { id } = req.params;
  const errors = [];

  if (!id || id.trim() === '') {
    errors.push({ field: 'id', message: 'Role ID is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Role ID validation failed', errors));
  }

  return next();
};

module.exports = {
  validateCreateRole,
  validateRoleId,
};