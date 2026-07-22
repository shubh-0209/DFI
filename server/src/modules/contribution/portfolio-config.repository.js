const PortfolioConfig = require('./portfolio-config.model');

class PortfolioConfigRepository {
  async create(configData) {
    return PortfolioConfig.create(configData);
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const [configs, total] = await Promise.all([
      PortfolioConfig.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      PortfolioConfig.countDocuments(query),
    ]);

    return { configs, total, page, limit };
  }

  async findById(id) {
    return PortfolioConfig.findById(id);
  }

  async findByKey(key) {
    return PortfolioConfig.findOne({ key, isDeleted: false });
  }

  async update(id, updateData) {
    return PortfolioConfig.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async updateByKey(key, value, updatedBy) {
    return PortfolioConfig.findOneAndUpdate(
      { key, isDeleted: false },
      { value, updatedBy },
      { new: true, runValidators: true }
    );
  }

  async softDelete(id, deletedBy) {
    return PortfolioConfig.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }

  async restore(id) {
    return PortfolioConfig.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: null },
      { new: true }
    );
  }
}

module.exports = new PortfolioConfigRepository();
