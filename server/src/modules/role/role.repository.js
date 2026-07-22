const Role = require('./role.model');

class RoleRepository {
  async create(roleData) {
    return Role.create(roleData);
  }

  async findById(id) {
    return Role.findById(id).populate('permissions');
  }

  async findBySlug(slug) {
    return Role.findOne({ slug, isDeleted: false }).populate('permissions');
  }

  async findAll(query = {}) {
    const { page = 1, limit = 10, isActive, isSystemRole } = query;
    const skip = (page - 1) * limit;
    const filter = { isDeleted: false };

    if (isActive !== undefined) filter.isActive = isActive;
    if (isSystemRole !== undefined) filter.isSystemRole = isSystemRole;

    const [roles, total] = await Promise.all([
      Role.find(filter).skip(skip).limit(limit).populate('permissions'),
      Role.countDocuments(filter),
    ]);

    return { roles, total, page, limit };
  }

  async update(id, updateData) {
    return Role.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate(
      'permissions'
    );
  }

  async softDelete(id, deletedById) {
    return Role.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedById },
      { new: true }
    );
  }

  async existsBySlug(slug, excludeId = null) {
    const query = { slug, isDeleted: false };
    if (excludeId) query._id = { $ne: excludeId };
    return Role.findOne(query);
  }
}

module.exports = new RoleRepository();