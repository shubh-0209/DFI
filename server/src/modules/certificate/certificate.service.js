const certificateRepository = require('./certificate.repository');
const applicationRepository = require('../application/application.repository');
const attendanceRepository = require('../attendance/attendance.repository');
const userRepository = require('../user/user.repository');
const rewardRepository = require('../reward/reward.repository');
const rewardTransactionRepository = require('../reward-transaction/rewardTransaction.repository');
const programRepository = require('../program/program.repository');
const { generateCertificateNumber, generateCertificateId } = require('./certificate.utils');
const { CERTIFICATE_STATUS, MESSAGES, VALIDATION } = require('./certificate.constants');
const { APPLICATION_STATUS } = require('../application/application.constants');
const { TRANSACTION_TYPE } = require('../reward-transaction/rewardTransaction.constants');
const { generateCertificatePDF, generateQRCodeBuffer, uploadBufferToCloudinary } = require('./certificate.helper');
const {
  NotFoundError,
  ValidationError,
  AuthorizationError,
  ConflictError,
} = require('../../utils/errors');
const ROLES = require('../../constants/roles.constants');
const notificationService = require('../notification/notification.service');

class CertificateService {
  async generateCertificate(userId, programId, options = {}, issuedBy, host) {
    const { applicationId, attendanceId, volunteerHours, completionDate, skillsEarned, description, bypassAttendanceCheck } = options;

    const existing = await certificateRepository.findCertificateToGenerate(userId, programId);
    if (existing) {
      throw new ConflictError(MESSAGES.CERTIFICATE_ALREADY_EXISTS);
    }

    let application;
    if (applicationId) {
      application = await applicationRepository.findById(applicationId);
      if (!application || application.isDeleted) {
        throw new NotFoundError('Application not found');
      }
    } else {
      const applications = await applicationRepository.findByUser(userId, {}, { page: 1, limit: 100 });
      application = applications.applications.find((a) => {
        const pid = a.program?._id || a.program;
        return pid && pid.toString() === programId.toString();
      });
      if (!application) {
        throw new NotFoundError('No application found for this program');
      }
    }

    const appUserId = application.user._id || application.user;
    if (appUserId.toString() !== userId.toString()) {
      throw new AuthorizationError('You are not authorized to generate a certificate for this application');
    }

    const program = await programRepository.findById(programId);
    if (!program) {
      throw new NotFoundError('Program not found');
    }

    const isProgramCompleted = program.status === 'completed';
    const isApplicationCompleted = application.status === APPLICATION_STATUS.COMPLETED;

    if (!isProgramCompleted && !isApplicationCompleted) {
      throw new ValidationError(MESSAGES.PROGRAM_NOT_COMPLETED);
    }

    let targetAttendance = null;
    let totalHours = volunteerHours || 0;

    if (!bypassAttendanceCheck) {
      if (attendanceId) {
        targetAttendance = await attendanceRepository.findById(attendanceId);
      }

      if (!targetAttendance) {
        const allProgramAttendances = await attendanceRepository.findByProgram(programId);
        const matched = allProgramAttendances.find((a) => {
          const aid = a.application._id || a.application;
          return a.user.toString() === userId.toString() && aid && aid.toString() === application._id.toString();
        });
        targetAttendance = matched || null;
      }

      if (!targetAttendance) {
        throw new ValidationError(MESSAGES.ATTENDANCE_CRITERIA_NOT_MET);
      }

      totalHours = volunteerHours || targetAttendance.totalHours || 0;
      if (totalHours < VALIDATION.MIN_VOLUNTEER_HOURS) {
        throw new ValidationError(MESSAGES.ATTENDANCE_CRITERIA_NOT_MET);
      }
    } else {
      if (!totalHours) {
        const allProgramAttendances = await attendanceRepository.findByProgram(programId);
        const matched = allProgramAttendances.find((a) => a.user.toString() === userId.toString());
        totalHours = matched ? matched.totalHours : 1;
      }
    }

    const programIdStr = program._id;
    const applicationIdStr = application._id;
    const attendanceIdStr = targetAttendance ? targetAttendance._id : null;

    const certificateNumber = generateCertificateNumber();
    const certificateId = generateCertificateId();
    const verificationUrl = `${host || 'http://localhost:5000'}/api/v1/certificates/verify/${certificateNumber}`;
    const verificationToken = `${certificateNumber}-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const [pdfBuffer, qrBuffer] = await Promise.all([
      generateCertificatePDF({
        volunteerName: application.user.name,
        programName: program.title,
        organization: 'Disha for India',
        volunteerHours: totalHours,
        completionDate: completionDate || application.completedAt || new Date(),
        certificateNumber,
        authorizedSignatory: 'Disha for India Team',
        verificationUrl,
      }),
      generateQRCodeBuffer(verificationUrl),
    ]);

    const [certificateUrl, qrCodeUrl] = await Promise.all([
      uploadBufferToCloudinary(pdfBuffer, 'disha/certificates', 'raw'),
      uploadBufferToCloudinary(qrBuffer, 'disha/qrcodes', 'image'),
    ]);

    const certificate = await certificateRepository.create({
      certificateId,
      certificateNumber,
      user: userId,
      program: programIdStr,
      application: applicationIdStr,
      attendance: attendanceIdStr,
      certificateTitle: program.title,
      description: description || `Certificate of completion for ${program.title}`,
      certificateUrl,
      verificationUrl,
      qrCode: qrCodeUrl,
      verificationToken,
      volunteerHours: totalHours,
      completionDate: completionDate || application.completedAt || new Date(),
      skillsEarned: skillsEarned || [],
      organization: 'Disha for India',
      authorizedSignatory: 'Disha for India Team',
      status: CERTIFICATE_STATUS.ISSUED,
      issuedAt: new Date(),
      issuedBy: issuedBy,
    });

    try {
      await notificationService.sendInAppNotification('buildCertificateGenerated', {
        recipientId: userId,
        programName: program.title,
        certificateId: certificate._id.toString(),
        certificateNumber,
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    await certificate.populate('user', 'name email volunteerId');
    await certificate.populate('program', 'title programId');
    await certificate.populate('application');
    await certificate.populate('attendance');
    await certificate.populate('issuedBy', 'name email');

    const user = await userRepository.findById(userId);
    const currentEarned = user.certificatesEarned || 0;
    await userRepository.updateProfile(userId, {
      certificatesEarned: currentEarned + 1,
    });

    let reward = await rewardRepository.findByUser(userId);
    if (!reward) {
      reward = await rewardRepository.create({
        rewardId: `RWD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        user: userId,
        totalCertificates: 1,
      });
    } else {
      await rewardRepository.update(userId, {
        totalCertificates: (reward.totalCertificates || 0) + 1,
      });
    }

    const transactionId = `TXN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    await rewardTransactionRepository.create({
      transactionId,
      user: userId,
      program: programIdStr,
      certificate: certificate._id,
      application: applicationIdStr,
      attendance: attendanceIdStr,
      type: TRANSACTION_TYPE.EARNED,
      reason: `Certificate earned for completing ${program.title}`,
      coins: 0,
      points: 0,
      impact: 0,
    });

    try {
      const leaderboardService = require('../leaderboard/leaderboard.service');
      await leaderboardService.calculateRank(userId);
    } catch (_error) {
      // Notification failure is non-blocking
    }

    try {
      const gamificationService = require('../leaderboard/gamification.service');
      await gamificationService.evaluateAll(userId);
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return certificate;
  }

  async autoGenerateForProgram(programId) {
    const program = await programRepository.findById(programId);
    if (!program || program.isDeleted) {
      throw new NotFoundError('Program not found');
    }

    if (program.status !== 'completed') {
      throw new ValidationError(MESSAGES.PROGRAM_NOT_COMPLETED);
    }

    const applications = await applicationRepository.findByProgram(programId, {}, { page: 1, limit: 1000 });
    const results = { generated: 0, skipped: 0, failed: [] };

    for (const app of applications.applications) {
      try {
        const existing = await certificateRepository.findCertificateToGenerate(app.user._id, programId);
        if (existing) {
          results.skipped++;
          continue;
        }

        const allProgramAttendances = await attendanceRepository.findByProgram(programId);
        const programAttendances = allProgramAttendances.filter((a) => {
          const aid = a.application._id || a.application;
          return aid && aid.toString() === app._id.toString();
        });

        if (programAttendances.length === 0) {
          results.skipped++;
          continue;
        }

        const totalHours = programAttendances.reduce((sum, a) => sum + (a.totalHours || 0), 0);
        if (totalHours < VALIDATION.MIN_VOLUNTEER_HOURS) {
          results.skipped++;
          continue;
        }

        await this.generateCertificate(
          app.user._id,
          programId,
          { applicationId: app._id, attendanceId: programAttendances[0]._id, volunteerHours: totalHours },
          null,
          null
        );
        results.generated++;
      } catch (error) {
        results.failed.push({ userId: app.user._id, error: error.message });
      }
    }

    return results;
  }

  async verifyCertificate(certificateNumber) {
    const certificate = await certificateRepository.findByCertificateNumber(certificateNumber);
    if (!certificate) {
      throw new NotFoundError(MESSAGES.CERTIFICATE_INVALID);
    }

    return {
      verified: certificate.status !== CERTIFICATE_STATUS.REVOKED,
      status: certificate.status,
      isRevoked: certificate.status === CERTIFICATE_STATUS.REVOKED,
      certificate,
      message:
        certificate.status === CERTIFICATE_STATUS.REVOKED
          ? 'This certificate has been revoked'
          : 'Certificate is valid',
    };
  }

  async downloadCertificate(id, userId, userRole) {
    const certificate = await certificateRepository.findById(id);
    if (!certificate) {
      throw new NotFoundError('Certificate not found');
    }

    const isOwner = certificate.user._id.toString() === userId.toString();
    const isAdmin = [ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(userRole);
    if (!isOwner && !isAdmin) {
      throw new AuthorizationError('You are not authorized to download this certificate');
    }

    if (certificate.status === CERTIFICATE_STATUS.REVOKED) {
      throw new ValidationError('This certificate has been revoked');
    }

    if (certificate.certificateUrl) {
      return { certificateUrl: certificate.certificateUrl, certificate };
    }

    const pdfBuffer = await generateCertificatePDF({
      volunteerName: certificate.user.name,
      programName: certificate.program.title,
      organization: certificate.organization,
      volunteerHours: certificate.volunteerHours,
      completionDate: certificate.issuedAt,
      certificateNumber: certificate.certificateNumber,
      authorizedSignatory: certificate.authorizedSignatory,
      verificationUrl: certificate.verificationUrl,
    });

    return { pdfBuffer, certificate };
  }

  async revokeCertificate(id, _revokedBy) {
    const certificate = await certificateRepository.findById(id);
    if (!certificate) {
      throw new NotFoundError('Certificate not found');
    }

    if (certificate.status === CERTIFICATE_STATUS.REVOKED) {
      throw new ValidationError('Certificate is already revoked');
    }

    const revoked = await certificateRepository.revoke(id);
    await revoked.populate('user', 'name email volunteerId').populate('program', 'title programId');

    try {
      await notificationService.sendInAppNotification('buildCertificateRevoked', {
        recipientId: revoked.user._id.toString(),
        programName: revoked.program.title,
        certificateId: revoked._id.toString(),
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return revoked;
  }

  async getMyCertificates(userId, queryParams = {}) {
    const { page, limit, sort, filter } = queryParams;
    return certificateRepository.findByUser(userId, {
      page: Number(page) || 1,
      limit: Number(limit) || 12,
      sort: sort || 'newest',
      filter: filter || 'all',
    });
  }

  async searchCertificates(queryParams = {}) {
    const { page, limit, sort, filter, search } = queryParams;
    return certificateRepository.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 12,
      sort: sort || 'newest',
      filter: filter || 'all',
      search: search || '',
    });
  }

  async getCertificateHistory(certificateId) {
    const certificate = await certificateRepository.findById(certificateId);
    if (!certificate) {
      throw new NotFoundError('Certificate not found');
    }

    return {
      certificate,
      history: [
        {
          action: 'issued',
          date: certificate.issuedAt,
          details: `Certificate issued to ${certificate.user?.name || 'Volunteer'}`,
        },
        ...(certificate.status === 'revoked'
          ? [{ action: 'revoked', date: certificate.updatedAt, details: 'Certificate has been revoked' }]
          : []),
        ...(certificate.verificationCount > 0
          ? [{ action: 'verified', date: certificate.lastVerifiedAt, details: `Verified ${certificate.verificationCount} time(s)` }]
          : []),
      ],
    };
  }

  async bulkGenerateCertificates(programId, issuedBy) {
    const program = await programRepository.findById(programId);
    if (!program || program.isDeleted) {
      throw new NotFoundError('Program not found');
    }

    if (program.status !== 'completed') {
      throw new ValidationError(MESSAGES.PROGRAM_NOT_COMPLETED);
    }

    const applications = await applicationRepository.findByProgram(programId, {}, { page: 1, limit: 1000 });
    const results = { generated: 0, skipped: 0, failed: [] };

    for (const app of applications.applications) {
      try {
        const existing = await certificateRepository.findCertificateToGenerate(app.user._id, programId);
        if (existing) {
          results.skipped++;
          continue;
        }

        const allProgramAttendances = await attendanceRepository.findByProgram(programId);
        const programAttendances = allProgramAttendances.filter((a) => {
          const aid = a.application._id || a.application;
          return aid && aid.toString() === app._id.toString();
        });

        if (programAttendances.length === 0) {
          results.skipped++;
          continue;
        }

        const totalHours = programAttendances.reduce((sum, a) => sum + (a.totalHours || 0), 0);
        if (totalHours < VALIDATION.MIN_VOLUNTEER_HOURS) {
          results.skipped++;
          continue;
        }

        await this.generateCertificate(
          app.user._id,
          programId,
          { applicationId: app._id, attendanceId: programAttendances[0]._id, volunteerHours: totalHours },
          issuedBy,
          null
        );
        results.generated++;
      } catch (error) {
        results.failed.push({ userId: app.user._id, error: error.message });
      }
    }

    return results;
  }

  async getCertificate(id) {
    return certificateRepository.findById(id);
  }

  async approveCertificate(id, approvedBy) {
    const certificate = await certificateRepository.findById(id);
    if (!certificate) {
      throw new NotFoundError('Certificate not found');
    }

    if (certificate.status === CERTIFICATE_STATUS.REVOKED) {
      throw new ValidationError(MESSAGES.CERTIFICATE_CANNOT_APPROVE_REVOKED);
    }

    if (certificate.status === CERTIFICATE_STATUS.APPROVED) {
      throw new ValidationError(MESSAGES.CERTIFICATE_ALREADY_APPROVED);
    }

    const updated = await certificateRepository.approve(id, approvedBy);
    await updated.populate('user', 'name email volunteerId');
    await updated.populate('program', 'title programId');
    await updated.populate('approvedBy', 'name email');

    try {
      await notificationService.sendInAppNotification('buildCertificateApproved', {
        recipientId: updated.user._id.toString(),
        programName: updated.program.title,
        certificateId: updated._id.toString(),
        certificateNumber: updated.certificateNumber,
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return updated;
  }

  async rejectCertificate(id) {
    const certificate = await certificateRepository.findById(id);
    if (!certificate) {
      throw new NotFoundError('Certificate not found');
    }

    if (certificate.status === CERTIFICATE_STATUS.REVOKED) {
      throw new ValidationError(MESSAGES.CERTIFICATE_CANNOT_REJECT_REVOKED);
    }

    if (certificate.status === CERTIFICATE_STATUS.REJECTED) {
      throw new ValidationError(MESSAGES.CERTIFICATE_ALREADY_REJECTED);
    }

    const updated = await certificateRepository.reject(id);
    await updated.populate('user', 'name email volunteerId');
    await updated.populate('program', 'title programId');

    try {
      await notificationService.sendInAppNotification('buildCertificateRejected', {
        recipientId: updated.user._id.toString(),
        programName: updated.program.title,
        certificateId: updated._id.toString(),
        certificateNumber: updated.certificateNumber,
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return updated;
  }

  async deleteCertificate(id) {
    const certificate = await certificateRepository.findById(id);
    if (!certificate) {
      throw new NotFoundError('Certificate not found');
    }

    if ([CERTIFICATE_STATUS.ISSUED, CERTIFICATE_STATUS.APPROVED].includes(certificate.status)) {
      throw new ValidationError(MESSAGES.CERTIFICATE_CANNOT_DELETE_ISSUED);
    }

    const deleted = await certificateRepository.softDelete(id, certificate.user._id || certificate.user);

    try {
      await notificationService.sendInAppNotification('buildCertificateDeleted', {
        recipientId: deleted.user._id.toString(),
        certificateId: deleted._id.toString(),
        certificateNumber: deleted.certificateNumber,
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return deleted;
  }

  async adminGenerateCertificate(issuedBy, payload, host) {
    const {
      userId,
      programId,
      volunteerHours = 0,
      completionDate,
      skillsEarned = [],
      description = '',
      applicationId = null,
      attendanceId = null,
    } = payload;

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Volunteer not found');
    }

    const program = await programRepository.findById(programId);
    if (!program || program.isDeleted) {
      throw new NotFoundError('Program not found');
    }

    const existing = await certificateRepository.findCertificateToGenerate(userId, programId);
    if (existing) {
      throw new ConflictError(MESSAGES.CERTIFICATE_ALREADY_EXISTS);
    }

    let application;
    if (applicationId) {
      application = await applicationRepository.findById(applicationId);
      if (!application) {
        throw new NotFoundError('Application not found');
      }
    } else {
      const applications = await applicationRepository.findByUser(userId, {}, { page: 1, limit: 100 });
      application = applications.applications.find((a) => {
        const pid = a.program?._id || a.program;
        return pid && pid.toString() === programId.toString();
      }) || null;
    }

    let targetAttendance = null;
    if (attendanceId) {
      targetAttendance = await attendanceRepository.findById(attendanceId);
    } else if (application) {
      const allProgramAttendances = await attendanceRepository.findByProgram(programId);
      const appId = application._id || application;
      targetAttendance = allProgramAttendances.find((a) => {
        const aid = a.application?._id || a.application;
        const appRef = aid ? aid.toString() : null;
        return a.user.toString() === userId.toString() && appRef === appId.toString();
      }) || null;
    }

    const effectiveHours = targetAttendance?.totalHours ? volunteerHours || targetAttendance.totalHours : volunteerHours;
    if (effectiveHours < VALIDATION.MIN_VOLUNTEER_HOURS) {
      throw new ValidationError(MESSAGES.ATTENDANCE_CRITERIA_NOT_MET);
    }

    const programIdStr = program._id;
    const applicationIdStr = application?._id || applicationId;
    const attendanceIdStr = targetAttendance?._id || attendanceId;

    const certificateNumber = generateCertificateNumber();
    const certificateId = generateCertificateId();
    const verificationUrl = `${host || 'http://localhost:5000'}/api/v1/certificates/verify/${certificateNumber}`;
    const verificationToken = `${certificateNumber}-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const [pdfBuffer, qrBuffer] = await Promise.all([
      generateCertificatePDF({
        volunteerName: user.name,
        programName: program.title,
        organization: 'Disha for India',
        volunteerHours: effectiveHours,
        completionDate: completionDate || new Date(),
        certificateNumber,
        authorizedSignatory: 'Disha for India Team',
        verificationUrl,
        description: description || `Certificate of completion for ${program.title}`,
        skillsEarned,
      }),
      generateQRCodeBuffer(verificationUrl),
    ]);

    const [certificateUrl, qrCodeUrl] = await Promise.all([
      uploadBufferToCloudinary(pdfBuffer, 'disha/certificates', 'raw'),
      uploadBufferToCloudinary(qrBuffer, 'disha/qrcodes', 'image'),
    ]);

    const certificate = await certificateRepository.create({
      certificateId,
      certificateNumber,
      user: userId,
      program: programIdStr,
      application: applicationIdStr,
      attendance: attendanceIdStr,
      certificateTitle: program.title,
      description,
      certificateUrl,
      verificationUrl,
      qrCode: qrCodeUrl,
      verificationToken,
      volunteerHours: effectiveHours,
      completionDate: completionDate || new Date(),
      skillsEarned,
      organization: 'Disha for India',
      authorizedSignatory: 'Disha for India Team',
      status: CERTIFICATE_STATUS.ISSUED,
      issuedAt: new Date(),
      issuedBy: issuedBy,
    });

    try {
      await notificationService.sendInAppNotification('buildCertificateGenerated', {
        recipientId: userId,
        programName: program.title,
        certificateId: certificate._id.toString(),
        certificateNumber,
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    await certificate.populate('user', 'name email volunteerId');
    await certificate.populate('program', 'title programId');
    await certificate.populate('application');
    await certificate.populate('attendance');
    await certificate.populate('issuedBy', 'name email');

    const currentEarned = user.certificatesEarned || 0;
    await userRepository.updateProfile(userId, {
      certificatesEarned: currentEarned + 1,
    });

    let reward = await rewardRepository.findByUser(userId);
    if (!reward) {
      reward = await rewardRepository.create({
        rewardId: `RWD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        user: userId,
        totalCertificates: 1,
      });
    } else {
      await rewardRepository.update(userId, {
        totalCertificates: (reward.totalCertificates || 0) + 1,
      });
    }

    const transactionId = `TXN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    await rewardTransactionRepository.create({
      transactionId,
      user: userId,
      program: programIdStr,
      certificate: certificate._id,
      application: applicationIdStr,
      attendance: attendanceIdStr,
      type: TRANSACTION_TYPE.EARNED,
      reason: `Certificate issued by admin for completing ${program.title}`,
      coins: 0,
      points: 0,
      impact: 0,
    });

    try {
      const leaderboardService = require('../leaderboard/leaderboard.service');
      await leaderboardService.calculateRank(userId);
    } catch (_error) {
      // Notification failure is non-blocking
    }

    try {
      const gamificationService = require('../leaderboard/gamification.service');
      await gamificationService.evaluateAll(userId);
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return certificate;
  }
}

module.exports = new CertificateService();
