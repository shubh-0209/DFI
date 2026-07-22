const CONVERSATION_TYPES = {
  PRIVATE: 'private',
  SUPPORT: 'support',
  GROUP: 'group',
};

const CONVERSATION_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  DELETED: 'deleted',
};

const MESSAGES = {
  CREATED: 'Conversation created successfully',
  FETCHED: 'Conversation retrieved successfully',
  UPDATED: 'Conversation updated successfully',
  DELETED: 'Conversation deleted successfully',
  ALL_FETCHED: 'Conversations retrieved successfully',
  ARCHIVED: 'Conversation archived successfully',
};

const DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  SORT_BY: 'lastMessageAt',
  ORDER: 'desc',
};

const VALIDATION = {
  TITLE_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 1000,
};

module.exports = {
  CONVERSATION_TYPES,
  CONVERSATION_STATUS,
  MESSAGES,
  DEFAULTS,
  VALIDATION,
};
