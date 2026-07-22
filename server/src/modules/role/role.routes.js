const express = require('express');
const roleController = require('./role.controller');
const { validateCreateRole, validateRoleId } = require('./role.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');
const { isAdmin } = require('../../middlewares/rbac.middleware');

const router = express.Router();

router.post('/', authenticate, authenticatedLimiter, isAdmin, validateCreateRole, roleController.createRole);
router.get('/', authenticate, authenticatedLimiter, isAdmin, roleController.listRoles);
router.get('/:id', authenticate, authenticatedLimiter, isAdmin, validateRoleId, roleController.getRole);
router.put('/:id', authenticate, authenticatedLimiter, isAdmin, validateRoleId, validateCreateRole, roleController.updateRole);
router.delete('/:id', authenticate, authenticatedLimiter, isAdmin, validateRoleId, roleController.deleteRole);

module.exports = router;