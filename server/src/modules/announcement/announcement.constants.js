const TYPES = {
  GENERAL: 'general',
  PROGRAM: 'program',
  EMERGENCY: 'emergency',
  MAINTENANCE: 'maintenance',
  EVENT: 'event',
  RECRUITMENT: 'recruitment',
  SYSTEM: 'system',
};

const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

const TARGET_AUDIENCE = {
  ALL_USERS: 'all_users',
  VOLUNTEERS: 'volunteers',
  NGOS: 'ngos',
  ADMINS: 'admins',
  SPECIFIC_USERS: 'specific_users',
};

const STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  PUBLISHED: 'published',
  EXPIRED: 'expired',
  ARCHIVED: 'archived',
};

const MESSAGES = {
  ANNOUNCEMENT_CREATED: 'Announcement created successfully',
  ANNOUNCEMENT_FETCHED: 'Announcement retrieved successfully',
  ANNOUNCEMENTS_FETCHED: 'Announcements retrieved successfully',
  ANNOUNCEMENT_UPDATED: 'Announcement updated successfully',
  ANNOUNCEMENT_DELETED: 'Announcement deleted successfully',
  ANNOUNCEMENT_PUBLISHED: 'Announcement published successfully',
  ANNOUNCEMENT_ARCHIVED: 'Announcement archived successfully',
  ANNOUNCEMENT_NOT_FOUND: 'Announcement not found',
  NO_ANNOUNCEMENTS: 'No announcements found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden',
};

const VALIDATION = {
  TITLE_MAX_LENGTH: 255,
  MESSAGE_MAX_LENGTH: 2000,
  ATTACHMENTS_MAX: 10,
};

const DEFAULTS = {
  TYPE: TYPES.GENERAL,
  PRIORITY: PRIORITY.MEDIUM,
  TARGET_AUDIENCE: TARGET_AUDIENCE.ALL_USERS,
  STATUS: STATUS.DRAFT,
};

module.exports = {
  TYPES,
  PRIORITY,
  TARGET_AUDIENCE,
  STATUS,
  MESSAGES,
  VALIDATION,
  DEFAULTS,
};
