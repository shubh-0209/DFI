const express = require('express');
const leaderboardController = require('./leaderboard.controller');
const gamificationController = require('./gamification.controller');
const {
  validateGetLeaderboard,
  validateGetMyRank,
  validateGetTopVolunteers,
  validateRefreshLeaderboard,
  validateGetBadges,
  validateGetAchievements,
  validateGetVolunteerLevel,
  validateEvaluateGamification,
} = require('./leaderboard.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');
const { authorize } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

router.use(authenticate);
router.use(authenticatedLimiter);

router.get('/', validateGetLeaderboard, leaderboardController.getLeaderboard);
router.get('/me', validateGetMyRank, leaderboardController.getMyRank);
router.get('/top', validateGetTopVolunteers, leaderboardController.getTopVolunteers);

router.get('/badges', validateGetBadges, gamificationController.getBadges);
router.get('/achievements', validateGetAchievements, gamificationController.getAchievements);
router.get('/level', validateGetVolunteerLevel, gamificationController.getVolunteerLevel);

router.use(authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN));

router.post('/refresh', validateRefreshLeaderboard, leaderboardController.refreshLeaderboard);
router.post('/evaluate', validateEvaluateGamification, gamificationController.evaluateGamification);

module.exports = router;
