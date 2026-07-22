const AutomationConfig = require('./automation-config.model');

class AutomationConfigRepository {
  async create(configData) {
    return AutomationConfig.create(configData);
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const [configs, total] = await Promise.all([
      AutomationConfig.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      AutomationConfig.countDocuments(query),
    ]);

    return { configs, total, page, limit };
  }

  async findById(id) {
    return AutomationConfig.findById(id);
  }

  async findByKey(key) {
    return AutomationConfig.findOne({ key, isDeleted: false });
  }

  async update(id, updateData) {
    return AutomationConfig.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async updateByKey(key, value, updatedBy) {
    return AutomationConfig.findOneAndUpdate(
      { key, isDeleted: false },
      { value, updatedBy },
      { new: true, runValidators: true }
    );
  }

  async softDelete(id, deletedBy) {
    return AutomationConfig.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }

  async restore(id) {
    return AutomationConfig.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: null },
      { new: true }
    );
  }
}

module.exports = new AutomationConfigRepository();
