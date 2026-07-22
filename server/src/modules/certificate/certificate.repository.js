const Certificate = require('./certificate.model');
const { CERTIFICATE_STATUS, FILTERS, SORT_FIELDS, PAGINATION } = require('./certificate.constants');

class CertificateRepository {
  async create(certData) {
    return Certificate.create(certData);
  }

  async findById(id) {
    return Certificate.findOne({ _id: id, isDeleted: false })
      .populate('user', 'name email volunteerId profilePhoto')
      .populate('program', 'title programId')
      .populate('application')
      .populate('attendance')
      .populate('issuedBy', 'name email');
  }

  async findByCertificateNumber(certificateNumber) {
    return Certificate.findOne({ certificateNumber, isDeleted: false })
      .populate('user', 'name email volunteerId profilePhoto')
      .populate('program', 'title programId')
      .populate('application')
      .populate('attendance')
      .populate('issuedBy', 'name email');
  }

  async findByUser(userId, options = {}) {
    const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT, sort = 'newest', filter = 'all' } = options;
    const skip = (page - 1) * limit;

    const query = { user: userId, isDeleted: false };

    if (filter && filter !== FILTERS.ALL) {
      if (filter === FILTERS.REVOKED) {
        query.status = 'revoked';
      } else if (filter === FILTERS.APPROVED) {
        query.status = 'approved';
      } else if (filter === FILTERS.REJECTED) {
        query.status = 'rejected';
      } else if (filter === FILTERS.VERIFIED) {
        query.verificationCount = { $gt: 0 };
      } else if (filter === FILTERS.PENDING) {
        query.status = 'pending';
      }
    }

    let sortOption = { issuedAt: -1 };
    if (sort === SORT_FIELDS.OLDEST) sortOption = { issuedAt: 1 };
    else if (sort === SORT_FIELDS.PROGRAM) sortOption = { 'program.title': 1 };
    else if (sort === SORT_FIELDS.VOLUNTEER) sortOption = { 'user.name': 1 };

    const [certificates, total] = await Promise.all([
      Certificate.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate('program', 'title programId')
        .lean(),
      Certificate.countDocuments(query),
    ]);

    return { certificates, total, page, limit };
  }

  async findCertificateToGenerate(userId, programId) {
    return Certificate.findOne({ user: userId, program: programId, isDeleted: false }).lean();
  }

  async findByUserAndProgram(userId, programId) {
    return Certificate.findOne({ user: userId, program: programId, isDeleted: false });
  }

  async findCertificatesByProgram(programId) {
    return Certificate.find({ program: programId, isDeleted: false })
      .populate('user', 'name email volunteerId')
      .lean();
  }

  async findAll(options = {}) {
    const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT, sort = 'newest', filter = 'all', search = '' } = options;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };

    if (filter && filter !== FILTERS.ALL) {
      if (filter === FILTERS.REVOKED) {
        query.status = 'revoked';
      } else if (filter === FILTERS.APPROVED) {
        query.status = 'approved';
      } else if (filter === FILTERS.REJECTED) {
        query.status = 'rejected';
      } else if (filter === FILTERS.VERIFIED) {
        query.verificationCount = { $gt: 0 };
      } else if (filter === FILTERS.PENDING) {
        query.status = 'pending';
      }
    }

    if (search) {
      query.$or = [
        { certificateNumber: { $regex: search, $options: 'i' } },
        { 'user.name': { $regex: search, $options: 'i' } },
        { 'program.title': { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { issuedAt: -1 };
    if (sort === SORT_FIELDS.OLDEST) sortOption = { issuedAt: 1 };
    else if (sort === SORT_FIELDS.PROGRAM) sortOption = { 'program.title': 1 };
    else if (sort === SORT_FIELDS.VOLUNTEER) sortOption = { 'user.name': 1 };

    const [certificates, total] = await Promise.all([
      Certificate.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email volunteerId profilePhoto')
        .populate('program', 'title programId')
        .populate('issuedBy', 'name email')
        .lean(),
      Certificate.countDocuments(query),
    ]);

    return { certificates, total, page, limit };
  }

  async update(id, updateData) {
    return Certificate.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async approve(id, approvedBy) {
    return Certificate.findByIdAndUpdate(
      id,
      { status: CERTIFICATE_STATUS.APPROVED, approvedBy },
      { new: true, runValidators: true }
    );
  }

  async reject(id) {
    return Certificate.findByIdAndUpdate(
      id,
      { status: CERTIFICATE_STATUS.REJECTED },
      { new: true, runValidators: true }
    );
  }

  async revoke(id) {
    return Certificate.findByIdAndUpdate(
      id,
      { status: 'revoked' },
      { new: true, runValidators: true }
    );
  }

  async softDelete(id, deletedById) {
    return Certificate.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy: deletedById },
      { new: true }
    );
  }

  async incrementVerificationCount(id) {
    return Certificate.findByIdAndUpdate(
      id,
      { $inc: { verificationCount: 1 }, $set: { lastVerifiedAt: new Date() } },
      { new: true }
    );
  }

  async bulkUpdateStatus(ids, status) {
    return Certificate.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      { $set: { status } }
    );
  }
}

module.exports = new CertificateRepository();
