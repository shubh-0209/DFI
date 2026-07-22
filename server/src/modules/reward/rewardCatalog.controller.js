const rewardCatalogService = require('./rewardCatalog.service');
const { MESSAGES } = require('./reward.constants');
const { successResponse, errorResponse } = require('../../utils/response');
const rewardService = require('./reward.service');
const rewardRedemptionService = require('./rewardRedemption.service');
const { generateRedemptionId } = require('./rewardRedemption.utils');
const notificationService = require('../notification/notification.service');
const rewardImageService = require('./rewardImage.service');
const aiImageService = require('./aiImage.service');
const { generateRewardImagePrompt } = require('./rewardPrompt.builder');

class RewardCatalogController {
  _mapReward(reward) {
    if (!reward) return reward;
    const { name, image, ...rest } = reward;
    return { ...rest, title: name, name, image_url: image, image }; // Return both for backward compatibility during transition
  }

  getCatalog = async (req, res, next) => {
    try {
      const filters = {
        category: req.query.category,
        status: req.query.status,
        isFeatured: req.query.isFeatured === 'true' ? true : req.query.isFeatured === 'false' ? false : undefined,
        search: req.query.search,
        minCoins: req.query.minCoins ? Number(req.query.minCoins) : undefined,
        maxCoins: req.query.maxCoins ? Number(req.query.maxCoins) : undefined,
        inStock: req.query.inStock === 'true',
      };
      const options = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
        sort: req.query.sort || '-createdAt',
      };
      const result = await rewardCatalogService.getCatalog(filters, options);
      if (result && result.items) {
        result.items = result.items.map(this._mapReward);
      }
      return successResponse(res, 200, MESSAGES.REWARD_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  getRewardDetail = async (req, res, next) => {
    try {
      const reward = await rewardCatalogService.getRewardById(req.params.id);
      return successResponse(res, 200, MESSAGES.REWARD_FETCHED, this._mapReward(reward));
    } catch (error) {
      return next(error);
    }
  };

  getFeaturedRewards = async (req, res, next) => {
    try {
      const limit = Number(req.query.limit) || 10;
      const rewards = await rewardCatalogService.getFeaturedRewards(limit);
      return successResponse(res, 200, MESSAGES.REWARD_FETCHED, rewards.map(this._mapReward));
    } catch (error) {
      return next(error);
    }
  };

  createReward = async (req, res, next) => {
    try {
      const {
        name,
        description,
        category,
        coinCost,
        stock,
        isFeatured,
        eligibility,
        termsAndConditions,
        estimatedDelivery,
        tags,
        autoGenerateImage = true,
        image_url
      } = req.body;

      let finalImageUrl = image_url;
      let imageGenerated = false;
      let imageSource = 'manual';

      if (autoGenerateImage || !finalImageUrl) {
        try {
          // 1. Generate Prompt
          const prompt = generateRewardImagePrompt({
            title: name,
            category,
            description
          });

          // 2. Try to generate and upload image via AI
          finalImageUrl = await aiImageService.generateAndUploadImage(prompt);
          imageGenerated = true;
          imageSource = 'ai_generated';
        } catch (aiError) {
          // 3. Fallback to existing manual assignment logic if AI fails or key is missing
          console.warn('[RewardCatalogController] Falling back to manual image assignment due to AI error:', aiError.message);
          finalImageUrl = rewardImageService.assignImage(name, category);
          imageGenerated = true;
          imageSource = 'automatic';
        }
      }

      const rewardData = {
        name,
        description,
        category,
        coinCost,
        stock,
        isFeatured,
        eligibility,
        termsAndConditions,
        estimatedDelivery,
        tags,
        image: finalImageUrl,
        image_url: finalImageUrl,
        image_source: imageSource,
        image_generated: imageGenerated,
        status: 'active'
      };

      const newReward = await rewardCatalogService.createReward(rewardData);
      return successResponse(res, 201, 'Reward created successfully', this._mapReward(newReward));
    } catch (error) {
      return next(error);
    }
  };

  redeemReward = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const rewardId = req.params.id;
      const { quantity = 1 } = req.body;

      const reward = await rewardCatalogService.redeemReward(userId, rewardId, quantity);
      const totalCoinsRequired = reward.coinCost * quantity;

      const userReward = await rewardService.getMyReward(userId);
      if (!userReward || (userReward.currentCoins || 0) < totalCoinsRequired) {
        return errorResponse(res, 400, 'Insufficient coins to redeem this reward', [
          { field: 'coins', message: 'You do not have enough coins' },
        ]);
      }

      const redemptionId = generateRedemptionId();
      const redemption = await rewardRedemptionService.createRedemption({
        user: userId,
        reward: rewardId,
        redemptionId,
        rewardSnapshot: {
          name: reward.name,
          coinCost: reward.coinCost,
          category: reward.category,
          image: reward.image,
        },
        quantity,
        totalCoinsDeducted: totalCoinsRequired,
        status: 'pending',
        // persist delivery address and reward type if provided by client
        deliveryAddress: req.body.deliveryAddress || {},
        rewardType: req.body.rewardType || 'physical',
      });

      await rewardService.redeemReward(userId, {
        coins: totalCoinsRequired,
        points: 0,
      });

      const rewardTransactionService = require('../reward-transaction/rewardTransaction.service');
      await rewardTransactionService.createTransaction(userId, {
        type: 'redeemed',
        reason: `Redeemed ${reward.name} (x${quantity})`,
        coins: -totalCoinsRequired,
        points: 0,
        impact: 0,
      });

      // Non-blocking confirmation notification
      notificationService.notifyRedemptionConfirmed(
        userId,
        reward.name,
        totalCoinsRequired,
        redemptionId,
      ).catch(() => {});

      return successResponse(res, 200, 'Reward redeemed successfully', { redemption, reward });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new RewardCatalogController();
