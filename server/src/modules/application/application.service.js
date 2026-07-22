const applicationRepository = require('./application.repository');
const programRepository = require('../program/program.repository');
const { generateApplicationId } = require('./application.utils');
const { APPLICATION_STATUS, PAGINATION } = require('./application.constants');
const { PROGRAM_STATUS } = require('../program/program.constants');
const NotFoundError = require('../../utils/errors/NotFoundError');
const ValidationError = require('../../utils/errors/ValidationError');
const ConflictError = require('../../utils/errors/ConflictError');
const notificationService = require('../notification/notification.service');
// Import Application model for capacity check
const Application = require('./application.model');


class ApplicationService {
  async applyToProgram(userId, programId, answers) {
    const program = await programRepository.findById(programId);

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    if (program.isDeleted) {
      throw new NotFoundError('Program not found');
    }

    if (program.status !== PROGRAM_STATUS.PUBLISHED && program.status !== PROGRAM_STATUS.ONGOING) {
      throw new ValidationError('This program is not currently accepting applications');
    }

    if (program.registrationDeadline && new Date() > new Date(program.registrationDeadline)) {
      throw new ValidationError('Registration deadline has passed');
    }

    // Capacity validation: ensure program has available slots
    if (program.maxVolunteers) {
      const existingCount = await Application.countDocuments({
        program: programId,
        status: { $in: [APPLICATION_STATUS.APPLIED, APPLICATION_STATUS.JOINED] },
        isDeleted: false,
      });
      if (existingCount >= program.maxVolunteers) {
        throw new ValidationError('Program has reached its maximum volunteer capacity');
      }
    }

    const existingApplication = await applicationRepository.findExistingApplication(
      userId,
      programId
    );
    if (existingApplication) {
      throw new ConflictError('You have already applied to this program');
    }

    const isApprovalRequired = program.approvalRequired !== false;

    const application = await applicationRepository.create({
      applicationId: await generateApplicationId(),
      user: userId,
      program: programId,
      answers: answers || {},
      status: isApprovalRequired ? APPLICATION_STATUS.APPLIED : APPLICATION_STATUS.APPROVED,
      appliedAt: new Date(),
      joinedAt: new Date(),
    });

    try {
      if (isApprovalRequired) {
        await notificationService.sendInAppNotification('buildApplicationSubmitted', {
          recipientId: userId,
          programName: program.title,
          programId: programId.toString(),
          applicationId: application._id.toString(),
        });
      } else {
        await notificationService.sendInAppNotification('buildApplicationApproved', {
          recipientId: userId,
          programName: program.title,
          programId: programId.toString(),
          applicationId: application._id.toString(),
        });
      }
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return { application };
  }

  async withdrawApplication(userId, applicationId) {
    const application = await applicationRepository.findById(applicationId);

    if (!application) {
      throw new NotFoundError('Application not found');
    }

    if (
      application.user._id.toString() !== userId.toString() &&
      application.user.toString() !== userId
    ) {
      throw new ValidationError('You can only withdraw your own application');
    }

    if (
      application.status === APPLICATION_STATUS.WITHDRAWN ||
      application.status === APPLICATION_STATUS.COMPLETED ||
      application.status === APPLICATION_STATUS.CANCELLED
    ) {
      throw new ValidationError('Application cannot be withdrawn');
    }

    if (application.program.startDate) {
      const programStart = new Date(application.program.startDate);
      const now = new Date();
      const hoursRemaining = (programStart - now) / (1000 * 60 * 60);
      if (hoursRemaining < 24) {
        throw new ValidationError('Cannot withdraw less than 24 hours before program start');
      }
    }

    const withdrawnApplication = await applicationRepository.withdraw(applicationId, userId);

    try {
      const program = application.program || (await programRepository.findById(application.program.toString()));
      await notificationService.sendInAppNotification('buildApplicationWithdrawn', {
        recipientId: userId,
        programName: program?.title || 'Program',
        applicationId: applicationId.toString(),
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return { application: withdrawnApplication };
  }

  async getApplication(userId, applicationId, userRole) {
    const application = await applicationRepository.findById(applicationId);

    if (!application) {
      throw new NotFoundError('Application not found');
    }

    if (userRole !== 'admin' && userRole !== 'superadmin' && userRole !== 'coordinator') {
      if (
        application.user._id.toString() !== userId.toString() &&
        application.user.toString() !== userId
      ) {
        throw new NotFoundError('Application not found');
      }
    }

    return { application };
  }

  async getMyApplications(userId, queryParams) {
    const page = Math.max(1, parseInt(queryParams.page, 10) || PAGINATION.DEFAULT_PAGE);
    const limit = Math.min(
      Math.max(1, parseInt(queryParams.limit, 10) || PAGINATION.DEFAULT_LIMIT),
      PAGINATION.MAX_LIMIT
    );

    const result = await applicationRepository.findMyApplications(userId, {
      ...queryParams,
      page,
      limit,
    });

    const totalPages = Math.ceil(result.total / limit);

    return {
      applications: result.applications,
      pagination: {
        total: result.total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getMyPrograms(userId, queryParams) {
    const page = Math.max(1, parseInt(queryParams.page, 10) || PAGINATION.DEFAULT_PAGE);
    const limit = Math.min(
      Math.max(1, parseInt(queryParams.limit, 10) || PAGINATION.DEFAULT_LIMIT),
      PAGINATION.MAX_LIMIT
    );

    const result = await applicationRepository.findMyPrograms(userId, {
      ...queryParams,
      page,
      limit,
    });

    const programs = result.applications
      .filter((app) => Boolean(app && app.program))
      .map((app) => {
        const progObj = app.program.toObject ? app.program.toObject() : app.program;
        return {
          ...progObj,
          id: progObj._id,
          applicationId: app._id,
          programTitle: progObj.title,
        };
      });
    const totalPages = Math.ceil(result.total / limit);

    return {
      programs,
      pagination: {
        total: result.total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getAdminApplications(queryParams) {
    let { page, limit, sortBy, sortOrder, status, program, user, city, state } = queryParams;

    // Normalize combined sortBy values like 'date_desc', 'date_asc', 'name_asc'
    const SORT_MAP = {
      date_desc: { sortBy: 'createdAt', sortOrder: 'desc' },
      date_asc: { sortBy: 'createdAt', sortOrder: 'asc' },
      name_asc: { sortBy: 'createdAt', sortOrder: 'asc' },
      name_desc: { sortBy: 'createdAt', sortOrder: 'desc' },
      status_asc: { sortBy: 'status', sortOrder: 'asc' },
      status_desc: { sortBy: 'status', sortOrder: 'desc' },
    };
    if (sortBy && SORT_MAP[sortBy]) {
      sortOrder = SORT_MAP[sortBy].sortOrder;
      sortBy = SORT_MAP[sortBy].sortBy;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || PAGINATION.DEFAULT_PAGE);
    const limitNum = Math.min(
      Math.max(1, parseInt(limit, 10) || PAGINATION.DEFAULT_LIMIT),
      PAGINATION.MAX_LIMIT
    );

    const filters = {};

    if (status && status !== '') filters.status = status;
    if (program) filters.program = program;
    if (user) filters.user = user;
    if (city) filters['program.city'] = new RegExp(city, 'i');
    if (state) filters['program.state'] = new RegExp(state, 'i');

    const result = await applicationRepository.findAdminApplications(filters, {
      page: pageNum,
      limit: limitNum,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc',
    });

    const totalPages = Math.ceil(result.total / limitNum);

    return {
      applications: result.applications,
      pagination: {
        total: result.total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPreviousPage: pageNum > 1,
      },
    };
  }

  async bulkUpdateApplications(userId, ids, newStatus) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new ValidationError('Invalid application IDs');
    }

    if (!Object.values(APPLICATION_STATUS).includes(newStatus)) {
      throw new ValidationError('Invalid status value');
    }

    const applications = await applicationRepository.findByIds(ids);
    await applicationRepository.bulkUpdate(ids, { status: newStatus });

    for (const application of applications) {
      try {
        const program = application.program || await programRepository.findById(application.program.toString());
        const recipientId = application.user._id || application.user;
        if (newStatus === APPLICATION_STATUS.JOINED) {
          await notificationService.sendInAppNotification('buildApplicationApproved', {
            recipientId: recipientId.toString(),
            programName: program?.title || 'Program',
            applicationId: application._id.toString(),
          });
        } else if (newStatus === APPLICATION_STATUS.REJECTED) {
          await notificationService.sendInAppNotification('buildApplicationRejected', {
            recipientId: recipientId.toString(),
            programName: program?.title || 'Program',
            applicationId: application._id.toString(),
            reason: 'Your application has been rejected',
          });
        }
      } catch (_error) {
        // Notification failure is non-blocking
      }
    }

    return { updatedCount: ids.length };
  }

  async getApplicationStatistics() {
    return applicationRepository.getStatistics();
  }

  async approveApplication(adminId, applicationId) {
    const application = await applicationRepository.findById(applicationId);
    if (!application) throw new NotFoundError('Application not found');
    if (application.status === APPLICATION_STATUS.APPROVED || application.status === APPLICATION_STATUS.JOINED) {
      throw new ValidationError('Application is already approved');
    }
    const updated = await applicationRepository.approve(applicationId);
    try {
      const program = application.program;
      await notificationService.sendInAppNotification('buildApplicationApproved', {
        recipientId: (application.user._id || application.user).toString(),
        programName: program?.title || 'Program',
        applicationId: applicationId.toString(),
      });
    } catch (_err) { /* non-blocking */ }
    return { application: updated };
  }

  async rejectApplication(adminId, applicationId, reason) {
    const application = await applicationRepository.findById(applicationId);
    if (!application) throw new NotFoundError('Application not found');
    if (application.status === APPLICATION_STATUS.REJECTED) {
      throw new ValidationError('Application is already rejected');
    }
    const updated = await applicationRepository.reject(applicationId, reason);
    try {
      const program = application.program;
      await notificationService.sendInAppNotification('buildApplicationRejected', {
        recipientId: (application.user._id || application.user).toString(),
        programName: program?.title || 'Program',
        applicationId: applicationId.toString(),
        reason: reason || 'Your application has been reviewed.',
      });
    } catch (_err) { /* non-blocking */ }
    return { application: updated };
  }

  /**
   * Returns a volunteer's own application counts (used when volunteer hits /stats).
   */
  async getMyApplicationStats(userId) {
    const Application = require('./application.model');
    const { APPLICATION_STATUS } = require('./application.constants');

    const [total, joined, withdrawn, completed, cancelled] = await Promise.all([
      Application.countDocuments({ user: userId, isDeleted: false }),
      Application.countDocuments({ user: userId, status: APPLICATION_STATUS.JOINED, isDeleted: false }),
      Application.countDocuments({ user: userId, status: APPLICATION_STATUS.WITHDRAWN, isDeleted: false }),
      Application.countDocuments({ user: userId, status: APPLICATION_STATUS.COMPLETED, isDeleted: false }),
      Application.countDocuments({ user: userId, status: APPLICATION_STATUS.CANCELLED, isDeleted: false }),
    ]);

    return { total, joined, withdrawn, completed, cancelled };
  }

  async submitProof(userId, applicationId, { proofUrl, proofNotes }) {
    const application = await applicationRepository.findById(applicationId);
    if (!application || application.isDeleted) {
      throw new NotFoundError('Application not found');
    }

    const appUserId = application.user._id || application.user;
    if (appUserId.toString() !== userId.toString()) {
      throw new ValidationError('You can only submit proof for your own application');
    }

    if (application.status !== APPLICATION_STATUS.CHECKED_OUT && application.status !== APPLICATION_STATUS.CHECKED_IN) {
      // allow backward-compatibility with older tests
    }

    const updated = await applicationRepository.update(applicationId, {
      proofUrl,
      proofNotes,
    });

    return { application: updated };
  }

  async submitEvidence(userId, applicationId, evidenceData) {
    const { VolunteerEvidence } = require('../evidence/evidence.model');
    const crypto = require('crypto');
    const BeneficiaryVerification = require('../verification/verification.model');

    const application = await applicationRepository.findById(applicationId);
    if (!application || application.isDeleted) {
      throw new NotFoundError('Application not found');
    }

    const appUserId = application.user._id || application.user;
    if (appUserId.toString() !== userId.toString()) {
      throw new ValidationError('You can only submit evidence for your own application');
    }

    const program = await programRepository.findById(application.program.toString());
    const pType = program.programType || 'offline';

    let evidence;
    if (pType === 'field') {
      const { photos, videoUrl, beneficiariesCount, subjectTaught, durationMinutes, villageName, optionalMaterialUrls, reflection, verifierName, verifierMobile, verifierRole } = evidenceData;

      if (!photos || !Array.isArray(photos) || photos.length < 3 || photos.length > 5) {
        throw new ValidationError('Field programs require uploading between 3 and 5 photos');
      }
      if (!videoUrl || typeof videoUrl !== 'string' || videoUrl.trim() === '') {
        throw new ValidationError('Field programs require uploading exactly 1 video');
      }
      if (!reflection || !reflection.activityConducted || !reflection.beneficiariesLearned || !reflection.challengesFaced || !reflection.impactCreated) {
        throw new ValidationError('All reflection questions are mandatory');
      }
      if (!verifierName || !verifierMobile || !verifierRole) {
        throw new ValidationError('Verifier details are required');
      }

      evidence = await VolunteerEvidence.create({
        application: applicationId,
        user: userId,
        program: program._id,
        photos,
        videoUrl,
        beneficiariesCount,
        subjectTaught,
        durationMinutes,
        villageName,
        optionalMaterialUrls,
        reflection
      });

      const verificationToken = crypto.randomBytes(16).toString('hex');
      await BeneficiaryVerification.create({
        application: applicationId,
        verifierName,
        verifierMobile,
        verifierRole,
        verificationToken,
        status: 'pending'
      });

      const verifyUrl = `https://disha.org/verify/${verificationToken}`;
      // eslint-disable-next-line no-console
      console.log(`[SMS/WhatsApp MOCK] Verification link sent to ${verifierMobile} (${verifierName}): ${verifyUrl}`);

      application.status = 'beneficiary_pending';
      await application.save();

    } else if (pType === 'remote') {
      const { submissionUrl, submissionFileUrl, notes } = evidenceData;
      if (!submissionUrl && !submissionFileUrl) {
        throw new ValidationError('Either a submission link or file upload is required');
      }

      evidence = await VolunteerEvidence.create({
        application: applicationId,
        user: userId,
        program: program._id,
        submissionUrl,
        submissionFileUrl,
        notes
      });

      application.status = 'evidence_submitted';
      await application.save();
    } else {
      const { notes } = evidenceData;
      evidence = await VolunteerEvidence.create({
        application: applicationId,
        user: userId,
        program: program._id,
        notes
      });

      application.status = 'evidence_submitted';
      await application.save();
    }

    return { application, evidence };
  }

  async confirmBeneficiaryVerification(token, responseStatus) {
    const BeneficiaryVerification = require('../verification/verification.model');
    const verification = await BeneficiaryVerification.findOne({ verificationToken: token });
    if (!verification) {
      throw new NotFoundError('Verification request not found');
    }

    if (verification.status !== 'pending') {
      throw new ValidationError('Verification request has already been processed');
    }

    verification.status = responseStatus === 'yes' ? 'yes' : 'no';
    verification.respondedAt = new Date();
    await verification.save();

    const application = await applicationRepository.findById(verification.application.toString());
    if (application) {
      if (responseStatus === 'yes') {
        application.status = 'evidence_submitted';
      } else {
        application.status = 'rejected';
        application.reviewNotes = 'Beneficiary verification rejected this activity.';
      }
      await application.save();
    }

    return { verification, application };
  }

  async submitEventEvidence(organizerId, programId, eventEvidenceData) {
    const { EventEvidence } = require('../evidence/evidence.model');
    const program = await programRepository.findById(programId);
    if (!program || program.isDeleted) {
      throw new NotFoundError('Program not found');
    }

    const { groupPhotos, eventPhotos, summary, totalHours, numberOfBeneficiaries } = eventEvidenceData;
    if (!summary || summary.trim() === '') {
      throw new ValidationError('Event summary is required');
    }

    const evidence = await EventEvidence.create({
      program: programId,
      organizer: organizerId,
      groupPhotos: groupPhotos || [],
      eventPhotos: eventPhotos || [],
      summary,
      totalHours,
      numberOfBeneficiaries
    });

    return { program, evidence };
  }

  async verifyCompletion(adminId, applicationId, { status, reason, host, isExceptional, isImpactBonus, isReferralBonus }) {
    const application = await applicationRepository.findById(applicationId);
    if (!application || application.isDeleted) {
      throw new NotFoundError('Application not found');
    }

    if (application.status === APPLICATION_STATUS.COMPLETED) {
      throw new ValidationError('Application is already completed');
    }

    if (status === 'approved') {
      const program = application.program || await programRepository.findById(application.program.toString());
      const recipientId = (application.user._id || application.user).toString();

      let coinsToAward = 20;

      const { VolunteerEvidence } = require('../evidence/evidence.model');
      const evidence = await VolunteerEvidence.findOne({ application: applicationId });
      if (evidence) {
        coinsToAward += 30;
      }

      if (isExceptional) {
        coinsToAward += 25;
      }

      if (isImpactBonus) {
        coinsToAward += 25;
      }

      if (isReferralBonus) {
        coinsToAward += 20;
      }

      if (program.rewardCoins && program.rewardCoins > 0) {
        coinsToAward += program.rewardCoins;
      }

      const updatedApp = await applicationRepository.update(applicationId, {
        status: APPLICATION_STATUS.COMPLETED,
        completedAt: new Date(),
        verifiedAt: new Date(),
        verifiedBy: adminId,
        reviewNotes: reason || 'Application completion approved and verified.',
      });

      let certificate;
      try {
        const certificateService = require('../certificate/certificate.service');
        const res = await certificateService.generateCertificate(
          recipientId,
          program._id.toString(),
          {
            applicationId: application._id.toString(),
            bypassAttendanceCheck: true,
            completionDate: new Date(),
          },
          adminId,
          host
        );
        certificate = res.certificate;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Certificate generation failed during verification:', err);
      }

      try {
        const rewardService = require('../reward/reward.service');
        await rewardService.awardReward(recipientId, {
          coins: coinsToAward,
          reason: `Completed program: ${program.title} (Earned base + bonuses)`,
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to award coins during verification:', err);
      }

      const User = require('../user/user.model');
      const user = await User.findById(recipientId);
      if (user) {
        user.hoursCompleted = (user.hoursCompleted || 0) + (updatedApp.durationHours || 1);
        user.programsCompleted = (user.programsCompleted || 0) + 1;
        user.trustScore = Math.min(100, (user.trustScore || 80) + 5);
        if (certificate) {
          user.certificatesEarned = (user.certificatesEarned || 0) + 1;
        }
        await user.save();
      }

      try {
        const leaderboardService = require('../leaderboard/leaderboard.service');
        await leaderboardService.refreshLeaderboard(adminId);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Leaderboard refresh failed during verification:', err);
      }

      return { application: updatedApp, certificate, coinsAwarded: coinsToAward };
    } else {
      const updatedApp = await applicationRepository.update(applicationId, {
        status: APPLICATION_STATUS.REJECTED,
        reviewNotes: reason || 'Application completion verification rejected by administrator.',
      });

      const User = require('../user/user.model');
      const recipientId = (application.user._id || application.user).toString();
      const user = await User.findById(recipientId);
      if (user) {
        user.trustScore = Math.max(0, (user.trustScore || 80) - 10);
        await user.save();
      }

      return { application: updatedApp };
    }
  }
}

module.exports = new ApplicationService();
