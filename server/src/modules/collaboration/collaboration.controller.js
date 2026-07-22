const collaborationService = require('./collaboration.service');
const { successResponse } = require('../../utils/response');

class CollaborationController {
  getWorkspaces = async (req, res, next) => {
    try {
      const result = await collaborationService.getWorkspaces(req.query, req.user.id);
      return successResponse(res, 200, result.message, {
        workspaces: result.workspaces,
        pagination: result.pagination,
      });
    } catch (error) {
      return next(error);
    }
  };

  getWorkspace = async (req, res, next) => {
    try {
      const result = await collaborationService.getWorkspace(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, { workspace: result.workspace });
    } catch (error) {
      return next(error);
    }
  };

  createWorkspace = async (req, res, next) => {
    try {
      const result = await collaborationService.createWorkspace(req.body, req.user.id);
      return successResponse(res, 201, result.message, { workspace: result.workspace });
    } catch (error) {
      return next(error);
    }
  };

  updateWorkspace = async (req, res, next) => {
    try {
      const result = await collaborationService.updateWorkspace(req.params.id, req.body, req.user.id);
      return successResponse(res, 200, result.message, { workspace: result.workspace });
    } catch (error) {
      return next(error);
    }
  };

  deleteWorkspace = async (req, res, next) => {
    try {
      const result = await collaborationService.deleteWorkspace(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, {});
    } catch (error) {
      return next(error);
    }
  };

  joinWorkspace = async (req, res, next) => {
    try {
      const result = await collaborationService.joinWorkspace(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, {});
    } catch (error) {
      return next(error);
    }
  };

  leaveWorkspace = async (req, res, next) => {
    try {
      const result = await collaborationService.leaveWorkspace(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, {});
    } catch (error) {
      return next(error);
    }
  };

  getWorkspaceMembers = async (req, res, next) => {
    try {
      const result = await collaborationService.getWorkspaceMembers(req.params.id);
      return successResponse(res, 200, result.message, { members: result.members });
    } catch (error) {
      return next(error);
    }
  };

  addNote = async (req, res, next) => {
    try {
      const result = await collaborationService.addNote(req.params.id, req.body, req.user.id);
      return successResponse(res, 201, result.message, { note: result.note });
    } catch (error) {
      return next(error);
    }
  };

  addFile = async (req, res, next) => {
    try {
      const result = await collaborationService.addFile(req.params.id, req.body, req.user.id);
      return successResponse(res, 201, result.message, { file: result.file });
    } catch (error) {
      return next(error);
    }
  };

  assignTask = async (req, res, next) => {
    try {
      const result = await collaborationService.assignTask(req.params.id, req.body, req.user.id);
      return successResponse(res, 201, result.message, { task: result.task });
    } catch (error) {
      return next(error);
    }
  };

  updateTaskStatus = async (req, res, next) => {
    try {
      const result = await collaborationService.updateTaskStatus(req.params.id, req.params.taskIndex, req.body, req.user.id);
      return successResponse(res, 200, result.message, { task: result.task });
    } catch (error) {
      return next(error);
    }
  };

  getWorkspaceActivityLog = async (req, res, next) => {
    try {
      const result = await collaborationService.getWorkspaceActivityLog(req.params.id);
      return successResponse(res, 200, result.message, { activityLog: result.activityLog });
    } catch (error) {
      return next(error);
    }
  };

  inviteToWorkspace = async (req, res, next) => {
    try {
      const result = await collaborationService.inviteToWorkspace(req.params.id, req.body, req.user.id);
      return successResponse(res, 200, result.message, {});
    } catch (error) {
      return next(error);
    }
  };

  acceptInvitation = async (req, res, next) => {
    try {
      const result = await collaborationService.acceptInvitation(req.params.id, req.params.token, req.user.id);
      return successResponse(res, 200, result.message, {});
    } catch (error) {
      return next(error);
    }
  };

  declineInvitation = async (req, res, next) => {
    try {
      const result = await collaborationService.declineInvitation(req.params.id, req.params.token, req.user.id);
      return successResponse(res, 200, result.message, {});
    } catch (error) {
      return next(error);
    }
  };

  requestToJoin = async (req, res, next) => {
    try {
      const result = await collaborationService.requestToJoin(req.params.id, req.user.id, req.body.message || '');
      return successResponse(res, 200, result.message, {});
    } catch (error) {
      return next(error);
    }
  };

  reviewJoinRequest = async (req, res, next) => {
    try {
      const { action } = req.body;
      const result = await collaborationService.reviewJoinRequest(req.params.id, parseInt(req.params.requestIndex), action, req.user.id, req.user.id);
      return successResponse(res, 200, result.message, {});
    } catch (error) {
      return next(error);
    }
  };

  updateMemberRole = async (req, res, next) => {
    try {
      const result = await collaborationService.updateMemberRole(req.params.id, req.params.userId, req.body.role, req.user.id);
      return successResponse(res, 200, result.message, {});
    } catch (error) {
      return next(error);
    }
  };

  getPendingInvitations = async (req, res, next) => {
    try {
      const result = await collaborationService.getPendingInvitations(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, { invitations: result.invitations });
    } catch (error) {
      return next(error);
    }
  };

  getPendingJoinRequests = async (req, res, next) => {
    try {
      const result = await collaborationService.getPendingJoinRequests(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, { joinRequests: result.joinRequests });
    } catch (error) {
      return next(error);
    }
  };

  getActivityTimeline = async (req, res, next) => {
    try {
      const result = await collaborationService.getActivityTimeline(req.params.id, req.query, req.user.id);
      return successResponse(res, 200, result.message, {
        timeline: result.timeline,
        pagination: result.pagination,
      });
    } catch (error) {
      return next(error);
    }
  };

  getUserRecentActivity = async (req, res, next) => {
    try {
      const result = await collaborationService.getUserRecentActivity(req.user.id);
      return successResponse(res, 200, result.message, { activities: result.activities });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new CollaborationController();
