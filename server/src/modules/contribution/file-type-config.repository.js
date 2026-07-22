const FileTypeConfig = require('./file-type-config.model');

class FileTypeConfigRepository {
  async create(configData) {
    return FileTypeConfig.create(configData);
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

    const [configs, total] = await Promise.all([
      FileTypeConfig.find(query)
        .sort({ category: 1, extension: 1 })
        .skip(skip)
        .limit(limit),
      FileTypeConfig.countDocuments(query),
    ]);

    return { configs, total, page, limit };
  }

  async findById(id) {
    return FileTypeConfig.findById(id);
  }

  async findByExtension(extension) {
    return FileTypeConfig.findOne({ extension, isDeleted: false });
  }

  async findByMimeType(mimeType) {
    return FileTypeConfig.findOne({ mimeType, isDeleted: false });
  }

  async update(id, updateData) {
    return FileTypeConfig.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async softDelete(id, deletedBy) {
    return FileTypeConfig.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }

  async restore(id) {
    return FileTypeConfig.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: null },
      { new: true }
    );
  }
}

module.exports = new FileTypeConfigRepository();
