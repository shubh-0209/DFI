const STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  DELETED: 'deleted',
};

const MEMBER_ROLE = {
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer',
};

const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const MESSAGES = {
  WORKSPACE_CREATED: 'Workspace created successfully',
  WORKSPACE_FETCHED: 'Workspace fetched successfully',
  WORKSPACES_FETCHED: 'Workspaces fetched successfully',
  WORKSPACE_UPDATED: 'Workspace updated successfully',
  WORKSPACE_DELETED: 'Workspace deleted successfully',
  WORKSPACE_JOINED: 'Joined workspace successfully',
  WORKSPACE_LEFT: 'Left workspace successfully',
  WORKSPACE_NOT_FOUND: 'Workspace not found',
  ALREADY_MEMBER: 'You are already a member of this workspace',
  NOT_MEMBER: 'You are not a member of this workspace',
  CANNOT_LEAVE: 'You cannot leave a workspace you created. Transfer ownership or delete the workspace instead.',
  NOTE_ADDED: 'Note added successfully',
  FILE_ADDED: 'File added successfully',
  TASK_CREATED: 'Task created successfully',
  TASK_UPDATED: 'Task updated successfully',
  MEMBERS_FETCHED: 'Members fetched successfully',
  ACTIVITY_LOG_FETCHED: 'Activity log fetched successfully',
  INVITATION_SENT: 'Invitation sent successfully',
  INVITATION_ACCEPTED: 'Invitation accepted successfully',
  INVITATION_DECLINED: 'Invitation declined',
  JOIN_REQUEST_SUBMITTED: 'Join request submitted successfully',
  JOIN_REQUEST_APPROVED: 'Join request approved',
  JOIN_REQUEST_DECLINED: 'Join request declined',
  ROLE_UPDATED: 'Member role updated successfully',
  ALREADY_INVITED: 'User has already been invited to this workspace',
  ALREADY_REQUESTED: 'You have already requested to join this workspace',
  INVITATION_NOT_FOUND: 'Invitation not found',
  JOIN_REQUEST_NOT_FOUND: 'Join request not found',
  INVALID_ROLE: 'Invalid role',
  CANNOT_UPDATE_OWN_ROLE: 'You cannot change your own role',
  CANNOT_REMOVE_CREATOR: 'Cannot remove workspace creator',
  PENDING_INVITATIONS: 'Pending invitations fetched successfully',
  PENDING_JOIN_REQUESTS: 'Pending join requests fetched successfully',
  TIMELINE_FETCHED: 'Activity timeline fetched successfully',
};

const DEFAULTS = {
  STATUS: STATUS.ACTIVE,
  MEMBER_ROLE: MEMBER_ROLE.MEMBER,
  TASK_STATUS: TASK_STATUS.PENDING,
  PAGE: 1,
  LIMIT: 10,
};

module.exports = {
  STATUS,
  MEMBER_ROLE,
  TASK_STATUS,
  MESSAGES,
  DEFAULTS,
};
