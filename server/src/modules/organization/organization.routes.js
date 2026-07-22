const express = require('express');
const organizationController = require('./organization.controller');
const {
  validateCreateOrganization,
  validateUpdateOrganization,
  validateOrganizationId,
  validateListOrganizations,
  validateApproveOrganization,
  validateRejectOrganization,
  validateAssignAdmin,
  validateTransferOwnership,
} = require('./organization.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');
const { authorize, isAdmin } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

// Create Organization - Super Admin only
router.post('/', authenticate, authenticatedLimiter, authorize(ROLES.SUPER_ADMIN), validateCreateOrganization, organizationController.createOrganization);

// List Organizations - Authenticated users
router.get('/', authenticate, authenticatedLimiter, validateListOrganizations, organizationController.listOrganizations);

// Get Organization by ID
router.get('/:id', authenticate, authenticatedLimiter, validateOrganizationId, organizationController.getOrganization);

// Update Organization - Owner/Admin
router.put('/:id', authenticate, authenticatedLimiter, validateOrganizationId, validateUpdateOrganization, organizationController.updateOrganization);

// Delete Organization - Owner/Super Admin
router.delete('/:id', authenticate, authenticatedLimiter, validateOrganizationId, organizationController.deleteOrganization);

// Admin actions - Super Admin or Admin
router.patch('/:id/approve', authenticate, authenticatedLimiter, isAdmin, validateOrganizationId, validateApproveOrganization, organizationController.approveOrganization);
router.patch('/:id/reject', authenticate, authenticatedLimiter, isAdmin, validateOrganizationId, validateRejectOrganization, organizationController.rejectOrganization);
router.patch('/:id/activate', authenticate, authenticatedLimiter, isAdmin, validateOrganizationId, organizationController.activateOrganization);
router.patch('/:id/deactivate', authenticate, authenticatedLimiter, isAdmin, validateOrganizationId, organizationController.deactivateOrganization);
router.patch('/:id/archive', authenticate, authenticatedLimiter, isAdmin, validateOrganizationId, organizationController.archiveOrganization);
router.patch('/:id/restore', authenticate, authenticatedLimiter, isAdmin, validateOrganizationId, organizationController.restoreOrganization);
router.patch('/:id/assign-admin', authenticate, authenticatedLimiter, isAdmin, validateOrganizationId, validateAssignAdmin, organizationController.assignAdmin);
router.patch('/:id/remove-admin', authenticate, authenticatedLimiter, isAdmin, validateOrganizationId, validateAssignAdmin, organizationController.removeAdmin);
router.patch('/:id/transfer-owner', authenticate, authenticatedLimiter, isAdmin, validateOrganizationId, validateTransferOwnership, organizationController.transferOwnership);

module.exports = router;