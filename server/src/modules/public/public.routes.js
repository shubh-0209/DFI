const express = require('express');
const publicController = require('./public.controller');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Strict rate limiter for public endpoints to prevent abuse (e.g. max 100 requests per 15 minutes)
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all public routes
router.use(publicLimiter);

router.get('/programs', publicController.getPrograms);
router.get('/leaderboard/top', publicController.getTopLeaderboard);
router.get('/analytics/impact', publicController.getImpactAnalytics);
router.get('/announcements', publicController.getAnnouncements);
router.get('/volunteers/count', publicController.getVolunteerCount);

module.exports = router;
