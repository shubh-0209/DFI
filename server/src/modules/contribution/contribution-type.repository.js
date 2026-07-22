const ContributionType = require('./contribution-type.model');

class ContributionTypeRepository {
  async create(typeData) {
    return ContributionType.create(typeData);
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const [types, total] = await Promise.all([
      ContributionType.find(query)
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ContributionType.countDocuments(query),
    ]);

    return { types, total, page, limit };
  }

  async findById(id) {
    return ContributionType.findById(id);
  }

  async findBySlug(slug) {
    return ContributionType.findOne({ slug, isDeleted: false });
  }

  async update(id, updateData) {
    return ContributionType.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async softDelete(id, deletedBy) {
    return ContributionType.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }

  async restore(id) {
    return ContributionType.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: null },
      { new: true }
    );
  }
}

module.exports = new ContributionTypeRepository();
