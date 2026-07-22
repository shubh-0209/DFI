const express = require('express');
const contributionController = require('./contribution.controller');
const {
  validateCreateContribution,
  validateSubmitContribution,
  validateUpdateContribution,
  validateGetContribution,
  validateGetContributions,
} = require('./contribution.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');
const { isVolunteer, isAdminOrVolunteer } = require('../../middlewares/rbac.middleware');
const { uploadMultiple } = require('./upload.middleware');

const router = express.Router();

router.use(authenticate);
router.use(authenticatedLimiter);

router.post('/', isAdminOrVolunteer, validateCreateContribution, contributionController.createContribution);

router.post('/:id/submit', isAdminOrVolunteer, validateSubmitContribution, contributionController.submitContribution);

// File upload endpoint — accepts multipart/form-data with field name "files"
router.post('/:id/upload', isAdminOrVolunteer, validateGetContribution, uploadMultiple('files'), contributionController.uploadFiles);

router.put('/:id', isAdminOrVolunteer, validateUpdateContribution, contributionController.updateContribution);

router.delete('/:id', isAdminOrVolunteer, validateGetContribution, contributionController.deleteContribution);

router.get('/timeline', contributionController.getTimeline);

router.get('/my', isAdminOrVolunteer, validateGetContributions, contributionController.getMyContributions);

router.get('/:id', isAdminOrVolunteer, validateGetContribution, contributionController.getContribution);

router.get('/:id/versions', isAdminOrVolunteer, validateGetContribution, contributionController.getVersionHistory);

router.get('/:id/reviews', isAdminOrVolunteer, validateGetContribution, contributionController.getContributionReviews);

module.exports = router;

