const ValidationError = require('../../utils/errors/ValidationError');

const validateCreateCategory = (req, res, next) => {
  const errors = [];
  const { name, slug, description } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push({ field: 'name', message: 'Category name is required' });
  }

  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    errors.push({ field: 'slug', message: 'Category slug is required' });
  }

  if (description && typeof description !== 'string') {
    errors.push({ field: 'description', message: 'Description must be a string' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

const validateUpdateCategory = (req, res, next) => {
  const errors = [];
  const { name, slug, description } = req.body;

  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    errors.push({ field: 'name', message: 'Category name cannot be empty' });
  }

  if (slug !== undefined && (typeof slug !== 'string' || slug.trim() === '')) {
    errors.push({ field: 'slug', message: 'Category slug cannot be empty' });
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.push({ field: 'description', message: 'Description must be a string' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

const validateCreateType = (req, res, next) => {
  const errors = [];
  const { name, slug, description } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push({ field: 'name', message: 'Type name is required' });
  }

  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    errors.push({ field: 'slug', message: 'Type slug is required' });
  }

  if (description && typeof description !== 'string') {
    errors.push({ field: 'description', message: 'Description must be a string' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

const validateUpdateType = (req, res, next) => {
  const errors = [];
  const { name, slug, description } = req.body;

  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    errors.push({ field: 'name', message: 'Type name cannot be empty' });
  }

  if (slug !== undefined && (typeof slug !== 'string' || slug.trim() === '')) {
    errors.push({ field: 'slug', message: 'Type slug cannot be empty' });
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.push({ field: 'description', message: 'Description must be a string' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

const validateCreateCoinRule = (req, res, next) => {
  const errors = [];
  const { name, coins } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push({ field: 'name', message: 'Coin rule name is required' });
  }

  if (coins === undefined || typeof coins !== 'number' || coins < 0) {
    errors.push({ field: 'coins', message: 'Coins must be a non-negative number' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

const validateCreateBadgeRule = (req, res, next) => {
  const errors = [];
  const { name, slug, description } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push({ field: 'name', message: 'Badge name is required' });
  }

  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    errors.push({ field: 'slug', message: 'Badge slug is required' });
  }

  if (description && typeof description !== 'string') {
    errors.push({ field: 'description', message: 'Description must be a string' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

const validateCreateReviewTemplate = (req, res, next) => {
  const errors = [];
  const { name, templateText, action } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push({ field: 'name', message: 'Template name is required' });
  }

  if (!templateText || typeof templateText !== 'string' || templateText.trim() === '') {
    errors.push({ field: 'templateText', message: 'Template text is required' });
  }

  if (action && !['approved', 'rejected', 'needs_changes'].includes(action)) {
    errors.push({ field: 'action', message: 'Invalid action' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

const validateCreateFileTypeConfig = (req, res, next) => {
  const errors = [];
  const { name, mimeType, extension, category, maxSize } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push({ field: 'name', message: 'File type name is required' });
  }

  if (!mimeType || typeof mimeType !== 'string' || mimeType.trim() === '') {
    errors.push({ field: 'mimeType', message: 'MIME type is required' });
  }

  if (!extension || typeof extension !== 'string' || extension.trim() === '') {
    errors.push({ field: 'extension', message: 'Extension is required' });
  }

  if (!category || !['image', 'document', 'video', 'archive', 'other'].includes(category)) {
    errors.push({ field: 'category', message: 'Invalid category' });
  }

  if (maxSize === undefined || typeof maxSize !== 'number' || maxSize < 0) {
    errors.push({ field: 'maxSize', message: 'Max size must be a non-negative number' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

const validateCreateTag = (req, res, next) => {
  const errors = [];
  const { name, slug, category } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push({ field: 'name', message: 'Tag name is required' });
  }

  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    errors.push({ field: 'slug', message: 'Tag slug is required' });
  }

  if (category && typeof category !== 'string') {
    errors.push({ field: 'category', message: 'Category must be a string' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

const validateCreateGenericConfig = (req, res, next) => {
  const errors = [];
  const { key, value, description } = req.body;

  if (!key || typeof key !== 'string' || key.trim() === '') {
    errors.push({ field: 'key', message: 'Config key is required' });
  }

  if (value === undefined) {
    errors.push({ field: 'value', message: 'Config value is required' });
  }

  if (description && typeof description !== 'string') {
    errors.push({ field: 'description', message: 'Description must be a string' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

const validateUpdateGenericConfig = (req, res, next) => {
  const errors = [];
  const { key, value, description } = req.body;

  if (key !== undefined && (typeof key !== 'string' || key.trim() === '')) {
    errors.push({ field: 'key', message: 'Config key cannot be empty' });
  }

  if (value === undefined) {
    errors.push({ field: 'value', message: 'Config value is required' });
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.push({ field: 'description', message: 'Description must be a string' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Validation failed', errors));
  }

  return next();
};

module.exports = {
  validateCreateCategory,
  validateUpdateCategory,
  validateCreateType,
  validateUpdateType,
  validateCreateCoinRule,
  validateCreateBadgeRule,
  validateCreateReviewTemplate,
  validateCreateFileTypeConfig,
  validateCreateTag,
  validateCreateGenericConfig,
  validateUpdateGenericConfig,
};
