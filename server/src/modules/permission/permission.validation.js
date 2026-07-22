const ValidationError = require('../../utils/errors/ValidationError');
const { PERMISSION_MODULES, PERMISSION_CATEGORIES } = require('./permission.constants');

const validateCreatePermission = (req, res, next) => {
  const { code, module, action } = req.body;
  const errors = [];

  if (!code || typeof code !== 'string' || code.trim() === '') {
    errors.push({ field: 'code', message: 'Permission code is required' });
  }

  if (!module || typeof module !== 'string' || module.trim() === '') {
    errors.push({ field: 'module', message: 'Module is required' });
  } else if (!Object.values(PERMISSION_MODULES).includes(module)) {
    errors.push({ field: 'module', message: 'Invalid module value' });
  }

  if (!action || typeof action !== 'string' || action.trim() === '') {
    errors.push({ field: 'action', message: 'Action is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Permission validation failed', errors));
  }

  return next();
};

const validateListPermissions = (req, res, next) => {
  const errors = [];
  const validModules = Object.values(PERMISSION_MODULES);
  const validCategories = Object.values(PERMISSION_CATEGORIES);

  if (req.query.module && !validModules.includes(req.query.module)) {
    errors.push({ field: 'module', message: 'Invalid module filter' });
  }

  if (req.query.category && !validCategories.includes(req.query.category)) {
    errors.push({ field: 'category', message: 'Invalid category filter' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('List validation failed', errors));
  }

  return next();
};

module.exports = {
  validateCreatePermission,
  validateListPermissions,
};