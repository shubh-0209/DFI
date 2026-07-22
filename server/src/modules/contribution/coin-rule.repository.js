const CoinRule = require('./coin-rule.model');

class CoinRuleRepository {
  async create(ruleData) {
    return CoinRule.create(ruleData);
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    if (filters.contributionCategory) {
      query.contributionCategory = filters.contributionCategory;
    }
    if (filters.contributionType) {
      query.contributionType = filters.contributionType;
    }

    const [rules, total] = await Promise.all([
      CoinRule.find(query)
        .populate('contributionCategory', 'name slug')
        .populate('contributionType', 'name slug')
        .sort({ priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CoinRule.countDocuments(query),
    ]);

    return { rules, total, page, limit };
  }

  async findById(id) {
    return CoinRule.findById(id)
      .populate('contributionCategory', 'name slug')
      .populate('contributionType', 'name slug');
  }

  async findActiveRule(contributionCategory, contributionType) {
    const query = { isDeleted: false, isActive: true };
    if (contributionCategory) query.contributionCategory = contributionCategory;
    if (contributionType) query.contributionType = contributionType;

    return CoinRule.findOne(query)
      .populate('contributionCategory', 'name slug')
      .populate('contributionType', 'name slug')
      .sort({ priority: -1 });
  }

  async update(id, updateData) {
    return CoinRule.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async softDelete(id, deletedBy) {
    return CoinRule.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }

  async restore(id) {
    return CoinRule.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: null },
      { new: true }
    );
  }
}

module.exports = new CoinRuleRepository();
