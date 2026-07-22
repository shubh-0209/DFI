const Organization = require('./organization.model');

class OrganizationRepository {
  async create(organizationData) {
    return Organization.create(organizationData);
  }

  async findById(id, includeDeleted = false) {
    const query = includeDeleted ? { _id: id } : { _id: id, isDeleted: false };
    return Organization.findOne(query)
      .populate('owner', 'name email')
      .populate('admins', 'name email')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
  }

  async findBySlug(slug, includeDeleted = false) {
    const query = includeDeleted ? { slug } : { slug, isDeleted: false };
    return Organization.findOne(query)
      .populate('owner', 'name email')
      .populate('admins', 'name email')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
  }

  async findByOrganizationId(organizationId) {
    return Organization.findOne({ organizationId, isDeleted: false })
      .populate('owner', 'name email')
      .populate('admins', 'name email');
  }

  async existsByOrganizationId(organizationId, excludeId = null) {
    const query = { organizationId, isDeleted: false };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return Organization.findOne(query);
  }

  async findAll(query = {}, options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [organizations, total] = await Promise.all([
      Organization.find({ ...query, isDeleted: false })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('owner', 'name email')
        .lean(),
      Organization.countDocuments({ ...query, isDeleted: false }),
    ]);

    return { organizations, total, page, limit };
  }

  async update(id, updateData) {
    return Organization.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('owner', 'name email')
      .populate('admins', 'name email')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
  }

  async softDelete(id, deletedById) {
    return Organization.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: deletedById,
        isActive: false,
      },
      { new: true }
    );
  }

  async restore(id) {
    return Organization.findByIdAndUpdate(
      id,
      {
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
      },
      { new: true, runValidators: true }
    )
      .populate('owner', 'name email')
      .populate('admins', 'name email')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
  }

  async existsBySlug(slug, excludeId = null) {
    const query = { slug, isDeleted: false };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return Organization.findOne(query);
  }

  async existsByEmail(email, excludeId = null) {
    const query = { email, isDeleted: false };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return Organization.findOne(query);
  }

  async assignAdmin(id, adminId) {
    return Organization.findByIdAndUpdate(
      id,
      { $addToSet: { admins: adminId } },
      { new: true }
    ).populate('owner', 'name email').populate('admins', 'name email');
  }

  async removeAdmin(id, adminId) {
    return Organization.findByIdAndUpdate(
      id,
      { $pull: { admins: adminId } },
      { new: true }
    ).populate('owner', 'name email').populate('admins', 'name email');
  }

  async transferOwnership(id, newOwnerId, oldOwnerId = null) {
    const updateObj = { owner: newOwnerId };
    if (oldOwnerId) {
      updateObj.$addToSet = { admins: oldOwnerId };
    }
    return Organization.findByIdAndUpdate(id, updateObj, { new: true })
      .populate('owner', 'name email').populate('admins', 'name email');
  }

  async changeStatus(id, status, updatedById, reviewNotes = null, rejectionReason = null) {
    const updateObj = {
      verificationStatus: status,
      updatedBy: updatedById,
    };
    if (status === 'verified' || status === 'rejected') {
      updateObj.reviewedBy = updatedById;
      updateObj.reviewedAt = new Date();
    }
    if (reviewNotes) {
      updateObj.reviewNotes = reviewNotes;
    }
    if (rejectionReason) {
      updateObj.rejectionReason = rejectionReason;
    }
    return Organization.findByIdAndUpdate(id, updateObj, { new: true })
      .populate('owner', 'name email').populate('admins', 'name email');
  }
}

module.exports = new OrganizationRepository();
