const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  PDF: 'pdf',
  DOCUMENT: 'document',
  AUDIO: 'audio',
  VIDEO: 'video',
  SYSTEM: 'system',
};

const MESSAGE_STATUS = {
  SENDING: 'sending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed',
};

const MESSAGES = {
  CREATED: 'Message sent successfully',
  FETCHED: 'Messages retrieved successfully',
  FETCHED_SINGLE: 'Message retrieved successfully',
  UPDATED: 'Message updated successfully',
  DELETED: 'Message deleted successfully',
  PINNED: 'Message pinned successfully',
  UNPINNED: 'Message unpinned successfully',
  MARKED_AS_READ: 'Message marked as read',
};

const DEFAULTS = {
  PAGE: 1,
  LIMIT: 50,
  SORT_BY: 'createdAt',
  ORDER: 'asc',
};

const VALIDATION = {
  CONTENT_MAX_LENGTH: 5000,
  ATTACHMENTS_MAX_COUNT: 10,
  ATTACHMENT_MAX_SIZE: 50 * 1024 * 1024,
};

module.exports = {
  MESSAGE_TYPES,
  MESSAGE_STATUS,
  MESSAGES,
  DEFAULTS,
  VALIDATION,
};
