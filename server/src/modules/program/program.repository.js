const Program = require('./program.model');
const { PROGRAM_STATUS, PROGRAM_MODE } = require('./program.constants');

class ProgramRepository {
  async create(programData) {
    return Program.create(programData);
  }

  async findById(id, includeDeleted = false) {
    const query = includeDeleted ? { _id: id } : { _id: id, isDeleted: false };
    return Program.findOne(query)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
  }

  async findByProgramId(programId) {
    return Program.findOne({ programId, isDeleted: false }).populate('createdBy', 'name email');
  }

  async findBySlug(slug) {
    return Program.findOne({ slug, isDeleted: false }).populate('createdBy', 'name email');
  }

  async searchPrograms(searchQuery = '') {
    if (!searchQuery || searchQuery.trim() === '') {
      return { $or: [] };
    }

    const searchRegex = new RegExp(searchQuery.trim(), 'i');
    return {
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { shortDescription: searchRegex },
        { category: searchRegex },
        { tags: { $in: [searchRegex] } },
      ],
    };
  }

  async buildQueryFilters(filters = {}) {
    const {
      category,
      city,
      state,
      country,
      mode,
      status,
      createdBy,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
    } = filters;

    const query = {};

    if (category) {
      query.category = new RegExp(category.trim(), 'i');
    }

    if (city) {
      query.city = new RegExp(city.trim(), 'i');
    }

    if (state) {
      query.state = new RegExp(state.trim(), 'i');
    }

    if (country) {
      query.country = new RegExp(country.trim(), 'i');
    }

    if (mode && Object.values(PROGRAM_MODE).includes(mode)) {
      query.mode = mode;
    }

    if (status && Object.values(PROGRAM_STATUS).includes(status)) {
      query.status = status;
    }

    if (createdBy) {
      query.createdBy = createdBy;
    }

    if (startDateFrom || startDateTo) {
      query.startDate = {};
      if (startDateFrom) {
        query.startDate.$gte = new Date(startDateFrom);
      }
      if (startDateTo) {
        query.startDate.$lte = new Date(startDateTo);
      }
    }

    if (endDateFrom || endDateTo) {
      query.endDate = {};
      if (endDateFrom) {
        query.endDate.$gte = new Date(endDateFrom);
      }
      if (endDateTo) {
        query.endDate.$lte = new Date(endDateTo);
      }
    }

    return query;
  }

  async findAll(query = {}, options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [programs, total] = await Promise.all([
      Program.find({ ...query, isDeleted: false })
        .select('-description -customFields')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email')
        .lean(),
      Program.countDocuments({ ...query, isDeleted: false }),
    ]);

    return { programs, total, page, limit };
  }

  async update(id, updateData) {
    return Program.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
  }

  async publish(id) {
    return Program.findByIdAndUpdate(
      id,
      { status: PROGRAM_STATUS.PUBLISHED },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
  }

  async archive(id) {
    return Program.findByIdAndUpdate(
      id,
      { status: PROGRAM_STATUS.ARCHIVED },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
  }

  async softDelete(id, deletedById) {
    return Program.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: deletedById,
        status: PROGRAM_STATUS.ARCHIVED,
      },
      { new: true }
    );
  }

  async restore(id) {
    return Program.findByIdAndUpdate(
      id,
      {
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        status: PROGRAM_STATUS.DRAFT,
      },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
  }

  async updateUpdatedBy(id, updatedById) {
    return Program.findByIdAndUpdate(
      id,
      { updatedBy: updatedById },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
  }

  async updateStatus(id, newStatus) {
    return Program.findByIdAndUpdate(id, { status: newStatus }, { new: true, runValidators: true })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
  }

  async getStatistics() {
    const [
      total,
      draft,
      pendingApproval,
      published,
      registrationClosed,
      ongoing,
      completed,
      cancelled,
      archived,
    ] = await Promise.all([
      Program.countDocuments({ isDeleted: false }),
      Program.countDocuments({ status: PROGRAM_STATUS.DRAFT, isDeleted: false }),
      Program.countDocuments({ status: PROGRAM_STATUS.PENDING_APPROVAL, isDeleted: false }),
      Program.countDocuments({ status: PROGRAM_STATUS.PUBLISHED, isDeleted: false }),
      Program.countDocuments({ status: PROGRAM_STATUS.REGISTRATION_CLOSED, isDeleted: false }),
      Program.countDocuments({ status: PROGRAM_STATUS.ONGOING, isDeleted: false }),
      Program.countDocuments({ status: PROGRAM_STATUS.COMPLETED, isDeleted: false }),
      Program.countDocuments({ status: PROGRAM_STATUS.CANCELLED, isDeleted: false }),
      Program.countDocuments({ status: PROGRAM_STATUS.ARCHIVED, isDeleted: false }),
    ]);

    return {
      total,
      draft,
      pendingApproval,
      published,
      registrationClosed,
      ongoing,
      completed,
      cancelled,
      archived,
    };
  }
}

module.exports = new ProgramRepository();
