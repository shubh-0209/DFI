const express = require('express');
const rewardRedemptionController = require('./rewardRedemption.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');

const router = express.Router();

router.use(authenticate);
router.use(authenticatedLimiter);

router.get('/history', rewardRedemptionController.getRedemptionHistory);
router.get('/:id', rewardRedemptionController.getRedemptionById);

module.exports = router;
