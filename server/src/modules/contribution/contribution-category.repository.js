const ContributionCategory = require('./contribution-category.model');

class ContributionCategoryRepository {
  async create(categoryData) {
    return ContributionCategory.create(categoryData);
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const [categories, total] = await Promise.all([
      ContributionCategory.find(query)
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ContributionCategory.countDocuments(query),
    ]);

    return { categories, total, page, limit };
  }

  async findById(id) {
    return ContributionCategory.findById(id);
  }

  async findBySlug(slug) {
    return ContributionCategory.findOne({ slug, isDeleted: false });
  }

  async update(id, updateData) {
    return ContributionCategory.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async softDelete(id, deletedBy) {
    return ContributionCategory.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }

  async restore(id) {
    return ContributionCategory.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: null },
      { new: true }
    );
  }
}

module.exports = new ContributionCategoryRepository();
