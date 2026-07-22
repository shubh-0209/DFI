const contributionCategoryRepository = require('./contribution-category.repository');
const contributionTypeRepository = require('./contribution-type.repository');
const coinRuleRepository = require('./coin-rule.repository');
const badgeRuleRepository = require('./badge-rule.repository');
const reviewTemplateRepository = require('./review-template.repository');
const fileTypeConfigRepository = require('./file-type-config.repository');
const contributionTagRepository = require('./contribution-tag.repository');
const portfolioConfigRepository = require('./portfolio-config.repository');
const featuredConfigRepository = require('./featured-config.repository');
const reviewConfigRepository = require('./review-config.repository');
const automationConfigRepository = require('./automation-config.repository');
const { NotFoundError, ConflictError } = require('../../utils/errors');

class ContributionConfigService {
  // Categories
  async createCategory(userId, data) {
    const existing = await contributionCategoryRepository.findBySlug(data.slug);
    if (existing) {
      throw new ConflictError('Category with this slug already exists');
    }

    const category = await contributionCategoryRepository.create({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    });

    return { category, message: 'Category created successfully' };
  }

  async getCategories(query = {}) {
    const { page = 1, limit = 10, isActive } = query;
    const result = await contributionCategoryRepository.findAll(
      { isActive },
      { page: Number(page), limit: Number(limit) }
    );

    return {
      categories: result.categories,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
        hasNextPage: result.page < Math.ceil(result.total / result.limit),
        hasPreviousPage: result.page > 1,
      },
      message: 'Categories retrieved successfully',
    };
  }

  async updateCategory(id, userId, data) {
    const category = await contributionCategoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    if (data.slug && data.slug !== category.slug) {
      const existing = await contributionCategoryRepository.findBySlug(data.slug);
      if (existing) {
        throw new ConflictError('Category with this slug already exists');
      }
    }

    const updated = await contributionCategoryRepository.update(id, {
      ...data,
      updatedBy: userId,
    });

    return { category: updated, message: 'Category updated successfully' };
  }

  async deleteCategory(id, userId) {
    const category = await contributionCategoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    await contributionCategoryRepository.softDelete(id, userId);
    return { message: 'Category deleted successfully' };
  }

  async restoreCategory(id) {
    const category = await contributionCategoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    const restored = await contributionCategoryRepository.restore(id);
    return { category: restored, message: 'Category restored successfully' };
  }

  // Types
  async createType(userId, data) {
    const existing = await contributionTypeRepository.findBySlug(data.slug);
    if (existing) {
      throw new ConflictError('Type with this slug already exists');
    }

    const type = await contributionTypeRepository.create({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    });

    return { type, message: 'Type created successfully' };
  }

  async getTypes(query = {}) {
    const { page = 1, limit = 10, isActive } = query;
    const result = await contributionTypeRepository.findAll(
      { isActive },
      { page: Number(page), limit: Number(limit) }
    );

    return {
      types: result.types,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
        hasNextPage: result.page < Math.ceil(result.total / result.limit),
        hasPreviousPage: result.page > 1,
      },
      message: 'Types retrieved successfully',
    };
  }

  async updateType(id, userId, data) {
    const type = await contributionTypeRepository.findById(id);
    if (!type) {
      throw new NotFoundError('Type not found');
    }

    if (data.slug && data.slug !== type.slug) {
      const existing = await contributionTypeRepository.findBySlug(data.slug);
      if (existing) {
        throw new ConflictError('Type with this slug already exists');
      }
    }

    const updated = await contributionTypeRepository.update(id, {
      ...data,
      updatedBy: userId,
    });

    return { type: updated, message: 'Type updated successfully' };
  }

  async deleteType(id, userId) {
    const type = await contributionTypeRepository.findById(id);
    if (!type) {
      throw new NotFoundError('Type not found');
    }

    await contributionTypeRepository.softDelete(id, userId);
    return { message: 'Type deleted successfully' };
  }

  async restoreType(id) {
    const type = await contributionTypeRepository.findById(id);
    if (!type) {
      throw new NotFoundError('Type not found');
    }

    const restored = await contributionTypeRepository.restore(id);
    return { type: restored, message: 'Type restored successfully' };
  }

  // Coin Rules
  async createCoinRule(userId, data) {
    const rule = await coinRuleRepository.create({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    });

    return { rule, message: 'Coin rule created successfully' };
  }

  async getCoinRules(query = {}) {
    const { page = 1, limit = 10, isActive, contributionCategory, contributionType } = query;
    const result = await coinRuleRepository.findAll(
      { isActive, contributionCategory, contributionType },
      { page: Number(page), limit: Number(limit) }
    );

    return {
      rules: result.rules,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
        hasNextPage: result.page < Math.ceil(result.total / result.limit),
        hasPreviousPage: result.page > 1,
      },
      message: 'Coin rules retrieved successfully',
    };
  }

  async updateCoinRule(id, userId, data) {
    const rule = await coinRuleRepository.findById(id);
    if (!rule) {
      throw new NotFoundError('Coin rule not found');
    }

    const updated = await coinRuleRepository.update(id, {
      ...data,
      updatedBy: userId,
    });

    return { rule: updated, message: 'Coin rule updated successfully' };
  }

  async deleteCoinRule(id, userId) {
    const rule = await coinRuleRepository.findById(id);
    if (!rule) {
      throw new NotFoundError('Coin rule not found');
    }

    await coinRuleRepository.softDelete(id, userId);
    return { message: 'Coin rule deleted successfully' };
  }

  async restoreCoinRule(id) {
    const rule = await coinRuleRepository.findById(id);
    if (!rule) {
      throw new NotFoundError('Coin rule not found');
    }

    const restored = await coinRuleRepository.restore(id);
    return { rule: restored, message: 'Coin rule restored successfully' };
  }

  // Badge Rules
  async createBadgeRule(userId, data) {
    const existing = await badgeRuleRepository.findBySlug(data.slug);
    if (existing) {
      throw new ConflictError('Badge with this slug already exists');
    }

    const rule = await badgeRuleRepository.create({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    });

    return { rule, message: 'Badge rule created successfully' };
  }

  async getBadgeRules(query = {}) {
    const { page = 1, limit = 10, isActive, category } = query;
    const result = await badgeRuleRepository.findAll(
      { isActive, category },
      { page: Number(page), limit: Number(limit) }
    );

    return {
      rules: result.rules,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
        hasNextPage: result.page < Math.ceil(result.total / result.limit),
        hasPreviousPage: result.page > 1,
      },
      message: 'Badge rules retrieved successfully',
    };
  }

  async updateBadgeRule(id, userId, data) {
    const rule = await badgeRuleRepository.findById(id);
    if (!rule) {
      throw new NotFoundError('Badge rule not found');
    }

    if (data.slug && data.slug !== rule.slug) {
      const existing = await badgeRuleRepository.findBySlug(data.slug);
      if (existing) {
        throw new ConflictError('Badge with this slug already exists');
      }
    }

    const updated = await badgeRuleRepository.update(id, {
      ...data,
      updatedBy: userId,
    });

    return { rule: updated, message: 'Badge rule updated successfully' };
  }

  async deleteBadgeRule(id, userId) {
    const rule = await badgeRuleRepository.findById(id);
    if (!rule) {
      throw new NotFoundError('Badge rule not found');
    }

    await badgeRuleRepository.softDelete(id, userId);
    return { message: 'Badge rule deleted successfully' };
  }

  async restoreBadgeRule(id) {
    const rule = await badgeRuleRepository.findById(id);
    if (!rule) {
      throw new NotFoundError('Badge rule not found');
    }

    const restored = await badgeRuleRepository.restore(id);
    return { rule: restored, message: 'Badge rule restored successfully' };
  }

  // Review Templates
  async createReviewTemplate(userId, data) {
    const template = await reviewTemplateRepository.create({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    });

    return { template, message: 'Review template created successfully' };
  }

  async getReviewTemplates(query = {}) {
    const { page = 1, limit = 10, isActive, action, category } = query;
    const result = await reviewTemplateRepository.findAll(
      { isActive, action, category },
      { page: Number(page), limit: Number(limit) }
    );

    return {
      templates: result.templates,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
        hasNextPage: result.page < Math.ceil(result.total / result.limit),
        hasPreviousPage: result.page > 1,
      },
      message: 'Review templates retrieved successfully',
    };
  }

  async updateReviewTemplate(id, userId, data) {
    const template = await reviewTemplateRepository.findById(id);
    if (!template) {
      throw new NotFoundError('Review template not found');
    }

    const updated = await reviewTemplateRepository.update(id, {
      ...data,
      updatedBy: userId,
    });

    return { template: updated, message: 'Review template updated successfully' };
  }

  async deleteReviewTemplate(id, userId) {
    const template = await reviewTemplateRepository.findById(id);
    if (!template) {
      throw new NotFoundError('Review template not found');
    }

    await reviewTemplateRepository.softDelete(id, userId);
    return { message: 'Review template deleted successfully' };
  }

  async restoreReviewTemplate(id) {
    const template = await reviewTemplateRepository.findById(id);
    if (!template) {
      throw new NotFoundError('Review template not found');
    }

    const restored = await reviewTemplateRepository.restore(id);
    return { template: restored, message: 'Review template restored successfully' };
  }

  // File Type Configs
  async createFileTypeConfig(userId, data) {
    const existing = await fileTypeConfigRepository.findByExtension(data.extension);
    if (existing) {
      throw new ConflictError('File type with this extension already exists');
    }

    const config = await fileTypeConfigRepository.create({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    });

    return { config, message: 'File type config created successfully' };
  }

  async getFileTypeConfigs(query = {}) {
    const { page = 1, limit = 10, isActive, category } = query;
    const result = await fileTypeConfigRepository.findAll(
      { isActive, category },
      { page: Number(page), limit: Number(limit) }
    );

    return {
      configs: result.configs,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
        hasNextPage: result.page < Math.ceil(result.total / result.limit),
        hasPreviousPage: result.page > 1,
      },
      message: 'File type configs retrieved successfully',
    };
  }

  async updateFileTypeConfig(id, userId, data) {
    const config = await fileTypeConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundError('File type config not found');
    }

    if (data.extension && data.extension !== config.extension) {
      const existing = await fileTypeConfigRepository.findByExtension(data.extension);
      if (existing) {
        throw new ConflictError('File type with this extension already exists');
      }
    }

    const updated = await fileTypeConfigRepository.update(id, {
      ...data,
      updatedBy: userId,
    });

    return { config: updated, message: 'File type config updated successfully' };
  }

  async deleteFileTypeConfig(id, userId) {
    const config = await fileTypeConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundError('File type config not found');
    }

    await fileTypeConfigRepository.softDelete(id, userId);
    return { message: 'File type config deleted successfully' };
  }

  async restoreFileTypeConfig(id) {
    const config = await fileTypeConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundError('File type config not found');
    }

    const restored = await fileTypeConfigRepository.restore(id);
    return { config: restored, message: 'File type config restored successfully' };
  }

  // Tags
  async createTag(userId, data) {
    const existing = await contributionTagRepository.findBySlug(data.slug);
    if (existing) {
      throw new ConflictError('Tag with this slug already exists');
    }

    const tag = await contributionTagRepository.create({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    });

    return { tag, message: 'Tag created successfully' };
  }

  async getTags(query = {}) {
    const { page = 1, limit = 10, isActive, category, popular } = query;
    if (popular) {
      const tags = await contributionTagRepository.findPopular(Number(limit) || 20);
      return { tags, message: 'Popular tags retrieved successfully' };
    }

    const result = await contributionTagRepository.findAll(
      { isActive, category },
      { page: Number(page), limit: Number(limit) }
    );

    return {
      tags: result.tags,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
        hasNextPage: result.page < Math.ceil(result.total / result.limit),
        hasPreviousPage: result.page > 1,
      },
      message: 'Tags retrieved successfully',
    };
  }

  async updateTag(id, userId, data) {
    const tag = await contributionTagRepository.findById(id);
    if (!tag) {
      throw new NotFoundError('Tag not found');
    }

    if (data.slug && data.slug !== tag.slug) {
      const existing = await contributionTagRepository.findBySlug(data.slug);
      if (existing) {
        throw new ConflictError('Tag with this slug already exists');
      }
    }

    const updated = await contributionTagRepository.update(id, {
      ...data,
      updatedBy: userId,
    });

    return { tag: updated, message: 'Tag updated successfully' };
  }

  async deleteTag(id, userId) {
    const tag = await contributionTagRepository.findById(id);
    if (!tag) {
      throw new NotFoundError('Tag not found');
    }

    await contributionTagRepository.softDelete(id, userId);
    return { message: 'Tag deleted successfully' };
  }

  async restoreTag(id) {
    const tag = await contributionTagRepository.findById(id);
    if (!tag) {
      throw new NotFoundError('Tag not found');
    }

    const restored = await contributionTagRepository.restore(id);
    return { tag: restored, message: 'Tag restored successfully' };
  }

  // Generic config helpers
  async getConfig(repository, key) {
    return repository.findByKey(key);
  }

  async updateConfig(repository, key, value, updatedBy) {
    return repository.updateByKey(key, value, updatedBy);
  }

  // Portfolio Configs
  async createPortfolioConfig(userId, data) {
    const existing = await portfolioConfigRepository.findByKey(data.key);
    if (existing) {
      throw new ConflictError('Portfolio config with this key already exists');
    }

    const config = await portfolioConfigRepository.create({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    });

    return { config, message: 'Portfolio config created successfully' };
  }

  async getPortfolioConfigs(query = {}) {
    const { page = 1, limit = 10, isActive } = query;
    const result = await portfolioConfigRepository.findAll(
      { isActive },
      { page: Number(page), limit: Number(limit) }
    );

    return {
      configs: result.configs,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
        hasNextPage: result.page < Math.ceil(result.total / result.limit),
        hasPreviousPage: result.page > 1,
      },
      message: 'Portfolio configs retrieved successfully',
    };
  }

  async updatePortfolioConfig(id, userId, data) {
    const config = await portfolioConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundError('Portfolio config not found');
    }

    if (data.key && data.key !== config.key) {
      const existing = await portfolioConfigRepository.findByKey(data.key);
      if (existing) {
        throw new ConflictError('Portfolio config with this key already exists');
      }
    }

    const updated = await portfolioConfigRepository.update(id, {
      ...data,
      updatedBy: userId,
    });

    return { config: updated, message: 'Portfolio config updated successfully' };
  }

  async deletePortfolioConfig(id, userId) {
    const config = await portfolioConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundError('Portfolio config not found');
    }

    await portfolioConfigRepository.softDelete(id, userId);
    return { message: 'Portfolio config deleted successfully' };
  }

  async restorePortfolioConfig(id) {
    const config = await portfolioConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundError('Portfolio config not found');
    }

    const restored = await portfolioConfigRepository.restore(id);
    return { config: restored, message: 'Portfolio config restored successfully' };
  }

  async togglePortfolioConfig(id, userId, isActive) {
    const config = await portfolioConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundError('Portfolio config not found');
    }

    const updated = await portfolioConfigRepository.update(id, {
      isActive,
      updatedBy: userId,
    });

    return {
      config: updated,
      message: isActive ? 'Portfolio config enabled successfully' : 'Portfolio config disabled successfully',
    };
  }

  // Featured Configs
  async createFeaturedConfig(userId, data) {
    const existing = await featuredConfigRepository.findByKey(data.key);
    if (existing) {
      throw new ConflictError('Featured config with this key already exists');
    }

    const config = await featuredConfigRepository.create({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    });

    return { config, message: 'Featured config created successfully' };
  }

  async getFeaturedConfigs(query = {}) {
    const { page = 1, limit = 10, isActive } = query;
    const result = await featuredConfigRepository.findAll(
      { isActive },
      { page: Number(page), limit: Number(limit) }
    );

    return {
      configs: result.configs,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
        hasNextPage: result.page < Math.ceil(result.total / result.limit),
        hasPreviousPage: result.page > 1,
      },
      message: 'Featured configs retrieved successfully',
    };
  }

  async updateFeaturedConfig(id, userId, data) {
    const config = await featuredConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundError('Featured config not found');
    }

    if (data.key && data.key !== config.key) {
      const existing = await featuredConfigRepository.findByKey(data.key);
      if (existing) {
        throw new ConflictError('Featured config with this key already exists');
      }
    }

    const updated = await featuredConfigRepository.update(id, {
      ...data,
      updatedBy: userId,
    });

    return { config: updated, message: 'Featured config updated successfully' };
  }

  async deleteFeaturedConfig(id, userId) {
    const config = await featuredConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundError('Featured config not found');
    }

    await featuredConfigRepository.softDelete(id, userId);
    return { message: 'Featured config deleted successfully' };
  }

  async restoreFeaturedConfig(id) {
    const config = await featuredConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundError('Featured config not found');
    }

    const restored = await featuredConfigRepository.restore(id);
    return { config: restored, message: 'Featured config restored successfully' };
  }

  async toggleFeaturedConfig(id, userId, isActive) {
    const config = await featuredConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundError('Featured config not found');
    }

    const updated = await featuredConfigRepository.update(id, {
      isActive,
      updatedBy: userId,
    });

    return {
      config: updated,
      message: isActive ? 'Featured config enabled successfully' : 'Featured config disabled successfully',
    };
  }

  // Review Configs
  async createReviewConfig(userId, data) {
    const existing = await reviewConfigRepository.findByKey(data.key);
    if (existing) {
      throw new ConflictError('Review config with this key already exists');
    }

    const config = await reviewConfigRepository.create({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    });

    return { config, message: 'Review config created successfully' };
  }

  async getReviewConfigs(query = {}) {
    const { page = 1, limit = 10, isActive } = query;
    const result = await reviewConfigRepository.findAll(
      { isActive },
      { page: Number(page), limit: Number(limit) }
    );

    return {
      configs: result.configs,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
        hasNextPage: result.page < Math.ceil(result.total / result.limit),
        hasPreviousPage: result.page > 1,
      },
      message: 'Review configs retrieved successfully',
    };
  }

  async updateReviewConfig(id, userId, data) {
    const config = await reviewConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundError('Review config not found');
    }

    if (data.key && data.key !== config.key) {
      const existing = await reviewConfigRepository.findByKey(data.key);
      if (existing) {
        throw new ConflictError('Review config with this key already exists');
      }
    }

    const updated = await reviewConfigRepository.update(id, {
      ...data,
      updatedBy: userId,
    });

    return { config: updated, message: 'Review config updated successfully' };
  }

  async deleteReviewConfig(id, userId) {
    const config = await reviewConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundError('Review config not found');
    }

    await reviewConfigRepository.softDelete(id, userId);
    return { message: 'Review config deleted successfully' };
  }

  async restoreReviewConfig(id) {
    const config = await reviewConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundError('Review config not found');
    }

    const restored = await reviewConfigRepository.restore(id);
    return { config: restored, message: 'Review config restored successfully' };
  }

  async toggleReviewConfig(id, userId, isActive) {
    const config = await reviewConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundError('Review config not found');
    }

    const updated = await reviewConfigRepository.update(id, {
      isActive,
      updatedBy: userId,
    });

    return {
      config: updated,
      message: isActive ? 'Review config enabled successfully' : 'Review config disabled successfully',
    };
  }

  // Automation Configs
  async createAutomationConfig(userId, data) {
    const existing = await automationConfigRepository.findByKey(data.key);
    if (existing) {
      throw new ConflictError('Automation config with this key already exists');
    }

    const config = await automationConfigRepository.create({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    });

    return { config, message: 'Automation config created successfully' };
  }

  async getAutomationConfigs(query = {}) {
    const { page = 1, limit = 10, isActive } = query;
    const result = await automationConfigRepository.findAll(
      { isActive },
      { page: Number(page), limit: Number(limit) }
    );

    return {
      configs: result.configs,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
        hasNextPage: result.page < Math.ceil(result.total / result.limit),
        hasPreviousPage: result.page > 1,
      },
      message: 'Automation configs retrieved successfully',
    };
  }

  async updateAutomationConfig(id, userId, data) {
    const config = await automationConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundError('Automation config not found');
    }

    if (data.key && data.key !== config.key) {
      const existing = await automationConfigRepository.findByKey(data.key);
      if (existing) {
        throw new ConflictError('Automation config with this key already exists');
      }
    }

    const updated = await automationConfigRepository.update(id, {
      ...data,
      updatedBy: userId,
    });

    return { config: updated, message: 'Automation config updated successfully' };
  }

  async deleteAutomationConfig(id, userId) {
    const config = await automationConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundError('Automation config not found');
    }

    await automationConfigRepository.softDelete(id, userId);
    return { message: 'Automation config deleted successfully' };
  }

  async restoreAutomationConfig(id) {
    const config = await automationConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundError('Automation config not found');
    }

    const restored = await automationConfigRepository.restore(id);
    return { config: restored, message: 'Automation config restored successfully' };
  }

  async toggleAutomationConfig(id, userId, isActive) {
    const config = await automationConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundError('Automation config not found');
    }

    const updated = await automationConfigRepository.update(id, {
      isActive,
      updatedBy: userId,
    });

    return {
      config: updated,
      message: isActive ? 'Automation config enabled successfully' : 'Automation config disabled successfully',
    };
  }

  // Toggle endpoints for existing configs
  async toggleCategory(id, userId, isActive) {
    const category = await contributionCategoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    const updated = await contributionCategoryRepository.update(id, {
      isActive,
      updatedBy: userId,
    });

    return {
      category: updated,
      message: isActive ? 'Category enabled successfully' : 'Category disabled successfully',
    };
  }

  async toggleType(id, userId, isActive) {
    const type = await contributionTypeRepository.findById(id);
    if (!type) {
      throw new NotFoundError('Type not found');
    }

    const updated = await contributionTypeRepository.update(id, {
      isActive,
      updatedBy: userId,
    });

    return {
      type: updated,
      message: isActive ? 'Type enabled successfully' : 'Type disabled successfully',
    };
  }

  async toggleCoinRule(id, userId, isActive) {
    const rule = await coinRuleRepository.findById(id);
    if (!rule) {
      throw new NotFoundError('Coin rule not found');
    }

    const updated = await coinRuleRepository.update(id, {
      isActive,
      updatedBy: userId,
    });

    return {
      rule: updated,
      message: isActive ? 'Coin rule enabled successfully' : 'Coin rule disabled successfully',
    };
  }

  async toggleBadgeRule(id, userId, isActive) {
    const rule = await badgeRuleRepository.findById(id);
    if (!rule) {
      throw new NotFoundError('Badge rule not found');
    }

    const updated = await badgeRuleRepository.update(id, {
      isActive,
      updatedBy: userId,
    });

    return {
      rule: updated,
      message: isActive ? 'Badge rule enabled successfully' : 'Badge rule disabled successfully',
    };
  }

  async toggleReviewTemplate(id, userId, isActive) {
    const template = await reviewTemplateRepository.findById(id);
    if (!template) {
      throw new NotFoundError('Review template not found');
    }

    const updated = await reviewTemplateRepository.update(id, {
      isActive,
      updatedBy: userId,
    });

    return {
      template: updated,
      message: isActive ? 'Review template enabled successfully' : 'Review template disabled successfully',
    };
  }

  async toggleFileTypeConfig(id, userId, isActive) {
    const config = await fileTypeConfigRepository.findById(id);
    if (!config) {
      throw new NotFoundError('File type config not found');
    }

    const updated = await fileTypeConfigRepository.update(id, {
      isActive,
      updatedBy: userId,
    });

    return {
      config: updated,
      message: isActive ? 'File type config enabled successfully' : 'File type config disabled successfully',
    };
  }

  async toggleTag(id, userId, isActive) {
    const tag = await contributionTagRepository.findById(id);
    if (!tag) {
      throw new NotFoundError('Tag not found');
    }

    const updated = await contributionTagRepository.update(id, {
      isActive,
      updatedBy: userId,
    });

    return {
      tag: updated,
      message: isActive ? 'Tag enabled successfully' : 'Tag disabled successfully',
    };
  }
}

module.exports = new ContributionConfigService();
