/* global URL */
const ValidationError = require('../../utils/errors/ValidationError');
const { ORGANIZATION_TYPE, VERIFICATION_STATUS } = require('./organization.constants');

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validateCreateOrganization = (req, res, next) => {
  const { name, slug, email, phone, website, address, organizationType, pincode, foundedYear } =
    req.body;

  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push({ field: 'name', message: 'Organization name is required' });
  } else if (name.trim().length > 150) {
    errors.push({
      field: 'name',
      message: 'Organization name cannot exceed 150 characters',
    });
  }

  if (slug !== undefined) {
    if (typeof slug !== 'string' || slug.trim() === '') {
      errors.push({ field: 'slug', message: 'Slug must be a non-empty string' });
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.trim())) {
      errors.push({
        field: 'slug',
        message: 'Slug can only contain lowercase letters, numbers, and hyphens',
      });
    }
  }

  if (email !== undefined) {
    if (typeof email !== 'string' || email.trim() === '') {
      errors.push({ field: 'email', message: 'Email must be a non-empty string' });
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())
    ) {
      errors.push({ field: 'email', message: 'Email is not valid' });
    }
  }

  if (phone !== undefined) {
    if (typeof phone !== 'string' || phone.trim() === '') {
      errors.push({ field: 'phone', message: 'Phone must be a non-empty string' });
    } else if (!/^\+?[1-9]\d{1,14}$/.test(phone.trim())) {
      errors.push({ field: 'phone', message: 'Phone number is not valid' });
    }
  }

  if (website !== undefined) {
    if (typeof website !== 'string' || website.trim() === '') {
      errors.push({ field: 'website', message: 'Website must be a non-empty string' });
    } else if (!isValidUrl(website.trim())) {
      errors.push({ field: 'website', message: 'Website must be a valid URL' });
    }
  }

  if (address !== undefined) {
    if (typeof address !== 'string' || address.trim() === '') {
      errors.push({ field: 'address', message: 'Address must be a non-empty string' });
    } else if (address.trim().length > 200) {
      errors.push({ field: 'address', message: 'Address cannot exceed 200 characters' });
    }
  }

  if (organizationType !== undefined) {
    if (!Object.values(ORGANIZATION_TYPE).includes(organizationType)) {
      errors.push({
        field: 'organizationType',
        message: `Invalid organization type. Valid values: ${Object.values(ORGANIZATION_TYPE).join(', ')}`,
      });
    }
  }

  if (pincode !== undefined) {
    if (typeof pincode !== 'string' || pincode.trim() === '') {
      errors.push({ field: 'pincode', message: 'Pincode must be a non-empty string' });
    } else if (!/^[0-9]{4,10}$/.test(pincode.trim())) {
      errors.push({ field: 'pincode', message: 'Pincode must be 4-10 digits' });
    }
  }

  if (foundedYear !== undefined) {
    const year = parseInt(foundedYear, 10);
    if (isNaN(year) || year < 1000 || year > new Date().getFullYear()) {
      errors.push({ field: 'foundedYear', message: 'Founded year is not valid' });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError('Organization creation validation failed', errors));
  }

  return next();
};

const validateUpdateOrganization = (req, res, next) => {
  const {
    name,
    shortName,
    description,
    email,
    phone,
    website,
    address,
    socialLinks,
    foundedYear,
    organizationType,
    verificationStatus,
    isActive,
    admins,
  } = req.body;

  const errors = [];

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      errors.push({ field: 'name', message: 'Organization name cannot be empty' });
    } else if (name.trim().length > 150) {
      errors.push({
        field: 'name',
        message: 'Organization name cannot exceed 150 characters',
      });
    }
  }

  if (shortName !== undefined) {
    if (typeof shortName !== 'string' || shortName.trim() === '') {
      errors.push({ field: 'shortName', message: 'Short name must be a non-empty string' });
    } else if (shortName.trim().length > 50) {
      errors.push({ field: 'shortName', message: 'Short name cannot exceed 50 characters' });
    }
  }

  if (description !== undefined) {
    if (typeof description !== 'string' || description.trim() === '') {
      errors.push({ field: 'description', message: 'Description must be a non-empty string' });
    } else if (description.trim().length > 2000) {
      errors.push({ field: 'description', message: 'Description cannot exceed 2000 characters' });
    }
  }

  if (email !== undefined) {
    if (typeof email !== 'string' || email.trim() === '') {
      errors.push({ field: 'email', message: 'Email must be a non-empty string' });
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())
    ) {
      errors.push({ field: 'email', message: 'Email is not valid' });
    }
  }

  if (phone !== undefined) {
    if (typeof phone !== 'string' || phone.trim() === '') {
      errors.push({ field: 'phone', message: 'Phone must be a non-empty string' });
    } else if (!/^\+?[1-9]\d{1,14}$/.test(phone.trim())) {
      errors.push({ field: 'phone', message: 'Phone number is not valid' });
    }
  }

  if (website !== undefined) {
    if (typeof website !== 'string' || website.trim() === '') {
      errors.push({ field: 'website', message: 'Website must be a non-empty string' });
    } else if (!isValidUrl(website.trim())) {
      errors.push({ field: 'website', message: 'Website must be a valid URL' });
    }
  }

  if (address !== undefined) {
    if (typeof address !== 'string' || address.trim() === '') {
      errors.push({ field: 'address', message: 'Address must be a non-empty string' });
    } else if (address.trim().length > 200) {
      errors.push({ field: 'address', message: 'Address cannot exceed 200 characters' });
    }
  }

  if (organizationType !== undefined && !Object.values(ORGANIZATION_TYPE).includes(organizationType)) {
    errors.push({
      field: 'organizationType',
      message: `Invalid organization type. Valid values: ${Object.values(ORGANIZATION_TYPE).join(', ')}`,
    });
  }

  if (verificationStatus !== undefined && !Object.values(VERIFICATION_STATUS).includes(verificationStatus)) {
    errors.push({
      field: 'verificationStatus',
      message: `Invalid verification status. Valid values: ${Object.values(VERIFICATION_STATUS).join(', ')}`,
    });
  }

  if (isActive !== undefined && typeof isActive !== 'boolean') {
    errors.push({ field: 'isActive', message: 'isActive must be a boolean' });
  }

  if (admins !== undefined && !Array.isArray(admins)) {
    errors.push({ field: 'admins', message: 'Admins must be an array of user IDs' });
  }

  if (foundedYear !== undefined) {
    const year = parseInt(foundedYear, 10);
    if (isNaN(year) || year < 1000 || year > new Date().getFullYear()) {
      errors.push({ field: 'foundedYear', message: 'Founded year is not valid' });
    }
  }

  if (socialLinks !== undefined) {
    if (typeof socialLinks !== 'object' || socialLinks === null || Array.isArray(socialLinks)) {
      errors.push({ field: 'socialLinks', message: 'Social links must be an object' });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError('Organization update validation failed', errors));
  }

  return next();
};

const validateOrganizationId = (req, res, next) => {
  const { id } = req.params;
  const errors = [];

  if (!id || id.trim() === '') {
    errors.push({ field: 'id', message: 'Organization ID is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Organization validation failed', errors));
  }

  return next();
};

const validateListOrganizations = (req, res, next) => {
  const { page, limit, sortBy, sortOrder, organizationType, verificationStatus, isActive } =
    req.query;
  const errors = [];

  const validOrganizationTypes = Object.values(ORGANIZATION_TYPE);
  const validVerificationStatuses = Object.values(VERIFICATION_STATUS);

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

  if (sortBy !== undefined && !['createdAt', 'name', 'foundedYear', 'organizationType'].includes(sortBy)) {
    errors.push({
      field: 'sortBy',
      message: 'Invalid sortBy. Valid fields: createdAt, name, foundedYear, organizationType',
    });
  }

  if (sortOrder !== undefined && !['asc', 'desc'].includes(sortOrder)) {
    errors.push({ field: 'sortOrder', message: 'Invalid sortOrder. Valid values: asc, desc' });
  }

  if (organizationType !== undefined && !validOrganizationTypes.includes(organizationType)) {
    errors.push({
      field: 'organizationType',
      message: `Invalid organization type. Valid values: ${validOrganizationTypes.join(', ')}`,
    });
  }

  if (verificationStatus !== undefined && !validVerificationStatuses.includes(verificationStatus)) {
    errors.push({
      field: 'verificationStatus',
      message: `Invalid verification status. Valid values: ${validVerificationStatuses.join(', ')}`,
    });
  }

  if (isActive !== undefined && isActive !== 'true' && isActive !== 'false') {
    errors.push({ field: 'isActive', message: 'isActive must be a boolean' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Organization list validation failed', errors));
  }

  return next();
};

const validateApproveOrganization = (req, res, next) => {
  const { reviewNotes } = req.body;
  const errors = [];

  if (reviewNotes !== undefined && (typeof reviewNotes !== 'string' || reviewNotes.trim().length > 1000)) {
    errors.push({ field: 'reviewNotes', message: 'Review notes must be a string up to 1000 characters' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Approve validation failed', errors));
  }

  return next();
};

const validateRejectOrganization = (req, res, next) => {
  const { rejectionReason, reviewNotes } = req.body;
  const errors = [];

  if (rejectionReason !== undefined && (typeof rejectionReason !== 'string' || rejectionReason.trim().length > 500)) {
    errors.push({ field: 'rejectionReason', message: 'Rejection reason must be a string up to 500 characters' });
  }

  if (reviewNotes !== undefined && (typeof reviewNotes !== 'string' || reviewNotes.trim().length > 1000)) {
    errors.push({ field: 'reviewNotes', message: 'Review notes must be a string up to 1000 characters' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Reject validation failed', errors));
  }

  return next();
};

const validateAssignAdmin = (req, res, next) => {
  const { userId } = req.body;
  const errors = [];

  if (!userId || userId.trim() === '') {
    errors.push({ field: 'userId', message: 'User ID is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Assign admin validation failed', errors));
  }

  return next();
};

const validateTransferOwnership = (req, res, next) => {
  const { newOwnerId } = req.body;
  const errors = [];

  if (!newOwnerId || newOwnerId.trim() === '') {
    errors.push({ field: 'newOwnerId', message: 'New owner ID is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Transfer ownership validation failed', errors));
  }

  return next();
};

module.exports = {
  validateCreateOrganization,
  validateUpdateOrganization,
  validateOrganizationId,
  validateListOrganizations,
  validateApproveOrganization,
  validateRejectOrganization,
  validateAssignAdmin,
  validateTransferOwnership,
};
