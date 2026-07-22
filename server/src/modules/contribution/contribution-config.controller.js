const contributionConfigService = require('./contribution-config.service');
const { successResponse } = require('../../utils/response');

class ContributionConfigController {
  // Categories
  createCategory = async (req, res, next) => {
    try {
      const result = await contributionConfigService.createCategory(req.user.id, req.body);
      return successResponse(res, 201, result.message, { category: result.category });
    } catch (error) {
      return next(error);
    }
  };

  getCategories = async (req, res, next) => {
    try {
      const result = await contributionConfigService.getCategories(req.query);
      return successResponse(res, 200, result.message, {
        categories: result.categories,
        pagination: result.pagination,
      });
    } catch (error) {
      return next(error);
    }
  };

  updateCategory = async (req, res, next) => {
    try {
      const result = await contributionConfigService.updateCategory(req.params.id, req.user.id, req.body);
      return successResponse(res, 200, result.message, { category: result.category });
    } catch (error) {
      return next(error);
    }
  };

  deleteCategory = async (req, res, next) => {
    try {
      const result = await contributionConfigService.deleteCategory(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, {});
    } catch (error) {
      return next(error);
    }
  };

  restoreCategory = async (req, res, next) => {
    try {
      const result = await contributionConfigService.restoreCategory(req.params.id);
      return successResponse(res, 200, result.message, { category: result.category });
    } catch (error) {
      return next(error);
    }
  };

  toggleCategory = async (req, res, next) => {
    try {
      const { isActive } = req.body;
      const result = await contributionConfigService.toggleCategory(req.params.id, req.user.id, isActive);
      return successResponse(res, 200, result.message, { category: result.category });
    } catch (error) {
      return next(error);
    }
  };

  // Types
  createType = async (req, res, next) => {
    try {
      const result = await contributionConfigService.createType(req.user.id, req.body);
      return successResponse(res, 201, result.message, { type: result.type });
    } catch (error) {
      return next(error);
    }
  };

  getTypes = async (req, res, next) => {
    try {
      const result = await contributionConfigService.getTypes(req.query);
      return successResponse(res, 200, result.message, {
        types: result.types,
        pagination: result.pagination,
      });
    } catch (error) {
      return next(error);
    }
  };

  updateType = async (req, res, next) => {
    try {
      const result = await contributionConfigService.updateType(req.params.id, req.user.id, req.body);
      return successResponse(res, 200, result.message, { type: result.type });
    } catch (error) {
      return next(error);
    }
  };

  deleteType = async (req, res, next) => {
    try {
      const result = await contributionConfigService.deleteType(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, {});
    } catch (error) {
      return next(error);
    }
  };

  restoreType = async (req, res, next) => {
    try {
      const result = await contributionConfigService.restoreType(req.params.id);
      return successResponse(res, 200, result.message, { type: result.type });
    } catch (error) {
      return next(error);
    }
  };

  toggleType = async (req, res, next) => {
    try {
      const { isActive } = req.body;
      const result = await contributionConfigService.toggleType(req.params.id, req.user.id, isActive);
      return successResponse(res, 200, result.message, { type: result.type });
    } catch (error) {
      return next(error);
    }
  };

  // Coin Rules
  createCoinRule = async (req, res, next) => {
    try {
      const result = await contributionConfigService.createCoinRule(req.user.id, req.body);
      return successResponse(res, 201, result.message, { rule: result.rule });
    } catch (error) {
      return next(error);
    }
  };

  getCoinRules = async (req, res, next) => {
    try {
      const result = await contributionConfigService.getCoinRules(req.query);
      return successResponse(res, 200, result.message, {
        rules: result.rules,
        pagination: result.pagination,
      });
    } catch (error) {
      return next(error);
    }
  };

  updateCoinRule = async (req, res, next) => {
    try {
      const result = await contributionConfigService.updateCoinRule(req.params.id, req.user.id, req.body);
      return successResponse(res, 200, result.message, { rule: result.rule });
    } catch (error) {
      return next(error);
    }
  };

  deleteCoinRule = async (req, res, next) => {
    try {
      const result = await contributionConfigService.deleteCoinRule(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, {});
    } catch (error) {
      return next(error);
    }
  };

  restoreCoinRule = async (req, res, next) => {
    try {
      const result = await contributionConfigService.restoreCoinRule(req.params.id);
      return successResponse(res, 200, result.message, { rule: result.rule });
    } catch (error) {
      return next(error);
    }
  };

  toggleCoinRule = async (req, res, next) => {
    try {
      const { isActive } = req.body;
      const result = await contributionConfigService.toggleCoinRule(req.params.id, req.user.id, isActive);
      return successResponse(res, 200, result.message, { rule: result.rule });
    } catch (error) {
      return next(error);
    }
  };

  // Badge Rules
  createBadgeRule = async (req, res, next) => {
    try {
      const result = await contributionConfigService.createBadgeRule(req.user.id, req.body);
      return successResponse(res, 201, result.message, { rule: result.rule });
    } catch (error) {
      return next(error);
    }
  };

  getBadgeRules = async (req, res, next) => {
    try {
      const result = await contributionConfigService.getBadgeRules(req.query);
      return successResponse(res, 200, result.message, {
        rules: result.rules,
        pagination: result.pagination,
      });
    } catch (error) {
      return next(error);
    }
  };

  updateBadgeRule = async (req, res, next) => {
    try {
      const result = await contributionConfigService.updateBadgeRule(req.params.id, req.user.id, req.body);
      return successResponse(res, 200, result.message, { rule: result.rule });
    } catch (error) {
      return next(error);
    }
  };

  deleteBadgeRule = async (req, res, next) => {
    try {
      const result = await contributionConfigService.deleteBadgeRule(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, {});
    } catch (error) {
      return next(error);
    }
  };

  restoreBadgeRule = async (req, res, next) => {
    try {
      const result = await contributionConfigService.restoreBadgeRule(req.params.id);
      return successResponse(res, 200, result.message, { rule: result.rule });
    } catch (error) {
      return next(error);
    }
  };

  toggleBadgeRule = async (req, res, next) => {
    try {
      const { isActive } = req.body;
      const result = await contributionConfigService.toggleBadgeRule(req.params.id, req.user.id, isActive);
      return successResponse(res, 200, result.message, { rule: result.rule });
    } catch (error) {
      return next(error);
    }
  };

  // Review Templates
  createReviewTemplate = async (req, res, next) => {
    try {
      const result = await contributionConfigService.createReviewTemplate(req.user.id, req.body);
      return successResponse(res, 201, result.message, { template: result.template });
    } catch (error) {
      return next(error);
    }
  };

  getReviewTemplates = async (req, res, next) => {
    try {
      const result = await contributionConfigService.getReviewTemplates(req.query);
      return successResponse(res, 200, result.message, {
        templates: result.templates,
        pagination: result.pagination,
      });
    } catch (error) {
      return next(error);
    }
  };

  updateReviewTemplate = async (req, res, next) => {
    try {
      const result = await contributionConfigService.updateReviewTemplate(req.params.id, req.user.id, req.body);
      return successResponse(res, 200, result.message, { template: result.template });
    } catch (error) {
      return next(error);
    }
  };

  deleteReviewTemplate = async (req, res, next) => {
    try {
      const result = await contributionConfigService.deleteReviewTemplate(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, {});
    } catch (error) {
      return next(error);
    }
  };

  restoreReviewTemplate = async (req, res, next) => {
    try {
      const result = await contributionConfigService.restoreReviewTemplate(req.params.id);
      return successResponse(res, 200, result.message, { template: result.template });
    } catch (error) {
      return next(error);
    }
  };

  toggleReviewTemplate = async (req, res, next) => {
    try {
      const { isActive } = req.body;
      const result = await contributionConfigService.toggleReviewTemplate(req.params.id, req.user.id, isActive);
      return successResponse(res, 200, result.message, { template: result.template });
    } catch (error) {
      return next(error);
    }
  };

  // File Type Configs
  createFileTypeConfig = async (req, res, next) => {
    try {
      const result = await contributionConfigService.createFileTypeConfig(req.user.id, req.body);
      return successResponse(res, 201, result.message, { config: result.config });
    } catch (error) {
      return next(error);
    }
  };

  getFileTypeConfigs = async (req, res, next) => {
    try {
      const result = await contributionConfigService.getFileTypeConfigs(req.query);
      return successResponse(res, 200, result.message, {
        configs: result.configs,
        pagination: result.pagination,
      });
    } catch (error) {
      return next(error);
    }
  };

  updateFileTypeConfig = async (req, res, next) => {
    try {
      const result = await contributionConfigService.updateFileTypeConfig(req.params.id, req.user.id, req.body);
      return successResponse(res, 200, result.message, { config: result.config });
    } catch (error) {
      return next(error);
    }
  };

  deleteFileTypeConfig = async (req, res, next) => {
    try {
      const result = await contributionConfigService.deleteFileTypeConfig(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, {});
    } catch (error) {
      return next(error);
    }
  };

  restoreFileTypeConfig = async (req, res, next) => {
    try {
      const result = await contributionConfigService.restoreFileTypeConfig(req.params.id);
      return successResponse(res, 200, result.message, { config: result.config });
    } catch (error) {
      return next(error);
    }
  };

  toggleFileTypeConfig = async (req, res, next) => {
    try {
      const { isActive } = req.body;
      const result = await contributionConfigService.toggleFileTypeConfig(req.params.id, req.user.id, isActive);
      return successResponse(res, 200, result.message, { config: result.config });
    } catch (error) {
      return next(error);
    }
  };

  // Tags
  createTag = async (req, res, next) => {
    try {
      const result = await contributionConfigService.createTag(req.user.id, req.body);
      return successResponse(res, 201, result.message, { tag: result.tag });
    } catch (error) {
      return next(error);
    }
  };

  getTags = async (req, res, next) => {
    try {
      const result = await contributionConfigService.getTags(req.query);
      return successResponse(res, 200, result.message, {
        tags: result.tags,
        pagination: result.pagination,
      });
    } catch (error) {
      return next(error);
    }
  };

  updateTag = async (req, res, next) => {
    try {
      const result = await contributionConfigService.updateTag(req.params.id, req.user.id, req.body);
      return successResponse(res, 200, result.message, { tag: result.tag });
    } catch (error) {
      return next(error);
    }
  };

  deleteTag = async (req, res, next) => {
    try {
      const result = await contributionConfigService.deleteTag(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, {});
    } catch (error) {
      return next(error);
    }
  };

  restoreTag = async (req, res, next) => {
    try {
      const result = await contributionConfigService.restoreTag(req.params.id);
      return successResponse(res, 200, result.message, { tag: result.tag });
    } catch (error) {
      return next(error);
    }
  };

  toggleTag = async (req, res, next) => {
    try {
      const { isActive } = req.body;
      const result = await contributionConfigService.toggleTag(req.params.id, req.user.id, isActive);
      return successResponse(res, 200, result.message, { tag: result.tag });
    } catch (error) {
      return next(error);
    }
  };

  // Portfolio Configs
  createPortfolioConfig = async (req, res, next) => {
    try {
      const result = await contributionConfigService.createPortfolioConfig(req.user.id, req.body);
      return successResponse(res, 201, result.message, { config: result.config });
    } catch (error) {
      return next(error);
    }
  };

  getPortfolioConfigs = async (req, res, next) => {
    try {
      const result = await contributionConfigService.getPortfolioConfigs(req.query);
      return successResponse(res, 200, result.message, {
        configs: result.configs,
        pagination: result.pagination,
      });
    } catch (error) {
      return next(error);
    }
  };

  updatePortfolioConfig = async (req, res, next) => {
    try {
      const result = await contributionConfigService.updatePortfolioConfig(req.params.id, req.user.id, req.body);
      return successResponse(res, 200, result.message, { config: result.config });
    } catch (error) {
      return next(error);
    }
  };

  deletePortfolioConfig = async (req, res, next) => {
    try {
      const result = await contributionConfigService.deletePortfolioConfig(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, {});
    } catch (error) {
      return next(error);
    }
  };

  restorePortfolioConfig = async (req, res, next) => {
    try {
      const result = await contributionConfigService.restorePortfolioConfig(req.params.id);
      return successResponse(res, 200, result.message, { config: result.config });
    } catch (error) {
      return next(error);
    }
  };

  togglePortfolioConfig = async (req, res, next) => {
    try {
      const { isActive } = req.body;
      const result = await contributionConfigService.togglePortfolioConfig(req.params.id, req.user.id, isActive);
      return successResponse(res, 200, result.message, { config: result.config });
    } catch (error) {
      return next(error);
    }
  };

  // Featured Configs
  createFeaturedConfig = async (req, res, next) => {
    try {
      const result = await contributionConfigService.createFeaturedConfig(req.user.id, req.body);
      return successResponse(res, 201, result.message, { config: result.config });
    } catch (error) {
      return next(error);
    }
  };

  getFeaturedConfigs = async (req, res, next) => {
    try {
      const result = await contributionConfigService.getFeaturedConfigs(req.query);
      return successResponse(res, 200, result.message, {
        configs: result.configs,
        pagination: result.pagination,
      });
    } catch (error) {
      return next(error);
    }
  };

  updateFeaturedConfig = async (req, res, next) => {
    try {
      const result = await contributionConfigService.updateFeaturedConfig(req.params.id, req.user.id, req.body);
      return successResponse(res, 200, result.message, { config: result.config });
    } catch (error) {
      return next(error);
    }
  };

  deleteFeaturedConfig = async (req, res, next) => {
    try {
      const result = await contributionConfigService.deleteFeaturedConfig(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, {});
    } catch (error) {
      return next(error);
    }
  };

  restoreFeaturedConfig = async (req, res, next) => {
    try {
      const result = await contributionConfigService.restoreFeaturedConfig(req.params.id);
      return successResponse(res, 200, result.message, { config: result.config });
    } catch (error) {
      return next(error);
    }
  };

  toggleFeaturedConfig = async (req, res, next) => {
    try {
      const { isActive } = req.body;
      const result = await contributionConfigService.toggleFeaturedConfig(req.params.id, req.user.id, isActive);
      return successResponse(res, 200, result.message, { config: result.config });
    } catch (error) {
      return next(error);
    }
  };

  // Review Configs
  createReviewConfig = async (req, res, next) => {
    try {
      const result = await contributionConfigService.createReviewConfig(req.user.id, req.body);
      return successResponse(res, 201, result.message, { config: result.config });
    } catch (error) {
      return next(error);
    }
  };

  getReviewConfigs = async (req, res, next) => {
    try {
      const result = await contributionConfigService.getReviewConfigs(req.query);
      return successResponse(res, 200, result.message, {
        configs: result.configs,
        pagination: result.pagination,
      });
    } catch (error) {
      return next(error);
    }
  };

  updateReviewConfig = async (req, res, next) => {
    try {
      const result = await contributionConfigService.updateReviewConfig(req.params.id, req.user.id, req.body);
      return successResponse(res, 200, result.message, { config: result.config });
    } catch (error) {
      return next(error);
    }
  };

  deleteReviewConfig = async (req, res, next) => {
    try {
      const result = await contributionConfigService.deleteReviewConfig(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, {});
    } catch (error) {
      return next(error);
    }
  };

  restoreReviewConfig = async (req, res, next) => {
    try {
      const result = await contributionConfigService.restoreReviewConfig(req.params.id);
      return successResponse(res, 200, result.message, { config: result.config });
    } catch (error) {
      return next(error);
    }
  };

  toggleReviewConfig = async (req, res, next) => {
    try {
      const { isActive } = req.body;
      const result = await contributionConfigService.toggleReviewConfig(req.params.id, req.user.id, isActive);
      return successResponse(res, 200, result.message, { config: result.config });
    } catch (error) {
      return next(error);
    }
  };

  // Automation Configs
  createAutomationConfig = async (req, res, next) => {
    try {
      const result = await contributionConfigService.createAutomationConfig(req.user.id, req.body);
      return successResponse(res, 201, result.message, { config: result.config });
    } catch (error) {
      return next(error);
    }
  };

  getAutomationConfigs = async (req, res, next) => {
    try {
      const result = await contributionConfigService.getAutomationConfigs(req.query);
      return successResponse(res, 200, result.message, {
        configs: result.configs,
        pagination: result.pagination,
      });
    } catch (error) {
      return next(error);
    }
  };

  updateAutomationConfig = async (req, res, next) => {
    try {
      const result = await contributionConfigService.updateAutomationConfig(req.params.id, req.user.id, req.body);
      return successResponse(res, 200, result.message, { config: result.config });
    } catch (error) {
      return next(error);
    }
  };

  deleteAutomationConfig = async (req, res, next) => {
    try {
      const result = await contributionConfigService.deleteAutomationConfig(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, {});
    } catch (error) {
      return next(error);
    }
  };

  restoreAutomationConfig = async (req, res, next) => {
    try {
      const result = await contributionConfigService.restoreAutomationConfig(req.params.id);
      return successResponse(res, 200, result.message, { config: result.config });
    } catch (error) {
      return next(error);
    }
  };

  toggleAutomationConfig = async (req, res, next) => {
    try {
      const { isActive } = req.body;
      const result = await contributionConfigService.toggleAutomationConfig(req.params.id, req.user.id, isActive);
      return successResponse(res, 200, result.message, { config: result.config });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new ContributionConfigController();
