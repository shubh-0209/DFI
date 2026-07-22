const NOTIFICATION_TYPES = {
  REGISTRATION: 'registration',
  PROGRAM_CREATED: 'program_created',
  PROGRAM_UPDATED: 'program_updated',
  PROGRAM_CANCELLED: 'program_cancelled',
  APPLICATION_SUBMITTED: 'application_submitted',
  APPLICATION_APPROVED: 'application_approved',
  APPLICATION_REJECTED: 'application_rejected',
  ATTENDANCE_MARKED: 'attendance_marked',
  CERTIFICATE_GENERATED: 'certificate_generated',
  CERTIFICATE_REVOKED: 'certificate_revoked',
  REWARD_EARNED: 'reward_earned',
  COINS_ADDED: 'coins_added',
  BADGE_EARNED: 'badge_earned',
  ORGANIZATION_APPROVED: 'organization_approved',
  ORGANIZATION_REJECTED: 'organization_rejected',
  ADMIN_ANNOUNCEMENT: 'admin_announcement',
  SYSTEM_MAINTENANCE: 'system_maintenance',
  SECURITY_ALERT: 'security_alert',
  PASSWORD_CHANGED: 'password_changed',
  PROFILE_UPDATED: 'profile_updated',
  VOLUNTEER_LEVEL_UP: 'volunteer_level_up',
  LEADERBOARD_POSITION_CHANGED: 'leaderboard_position_changed',
  WORKSPACE_CREATED: 'workspace_created',
  WORKSPACE_INVITATION_SENT: 'workspace_invitation_sent',
  WORKSPACE_INVITATION_ACCEPTED: 'workspace_invitation_accepted',
  WORKSPACE_INVITATION_DECLINED: 'workspace_invitation_declined',
  WORKSPACE_JOIN_REQUEST_SUBMITTED: 'workspace_join_request_submitted',
  WORKSPACE_JOIN_REQUEST_APPROVED: 'workspace_join_request_approved',
  WORKSPACE_JOIN_REQUEST_DECLINED: 'workspace_join_request_declined',
  WORKSPACE_MEMBER_ROLE_UPDATED: 'workspace_member_role_updated',
  WORKSPACE_MEMBER_LEFT: 'workspace_member_left',
  RECOMMENDATION_READY: 'recommendation_ready',
  RECOMMENDATION_SAVED: 'recommendation_saved',
  // Redemption lifecycle
  REWARD_REDEEMED:           'reward_redeemed',
  REDEMPTION_APPROVED:       'redemption_approved',
  REDEMPTION_SHIPPED:        'redemption_shipped',
  REDEMPTION_DELIVERED:      'redemption_delivered',
  REDEMPTION_CANCELLED:      'redemption_cancelled',
  CONTRIBUTION_REVIEW:       'contribution_review',
};

const CATEGORY = {
  APPLICATION: 'application',
  PROGRAM: 'program',
  ATTENDANCE: 'attendance',
  CERTIFICATE: 'certificate',
  REWARD: 'reward',
  LEADERBOARD: 'leaderboard',
  ANNOUNCEMENT: 'announcement',
  SECURITY: 'security',
  ACCOUNT: 'account',
  SYSTEM: 'system',
  MESSAGE: 'message',
  CONTRIBUTION: 'contribution',
};

const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

const CHANNEL = {
  IN_APP: 'in-app',
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
};

const STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  FAILED: 'failed',
  SCHEDULED: 'scheduled',
};

const MESSAGES = {
  NOTIFICATION_CREATED: 'Notification created successfully',
  NOTIFICATIONS_FETCHED: 'Notifications retrieved successfully',
  NOTIFICATION_FETCHED: 'Notification retrieved successfully',
  NOTIFICATION_UPDATED: 'Notification updated successfully',
  NOTIFICATION_DELETED: 'Notification deleted successfully',
  ALL_NOTIFICATIONS_READ: 'All notifications marked as read',
  NO_NOTIFICATIONS: 'No notifications found',
  NOTIFICATION_NOT_FOUND: 'Notification not found',
};

const DEFAULTS = {
  PAGINATION: {
    PAGE: 1,
    LIMIT: 10,
    SORT_BY: 'createdAt',
    ORDER: 'desc',
  },
  PRIORITY: PRIORITY.MEDIUM,
  CHANNEL: CHANNEL.IN_APP,
  IS_READ: false,
};

const VALIDATION = {
  TITLE_MAX_LENGTH: 255,
  MESSAGE_MAX_LENGTH: 1000,
  METADATA_MAX_DEPTH: 3,
};

module.exports = {
  NOTIFICATION_TYPES,
  CATEGORY,
  PRIORITY,
  CHANNEL,
  STATUS,
  MESSAGES,
  DEFAULTS,
  VALIDATION,
};
