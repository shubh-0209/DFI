const collaborationRepository = require('./collaboration.repository');
const CollaborationWorkspace = require('./collaboration.model');
const { MEMBER_ROLE, TASK_STATUS, MESSAGES } = require('./collaboration.constants');
const NotFoundError = require('../../utils/errors/NotFoundError');
const ValidationError = require('../../utils/errors/ValidationError');
const ConflictError = require('../../utils/errors/ConflictError');
const notificationService = require('../../modules/notification/notification.service');
const User = require('../../modules/user/user.model');

class CollaborationService {
  async createWorkspace(data, userId) {
    const { name, description } = data;

    const workspace = await collaborationRepository.create({
      name,
      description,
      createdBy: userId,
      members: [userId],
      memberDetails: [
        {
          userId,
          role: MEMBER_ROLE.ADMIN,
          joinedAt: new Date(),
          invitedBy: null,
        },
      ],
    });

    try {
      await notificationService.sendInAppNotification('buildWorkspaceCreated', {
        recipientId: userId,
        workspaceName: name,
        workspaceId: workspace._id.toString(),
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return {
      workspace,
      message: MESSAGES.WORKSPACE_CREATED,
    };
  }

  async getWorkspaces(query = {}, userId) {
    const { page = 1, limit = 10, search, status } = query;

    const result = await collaborationRepository.getWorkspacesByMember(userId, {
      page: Number(page),
      limit: Number(limit),
      search,
      status,
    });

    const workspacesWithFlags = result.workspaces.map(workspace => {
      const isCreator = workspace.createdBy._id.toString() === userId.toString();
      const isMember = workspace.members.some(m => m._id.toString() === userId.toString());
      return {
        ...workspace.toObject(),
        isCreator,
        isMember,
      };
    });

    return {
      workspaces: workspacesWithFlags,
      total: result.total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        totalPages: Math.ceil(result.total / Number(limit)) || 1,
      },
      message: MESSAGES.WORKSPACES_FETCHED,
    };
  }

  async getWorkspace(workspaceId, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isMember = workspace.members.some(m => m.toString() === userId.toString());
    if (!isMember) {
      throw new ValidationError(MESSAGES.NOT_MEMBER);
    }

    const workspaceObj = workspace.toObject();
    workspaceObj.isCreator = workspace.createdBy.toString() === userId.toString();

    return {
      workspace: workspaceObj,
      message: MESSAGES.WORKSPACE_FETCHED,
    };
  }

  async updateWorkspace(workspaceId, updateData, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isCreator = workspace.createdBy.toString() === userId.toString();
    if (!isCreator) {
      throw new ValidationError('Only workspace creator can update workspace');
    }

    const allowedFields = ['name', 'description'];
    const safeUpdate = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        safeUpdate[field] = updateData[field];
      }
    }

    const updated = await collaborationRepository.update(workspaceId, safeUpdate);

    return {
      workspace: updated,
      message: MESSAGES.WORKSPACE_UPDATED,
    };
  }

  async deleteWorkspace(workspaceId, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isCreator = workspace.createdBy.toString() === userId.toString();
    if (!isCreator) {
      throw new ValidationError('Only workspace creator can delete workspace');
    }

    await collaborationRepository.softDelete(workspaceId, userId);

    return {
      message: MESSAGES.WORKSPACE_DELETED,
    };
  }

  async joinWorkspace(workspaceId, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isMember = workspace.members.some(m => m.toString() === userId.toString());
    if (isMember) {
      throw new ConflictError(MESSAGES.ALREADY_MEMBER);
    }

    const hasPendingRequest = workspace.joinRequests.some(
      req => req.userId.toString() === userId.toString() && req.status === 'pending'
    );
    if (hasPendingRequest) {
      throw new ConflictError(MESSAGES.ALREADY_REQUESTED);
    }

    await collaborationRepository.addMember(workspaceId, userId, MEMBER_ROLE.MEMBER, userId);

    try {
      await notificationService.sendInAppNotification('buildWorkspaceJoinRequestApproved', {
        recipientId: userId,
        workspaceName: workspace.name,
        workspaceId: workspaceId,
      });

      await collaborationRepository.addActivityLog(workspaceId, {
        action: `${userId} joined the workspace`,
        performedBy: userId,
        targetType: 'workspace',
        targetId: workspaceId,
        metadata: { type: 'join' },
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return {
      message: MESSAGES.WORKSPACE_JOINED,
    };
  }

  async leaveWorkspace(workspaceId, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isCreator = workspace.createdBy.toString() === userId.toString();
    if (isCreator) {
      throw new ValidationError(MESSAGES.CANNOT_LEAVE);
    }

    const isMember = workspace.members.some(m => m.toString() === userId.toString());
    if (!isMember) {
      throw new ValidationError(MESSAGES.NOT_MEMBER);
    }

    await collaborationRepository.removeMember(workspaceId, userId);

    try {
      const user = await User.findById(userId).select('name');
      await notificationService.sendInAppNotification('buildWorkspaceMemberLeft', {
        recipientId: workspace.createdBy.toString(),
        workspaceName: workspace.name,
        workspaceId: workspaceId,
        userName: user?.name || 'A member',
      });

      await collaborationRepository.addActivityLog(workspaceId, {
        action: `${user?.name || 'A member'} left the workspace`,
        performedBy: userId,
        targetType: 'workspace',
        targetId: workspaceId,
        metadata: { type: 'leave' },
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return {
      message: MESSAGES.WORKSPACE_LEFT,
    };
  }

  async getWorkspaceMembers(workspaceId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    return {
      members: workspace.memberDetails,
      message: MESSAGES.MEMBERS_FETCHED,
    };
  }

  async addNote(workspaceId, noteData, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isMember = workspace.members.some(m => m.toString() === userId.toString());
    if (!isMember) {
      throw new ValidationError(MESSAGES.NOT_MEMBER);
    }

    const updatedWorkspace = await collaborationRepository.addNote(workspaceId, {
      ...noteData,
      createdBy: userId,
    });

    await collaborationRepository.addActivityLog(workspaceId, {
      action: `Note added by ${userId}`,
      performedBy: userId,
      targetType: 'note',
      targetId: updatedWorkspace.sharedNotes[updatedWorkspace.sharedNotes.length - 1]._id,
      metadata: { type: 'note_added' },
    });

    return {
      note: updatedWorkspace.sharedNotes[updatedWorkspace.sharedNotes.length - 1],
      message: MESSAGES.NOTE_ADDED,
    };
  }

  async addFile(workspaceId, fileData, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isMember = workspace.members.some(m => m.toString() === userId.toString());
    if (!isMember) {
      throw new ValidationError(MESSAGES.NOT_MEMBER);
    }

    const updatedWorkspace = await collaborationRepository.addFile(workspaceId, {
      ...fileData,
      uploadedBy: userId,
    });

    await collaborationRepository.addActivityLog(workspaceId, {
      action: `File shared by ${userId}`,
      performedBy: userId,
      targetType: 'file',
      targetId: updatedWorkspace.sharedFiles[updatedWorkspace.sharedFiles.length - 1]._id,
      metadata: { type: 'file_added' },
    });

    return {
      file: updatedWorkspace.sharedFiles[updatedWorkspace.sharedFiles.length - 1],
      message: MESSAGES.FILE_ADDED,
    };
  }

  async assignTask(workspaceId, taskData, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isMember = workspace.members.some(m => m.toString() === userId.toString());
    if (!isMember) {
      throw new ValidationError(MESSAGES.NOT_MEMBER);
    }

    const updatedWorkspace = await collaborationRepository.addTask(workspaceId, {
      ...taskData,
      assignedBy: userId,
    });

    await collaborationRepository.addActivityLog(workspaceId, {
      action: `Task assigned by ${userId}`,
      performedBy: userId,
      targetType: 'task',
      targetId: updatedWorkspace.taskAssignments[updatedWorkspace.taskAssignments.length - 1]._id,
      metadata: { type: 'task_assigned' },
    });

    return {
      task: updatedWorkspace.taskAssignments[updatedWorkspace.taskAssignments.length - 1],
      message: MESSAGES.TASK_CREATED,
    };
  }

  async updateTaskStatus(workspaceId, taskIndex, updateData, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isMember = workspace.members.some(m => m.toString() === userId.toString());
    if (!isMember) {
      throw new ValidationError(MESSAGES.NOT_MEMBER);
    }

    const task = workspace.taskAssignments[taskIndex];
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    const safeUpdate = {};
    for (const field of ['status', 'description', 'dueDate']) {
      if (updateData[field] !== undefined) {
        safeUpdate[field] = updateData[field];
      }
    }

    if (safeUpdate.status === TASK_STATUS.COMPLETED) {
      safeUpdate.completedAt = new Date();
    }

    const updated = await collaborationRepository.updateTask(workspaceId, taskIndex, safeUpdate);

    await collaborationRepository.addActivityLog(workspaceId, {
      action: `Task status updated by ${userId}`,
      performedBy: userId,
      targetType: 'task',
      targetId: task._id,
      metadata: { type: 'task_updated', status: safeUpdate.status },
    });

    return {
      task: updated.taskAssignments[taskIndex],
      message: MESSAGES.TASK_UPDATED,
    };
  }

  async getWorkspaceActivityLog(workspaceId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    return {
      activityLog: workspace.activityLog.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      message: MESSAGES.ACTIVITY_LOG_FETCHED,
    };
  }

  async getActivityTimeline(workspaceId, query = {}, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isMember = workspace.members.some(m => m.toString() === userId.toString());
    if (!isMember) {
      throw new ValidationError(MESSAGES.NOT_MEMBER);
    }

    const { page = 1, limit = 20 } = query;
    const result = await collaborationRepository.getActivityTimeline(workspaceId, {
      page: Number(page),
      limit: Number(limit),
    });

    return {
      timeline: result.timeline,
      total: result.total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        totalPages: Math.ceil(result.total / Number(limit)) || 1,
      },
      message: MESSAGES.TIMELINE_FETCHED,
    };
  }

  async inviteToWorkspace(workspaceId, invitationData, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isAdmin = workspace.memberDetails.some(
      m => m.userId.toString() === userId.toString() && m.role === MEMBER_ROLE.ADMIN
    );
    if (!isAdmin) {
      throw new ValidationError('Only workspace admin can send invitations');
    }

    const { email, userId: inviteeId, role = MEMBER_ROLE.MEMBER } = invitationData;

    if (!email && !inviteeId) {
      throw new ValidationError('Email or user ID is required for invitation');
    }

    const targetUserId = inviteeId || (await User.findOne({ email }).select('_id'))?._id;
    if (!targetUserId) {
      throw new ValidationError('User not found with provided email');
    }

    const isMember = workspace.members.some(m => m.toString() === targetUserId.toString());
    if (isMember) {
      throw new ConflictError('User is already a member of this workspace');
    }

    const hasPendingInvitation = workspace.invitations.some(
      inv => (inv.userId?.toString() === targetUserId.toString() || inv.email === email) && inv.status === 'pending'
    );
    if (hasPendingInvitation) {
      throw new ConflictError(MESSAGES.ALREADY_INVITED);
    }

    const token = `${workspaceId}-${targetUserId}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    await collaborationRepository.addInvitation(workspaceId, {
      userId: targetUserId,
      email: email || '',
      invitedBy: userId,
      role,
      token,
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    try {
      const invitee = await User.findById(targetUserId).select('name email');
      await notificationService.sendInAppNotification('buildWorkspaceInvitationSent', {
        recipientId: targetUserId.toString(),
        workspaceName: workspace.name,
        workspaceId: workspaceId,
        inviterName: (await User.findById(userId).select('name'))?.name || 'Admin',
      });

      await collaborationRepository.addActivityLog(workspaceId, {
        action: `Invitation sent to ${invitee?.name || email}`,
        performedBy: userId,
        targetType: 'invitation',
        targetId: targetUserId,
        metadata: { type: 'invitation_sent', inviteeId: targetUserId.toString() },
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return {
      message: MESSAGES.INVITATION_SENT,
    };
  }

  async acceptInvitation(workspaceId, token, userId) {
    const workspace = await CollaborationWorkspace.findOne({
      _id: workspaceId,
      isDeleted: false,
      'invitations.token': token,
    });

    if (!workspace) {
      throw new NotFoundError(MESSAGES.INVITATION_NOT_FOUND);
    }

    const invitation = workspace.invitations.find(inv => inv.token === token);
    if (!invitation) {
      throw new NotFoundError(MESSAGES.INVITATION_NOT_FOUND);
    }

    if (invitation.status !== 'pending') {
      throw new ValidationError('Invitation is no longer pending');
    }

    if (invitation.expiresAt && new Date() > invitation.expiresAt) {
      throw new ValidationError('Invitation has expired');
    }

    const isMember = workspace.members.some(m => m.toString() === userId.toString());
    if (isMember) {
      throw new ConflictError(MESSAGES.ALREADY_MEMBER);
    }

    const invitationIndex = workspace.invitations.indexOf(invitation);
    await collaborationRepository.updateInvitation(workspaceId, invitationIndex, {
      status: 'accepted',
    });

    await collaborationRepository.addMember(workspaceId, userId, invitation.role, invitation.invitedBy);

    try {
      await notificationService.sendInAppNotification('buildWorkspaceInvitationAccepted', {
        recipientId: invitation.invitedBy.toString(),
        workspaceName: workspace.name,
        workspaceId: workspaceId,
        userName: (await User.findById(userId).select('name'))?.name || 'A user',
      });

      await collaborationRepository.addActivityLog(workspaceId, {
        action: `Invitation accepted by ${userId}`,
        performedBy: userId,
        targetType: 'invitation',
        targetId: invitation._id,
        metadata: { type: 'invitation_accepted' },
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return {
      message: MESSAGES.INVITATION_ACCEPTED,
    };
  }

  async declineInvitation(workspaceId, token, userId) {
    const workspace = await CollaborationWorkspace.findOne({
      _id: workspaceId,
      isDeleted: false,
      'invitations.token': token,
    });

    if (!workspace) {
      throw new NotFoundError(MESSAGES.INVITATION_NOT_FOUND);
    }

    const invitation = workspace.invitations.find(inv => inv.token === token);
    if (!invitation) {
      throw new NotFoundError(MESSAGES.INVITATION_NOT_FOUND);
    }

    if (invitation.status !== 'pending') {
      throw new ValidationError('Invitation is no longer pending');
    }

    const invitationIndex = workspace.invitations.indexOf(invitation);
    await collaborationRepository.updateInvitation(workspaceId, invitationIndex, {
      status: 'declined',
    });

    try {
      await notificationService.sendInAppNotification('buildWorkspaceInvitationDeclined', {
        recipientId: invitation.invitedBy.toString(),
        workspaceName: workspace.name,
        workspaceId: workspaceId,
        userName: (await User.findById(userId).select('name'))?.name || 'A user',
      });

      await collaborationRepository.addActivityLog(workspaceId, {
        action: `Invitation declined by ${userId}`,
        performedBy: userId,
        targetType: 'invitation',
        targetId: invitation._id,
        metadata: { type: 'invitation_declined' },
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return {
      message: MESSAGES.INVITATION_DECLINED,
    };
  }

  async requestToJoin(workspaceId, userId, message = '') {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isMember = workspace.members.some(m => m.toString() === userId.toString());
    if (isMember) {
      throw new ConflictError(MESSAGES.ALREADY_MEMBER);
    }

    const hasPendingRequest = workspace.joinRequests.some(
      req => req.userId.toString() === userId.toString() && req.status === 'pending'
    );
    if (hasPendingRequest) {
      throw new ConflictError(MESSAGES.ALREADY_REQUESTED);
    }

    await collaborationRepository.addJoinRequest(workspaceId, {
      userId,
      message,
      status: 'pending',
    });

    try {
      await notificationService.sendInAppNotification('buildWorkspaceJoinRequestSubmitted', {
        recipientId: workspace.createdBy.toString(),
        workspaceName: workspace.name,
        workspaceId: workspaceId,
        userName: (await User.findById(userId).select('name'))?.name || 'A user',
      });

      await collaborationRepository.addActivityLog(workspaceId, {
        action: `Join request submitted by ${userId}`,
        performedBy: userId,
        targetType: 'join_request',
        targetId: userId,
        metadata: { type: 'join_request_submitted' },
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return {
      message: MESSAGES.JOIN_REQUEST_SUBMITTED,
    };
  }

  async reviewJoinRequest(workspaceId, requestIndex, action, userId, reviewerId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isAdmin = workspace.memberDetails.some(
      m => m.userId.toString() === reviewerId.toString() && m.role === MEMBER_ROLE.ADMIN
    );
    if (!isAdmin) {
      throw new ValidationError('Only workspace admin can review join requests');
    }

    const request = workspace.joinRequests[requestIndex];
    if (!request) {
      throw new NotFoundError(MESSAGES.JOIN_REQUEST_NOT_FOUND);
    }

    if (request.status !== 'pending') {
      throw new ValidationError('Join request has already been processed');
    }

    const updateData = {
      status: action,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
    };

    await collaborationRepository.updateJoinRequest(workspaceId, requestIndex, updateData);

    if (action === 'approved') {
      const isMember = workspace.members.some(m => m.toString() === request.userId.toString());
      if (!isMember) {
        await collaborationRepository.addMember(workspaceId, request.userId, MEMBER_ROLE.MEMBER, reviewerId);
      }

      try {
        await notificationService.sendInAppNotification('buildWorkspaceJoinRequestApproved', {
          recipientId: request.userId.toString(),
          workspaceName: workspace.name,
          workspaceId: workspaceId,
        });

        await collaborationRepository.addActivityLog(workspaceId, {
          action: `Join request approved for ${request.userId}`,
          performedBy: reviewerId,
          targetType: 'join_request',
          targetId: request.userId,
          metadata: { type: 'join_request_approved' },
        });
      } catch (_error) {
        // Notification failure is non-blocking
      }
    } else {
      try {
        await notificationService.sendInAppNotification('buildWorkspaceJoinRequestDeclined', {
          recipientId: request.userId.toString(),
          workspaceName: workspace.name,
          workspaceId: workspaceId,
        });

        await collaborationRepository.addActivityLog(workspaceId, {
          action: `Join request declined for ${request.userId}`,
          performedBy: reviewerId,
          targetType: 'join_request',
          targetId: request.userId,
          metadata: { type: 'join_request_declined' },
        });
      } catch (_error) {
        // Notification failure is non-blocking
      }
    }

    return {
      message: action === 'approved' ? MESSAGES.JOIN_REQUEST_APPROVED : MESSAGES.JOIN_REQUEST_DECLINED,
    };
  }

  async updateMemberRole(workspaceId, targetUserId, newRole, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isAdmin = workspace.memberDetails.some(
      m => m.userId.toString() === userId.toString() && m.role === MEMBER_ROLE.ADMIN
    );
    if (!isAdmin) {
      throw new ValidationError('Only workspace admin can update member roles');
    }

    const targetMember = workspace.memberDetails.find(
      m => m.userId.toString() === targetUserId.toString()
    );
    if (!targetMember) {
      throw new NotFoundError('Member not found in workspace');
    }

    if (targetUserId.toString() === userId.toString()) {
      throw new ValidationError(MESSAGES.CANNOT_UPDATE_OWN_ROLE);
    }

    if (workspace.createdBy.toString() === targetUserId.toString()) {
      throw new ValidationError(MESSAGES.CANNOT_REMOVE_CREATOR);
    }

    if (!Object.values(MEMBER_ROLE).includes(newRole)) {
      throw new ValidationError(MESSAGES.INVALID_ROLE);
    }

    await collaborationRepository.updateMemberRole(workspaceId, targetUserId, newRole);

    try {
      await notificationService.sendInAppNotification('buildWorkspaceMemberRoleUpdated', {
        recipientId: targetUserId.toString(),
        workspaceName: workspace.name,
        workspaceId: workspaceId,
        newRole,
        updatedByName: (await User.findById(userId).select('name'))?.name || 'Admin',
      });

      await collaborationRepository.addActivityLog(workspaceId, {
        action: `Role updated for ${targetUserId} to ${newRole}`,
        performedBy: userId,
        targetType: 'member',
        targetId: targetUserId,
        metadata: { type: 'role_updated', newRole },
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return {
      message: MESSAGES.ROLE_UPDATED,
    };
  }

  async getPendingInvitations(workspaceId, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isAdmin = workspace.memberDetails.some(
      m => m.userId.toString() === userId.toString() && m.role === MEMBER_ROLE.ADMIN
    );
    if (!isAdmin) {
      throw new ValidationError('Only workspace admin can view invitations');
    }

    const pendingInvitations = workspace.invitations.filter(inv => inv.status === 'pending');

    return {
      invitations: pendingInvitations,
      message: MESSAGES.PENDING_INVITATIONS,
    };
  }

  async getPendingJoinRequests(workspaceId, userId) {
    const workspace = await collaborationRepository.findActiveById(workspaceId);

    if (!workspace) {
      throw new NotFoundError(MESSAGES.WORKSPACE_NOT_FOUND);
    }

    const isAdmin = workspace.memberDetails.some(
      m => m.userId.toString() === userId.toString() && m.role === MEMBER_ROLE.ADMIN
    );
    if (!isAdmin) {
      throw new ValidationError('Only workspace admin can view join requests');
    }

    const pendingRequests = workspace.joinRequests.filter(req => req.status === 'pending');

    return {
      joinRequests: pendingRequests,
      message: MESSAGES.PENDING_JOIN_REQUESTS,
    };
  }

  async getUserRecentActivity(userId) {
    const workspaces = await CollaborationWorkspace.find({
      members: userId,
      isDeleted: false,
    }).sort({ createdAt: -1 }).limit(10);

    const recentActivities = [];
    for (const workspace of workspaces) {
      const recentLogs = workspace.activityLog
        .filter(log => log.performedBy.toString() !== userId.toString())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      for (const log of recentLogs) {
        recentActivities.push({
          ...log.toObject(),
          workspaceName: workspace.name,
          workspaceId: workspace._id,
        });
      }
    }

    recentActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      activities: recentActivities.slice(0, 20),
      message: 'Recent activity fetched successfully',
    };
  }
}

module.exports = new CollaborationService();
