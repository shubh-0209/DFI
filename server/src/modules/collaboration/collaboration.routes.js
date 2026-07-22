const express = require('express');
const collaborationController = require('./collaboration.controller');
const {
  validateCreateWorkspace,
  validateUpdateWorkspace,
  validateGetWorkspace,
  validateGetWorkspaces,
  validateAddNote,
  validateAddFile,
  validateAssignTask,
  validateUpdateTask,
  validateInviteUser,
  validateJoinRequest,
  validateReviewJoinRequest,
  validateUpdateMemberRole,
  validateTimeline,
} = require('./collaboration.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');

const router = express.Router();

router.use(authenticate);
router.use(authenticatedLimiter);

router.get('/workspaces', validateGetWorkspaces, collaborationController.getWorkspaces);

router.get('/workspaces/recent-activity', collaborationController.getUserRecentActivity);

router.get('/workspaces/:id', validateGetWorkspace, collaborationController.getWorkspace);

router.post('/workspaces', validateCreateWorkspace, collaborationController.createWorkspace);

router.patch('/workspaces/:id', validateGetWorkspace, validateUpdateWorkspace, collaborationController.updateWorkspace);

router.delete('/workspaces/:id', validateGetWorkspace, collaborationController.deleteWorkspace);

router.post('/workspaces/:id/join', validateGetWorkspace, collaborationController.joinWorkspace);

router.post('/workspaces/:id/leave', validateGetWorkspace, collaborationController.leaveWorkspace);

router.post('/workspaces/:id/join-requests', validateGetWorkspace, validateJoinRequest, collaborationController.requestToJoin);

router.get('/workspaces/:id/join-requests', validateGetWorkspace, collaborationController.getPendingJoinRequests);

router.patch('/workspaces/:id/join-requests/:requestIndex', validateGetWorkspace, validateReviewJoinRequest, collaborationController.reviewJoinRequest);

router.post('/workspaces/:id/invitations', validateGetWorkspace, validateInviteUser, collaborationController.inviteToWorkspace);

router.get('/workspaces/:id/invitations', validateGetWorkspace, collaborationController.getPendingInvitations);

router.post('/workspaces/:id/invitations/:token/accept', validateGetWorkspace, collaborationController.acceptInvitation);

router.post('/workspaces/:id/invitations/:token/decline', validateGetWorkspace, collaborationController.declineInvitation);

router.patch('/workspaces/:id/members/:userId/role', validateGetWorkspace, validateUpdateMemberRole, collaborationController.updateMemberRole);

router.get('/workspaces/:id/members', validateGetWorkspace, collaborationController.getWorkspaceMembers);

router.post('/workspaces/:id/notes', validateGetWorkspace, validateAddNote, collaborationController.addNote);

router.post('/workspaces/:id/files', validateGetWorkspace, validateAddFile, collaborationController.addFile);

router.post('/workspaces/:id/tasks', validateGetWorkspace, validateAssignTask, collaborationController.assignTask);

router.patch('/workspaces/:id/tasks/:taskIndex', validateGetWorkspace, validateUpdateTask, collaborationController.updateTaskStatus);

router.get('/workspaces/:id/activity-log', validateGetWorkspace, collaborationController.getWorkspaceActivityLog);

router.get('/workspaces/:id/timeline', validateGetWorkspace, validateTimeline, collaborationController.getActivityTimeline);

module.exports = router;
