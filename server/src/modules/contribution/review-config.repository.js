const ReviewConfig = require('./review-config.model');

class ReviewConfigRepository {
  async create(configData) {
    return ReviewConfig.create(configData);
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const [configs, total] = await Promise.all([
      ReviewConfig.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ReviewConfig.countDocuments(query),
    ]);

    return { configs, total, page, limit };
  }

  async findById(id) {
    return ReviewConfig.findById(id);
  }

  async findByKey(key) {
    return ReviewConfig.findOne({ key, isDeleted: false });
  }

  async update(id, updateData) {
    return ReviewConfig.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async updateByKey(key, value, updatedBy) {
    return ReviewConfig.findOneAndUpdate(
      { key, isDeleted: false },
      { value, updatedBy },
      { new: true, runValidators: true }
    );
  }

  async softDelete(id, deletedBy) {
    return ReviewConfig.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }

  async restore(id) {
    return ReviewConfig.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: null },
      { new: true }
    );
  }
}

module.exports = new ReviewConfigRepository();
