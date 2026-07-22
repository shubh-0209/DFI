const FeaturedConfig = require('./featured-config.model');

class FeaturedConfigRepository {
  async create(configData) {
    return FeaturedConfig.create(configData);
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const [configs, total] = await Promise.all([
      FeaturedConfig.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      FeaturedConfig.countDocuments(query),
    ]);

    return { configs, total, page, limit };
  }

  async findById(id) {
    return FeaturedConfig.findById(id);
  }

  async findByKey(key) {
    return FeaturedConfig.findOne({ key, isDeleted: false });
  }

  async update(id, updateData) {
    return FeaturedConfig.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async updateByKey(key, value, updatedBy) {
    return FeaturedConfig.findOneAndUpdate(
      { key, isDeleted: false },
      { value, updatedBy },
      { new: true, runValidators: true }
    );
  }

  async softDelete(id, deletedBy) {
    return FeaturedConfig.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }

  async restore(id) {
    return FeaturedConfig.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: null },
      { new: true }
    );
  }
}

module.exports = new FeaturedConfigRepository();
