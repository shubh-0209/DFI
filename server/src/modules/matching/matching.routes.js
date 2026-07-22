const express = require('express');
const matchingController = require('./matching.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');
const { authorize } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

router.get('/programs', authenticate, authenticatedLimiter, matchingController.getProgramRecommendations);

router.get(
  '/volunteers',
  authenticate, authenticatedLimiter,
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR),
  matchingController.getVolunteerRecommendations
);

router.get('/recommendations', authenticate, authenticatedLimiter, matchingController.getDetailedRecommendation);

router.post('/save', authenticate, authenticatedLimiter, matchingController.saveRecommendation);

router.delete('/save/:id', authenticate, authenticatedLimiter, matchingController.unsaveRecommendation);

router.get('/saved', authenticate, authenticatedLimiter, matchingController.getSavedRecommendations);

router.get('/history', authenticate, authenticatedLimiter, matchingController.getRecommendationHistory);

router.get('/refresh', authenticate, authenticatedLimiter, matchingController.refreshRecommendations);

router.post('/feedback', authenticate, authenticatedLimiter, matchingController.submitFeedback);

router.post('/dismiss', authenticate, authenticatedLimiter, matchingController.dismissRecommendation);

module.exports = router;
