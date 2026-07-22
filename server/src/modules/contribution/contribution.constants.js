const STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  NEEDS_CHANGES: 'needs_changes',
  ARCHIVED: 'archived',
};

const CATEGORY = {
  GRAPHIC_DESIGN: 'graphic_design',
  CONTENT_WRITING: 'content_writing',
  DIGITAL_MARKETING: 'digital_marketing',
  PHOTOGRAPHY: 'photography',
  VIDEOGRAPHY: 'videography',
  TEACHING: 'teaching',
  WEB_DEVELOPMENT: 'web_development',
  UI_UX: 'ui_ux',
  EVENT_MANAGEMENT: 'event_management',
  SOCIAL_MEDIA: 'social_media',
  RESEARCH: 'research',
  OTHER: 'other',
};

const CONTRIBUTION_TYPE = {
  PDF: 'pdf',
  IMAGE: 'image',
  VIDEO: 'video',
  ZIP: 'zip',
  PPT: 'ppt',
  DOC: 'doc',
  GITHUB: 'github',
  FIGMA: 'figma',
  CANVA: 'canva',
  GOOGLE_DRIVE: 'google_drive',
  OTHER: 'other',
};

const VISIBILITY = {
  PRIVATE: 'private',
  PUBLIC: 'public',
  FEATURED: 'featured',
};

const REVIEW_ACTION = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
  NEEDS_CHANGES: 'needs_changes',
};

const REJECT_REASON = {
  SPAM: 'spam',
  DUPLICATE: 'duplicate',
  LOW_QUALITY: 'low_quality',
  INCOMPLETE: 'incomplete',
  WRONG_CATEGORY: 'wrong_category',
  OTHER: 'other',
};

const MESSAGES = {
  CONTRIBUTION_CREATED: 'Contribution submitted successfully',
  CONTRIBUTION_FETCHED: 'Contribution retrieved successfully',
  CONTRIBUTIONS_FETCHED: 'Contributions retrieved successfully',
  CONTRIBUTION_UPDATED: 'Contribution updated successfully',
  CONTRIBUTION_DELETED: 'Contribution deleted successfully',
  CONTRIBUTION_APPROVED: 'Contribution approved successfully',
  CONTRIBUTION_REJECTED: 'Contribution rejected successfully',
  CONTRIBUTION_MARKED_NEEDS_CHANGES: 'Contribution marked as needs changes successfully',
  CONTRIBUTION_FEATURED: 'Contribution featured successfully',
  CONTRIBUTION_ARCHIVED: 'Contribution archived successfully',
  CONTRIBUTION_NOT_FOUND: 'Contribution not found',
  NO_CONTRIBUTIONS: 'No contributions found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden',
  DRAFT_SAVED: 'Draft saved successfully',
  DRAFT_SUBMITTED: 'Contribution submitted successfully',
  SUBMISSION_FAILED: 'Submission failed',
  CANNOT_EDIT_SUBMITTED: 'Cannot edit a submitted contribution',
  CANNOT_DELETE_SUBMITTED: 'Cannot delete a submitted contribution',
  DUPLICATE_SUBMISSION: 'You have already submitted a similar contribution',
  INVALID_STATUS_TRANSITION: 'Invalid status transition',
  VERSION_CREATED: 'Version created successfully',
  NO_VERSIONS: 'No versions found',
  REVIEW_CREATED: 'Review created successfully',
  NO_REVIEWS: 'No reviews found',
  ALREADY_UNDER_REVIEW: 'Contribution is already under review',
  INVALID_REVIEW_ACTION: 'Invalid review action',
  FEEDBACK_REQUIRED: 'Feedback is required for this action',
  COINS_REQUIRED: 'Coins awarded must be a non-negative number',
};

const VALIDATION = {
  TITLE_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 2000,
  FILES_MAX: 10,
  TAGS_MAX: 20,
  TAG_MAX_LENGTH: 50,
  FEEDBACK_MAX_LENGTH: 1000,
};

const DEFAULTS = {
  STATUS: STATUS.DRAFT,
  CATEGORY: CATEGORY.OTHER,
  CONTRIBUTION_TYPE: CONTRIBUTION_TYPE.OTHER,
  VISIBILITY: VISIBILITY.PRIVATE,
};

module.exports = {
  STATUS,
  CATEGORY,
  CONTRIBUTION_TYPE,
  VISIBILITY,
  REVIEW_ACTION,
  REJECT_REASON,
  MESSAGES,
  VALIDATION,
  DEFAULTS,
};
