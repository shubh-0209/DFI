const express = require('express');
const rewardCatalogController = require('./rewardCatalog.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');

const router = express.Router();

router.use(authenticate);
router.use(authenticatedLimiter);

router.get('/', rewardCatalogController.getCatalog);
router.get('/featured', rewardCatalogController.getFeaturedRewards);
router.get('/:id', rewardCatalogController.getRewardDetail);
router.post('/:id/redeem', rewardCatalogController.redeemReward);

module.exports = router;
