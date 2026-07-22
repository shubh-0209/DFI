const { NOTIFICATION_TYPES, PRIORITY, CHANNEL, STATUS } = require('./notification.constants');

const buildRegistration = ({ recipientId, name }) => ({
  recipient: recipientId,
  title: 'Welcome to Disha for India!',
  message: `Hello ${name || 'Volunteer'}! Your registration is complete. Start exploring programs and make an impact.`,
  type: NOTIFICATION_TYPES.REGISTRATION,
  category: 'system',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { userName: name },
});

const buildProgramCreated = ({ recipientId, programName, programId, createdBy }) => ({
  recipient: recipientId,
  title: 'New Program Created',
  message: `A new program "${programName}" has been created. Check it out and apply now!`,
  type: NOTIFICATION_TYPES.PROGRAM_CREATED,
  category: 'program',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'program',
  relatedEntityId: programId,
  metadata: { programName, programId, createdBy },
});

const buildProgramUpdated = ({ recipientId, programName, programId }) => ({
  recipient: recipientId,
  title: 'Program Updated',
  message: `The program "${programName}" has been updated. Please review the latest details.`,
  type: NOTIFICATION_TYPES.PROGRAM_UPDATED,
  category: 'program',
  priority: PRIORITY.MEDIUM,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'program',
  relatedEntityId: programId,
  metadata: { programName, programId },
});

const buildProgramCancelled = ({ recipientId, programName, programId }) => ({
  recipient: recipientId,
  title: 'Program Cancelled',
  message: `The program "${programName}" has been cancelled. We apologize for any inconvenience.`,
  type: NOTIFICATION_TYPES.PROGRAM_CANCELLED,
  category: 'program',
  priority: PRIORITY.CRITICAL,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'program',
  relatedEntityId: programId,
  metadata: { programName, programId },
});

const buildApplicationSubmitted = ({ recipientId, programName, programId, applicationId }) => ({
  recipient: recipientId,
  title: 'Application Submitted',
  message: `Your application for "${programName}" has been submitted successfully. We will review it shortly.`,
  type: NOTIFICATION_TYPES.APPLICATION_SUBMITTED,
  category: 'application',
  priority: PRIORITY.MEDIUM,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'application',
  relatedEntityId: applicationId,
  metadata: { programId, applicationId },
});

const buildApplicationApproved = ({ recipientId, programName, applicationId }) => ({
  recipient: recipientId,
  title: 'Application Approved',
  message: `Congratulations! Your application for "${programName}" has been approved. You are now part of the program!`,
  type: NOTIFICATION_TYPES.APPLICATION_APPROVED,
  category: 'application',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'application',
  relatedEntityId: applicationId,
  metadata: { programName, applicationId },
});

const buildApplicationRejected = ({ recipientId, programName, applicationId, reason }) => ({
  recipient: recipientId,
  title: 'Application Rejected',
  message: `Your application for "${programName}" has been rejected. ${reason || 'Please try other programs.'}`,
  type: NOTIFICATION_TYPES.APPLICATION_REJECTED,
  category: 'application',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'application',
  relatedEntityId: applicationId,
  metadata: { programName, applicationId, reason },
});

const buildAttendanceMarked = ({ recipientId, programName, attendanceId, totalHours }) => ({
  recipient: recipientId,
  title: 'Attendance Marked',
  message: `Your attendance for "${programName}" has been recorded. Total hours: ${totalHours}.`,
  type: NOTIFICATION_TYPES.ATTENDANCE_MARKED,
  category: 'attendance',
  priority: PRIORITY.LOW,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'attendance',
  relatedEntityId: attendanceId,
  metadata: { programName, attendanceId, totalHours },
});

const buildCertificateGenerated = ({ recipientId, programName, certificateId, certificateNumber }) => ({
  recipient: recipientId,
  title: 'Certificate Generated',
  message: `Congratulations! Your certificate for "${programName}" has been generated. Certificate Number: ${certificateNumber}.`,
  type: NOTIFICATION_TYPES.CERTIFICATE_GENERATED,
  category: 'certificate',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'certificate',
  relatedEntityId: certificateId,
  metadata: { programName, certificateId, certificateNumber },
});

const buildCertificateRevoked = ({ recipientId, programName, certificateId }) => ({
  recipient: recipientId,
  title: 'Certificate Revoked',
  message: `Your certificate for "${programName}" has been revoked. Please contact support if you believe this is an error.`,
  type: NOTIFICATION_TYPES.CERTIFICATE_REVOKED,
  category: 'certificate',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'certificate',
  relatedEntityId: certificateId,
  metadata: { programName, certificateId },
});

const buildRewardEarned = ({ recipientId, rewardType, amount }) => ({
  recipient: recipientId,
  title: 'Reward Earned',
  message: `You have earned ${amount} ${rewardType}. Keep up the great work!`,
  type: NOTIFICATION_TYPES.REWARD_EARNED,
  category: 'reward',
  priority: PRIORITY.MEDIUM,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { rewardType, amount },
});

const buildCoinsAdded = ({ recipientId, coins }) => ({
  recipient: recipientId,
  title: 'Coins Added',
  message: `You have been awarded ${coins} coins. Keep contributing to earn more!`,
  type: NOTIFICATION_TYPES.COINS_ADDED,
  category: 'reward',
  priority: PRIORITY.MEDIUM,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { coins },
});

const buildBadgeEarned = ({ recipientId, badgeName, badgeDescription }) => ({
  recipient: recipientId,
  title: 'Badge Earned',
  message: `You have earned the "${badgeName}" badge! ${badgeDescription || 'Congratulations!'}`,
  type: NOTIFICATION_TYPES.BADGE_EARNED,
  category: 'gamification',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { badgeName, badgeDescription },
});

const buildOrganizationApproved = ({ recipientId, orgName }) => ({
  recipient: recipientId,
  title: 'Organization Approved',
  message: `Your organization "${orgName}" has been approved. You can now create programs.`,
  type: NOTIFICATION_TYPES.ORGANIZATION_APPROVED,
  category: 'organization',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { orgName },
});

const buildOrganizationRejected = ({ recipientId, orgName, reason }) => ({
  recipient: recipientId,
  title: 'Organization Rejected',
  message: `Your organization "${orgName}" has been rejected. ${reason || 'Please contact support.'}`,
  type: NOTIFICATION_TYPES.ORGANIZATION_REJECTED,
  category: 'organization',
  priority: PRIORITY.CRITICAL,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { orgName, reason },
});

const buildAdminAnnouncement = ({ recipientId, title, message, adminId }) => ({
  recipient: recipientId,
  title: title || 'Admin Announcement',
  message,
  type: NOTIFICATION_TYPES.ADMIN_ANNOUNCEMENT,
  category: 'announcement',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  sender: adminId,
  metadata: {},
});

const buildSystemMaintence = ({ recipientId, message, scheduledTime }) => ({
  recipient: recipientId,
  title: 'System Maintenance',
  message: message || `Scheduled maintenance on ${scheduledTime}. Services may be unavailable.`,
  type: NOTIFICATION_TYPES.SYSTEM_MAINTENANCE,
  category: 'system',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { scheduledTime },
});

const buildSecurityAlert = ({ recipientId, alertType, message }) => ({
  recipient: recipientId,
  title: 'Security Alert',
  message: message || `Suspicious activity detected: ${alertType}`,
  type: NOTIFICATION_TYPES.SECURITY_ALERT,
  category: 'security',
  priority: PRIORITY.CRITICAL,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { alertType },
});

const buildPasswordChanged = ({ recipientId }) => ({
  recipient: recipientId,
  title: 'Password Changed',
  message: 'Your password has been changed successfully. If this was not you, contact support immediately.',
  type: NOTIFICATION_TYPES.PASSWORD_CHANGED,
  category: 'security',
  priority: PRIORITY.CRITICAL,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: {},
});

const buildProfileUpdated = ({ recipientId }) => ({
  recipient: recipientId,
  title: 'Profile Updated',
  message: 'Your profile has been updated successfully.',
  type: NOTIFICATION_TYPES.PROFILE_UPDATED,
  category: 'system',
  priority: PRIORITY.MEDIUM,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: {},
});

const buildVolunteerLevelUp = ({ recipientId, newLevel }) => ({
  recipient: recipientId,
  title: 'Volunteer Level Up',
  message: `Congratulations! You have reached level ${newLevel}. Keep contributing to unlock more rewards!`,
  type: NOTIFICATION_TYPES.VOLUNTEER_LEVEL_UP,
  category: 'gamification',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { newLevel },
});

const buildTicketCreated = ({ recipientId, ticketId, subject }) => ({
  recipient: recipientId,
  title: 'Support Ticket Created',
  message: `Your support ticket "${subject}" (${ticketId}) has been created. We will get back to you shortly.`,
  type: NOTIFICATION_TYPES.ADMIN_ANNOUNCEMENT,
  category: 'support',
  priority: PRIORITY.MEDIUM,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { ticketId, subject },
  actionUrl: `/support?id=${ticketId}`,
});

const buildTicketUpdated = ({ recipientId, ticketId, subject, update }) => ({
  recipient: recipientId,
  title: 'Support Ticket Updated',
  message: `Your support ticket "${subject}" (${ticketId}) has been updated: ${update || 'status changed'}.`,
  type: NOTIFICATION_TYPES.ADMIN_ANNOUNCEMENT,
  category: 'support',
  priority: PRIORITY.MEDIUM,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { ticketId, subject, update },
  actionUrl: `/support?id=${ticketId}`,
});

const buildTicketResolved = ({ recipientId, ticketId, subject }) => ({
  recipient: recipientId,
  title: 'Support Ticket Resolved',
  message: `Your support ticket "${subject}" (${ticketId}) has been resolved. Please review and close if satisfied.`,
  type: NOTIFICATION_TYPES.ADMIN_ANNOUNCEMENT,
  category: 'support',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { ticketId, subject },
  actionUrl: `/support?id=${ticketId}`,
});

const buildTicketClosed = ({ recipientId, ticketId, subject }) => ({
  recipient: recipientId,
  title: 'Support Ticket Closed',
  message: `Your support ticket "${subject}" (${ticketId}) has been closed. Thank you for contacting support.`,
  type: NOTIFICATION_TYPES.ADMIN_ANNOUNCEMENT,
  category: 'support',
  priority: PRIORITY.MEDIUM,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { ticketId, subject },
  actionUrl: `/support?id=${ticketId}`,
});

const buildAdminTicketAssigned = ({ recipientId, ticketId, subject }) => ({
  recipient: recipientId,
  title: 'New Support Ticket Generated',
  message: `A new support ticket "${subject}" (${ticketId}) has been generated. Please review and take action.`,
  type: NOTIFICATION_TYPES.ADMIN_ANNOUNCEMENT,
  category: 'support',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { ticketId, subject },
  actionUrl: `/admin/support?id=${ticketId}`,
});

const buildLeaderboardPositionChanged = ({ recipientId, newPosition, leaderboardType }) => ({
  recipient: recipientId,
  title: 'Leaderboard Position Changed',
  message: `You have moved up to position #${newPosition} on the ${leaderboardType || 'national'} leaderboard!`,
  type: NOTIFICATION_TYPES.LEADERBOARD_POSITION_CHANGED,
  category: 'gamification',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { newPosition, leaderboardType },
});

const buildWelcome = ({ recipientId, name }) => ({
  recipient: recipientId,
  title: 'Welcome to Disha for India',
  message: `Hello ${name || 'Volunteer'}! Welcome to Disha for India. Start exploring programs and make an impact today!`,
  type: NOTIFICATION_TYPES.REGISTRATION,
  category: 'system',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { userName: name },
});

const buildWorkspaceCreated = ({ recipientId, workspaceName, workspaceId }) => ({
  recipient: recipientId,
  title: 'Workspace Created',
  message: `Your workspace "${workspaceName}" has been created successfully. Start collaborating with your team!`,
  type: NOTIFICATION_TYPES.WORKSPACE_CREATED,
  category: 'collaboration',
  priority: PRIORITY.MEDIUM,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'workspace',
  relatedEntityId: workspaceId,
  metadata: { workspaceName, workspaceId },
});

const buildWorkspaceInvitationSent = ({ recipientId, workspaceName, workspaceId, inviterName }) => ({
  recipient: recipientId,
  title: 'Workspace Invitation',
  message: `${inviterName || 'Someone'} has invited you to join the workspace "${workspaceName}".`,
  type: NOTIFICATION_TYPES.WORKSPACE_INVITATION_SENT,
  category: 'collaboration',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'workspace',
  relatedEntityId: workspaceId,
  metadata: { workspaceName, workspaceId, inviterName },
});

const buildWorkspaceInvitationAccepted = ({ recipientId, workspaceName, workspaceId, userName }) => ({
  recipient: recipientId,
  title: 'Invitation Accepted',
  message: `${userName || 'A user'} has accepted your invitation to join "${workspaceName}".`,
  type: NOTIFICATION_TYPES.WORKSPACE_INVITATION_ACCEPTED,
  category: 'collaboration',
  priority: PRIORITY.MEDIUM,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'workspace',
  relatedEntityId: workspaceId,
  metadata: { workspaceName, workspaceId, userName },
});

const buildWorkspaceInvitationDeclined = ({ recipientId, workspaceName, workspaceId, userName }) => ({
  recipient: recipientId,
  title: 'Invitation Declined',
  message: `${userName || 'A user'} has declined your invitation to join "${workspaceName}".`,
  type: NOTIFICATION_TYPES.WORKSPACE_INVITATION_DECLINED,
  category: 'collaboration',
  priority: PRIORITY.LOW,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'workspace',
  relatedEntityId: workspaceId,
  metadata: { workspaceName, workspaceId, userName },
});

const buildWorkspaceJoinRequestSubmitted = ({ recipientId, workspaceName, workspaceId, userName }) => ({
  recipient: recipientId,
  title: 'Join Request Received',
  message: `${userName || 'A user'} has requested to join your workspace "${workspaceName}".`,
  type: NOTIFICATION_TYPES.WORKSPACE_JOIN_REQUEST_SUBMITTED,
  category: 'collaboration',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'workspace',
  relatedEntityId: workspaceId,
  metadata: { workspaceName, workspaceId, userName },
});

const buildWorkspaceJoinRequestApproved = ({ recipientId, workspaceName, workspaceId }) => ({
  recipient: recipientId,
  title: 'Join Request Approved',
  message: `Your request to join "${workspaceName}" has been approved. Welcome!`,
  type: NOTIFICATION_TYPES.WORKSPACE_JOIN_REQUEST_APPROVED,
  category: 'collaboration',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'workspace',
  relatedEntityId: workspaceId,
  metadata: { workspaceName, workspaceId },
});

const buildWorkspaceJoinRequestDeclined = ({ recipientId, workspaceName, workspaceId }) => ({
  recipient: recipientId,
  title: 'Join Request Declined',
  message: `Your request to join "${workspaceName}" has been declined. Please try other workspaces or create your own.`,
  type: NOTIFICATION_TYPES.WORKSPACE_JOIN_REQUEST_DECLINED,
  category: 'collaboration',
  priority: PRIORITY.MEDIUM,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'workspace',
  relatedEntityId: workspaceId,
  metadata: { workspaceName, workspaceId },
});

const buildWorkspaceMemberRoleUpdated = ({ recipientId, workspaceName, workspaceId, newRole, updatedByName }) => ({
  recipient: recipientId,
  title: 'Role Updated',
  message: `Your role in "${workspaceName}" has been updated to ${newRole} by ${updatedByName || 'an admin'}.`,
  type: NOTIFICATION_TYPES.WORKSPACE_MEMBER_ROLE_UPDATED,
  category: 'collaboration',
  priority: PRIORITY.MEDIUM,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'workspace',
  relatedEntityId: workspaceId,
  metadata: { workspaceName, workspaceId, newRole, updatedByName },
});

const buildWorkspaceMemberLeft = ({ recipientId, workspaceName, workspaceId, userName }) => ({
  recipient: recipientId,
  title: 'Member Left',
  message: `${userName || 'A member'} has left the workspace "${workspaceName}".`,
  type: NOTIFICATION_TYPES.WORKSPACE_MEMBER_LEFT,
  category: 'collaboration',
  priority: PRIORITY.LOW,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  relatedEntityType: 'workspace',
  relatedEntityId: workspaceId,
  metadata: { workspaceName, workspaceId, userName },
});

// ── Redemption lifecycle notifications ──────────────────────────────────────

const buildRedemptionConfirmed = ({ recipientId, rewardName, totalCoins, redemptionId }) => ({
  recipient: recipientId,
  title: 'Redemption Confirmed!',
  message: `Your redemption of "${rewardName}" is confirmed. ${totalCoins.toLocaleString()} coins have been deducted. We will process your request shortly.`,
  type: NOTIFICATION_TYPES.REWARD_REDEEMED,
  category: 'reward',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { rewardName, totalCoins, redemptionId },
});

const buildRedemptionApproved = ({ recipientId, rewardName, redemptionId }) => ({
  recipient: recipientId,
  title: 'Reward Approved!',
  message: `Great news! Your reward "${rewardName}" has been approved and will be dispatched soon.`,
  type: NOTIFICATION_TYPES.REDEMPTION_APPROVED,
  category: 'reward',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { rewardName, redemptionId },
});

const buildRedemptionShipped = ({ recipientId, rewardName, trackingNumber, redemptionId }) => ({
  recipient: recipientId,
  title: 'Reward Shipped!',
  message: `Your reward "${rewardName}" is on its way!${trackingNumber ? ` Tracking number: ${trackingNumber}.` : ''}`,
  type: NOTIFICATION_TYPES.REDEMPTION_SHIPPED,
  category: 'reward',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { rewardName, trackingNumber, redemptionId },
});

const buildRedemptionDelivered = ({ recipientId, rewardName, redemptionId }) => ({
  recipient: recipientId,
  title: 'Reward Delivered!',
  message: `Your reward "${rewardName}" has been marked as delivered. Enjoy!`,
  type: NOTIFICATION_TYPES.REDEMPTION_DELIVERED,
  category: 'reward',
  priority: PRIORITY.MEDIUM,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { rewardName, redemptionId },
});

const buildRedemptionCancelled = ({ recipientId, rewardName, notes, redemptionId }) => ({
  recipient: recipientId,
  title: 'Redemption Cancelled',
  message: `Your redemption of "${rewardName}" has been cancelled.${notes ? ` Reason: ${notes}` : ' Please contact support if you have questions.'}`,
  type: NOTIFICATION_TYPES.REDEMPTION_CANCELLED,
  category: 'reward',
  priority: PRIORITY.HIGH,
  channel: CHANNEL.IN_APP,
  status: STATUS.SENT,
  metadata: { rewardName, notes, redemptionId },
});

module.exports = {
  buildRegistration,
  buildProgramCreated,
  buildProgramUpdated,
  buildProgramCancelled,
  buildApplicationSubmitted,
  buildApplicationApproved,
  buildApplicationRejected,
  buildAttendanceMarked,
  buildCertificateGenerated,
  buildCertificateRevoked,
  buildRewardEarned,
  buildCoinsAdded,
  buildBadgeEarned,
  buildOrganizationApproved,
  buildOrganizationRejected,
  buildAdminAnnouncement,
  buildSystemMaintence,
  buildSecurityAlert,
  buildPasswordChanged,
  buildProfileUpdated,
  buildVolunteerLevelUp,
  buildLeaderboardPositionChanged,
  buildWelcome,
  buildTicketCreated,
  buildTicketUpdated,
  buildTicketResolved,
  buildTicketClosed,
  buildAdminTicketAssigned,
  buildWorkspaceCreated,
  buildWorkspaceInvitationSent,
  buildWorkspaceInvitationAccepted,
  buildWorkspaceInvitationDeclined,
  buildWorkspaceJoinRequestSubmitted,
  buildWorkspaceJoinRequestApproved,
  buildWorkspaceJoinRequestDeclined,
  buildWorkspaceMemberRoleUpdated,
  buildWorkspaceMemberLeft,
  // Redemption lifecycle
  buildRedemptionConfirmed,
  buildRedemptionApproved,
  buildRedemptionShipped,
  buildRedemptionDelivered,
  buildRedemptionCancelled,
};
