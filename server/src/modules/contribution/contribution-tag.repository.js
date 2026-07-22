const ContributionTag = require('./contribution-tag.model');

class ContributionTagRepository {
  async create(tagData) {
    return ContributionTag.create(tagData);
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

    const [tags, total] = await Promise.all([
      ContributionTag.find(query)
        .sort({ usageCount: -1, name: 1 })
        .skip(skip)
        .limit(limit),
      ContributionTag.countDocuments(query),
    ]);

    return { tags, total, page, limit };
  }

  async findById(id) {
    return ContributionTag.findById(id);
  }

  async findBySlug(slug) {
    return ContributionTag.findOne({ slug, isDeleted: false });
  }

  async findPopular(limit = 20) {
    return ContributionTag.find({ isDeleted: false, isActive: true })
      .sort({ usageCount: -1 })
      .limit(limit);
  }

  async update(id, updateData) {
    return ContributionTag.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async incrementUsage(id) {
    return ContributionTag.findByIdAndUpdate(id, { $inc: { usageCount: 1 } }, { new: true });
  }

  async softDelete(id, deletedBy) {
    return ContributionTag.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }

  async restore(id) {
    return ContributionTag.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: null },
      { new: true }
    );
  }
}

module.exports = new ContributionTagRepository();
