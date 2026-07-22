const PROGRAM_STATUS = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  PUBLISHED: 'published',
  REGISTRATION_CLOSED: 'registration_closed',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ARCHIVED: 'archived',
};

const PROGRAM_MODE = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  HYBRID: 'hybrid',
};

const MESSAGES = {
  PROGRAM_CREATED: 'Program created successfully',
  PROGRAM_UPDATED: 'Program updated successfully',
  PROGRAM_DELETED: 'Program deleted successfully',
  PROGRAM_RESTORED: 'Program restored successfully',
  PROGRAM_PUBLISHED: 'Program published successfully',
  PROGRAM_ARCHIVED: 'Program archived successfully',
  PROGRAM_FETCHED: 'Program retrieved successfully',
  PROGRAMS_FETCHED: 'Programs retrieved successfully',
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

const VALIDATION = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 150,
  SHORT_DESCRIPTION_MAX_LENGTH: 300,
  DESCRIPTION_MAX_LENGTH: 10000,
  MAX_VOLUNTEERS_MIN: 1,
  MAX_VOLUNTEERS_MAX: 100000,
  CATEGORY_MAX_LENGTH: 50,
  TAG_MAX_LENGTH: 30,
};

const SORT_FIELDS = ['createdAt', 'startDate', 'title', 'status'];

const SORT_ORDERS = ['asc', 'desc'];

const ALLOWED_STATUSES_FOR_UPDATE = [
  PROGRAM_STATUS.DRAFT,
  PROGRAM_STATUS.PENDING_APPROVAL,
  PROGRAM_STATUS.PUBLISHED,
  PROGRAM_STATUS.REGISTRATION_CLOSED,
  PROGRAM_STATUS.ONGOING,
  PROGRAM_STATUS.CANCELLED,
];

module.exports = {
  PROGRAM_STATUS,
  PROGRAM_MODE,
  MESSAGES,
  PAGINATION,
  VALIDATION,
  SORT_FIELDS,
  SORT_ORDERS,
  ALLOWED_STATUSES_FOR_UPDATE,
};
