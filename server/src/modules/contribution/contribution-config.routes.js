const express = require('express');
const contributionConfigController = require('./contribution-config.controller');
const {
  validateCreateCategory,
  validateUpdateCategory,
  validateCreateType,
  validateUpdateType,
  validateCreateCoinRule,
  validateCreateBadgeRule,
  validateCreateReviewTemplate,
  validateCreateFileTypeConfig,
  validateCreateTag,
  validateCreateGenericConfig,
  validateUpdateGenericConfig,
} = require('./contribution-config.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');
const { isAdmin } = require('../../middlewares/rbac.middleware');

const router = express.Router();

// All config routes require authentication and admin role
router.use(authenticate, authenticatedLimiter, isAdmin);

// Categories
router.post('/categories', validateCreateCategory, contributionConfigController.createCategory);
router.get('/categories', contributionConfigController.getCategories);
router.patch('/categories/:id', validateUpdateCategory, contributionConfigController.updateCategory);
router.delete('/categories/:id', contributionConfigController.deleteCategory);
router.post('/categories/:id/restore', contributionConfigController.restoreCategory);
router.patch('/categories/:id/toggle', validateUpdateCategory, contributionConfigController.toggleCategory);

// Types
router.post('/types', validateCreateType, contributionConfigController.createType);
router.get('/types', contributionConfigController.getTypes);
router.patch('/types/:id', validateUpdateType, contributionConfigController.updateType);
router.delete('/types/:id', contributionConfigController.deleteType);
router.post('/types/:id/restore', contributionConfigController.restoreType);
router.patch('/types/:id/toggle', validateUpdateType, contributionConfigController.toggleType);

// Coin Rules
router.post('/coin-rules', validateCreateCoinRule, contributionConfigController.createCoinRule);
router.get('/coin-rules', contributionConfigController.getCoinRules);
router.patch('/coin-rules/:id', validateCreateCoinRule, contributionConfigController.updateCoinRule);
router.delete('/coin-rules/:id', contributionConfigController.deleteCoinRule);
router.post('/coin-rules/:id/restore', contributionConfigController.restoreCoinRule);
router.patch('/coin-rules/:id/toggle', validateCreateCoinRule, contributionConfigController.toggleCoinRule);

// Badge Rules
router.post('/badge-rules', validateCreateBadgeRule, contributionConfigController.createBadgeRule);
router.get('/badge-rules', contributionConfigController.getBadgeRules);
router.patch('/badge-rules/:id', validateCreateBadgeRule, contributionConfigController.updateBadgeRule);
router.delete('/badge-rules/:id', contributionConfigController.deleteBadgeRule);
router.post('/badge-rules/:id/restore', contributionConfigController.restoreBadgeRule);
router.patch('/badge-rules/:id/toggle', validateCreateBadgeRule, contributionConfigController.toggleBadgeRule);

// Review Templates
router.post('/review-templates', validateCreateReviewTemplate, contributionConfigController.createReviewTemplate);
router.get('/review-templates', contributionConfigController.getReviewTemplates);
router.patch('/review-templates/:id', validateCreateReviewTemplate, contributionConfigController.updateReviewTemplate);
router.delete('/review-templates/:id', contributionConfigController.deleteReviewTemplate);
router.post('/review-templates/:id/restore', contributionConfigController.restoreReviewTemplate);
router.patch('/review-templates/:id/toggle', validateCreateReviewTemplate, contributionConfigController.toggleReviewTemplate);

// File Type Configs
router.post('/file-types', validateCreateFileTypeConfig, contributionConfigController.createFileTypeConfig);
router.get('/file-types', contributionConfigController.getFileTypeConfigs);
router.patch('/file-types/:id', validateCreateFileTypeConfig, contributionConfigController.updateFileTypeConfig);
router.delete('/file-types/:id', contributionConfigController.deleteFileTypeConfig);
router.post('/file-types/:id/restore', contributionConfigController.restoreFileTypeConfig);
router.patch('/file-types/:id/toggle', validateCreateFileTypeConfig, contributionConfigController.toggleFileTypeConfig);

// Tags
router.post('/tags', validateCreateTag, contributionConfigController.createTag);
router.get('/tags', contributionConfigController.getTags);
router.patch('/tags/:id', validateCreateTag, contributionConfigController.updateTag);
router.delete('/tags/:id', contributionConfigController.deleteTag);
router.post('/tags/:id/restore', contributionConfigController.restoreTag);
router.patch('/tags/:id/toggle', validateCreateTag, contributionConfigController.toggleTag);

// Portfolio Configs
router.post('/portfolio-configs', validateCreateGenericConfig, contributionConfigController.createPortfolioConfig);
router.get('/portfolio-configs', contributionConfigController.getPortfolioConfigs);
router.patch('/portfolio-configs/:id', validateUpdateGenericConfig, contributionConfigController.updatePortfolioConfig);
router.delete('/portfolio-configs/:id', contributionConfigController.deletePortfolioConfig);
router.post('/portfolio-configs/:id/restore', contributionConfigController.restorePortfolioConfig);
router.patch('/portfolio-configs/:id/toggle', validateUpdateGenericConfig, contributionConfigController.togglePortfolioConfig);

// Featured Configs
router.post('/featured-configs', validateCreateGenericConfig, contributionConfigController.createFeaturedConfig);
router.get('/featured-configs', contributionConfigController.getFeaturedConfigs);
router.patch('/featured-configs/:id', validateUpdateGenericConfig, contributionConfigController.updateFeaturedConfig);
router.delete('/featured-configs/:id', contributionConfigController.deleteFeaturedConfig);
router.post('/featured-configs/:id/restore', contributionConfigController.restoreFeaturedConfig);
router.patch('/featured-configs/:id/toggle', validateUpdateGenericConfig, contributionConfigController.toggleFeaturedConfig);

// Review Configs
router.post('/review-configs', validateCreateGenericConfig, contributionConfigController.createReviewConfig);
router.get('/review-configs', contributionConfigController.getReviewConfigs);
router.patch('/review-configs/:id', validateUpdateGenericConfig, contributionConfigController.updateReviewConfig);
router.delete('/review-configs/:id', contributionConfigController.deleteReviewConfig);
router.post('/review-configs/:id/restore', contributionConfigController.restoreReviewConfig);
router.patch('/review-configs/:id/toggle', validateUpdateGenericConfig, contributionConfigController.toggleReviewConfig);

// Automation Configs
router.post('/automation-configs', validateCreateGenericConfig, contributionConfigController.createAutomationConfig);
router.get('/automation-configs', contributionConfigController.getAutomationConfigs);
router.patch('/automation-configs/:id', validateUpdateGenericConfig, contributionConfigController.updateAutomationConfig);
router.delete('/automation-configs/:id', contributionConfigController.deleteAutomationConfig);
router.post('/automation-configs/:id/restore', contributionConfigController.restoreAutomationConfig);
router.patch('/automation-configs/:id/toggle', validateUpdateGenericConfig, contributionConfigController.toggleAutomationConfig);

module.exports = router;
