const { Contribution, ContributionVersion, ContributionReview } = require('./contribution.model');
const { STATUS } = require('./contribution.constants');

class ContributionRepository {
  async create(contributionData) {
    return Contribution.create(contributionData);
  }

  async findById(id) {
    return Contribution.findById(id)
      .populate('submittedBy', 'name email volunteerId role')
      .populate('currentVersion')
      .populate('versions');
  }

  async findByContributionId(identifier) {
    // If it looks like an ObjectId, do a direct _id lookup first — much faster
    // than a full table scan with $or through mingo.
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      const byId = await Contribution.findOne({ _id: identifier, isDeleted: false })
        .populate('submittedBy', 'name email volunteerId role')
        .populate('currentVersion')
        .populate('versions');
      if (byId) return byId;
    }

    // Fall back to human-readable contributionId (e.g. "CONTRIB-...")
    return Contribution.findOne({ contributionId: identifier, isDeleted: false })
      .populate('submittedBy', 'name email volunteerId role')
      .populate('currentVersion')
      .populate('versions');
  }

  async findByIdentifier(identifier) {
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      const byId = await Contribution.findOne({ _id: identifier, isDeleted: false })
        .populate('submittedBy', 'name email volunteerId role')
        .populate('currentVersion')
        .populate('versions');
      if (byId) return byId;
    }
    return Contribution.findOne({ contributionId: identifier, isDeleted: false })
      .populate('submittedBy', 'name email volunteerId role')
      .populate('currentVersion')
      .populate('versions');
  }

  async findMyContributions(userId, filters = {}, options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const query = { submittedBy: userId, isDeleted: false };
    if (filters.status && filters.status !== '') {
      query.status = filters.status;
    }

    const [contributions, total] = await Promise.all([
      Contribution.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('submittedBy', 'name email volunteerId role')
        .populate('currentVersion')
        .populate('versions'),
      Contribution.countDocuments(query),
    ]);

    return { contributions, total, page, limit };
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const query = { isDeleted: false };
    if (filters.status && filters.status !== '') {
      query.status = filters.status;
    }
    if (filters.category && filters.category !== '') {
      query.category = filters.category;
    }
    if (filters.contributionType && filters.contributionType !== '') {
      query.contributionType = filters.contributionType;
    }

    const [contributions, total] = await Promise.all([
      Contribution.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('submittedBy', 'name email volunteerId role')
        .populate('currentVersion')
        .populate('versions'),
      Contribution.countDocuments(query),
    ]);

    return { contributions, total, page, limit };
  }

  async update(id, updateData) {
    return Contribution.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('submittedBy', 'name email volunteerId role')
      .populate('currentVersion')
      .populate('versions');
  }

  async softDelete(id, deletedBy) {
    return Contribution.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }

  async existsByTitleAndUser(title, userId, excludeId = null) {
    const query = {
      title: { $regex: new RegExp(`^${title}$`, 'i') },
      submittedBy: userId,
      isDeleted: false,
      status: { $ne: STATUS.DRAFT },
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    return Contribution.findOne(query);
  }

  async countActiveByUser(userId) {
    return Contribution.countDocuments({
      submittedBy: userId,
      isDeleted: false,
      status: { $ne: STATUS.DRAFT },
    });
  }

  async createVersion(versionData) {
    return ContributionVersion.create(versionData);
  }

  async addVersionToContribution(contributionId, versionId) {
    return Contribution.findByIdAndUpdate(
      contributionId,
      { $push: { versions: versionId } },
      { new: true }
    );
  }

  async updateCurrentVersion(contributionId, versionId) {
    return Contribution.findByIdAndUpdate(
      contributionId,
      { currentVersion: versionId },
      { new: true }
    );
  }

  async findVersionsByContribution(contributionId) {
    return ContributionVersion.find({ contributionId, isDeleted: false })
      .sort({ versionNumber: -1 })
      .populate('uploadedBy', 'name email volunteerId');
  }

  async findVersionById(id) {
    return ContributionVersion.findById(id)
      .populate('uploadedBy', 'name email volunteerId');
  }

  async findAdminContributions(filters = {}, options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const query = { isDeleted: false };
    if (filters.status && filters.status !== '') {
      query.status = filters.status;
    }
    if (filters.category && filters.category !== '') {
      query.category = filters.category;
    }
    if (filters.contributionType && filters.contributionType !== '') {
      query.contributionType = filters.contributionType;
    }
    if (filters.submittedBy && filters.submittedBy !== '') {
      query.submittedBy = filters.submittedBy;
    }
    if (filters.search && filters.search.trim() !== '') {
      query.$or = [
        { title: { $regex: filters.search.trim(), $options: 'i' } },
        { description: { $regex: filters.search.trim(), $options: 'i' } },
      ];
    }

    const [contributions, total] = await Promise.all([
      Contribution.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('submittedBy', 'name email volunteerId role')
        .populate('currentVersion')
        .populate('versions')
        .populate('adminAssigned', 'name email role'),
      Contribution.countDocuments(query),
    ]);

    return { contributions, total, page, limit };
  }

  async createReview(reviewData) {
    return ContributionReview.create(reviewData);
  }

  async findReviewsByContribution(contributionId) {
    return ContributionReview.find({ contributionId, isDeleted: false })
      .sort({ createdAt: -1 })
      .populate('reviewedBy', 'name email role');
  }

  async findReviewHistory(options = {}) {
    const { page = 1, limit = 10, reviewedBy, contributionId } = options;
    const skip = (page - 1) * limit;

    const query = {};
    if (reviewedBy) query.reviewedBy = reviewedBy;
    if (contributionId) query.contributionId = contributionId;

    const [reviews, total] = await Promise.all([
      ContributionReview.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('contributionId', 'title contributionId status')
        .populate('reviewedBy', 'name email role')
        .populate('versionId'),
      ContributionReview.countDocuments(query),
    ]);

    return { reviews, total, page, limit };
  }

  async updateStatus(id, status) {
    return Contribution.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
  }

  async updateFeature(id, isFeatured) {
    return Contribution.findByIdAndUpdate(
      id,
      { isFeatured },
      { new: true }
    );
  }

  async updateVisibility(id, visibility) {
    return Contribution.findByIdAndUpdate(
      id,
      { visibility },
      { new: true, runValidators: true }
    );
  }

  async findByIdWithVersions(id) {
    return Contribution.findById(id)
      .populate('submittedBy', 'name email volunteerId role')
      .populate('currentVersion')
      .populate('versions')
      .populate('adminAssigned', 'name email role');
  }
}

module.exports = new ContributionRepository();
