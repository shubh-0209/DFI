const express = require('express');
const contributionController = require('../contribution/contribution.controller');
const {
  validateAdminContributions,
  validateGetContribution,
  validateReviewContribution,
  validateFeatureContribution,
  validateArchiveContribution,
  validateReviewHistory,
} = require('../contribution/contribution.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');
const { authorize } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

// All admin contribution routes require authentication and admin role
router.use(authenticate);
router.use(authenticatedLimiter);
router.use(authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR, ROLES.REVIEWER));

// ─── Review Queue ──────────────────────────────────────────────────
router.get(
  '/contributions',
  validateAdminContributions,
  contributionController.getAdminContributions
);

// ─── Contribution Detail ──────────────────────────────────────────
router.get(
  '/contributions/:id',
  validateGetContribution,
  contributionController.getAdminContributionDetail
);

// ─── Review Actions ───────────────────────────────────────────────
router.post(
  '/contributions/:id/review',
  validateGetContribution,
  validateReviewContribution,
  contributionController.reviewContribution
);

// ─── Feature Contribution ─────────────────────────────────────────
router.post(
  '/contributions/:id/feature',
  validateGetContribution,
  validateFeatureContribution,
  contributionController.featureContribution
);

// ─── Archive Contribution ─────────────────────────────────────────
router.post(
  '/contributions/:id/archive',
  validateGetContribution,
  validateArchiveContribution,
  contributionController.archiveContribution
);

// ─── Review History ───────────────────────────────────────────────
router.get(
  '/contributions/review-history',
  validateReviewHistory,
  contributionController.getReviewHistory
);

module.exports = router;
