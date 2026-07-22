const ReviewTemplate = require('./review-template.model');

class ReviewTemplateRepository {
  async create(templateData) {
    return ReviewTemplate.create(templateData);
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    if (filters.action) {
      query.action = filters.action;
    }
    if (filters.category) {
      query.category = filters.category;
    }

    const [templates, total] = await Promise.all([
      ReviewTemplate.find(query)
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ReviewTemplate.countDocuments(query),
    ]);

    return { templates, total, page, limit };
  }

  async findById(id) {
    return ReviewTemplate.findById(id);
  }

  async update(id, updateData) {
    return ReviewTemplate.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async softDelete(id, deletedBy) {
    return ReviewTemplate.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }

  async restore(id) {
    return ReviewTemplate.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedBy: null },
      { new: true }
    );
  }
}

module.exports = new ReviewTemplateRepository();
