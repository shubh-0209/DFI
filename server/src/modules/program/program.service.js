const programRepository = require('./program.repository');
const { generateProgramId, generateProgramSlug } = require('./program.utils');
const { PROGRAM_STATUS, PROGRAM_MODE, PAGINATION } = require('./program.constants');
const NotFoundError = require('../../utils/errors/NotFoundError');
const ValidationError = require('../../utils/errors/ValidationError');
const notificationService = require('../notification/notification.service');
const { broadcastToAll } = require('../../socket/socketServer');

const ALLOWED_SORT_FIELDS = ['createdAt', 'startDate', 'registrationDeadline', 'title', 'status'];
const ALLOWED_SORT_ORDERS = ['asc', 'desc'];

const serializeProgram = (program) => {
  if (!program) return null;
  const obj = program.toObject ? program.toObject() : program;
  return {
    _id: obj._id,
    programId: obj.programId,
    title: obj.title,
    slug: obj.slug,
    shortDescription: obj.shortDescription,
    description: obj.description,
    category: obj.category,
    tags: obj.tags || [],
    mode: obj.mode,
    status: obj.status,
    approvalRequired: obj.approvalRequired,
    maxVolunteers: obj.maxVolunteers,
    rewardCoins: obj.rewardCoins,
    startDate: obj.startDate,
    endDate: obj.endDate,
    registrationDeadline: obj.registrationDeadline,
    country: obj.country,
    state: obj.state,
    city: obj.city,
    address: obj.address,
    customFields: obj.customFields || {},
    createdBy: obj.createdBy,
    updatedBy: obj.updatedBy,
    isDeleted: obj.isDeleted,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

class ProgramService {
  async createProgram(userId, programData) {
    const {
      title,
      shortDescription,
      description,
      category,
      tags,
      mode,
      approvalRequired,
      maxVolunteers,
      startDate,
      endDate,
      registrationDeadline,
      country,
      state,
      city,
      address,
      customFields,
      rewardCoins,
    } = programData;

    const programId = await generateProgramId();
    const slug = await generateProgramSlug(title);

    const program = await programRepository.create({
      programId,
      title,
      slug,
      shortDescription,
      description,
      category,
      tags,
      mode: mode || PROGRAM_MODE.OFFLINE,
      status: PROGRAM_STATUS.DRAFT,
      approvalRequired: approvalRequired || false,
      maxVolunteers,
      rewardCoins: rewardCoins || 0,
      startDate,
      endDate,
      registrationDeadline,
      country: country || 'India',
      state,
      city,
      address,
      customFields: customFields || {},
      createdBy: userId,
      updatedBy: userId,
    });

    const created = await programRepository.findById(program._id.toString());
    const serialized = serializeProgram(created);

    try {
      broadcastToAll('program-created', { program: serialized, createdBy: userId.toString() });
    } catch (_socketError) {
      // Socket broadcast failure must not block creation
    }

    return { program: serialized };
  }

  async getProgram(programId, userRole) {
    const normalizedRole = (userRole || '').toLowerCase();
    const program = await programRepository.findById(
      programId,
      normalizedRole === 'admin' || normalizedRole === 'superadmin'
    );

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    if (program.isDeleted && normalizedRole !== 'admin' && normalizedRole !== 'superadmin') {
      throw new NotFoundError('Program not found');
    }

    return { program: serializeProgram(program) };
  }

  async updateProgram(userId, programId, updateData) {
    const program = await programRepository.findById(programId);

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    const {
      title,
      shortDescription,
      description,
      category,
      tags,
      mode,
      approvalRequired,
      maxVolunteers,
      startDate,
      endDate,
      registrationDeadline,
      country,
      state,
      city,
      address,
      customFields,
      rewardCoins,
    } = updateData;

    const slugUpdateNeeded = title && title !== program.title;
    let slug = program.slug;

    if (slugUpdateNeeded) {
      slug = await generateProgramSlug(title);
    }

    const updatedProgram = await programRepository.update(programId, {
      ...(title !== undefined && { title }),
      ...(slugUpdateNeeded && { slug }),
      ...(shortDescription !== undefined && { shortDescription }),
      ...(description !== undefined && { description }),
      ...(category !== undefined && { category }),
      ...(tags !== undefined && { tags }),
      ...(mode !== undefined && { mode }),
      ...(approvalRequired !== undefined && { approvalRequired }),
      ...(maxVolunteers !== undefined && { maxVolunteers }),
      ...(rewardCoins !== undefined && { rewardCoins }),
      ...(startDate !== undefined && { startDate }),
      ...(endDate !== undefined && { endDate }),
      ...(registrationDeadline !== undefined && { registrationDeadline }),
      ...(country !== undefined && { country }),
      ...(state !== undefined && { state }),
      ...(city !== undefined && { city }),
      ...(address !== undefined && { address }),
      ...(customFields !== undefined && { customFields }),
      updatedBy: userId,
    });

    const serialized = serializeProgram(updatedProgram);

    try {
      // Notify enrolled volunteers about the update
      if (updatedProgram.status === 'published' || updatedProgram.status === 'ongoing') {
        const applicationRepository = require('../application/application.repository');
        const applicationsResult = await applicationRepository.findByProgram(
          programId,
          { status: { $in: ['joined', 'approved'] } },
          { page: 1, limit: 1000 }
        );
        const applicantIds = (applicationsResult.applications || []).map(
          (app) => (app.user?._id || app.user).toString()
        );
        for (const recipientId of applicantIds) {
          await notificationService.sendInAppNotification('buildProgramUpdated', {
            recipientId,
            programName: updatedProgram.title,
            programId: updatedProgram._id.toString(),
          });
        }
      }
      broadcastToAll('program-updated', { program: serialized, updatedBy: userId.toString() });
    } catch (_socketError) {
      // Socket broadcast failure is non-blocking
    }

    return { program: serialized };
  }

  async deleteProgram(userId, programId) {
    const program = await programRepository.findById(programId);

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    await programRepository.softDelete(programId, userId);

    try {
      // Notify enrolled volunteers that the program was removed
      const applicationRepository = require('../application/application.repository');
      const applicationsResult = await applicationRepository.findByProgram(
        programId,
        { status: { $in: ['joined', 'approved', 'applied', 'pending', 'under_review'] } },
        { page: 1, limit: 1000 }
      );
      const applicantIds = (applicationsResult.applications || []).map(
        (app) => (app.user?._id || app.user).toString()
      );
      for (const recipientId of applicantIds) {
        await notificationService.sendInAppNotification('buildProgramCancelled', {
          recipientId,
          programName: program.title,
          programId: program._id.toString(),
        });
      }
      broadcastToAll('program-deleted', { programId: programId.toString(), deletedBy: userId.toString() });
    } catch (_socketError) {
      // Socket broadcast failure is non-blocking
    }

    return { programId: programId.toString() };
  }

  async restoreProgram(userId, programId) {
    const program = await programRepository.findById(programId);

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    const restoredProgram = await programRepository.restore(programId);

    if (restoredProgram && restoredProgram.slug) {
      const existingProgram = await programRepository.findBySlug(restoredProgram.slug);
      if (existingProgram && existingProgram._id.toString() !== programId.toString()) {
        const newSlug = await generateProgramSlug(restoredProgram.title);
        await programRepository.update(programId, { slug: newSlug });
      }
    }

    const serialized = serializeProgram(restoredProgram);

    try {
      broadcastToAll('program-restored', { program: serialized, restoredBy: userId.toString() });
    } catch (_socketError) {
      // Socket broadcast failure is non-blocking
    }

    return { program: serialized };
  }

  async publishProgram(userId, programId) {
    const program = await programRepository.findById(programId);

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    if (program.status === PROGRAM_STATUS.PUBLISHED) {
      throw new ValidationError('Program is already published');
    }

    if (program.status === PROGRAM_STATUS.ARCHIVED) {
      throw new ValidationError('Archived program cannot be published');
    }

    const validationErrors = [];

    if (!program.title || program.title.trim() === '') {
      validationErrors.push({ field: 'title', message: 'Title is required for publishing' });
    }
    if (!program.description || program.description.trim() === '') {
      validationErrors.push({
        field: 'description',
        message: 'Description is required for publishing',
      });
    }
    if (!program.category || program.category.trim() === '') {
      validationErrors.push({ field: 'category', message: 'Category is required for publishing' });
    }
    if (!program.startDate) {
      validationErrors.push({
        field: 'startDate',
        message: 'Start date is required for publishing',
      });
    }
    if (!program.endDate) {
      validationErrors.push({
        field: 'endDate',
        message: 'End date is required for publishing',
      });
    }
    if (program.mode !== 'online' && (!program.city || program.city.trim() === '')) {
      validationErrors.push({ field: 'city', message: 'City is required for offline/hybrid programs' });
    }

    if (validationErrors.length > 0) {
      throw new ValidationError('Program validation failed before publishing', validationErrors);
    }

    const publishedProgram = await programRepository.publish(programId);
    const serialized = serializeProgram(publishedProgram);

    try {
      const User = require('../user/user.model');
      // Find all active volunteers — status is 'active' or 'pending' per user.constants.js
      // Do NOT filter by isDeleted (User model uses status, not isDeleted flag)
      const volunteers = await User.find(
        { role: 'volunteer', status: { $in: ['active', 'pending'] } },
        '_id'
      ).lean();

      if (volunteers.length > 0) {
        await notificationService.sendBulkInAppNotification(
          volunteers.map((v) => v._id.toString()),
          'buildProgramCreated',
          {
            programName: publishedProgram.title,
            programId:   publishedProgram._id.toString(),
            createdBy:   userId.toString(),
          }
        );
      }

      broadcastToAll('program-published', { program: serialized, publishedBy: userId.toString() });
    } catch (_err) {
      // Broadcast failure is non-blocking
    }

    return { program: serialized };
  }

  async archiveProgram(userId, programId) {
    const program = await programRepository.findById(programId);

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    if (program.status !== PROGRAM_STATUS.PUBLISHED) {
      throw new ValidationError('Only published programs can be archived');
    }

    const archivedProgram = await programRepository.archive(programId);
    const serialized = serializeProgram(archivedProgram);

    try {
      // Notify all applicants who were approved/joined, not just the creator
      const applicationRepository = require('../application/application.repository');
      const applicationsResult = await applicationRepository.findByProgram(
        programId,
        { status: { $in: ['joined', 'approved'] } },
        { page: 1, limit: 1000 }
      );
      const applicantIds = (applicationsResult.applications || []).map(
        (app) => (app.user?._id || app.user).toString()
      );

      // Always notify the creator too (if not already in applicants list)
      const creatorId = program.createdBy.toString();
      const recipientIds = [...new Set([...applicantIds, creatorId])];

      for (const recipientId of recipientIds) {
        await notificationService.sendInAppNotification('buildProgramCancelled', {
          recipientId,
          programName: program.title,
          programId: program._id.toString(),
        });
      }

      broadcastToAll('program-archived', { program: serialized, archivedBy: userId.toString() });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return { program: serialized };
  }

  async listPrograms(queryParams, userRole) {
    // Normalize role so 'ADMIN', 'admin', 'Admin' all work identically
    const normalizedRole = (userRole || '').toLowerCase();
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      search,
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
    } = queryParams;

    const validPage = Math.max(1, parseInt(page, 10) || PAGINATION.DEFAULT_PAGE);
    const validLimit = Math.min(
      Math.max(1, parseInt(limit, 10) || PAGINATION.DEFAULT_LIMIT),
      PAGINATION.MAX_LIMIT
    );
    const validSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
    const validSortOrder = ALLOWED_SORT_ORDERS.includes(sortOrder) ? sortOrder : 'desc';

    const searchQuery = await programRepository.searchPrograms(search);
    const filterQuery = await programRepository.buildQueryFilters({
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
    });

    const combinedQuery = { ...filterQuery };
    if (search && search.trim() !== '') {
      Object.assign(combinedQuery, searchQuery);
    }

    if (normalizedRole !== 'admin' && normalizedRole !== 'superadmin' && normalizedRole !== 'coordinator') {
      combinedQuery.status = PROGRAM_STATUS.PUBLISHED;
    }

    const result = await programRepository.findAll(combinedQuery, {
      page: validPage,
      limit: validLimit,
      sortBy: validSortBy,
      sortOrder: validSortOrder,
    });

    const totalPages = Math.ceil(result.total / validLimit);

    return {
      programs: result.programs.map(serializeProgram),
      pagination: {
        total: result.total,
        page: validPage,
        limit: validLimit,
        totalPages,
        hasNextPage: validPage < totalPages,
        hasPreviousPage: validPage > 1,
      },
    };
  }

  async changeProgramStatus(userId, programId, newStatus) {
    const program = await programRepository.findById(programId);

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    if (!Object.values(PROGRAM_STATUS).includes(newStatus)) {
      throw new ValidationError('Invalid status value');
    }

    const currentStatus = program.status;
    const validTransitions = this._getValidTransitions(currentStatus);

    if (newStatus !== PROGRAM_STATUS.CANCELLED && !validTransitions.includes(newStatus)) {
      throw new ValidationError(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    }

    const updatedProgram = await programRepository.updateStatus(programId, newStatus);
    const serialized = serializeProgram(updatedProgram);

    if (newStatus === PROGRAM_STATUS.ONGOING) {
      try {
        const applicationRepository = require('../application/application.repository');
        const applications = await applicationRepository.findByProgram(programId, {}, { page: 1, limit: 1000 });
        for (const app of applications.applications) {
          await notificationService.sendInAppNotification('buildProgramUpdated', {
            recipientId: app.user._id.toString(),
            programName: updatedProgram.title,
            programId: updatedProgram._id.toString(),
          });
        }
      } catch (_error) {
        // Notification failure is non-blocking
      }
    }

    if (newStatus === PROGRAM_STATUS.CANCELLED) {
      try {
        await notificationService.sendInAppNotification('buildProgramCancelled', {
          recipientId: program.createdBy.toString(),
          programName: program.title,
          programId: program._id.toString(),
        });
      } catch (_error) {
        // Notification failure is non-blocking
      }
    }

    if (newStatus === PROGRAM_STATUS.COMPLETED) {
      try {
        const leaderboardService = require('../leaderboard/leaderboard.service');
        await leaderboardService.refreshLeaderboard(userId);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Auto leaderboard refresh failed:', error);
      }

      try {
        const gamificationService = require('../leaderboard/gamification.service');
        await gamificationService.evaluateAll(userId);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Auto gamification evaluation failed:', error);
      }
    }

    try {
      broadcastToAll('program-status-updated', { program: serialized, status: newStatus, updatedBy: userId.toString() });
    } catch (_socketError) {
      // Socket broadcast failure is non-blocking
    }

    return { program: serialized };
  }

  _getValidTransitions(currentStatus) {
    const transitions = {
      [PROGRAM_STATUS.DRAFT]: [PROGRAM_STATUS.PENDING_APPROVAL, PROGRAM_STATUS.PUBLISHED],
      [PROGRAM_STATUS.PENDING_APPROVAL]: [
        PROGRAM_STATUS.DRAFT,
        PROGRAM_STATUS.PUBLISHED,
        PROGRAM_STATUS.CANCELLED,
      ],
      [PROGRAM_STATUS.PUBLISHED]: [
        PROGRAM_STATUS.REGISTRATION_CLOSED,
        PROGRAM_STATUS.ONGOING,
        PROGRAM_STATUS.CANCELLED,
      ],
      [PROGRAM_STATUS.REGISTRATION_CLOSED]: [PROGRAM_STATUS.ONGOING, PROGRAM_STATUS.CANCELLED],
      [PROGRAM_STATUS.ONGOING]: [PROGRAM_STATUS.COMPLETED, PROGRAM_STATUS.CANCELLED],
      [PROGRAM_STATUS.COMPLETED]: [],
      [PROGRAM_STATUS.CANCELLED]: [],
      [PROGRAM_STATUS.ARCHIVED]: [],
    };
    return transitions[currentStatus] || [];
  }

  async getStatistics() {
    const stats = await programRepository.getStatistics();
    return stats;
  }

  async getMyPrograms(userId, queryParams) {
    const applicationRepository = require('../application/application.repository');
    const result = await applicationRepository.findMyPrograms(userId, {
      page: parseInt(queryParams.page, 10) || PAGINATION.DEFAULT_PAGE,
      limit: parseInt(queryParams.limit, 10) || PAGINATION.DEFAULT_LIMIT,
    });

    const programs = result.applications
      .filter((app) => Boolean(app && app.program))
      .map((app) => {
        const progObj = app.program.toObject ? app.program.toObject() : app.program;
        return {
          ...progObj,
          id: progObj._id,
          applicationId: app._id.toString(),
          applicationStatus: app.status,
          programTitle: progObj.title,
        };
      });
    const totalPages = Math.ceil(
      result.total / (parseInt(queryParams.limit, 10) || PAGINATION.DEFAULT_LIMIT)
    );

    return {
      programs,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages,
        hasNextPage: result.page < totalPages,
        hasPreviousPage: result.page > 1,
      },
    };
  }

  async generateQrToken(programId, type) {
    const crypto = require('crypto');
    const program = await programRepository.findById(programId);
    if (!program || program.isDeleted) {
      throw new NotFoundError('Program not found');
    }

    const DURATION_SECONDS = 300; // 5 minutes

    // Check if the program uses the next-gen geofenced dynamic QR verification
    if (program.verificationMethod === 'qr_and_gps') {
      if (!program.activeQrSecret) {
        program.activeQrSecret = crypto.randomBytes(32).toString('hex');
      }

      const timestamp = Math.floor(Date.now() / 1000);
      const timeStep = Math.floor(timestamp / DURATION_SECONDS);
      
      const payload = `${program._id.toString()}:${timeStep}`;
      const signature = crypto
        .createHmac('sha256', program.activeQrSecret)
        .update(payload)
        .digest('hex');

      const token = `${program._id.toString()}:${timeStep}:${signature}`;
      
      // Update DB record
      program.activeQrToken = {
        token,
        type,
        expiresAt: new Date((timeStep + 1) * DURATION_SECONDS * 1000), // end of the 5 min block
      };
      await program.save();

      const { generateQRCodeBuffer } = require('../certificate/certificate.helper');
      const qrData = JSON.stringify({ programId: program._id.toString(), token, type });
      const buffer = await generateQRCodeBuffer(qrData);
      const qrCodeDataUri = `data:image/png;base64,${buffer.toString('base64')}`;

      const secondsRemaining = DURATION_SECONDS - (timestamp % DURATION_SECONDS);

      return { 
        token, 
        type, 
        expiresAt: program.activeQrToken.expiresAt, 
        qrCodeDataUri,
        expiresIn: secondsRemaining,
        verificationMethod: 'qr_and_gps'
      };
    }

    // Fallback: Legacy static QR generation (5 minutes)
    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + DURATION_SECONDS * 1000); // 5 minutes

    program.activeQrToken = {
      token,
      type,
      expiresAt,
    };
    await program.save();

    const { generateQRCodeBuffer } = require('../certificate/certificate.helper');
    const qrData = JSON.stringify({ programId: program._id.toString(), token, type });
    const buffer = await generateQRCodeBuffer(qrData);
    const qrCodeDataUri = `data:image/png;base64,${buffer.toString('base64')}`;

    return { 
      token, 
      type, 
      expiresAt, 
      qrCodeDataUri,
      expiresIn: DURATION_SECONDS, // 5 minutes (300 seconds)
      verificationMethod: 'static'
    };
  }
}

module.exports = new ProgramService();
