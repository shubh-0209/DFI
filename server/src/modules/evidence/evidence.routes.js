const express = require('express');
const evidenceController = require('./evidence.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

router.post(
  '/application/:id',
  authenticate,
  authorize(ROLES.VOLUNTEER),
  evidenceController.submitEvidence
);

router.post(
  '/program/:id',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  evidenceController.submitEventEvidence
);

module.exports = router;
