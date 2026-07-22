const BadgeRule = require('./badge-rule.model');

class BadgeRuleRepository {
  async create(ruleData) {
    return BadgeRule.create(ruleData);
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    if (filters.category) {
      query.category = filters.category;
    }

    const [rules, total] = await Promise.all([
      BadgeRule.find(query)
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      BadgeRule.countDocuments(query),
    ]);

    return { rules, total, page, limit };
  }

  async findById(id) {
    return BadgeRule.findById(id);
  }

  async findBySlug(slug) {
    return BadgeRule.findOne({ slug, isDeleted: false });
  }

  async update(id, updateData) {
    return BadgeRule.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async softDelete(id, deletedBy) {
    return BadgeRule.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }

  async restore(id) {
    return BadgeRule.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: null },
      { new: true }
    );
  }
}

module.exports = new BadgeRuleRepository();
