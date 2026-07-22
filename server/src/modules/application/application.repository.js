const Application = require('./application.model');
const { APPLICATION_STATUS } = require('./application.constants');

const ALLOWED_SORT_ORDERS = ['asc', 'desc'];

class ApplicationRepository {
  async create(applicationData) {
    return Application.create(applicationData);
  }

  async findById(id) {
    return Application.findById(id)
      .populate('user', 'name email volunteerId')
      .populate('program', 'title programId startDate endDate status category city mode programType rewardCoins activeQrToken');
  }

  async findByApplicationId(applicationId) {
    return Application.findOne({ applicationId })
      .populate('user', 'name email volunteerId')
      .populate('program', 'title programId programType rewardCoins activeQrToken');
  }

  async findByUserAndProgram(userId, programId) {
    return Application.findOne({ user: userId, program: programId, isDeleted: false });
  }

  async findExistingApplication(userId, programId) {
    return Application.findOne({
      user: userId,
      program: programId,
      isDeleted: false,
      status: { $in: [APPLICATION_STATUS.APPLIED, APPLICATION_STATUS.JOINED, APPLICATION_STATUS.APPROVED] },
    });
  }

  async findMyApplications(userId, queryParams = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', status } = queryParams;
    const skip = (page - 1) * limit;
    const sort = {
      [sortBy]: ALLOWED_SORT_ORDERS.includes(sortOrder) ? (sortOrder === 'asc' ? 1 : -1) : -1,
    };

    const query = { user: userId, isDeleted: false };
    if (status) query.status = status;

    const [applications, total] = await Promise.all([
      Application.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('program', 'title programId startDate endDate status category city mode programType rewardCoins activeQrToken'),
      Application.countDocuments(query),
    ]);

    return { applications, total, page, limit };
  }

  async findMyPrograms(userId, queryParams = {}) {
    const { page = 1, limit = 10, sortBy = 'startDate', sortOrder = 'asc' } = queryParams;
    const skip = (page - 1) * limit;
    const sort = {
      [sortBy]: ALLOWED_SORT_ORDERS.includes(sortOrder) ? (sortOrder === 'asc' ? 1 : -1) : -1,
    };

    const [applications, total] = await Promise.all([
      Application.find({
        user: userId,
        isDeleted: false,
        status: {
          $in: [
            APPLICATION_STATUS.JOINED,
            APPLICATION_STATUS.APPROVED,
            APPLICATION_STATUS.CHECKED_IN,
            APPLICATION_STATUS.CHECKED_OUT,
            APPLICATION_STATUS.COMPLETED
          ]
        }
      })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('program', 'title programId startDate endDate status category city mode programType rewardCoins activeQrToken'),
      Application.countDocuments({
        user: userId,
        isDeleted: false,
        status: {
          $in: [
            APPLICATION_STATUS.JOINED,
            APPLICATION_STATUS.APPROVED,
            APPLICATION_STATUS.CHECKED_IN,
            APPLICATION_STATUS.CHECKED_OUT,
            APPLICATION_STATUS.COMPLETED
          ]
        },
      }),
    ]);

    return { applications, total, page, limit };
  }

  async findAdminApplications(filters = {}, options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;
    const sort = {
      [sortBy]: ALLOWED_SORT_ORDERS.includes(sortOrder) ? (sortOrder === 'asc' ? 1 : -1) : -1,
    };

    const [applications, total] = await Promise.all([
      Application.find({ ...filters, isDeleted: false })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email volunteerId')
        .populate('program', 'title programId startDate endDate status category city mode programType rewardCoins activeQrToken'),
      Application.countDocuments({ ...filters, isDeleted: false }),
    ]);

    return { applications, total, page, limit };
  }

  async bulkUpdate(ids, updateData) {
    return Application.updateMany({ _id: { $in: ids } }, { $set: updateData });
  }

  async findByIds(ids) {
    return Application.find({ _id: { $in: ids } })
      .populate('user', 'name email volunteerId')
      .populate('program', 'title programId programType rewardCoins activeQrToken');
  }

  async getStatistics() {
    const [total, joined, withdrawn, completed, cancelled, applicationsThisMonth] =
      await Promise.all([
        Application.countDocuments({ isDeleted: false }),
        Application.countDocuments({
          status: {
            $in: [
              APPLICATION_STATUS.JOINED,
              APPLICATION_STATUS.APPROVED,
              APPLICATION_STATUS.CHECKED_IN,
              APPLICATION_STATUS.CHECKED_OUT
            ]
          },
          isDeleted: false
        }),
        Application.countDocuments({ status: APPLICATION_STATUS.WITHDRAWN, isDeleted: false }),
        Application.countDocuments({ status: APPLICATION_STATUS.COMPLETED, isDeleted: false }),
        Application.countDocuments({ status: APPLICATION_STATUS.CANCELLED, isDeleted: false }),
        Application.countDocuments({
          isDeleted: false,
          createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) },
        }),
      ]);

    return {
      total,
      joined,
      withdrawn,
      completed,
      cancelled,
      applicationsThisMonth,
    };
  }

  async findByUser(userId, query = {}, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find({ user: userId, isDeleted: false, ...query })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('program', 'title programId programType rewardCoins activeQrToken'),
      Application.countDocuments({ user: userId, isDeleted: false, ...query }),
    ]);

    return { applications, total };
  }

  async findByProgram(programId, query = {}, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find({ program: programId, isDeleted: false, ...query })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email volunteerId'),
      Application.countDocuments({ program: programId, isDeleted: false, ...query }),
    ]);

    return { applications, total };
  }

  async findAll(query = {}, options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [applications, total] = await Promise.all([
      Application.find({ ...query, isDeleted: false })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email volunteerId')
        .populate('program', 'title programId programType rewardCoins activeQrToken'),
      Application.countDocuments({ ...query, isDeleted: false }),
    ]);

    return { applications, total };
  }

  async update(id, updateData) {
    return Application.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('user', 'name email volunteerId')
      .populate('program', 'title programId programType rewardCoins activeQrToken');
  }

  async updateStatus(id, newStatus) {
    return Application.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email volunteerId')
      .populate('program', 'title programId programType rewardCoins activeQrToken');
  }

  async withdraw(id, withdrawnById) {
    return Application.findByIdAndUpdate(
      id,
      {
        status: APPLICATION_STATUS.WITHDRAWN,
        withdrawnAt: new Date(),
        withdrawnBy: withdrawnById,
      },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email volunteerId')
      .populate('program', 'title programId programType rewardCoins activeQrToken');
  }

  async softDelete(id, deletedById) {
    return Application.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: deletedById,
      },
      { new: true }
    );
  }

  async approve(id) {
    return Application.findByIdAndUpdate(
      id,
      { status: APPLICATION_STATUS.APPROVED, joinedAt: new Date() },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email volunteerId')
      .populate('program', 'title programId startDate endDate status category city mode programType rewardCoins activeQrToken');
  }

  async reject(id, reason) {
    return Application.findByIdAndUpdate(
      id,
      { status: APPLICATION_STATUS.REJECTED, reviewNotes: reason || '' },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email volunteerId')
      .populate('program', 'title programId startDate endDate status category city mode programType rewardCoins activeQrToken');
  }
}

module.exports = new ApplicationRepository();
