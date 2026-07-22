const ORGANIZATION_TYPE = {
  NGO: 'ngo',
  TRUST: 'trust',
  COLLEGE: 'college',
  UNIVERSITY: 'university',
  CORPORATE: 'corporate',
  GOVERNMENT: 'government',
  COMMUNITY: 'community',
};

const VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};

const ORGANIZATION_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
  SUSPENDED: 'suspended',
};

const MEMBER_ROLE = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MANAGER: 'manager',
  COORDINATOR: 'coordinator',
  VOLUNTEER: 'volunteer',
  GUEST: 'guest',
};

const MESSAGES = {
  ORGANIZATION_CREATED: 'Organization created successfully',
  ORGANIZATION_UPDATED: 'Organization updated successfully',
  ORGANIZATION_FETCHED: 'Organization retrieved successfully',
  ORGANIZATION_DELETED: 'Organization deleted successfully',
  ORGANIZATION_RESTORED: 'Organization restored successfully',
  ORGANIZATION_APPROVED: 'Organization approved successfully',
  ORGANIZATION_REJECTED: 'Organization rejected successfully',
  ORGANIZATION_ACTIVATED: 'Organization activated successfully',
  ORGANIZATION_DEACTIVATED: 'Organization deactivated successfully',
  ORGANIZATION_ARCHIVED: 'Organization archived successfully',
  ADMIN_ASSIGNED: 'Admin assigned successfully',
  ADMIN_REMOVED: 'Admin removed successfully',
  OWNER_TRANSFERRED: 'Ownership transferred successfully',
  ORGANIZATION_NOT_FOUND: 'Organization not found',
  SLUG_ALREADY_EXISTS: 'Organization with this slug already exists',
  EMAIL_ALREADY_EXISTS: 'Organization with this email already exists',
  FORBIDDEN: 'You do not have permission to perform this action',
  USER_NOT_FOUND: 'User not found',
  INVALID_STATUS: 'Invalid organization status',
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

const ALLOWED_SORT_FIELDS = ['createdAt', 'name', 'foundedYear', 'organizationType'];
const ALLOWED_SORT_ORDERS = ['asc', 'desc'];

module.exports = {
  ORGANIZATION_TYPE,
  VERIFICATION_STATUS,
  ORGANIZATION_STATUS,
  MEMBER_ROLE,
  MESSAGES,
  PAGINATION,
  ALLOWED_SORT_FIELDS,
  ALLOWED_SORT_ORDERS,
};
