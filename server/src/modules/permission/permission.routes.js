const express = require('express');
const permissionController = require('./permission.controller');
const { validateCreatePermission, validateListPermissions } = require('./permission.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');
const { isAdmin } = require('../../middlewares/rbac.middleware');

const router = express.Router();

router.get('/', authenticate, authenticatedLimiter, validateListPermissions, permissionController.listPermissions);

router.post('/', authenticate, authenticatedLimiter, isAdmin, validateCreatePermission, permissionController.createPermission);

module.exports = router;