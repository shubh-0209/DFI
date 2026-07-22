const attendanceRepository = require('./attendance.repository');
const applicationRepository = require('../application/application.repository');
const Program = require('../program/program.model');
const User = require('../user/user.model');
const Attendance = require('./attendance.model');
const { generateAttendanceId } = require('./attendance.utils');
const { ATTENDANCE_STATUS } = require('./attendance.constants');
const {
  NotFoundError,
  ValidationError,
  AuthorizationError,
  ConflictError,
} = require('../../utils/errors');
const ROLES = require('../../constants/roles.constants');
const gamificationService = require('../leaderboard/gamification.service');
const notificationService = require('../notification/notification.service');

class AttendanceService {
  /**
   * Helper to build Mongoose query filters for attendance listings.
   */
  async _buildFilters(queryParams) {
    const { program, volunteer, status, date, startDate, endDate, city, state, search } =
      queryParams;
    const query = { isDeleted: false };

    if (program) query.program = program;
    if (volunteer) query.user = volunteer;
    if (status) query.status = status;

    if (date) {
      const targetDate = new Date(date);
      targetDate.setUTCHours(0, 0, 0, 0);
      query.attendanceDate = targetDate;
    } else if (startDate || endDate) {
      query.attendanceDate = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0);
        query.attendanceDate.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        query.attendanceDate.$lte = end;
      }
    }

    // Filter by Program Location (City/State)
    const programQueries = { isDeleted: false };
    let hasLocationFilter = false;
    if (city) {
      programQueries.city = { $regex: city, $options: 'i' };
      hasLocationFilter = true;
    }
    if (state) {
      programQueries.state = { $regex: state, $options: 'i' };
      hasLocationFilter = true;
    }

    if (hasLocationFilter) {
      const matchingPrograms = await Program.find(programQueries).select('_id');
      const programIds = matchingPrograms.map((p) => p._id);
      query.program = { $in: programIds };
    }

    // Search by User name/email or Program title
    if (search) {
      const [users, programs] = await Promise.all([
        User.find({
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }).select('_id'),
        Program.find({ title: { $regex: search, $options: 'i' } }).select('_id'),
      ]);
      const userIds = users.map((u) => u._id);
      const programIds = programs.map((p) => p._id);
      query.$or = [{ user: { $in: userIds } }, { program: { $in: programIds } }];
    }

    return query;
  }

  /**
   * Calculate total hours between check-in and check-out.
   */
  calculateHours(checkInTime, checkOutTime) {
    const inTime = new Date(checkInTime);
    const outTime = new Date(checkOutTime);
    const diffMs = outTime - inTime;

    if (diffMs < 0) {
      throw new ValidationError('Check-out time cannot be before check-in time');
    }

    const diffHours = diffMs / (1000 * 60 * 60);
    return Math.round(diffHours * 100) / 100;
  }

  _getDistanceInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) *
        Math.cos(phi2) *
        Math.sin(deltaLambda / 2) *
        Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
  }

  /**
   * Validate if a volunteer is allowed to check in for a specific application/program.
   */
  async validateAttendance(userId, applicationId) {
    const application = await applicationRepository.findById(applicationId);
    if (!application || application.isDeleted) {
      throw new NotFoundError('Application not found');
    }

    const appUserId = application.user._id || application.user;
    if (appUserId.toString() !== userId.toString()) {
      throw new AuthorizationError('You are not authorized to check in for this application');
    }

    if (application.status !== 'joined' && application.status !== 'approved') {
      throw new ValidationError('You have not joined this program');
    }

    const program = application.program;
    if (!program || program.isDeleted) {
      throw new NotFoundError('Program not found');
    }

    // Program status can be ongoing or active
    const isActive = ['ongoing', 'active', 'completed'].includes(program.status);
    if (!isActive) {
      throw new ValidationError('Check-in failed: Program is not currently active');
    }

    return { application, program };
  }

  /**
   * Check in a volunteer for a specific program/application.
   */
  async checkIn(userId, applicationId, options = {}) {
    const { qrToken, coordinates, userAgent, ipAddress, villageName } = options;
    const { application, program } = await this.validateAttendance(userId, applicationId);

    const programId = program._id || program;
    const pType = program.programType || 'offline';

    // 1. GPS Geofencing Check
    if (coordinates && coordinates.latitude && coordinates.longitude) {
      if (program.latitude && program.longitude) {
        const distance = this._getDistanceInMeters(
          coordinates.latitude,
          coordinates.longitude,
          program.latitude,
          program.longitude
        );
        const maxRadius = program.allowedRadiusMeters || 100;
        if (distance > maxRadius) {
          throw new ValidationError(
            `Check-in rejected: You are too far from the program venue (${Math.round(distance)}m away, allowed: ${maxRadius}m).`
          );
        }
      }
    }

    // 2. Verification method check (GPS or QR token)
    const hasGps = coordinates && coordinates.latitude && coordinates.longitude;
    if (!qrToken && !hasGps && pType !== 'remote') {
      throw new ValidationError('GPS location or QR Token is required for check-in');
    }

    if (qrToken) {
      const crypto = require('crypto');
      const parts = qrToken.split(':');

      // Dynamic QR Validation Check
      if (program.verificationMethod === 'qr_and_gps' && program.activeQrSecret && parts.length === 3) {
        const [_tokenProgId, timeStepStr, signature] = parts;
        const timeStep = parseInt(timeStepStr, 10);
        
        const payload = `${programId}:${timeStep}`;
        const expectedSignature = crypto
          .createHmac('sha256', program.activeQrSecret)
          .update(payload)
          .digest('hex');

        if (signature !== expectedSignature) {
          throw new ValidationError('Invalid QR code signature');
        }

        const currentStep = Math.floor(Date.now() / 1000 / 300);
        if (Math.abs(currentStep - timeStep) > 1) {
          throw new ValidationError('This dynamic QR code has expired. Please scan a fresh one.');
        }
      } else if (program.activeQrToken) {
        // Fallback to legacy static check
        if (program.activeQrToken.type !== 'checkin' || program.activeQrToken.token !== qrToken) {
          throw new ValidationError('Invalid or expired check-in QR code');
        }
        if (program.activeQrToken.expiresAt < new Date()) {
          throw new ValidationError('Check-in QR code has expired');
        }
      }
    } else if (pType === 'field') {
      if (!hasGps) {
        throw new ValidationError('GPS location coordinates are required to start a field activity');
      }
      if (!villageName) {
        throw new ValidationError('Village name is required to start a field activity');
      }
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const existingAttendance = await attendanceRepository.findTodayAttendance(
      userId,
      programId,
      today
    );
    if (existingAttendance) {
      throw new ConflictError('You have already checked in for this program today');
    }

    const attendanceId = generateAttendanceId();
    const checkInRecord = await attendanceRepository.checkIn({
      attendanceId,
      user: userId,
      application: application._id,
      program: programId,
      attendanceDate: today,
      status: ATTENDANCE_STATUS.PRESENT,
      checkInTime: new Date(),
      markedBy: userId,
      checkInCoordinates: coordinates || null,
      deviceInfo: { userAgent: userAgent || 'Unknown', ipAddress: ipAddress || 'Unknown' },
      checkInType: pType === 'offline' ? 'qr' : 'gps',
      villageName: villageName || null
    });

    // Update application status in the pipeline
    application.status = pType === 'offline' ? 'checked_in' : 'activity_started';
    await application.save();

    try {
      await notificationService.sendInAppNotification('buildCheckInSuccessful', {
        recipientId: userId,
        programName: program.title,
        attendanceId: checkInRecord._id.toString(),
        checkInTime: checkInRecord.checkInTime,
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return checkInRecord;
  }

  /**
   * Check out a volunteer.
   */
  async checkOut(attendanceId, userId, options = {}) {
    const { qrToken, coordinates } = options;
    const attendance = await attendanceRepository.findByAttendanceId(attendanceId);
    if (!attendance) {
      throw new NotFoundError('Attendance record not found');
    }

    const attUserId = attendance.user._id || attendance.user;
    if (attUserId.toString() !== userId.toString()) {
      throw new AuthorizationError('You are not authorized to check out for this attendance');
    }

    if (attendance.checkOutTime) {
      throw new ValidationError('You have already checked out for this attendance record');
    }

    const program = await Program.findById(attendance.program.toString());
    const application = await applicationRepository.findById(attendance.application.toString());

    const pType = program?.programType || 'offline';

    // 1. GPS Geofencing Check
    if (coordinates && coordinates.latitude && coordinates.longitude) {
      if (program?.latitude && program?.longitude) {
        const distance = this._getDistanceInMeters(
          coordinates.latitude,
          coordinates.longitude,
          program.latitude,
          program.longitude
        );
        const maxRadius = program.allowedRadiusMeters || 100;
        if (distance > maxRadius) {
          throw new ValidationError(
            `Check-out rejected: You are too far from the program venue (${Math.round(distance)}m away, allowed: ${maxRadius}m).`
          );
        }
      }
    }

    // 2. Verification method check (GPS or QR token)
    const hasGps = coordinates && coordinates.latitude && coordinates.longitude;
    if (!qrToken && !hasGps && pType !== 'remote') {
      throw new ValidationError('GPS location or QR Token is required for check-out');
    }

    if (qrToken) {
      const crypto = require('crypto');
      const parts = qrToken.split(':');

      // Dynamic QR Validation Check
      if (program.verificationMethod === 'qr_and_gps' && program.activeQrSecret && parts.length === 3) {
        const [_tokenProgId, timeStepStr, signature] = parts;
        const timeStep = parseInt(timeStepStr, 10);
        
        const payload = `${program._id.toString()}:${timeStep}`;
        const expectedSignature = crypto
          .createHmac('sha256', program.activeQrSecret)
          .update(payload)
          .digest('hex');

        if (signature !== expectedSignature) {
          throw new ValidationError('Invalid QR code signature');
        }

        const currentStep = Math.floor(Date.now() / 1000 / 300);
        if (Math.abs(currentStep - timeStep) > 1) {
          throw new ValidationError('This dynamic QR code has expired. Please scan a fresh one.');
        }
      } else if (program.activeQrToken) {
        // Fallback to legacy static check
        if (program.activeQrToken.type !== 'checkout' || program.activeQrToken.token !== qrToken) {
          throw new ValidationError('Invalid or expired check-out QR code');
        }
        if (program.activeQrToken.expiresAt < new Date()) {
          throw new ValidationError('Check-out QR code has expired');
        }
      }
    } else if (pType === 'field') {
      if (!hasGps) {
        throw new ValidationError('GPS location coordinates are required to end a field activity');
      }
    }

    const checkInTime = attendance.checkInTime;
    const checkOutTime = new Date();
    const totalHours = this.calculateHours(checkInTime, checkOutTime);

    // Save checkout fields
    attendance.checkOutTime = checkOutTime;
    attendance.totalHours = totalHours;
    attendance.checkOutCoordinates = coordinates || null;
    const updatedRecord = await attendance.save();

    // Update application status in the pipeline
    if (application) {
      application.status = pType === 'offline' ? 'checked_out' : 'activity_completed';
      await application.save();
    }

    try {
      await notificationService.sendInAppNotification('buildCheckOutSuccessful', {
        recipientId: attUserId.toString(),
        programName: program?.title || 'Program',
        attendanceId: attendance._id.toString(),
        totalHours,
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    try {
      await gamificationService.evaluateAll(attUserId.toString());
    } catch (_error) {
      // Gamification evaluation is non-blocking
    }

    return updatedRecord;
  }

  /**
   * Get attendance for currently logged in volunteer.
   */
  async getMyAttendance(userId, queryParams) {
    const { page, limit, sortBy, sortOrder, program, startDate, endDate } = queryParams;
    const filters = {};

    if (program) filters.program = program;
    if (startDate || endDate) {
      filters.attendanceDate = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0);
        filters.attendanceDate.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        filters.attendanceDate.$lte = end;
      }
    }

    const result = await attendanceRepository.findMyAttendance(userId, filters, {
      page: Number(page),
      limit: Number(limit),
      sortBy,
      sortOrder,
    });
    return result;
  }

  /**
   * Get attendance details. Volunteers can view only their own. Admins can view any.
   */
  async getAttendance(attendanceId, userId, userRole) {
    const attendance = await attendanceRepository.findAttendanceById(attendanceId);
    if (!attendance) {
      throw new NotFoundError('Attendance record not found');
    }

    const isAuthorized =
      [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR].includes(userRole) ||
      attendance.user._id.toString() === userId.toString();

    if (!isAuthorized) {
      throw new AuthorizationError('You are not authorized to view this record');
    }

    return attendance;
  }

  /**
   * Admin attendance listing.
   */
  async getAdminAttendance(queryParams) {
    const { page = 1, limit = 10, sortBy, sortOrder } = queryParams;
    const filters = await this._buildFilters(queryParams);

    const result = await attendanceRepository.findAdminAttendance(filters, {
      page: Number(page),
      limit: Number(limit),
      sortBy,
      sortOrder,
    });
    return result;
  }

  /**
   * Edit attendance manually (Admin only).
   */
  async editAttendance(id, updateData, adminId) {
    const attendance = await attendanceRepository.findById(id);
    if (!attendance) {
      throw new NotFoundError('Attendance record not found');
    }

    const updatedFields = { ...updateData, markedBy: adminId };

    if (updateData.status === ATTENDANCE_STATUS.ABSENT) {
      updatedFields.checkInTime = null;
      updatedFields.checkOutTime = null;
      updatedFields.totalHours = 0;
    } else {
      const inTime = updateData.checkInTime
        ? new Date(updateData.checkInTime)
        : attendance.checkInTime;
      const outTime = updateData.checkOutTime
        ? new Date(updateData.checkOutTime)
        : attendance.checkOutTime;

      if (inTime && outTime) {
        updatedFields.totalHours = this.calculateHours(inTime, outTime);
      }
    }

    const updated = await attendanceRepository.updateAttendance(id, updatedFields);

    try {
      const program = await Program.findById(updated.program.toString());
      const editor = await User.findById(adminId).select('name');
      await notificationService.sendInAppNotification('buildAttendanceEdited', {
        recipientId: attendance.user.toString(),
        programName: program?.title || 'Program',
        attendanceId: attendance._id.toString(),
        updatedBy: editor?.name || 'Administrator',
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return updated;
  }

  /**
   * Bulk mark/update attendance (Admin only).
   */
  async bulkAttendance(adminId, bulkData) {
    const { ids, status, remarks } = bulkData;

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new ValidationError('A non-empty array of attendance IDs is required');
    }

    const updateData = { markedBy: adminId };
    if (status) {
      updateData.status = status;
      if (status === ATTENDANCE_STATUS.ABSENT) {
        updateData.totalHours = 0;
        updateData.checkInTime = null;
        updateData.checkOutTime = null;
      }
    }
    if (remarks !== undefined) {
      updateData.remarks = remarks;
    }

    await attendanceRepository.bulkUpdateAttendance(ids, updateData);
    return { count: ids.length };
  }

  /**
   * Get attendance statistics (Admin only).
   */
  async getStatistics() {
    return attendanceRepository.getAttendanceStatistics();
  }

  /**
   * GET /api/v1/attendance/dashboard
   * Returns a volunteer's personal attendance summary for the dashboard.
   * All users can call this; admins get global stats instead.
   */
  async getDashboard(userId, userRole) {
    const isAdmin = [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR].includes(userRole);

    if (isAdmin) {
      // Admins see global aggregate stats
      const stats = await attendanceRepository.getAttendanceStatistics();
      return { type: 'admin', stats };
    }

    // Volunteers see their own summary
    const records = await Attendance.find({ user: userId, isDeleted: false })
      .populate('program', 'title programId startDate endDate')
      .sort({ attendanceDate: -1 })
      .lean();

    const totalSessions = records.length;
    const presentCount = records.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length;
    const absentCount = records.filter((r) => r.status === ATTENDANCE_STATUS.ABSENT).length;
    const totalHours = records.reduce((sum, r) => sum + (r.totalHours || 0), 0);
    const attendanceRate = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;
    const recentAttendance = records.slice(0, 5);

    return {
      type: 'volunteer',
      summary: {
        totalSessions,
        presentCount,
        absentCount,
        totalHours: Math.round(totalHours * 100) / 100,
        attendanceRate,
      },
      recentAttendance,
    };
  }

  /**
   * Export attendance data in simplified format (Admin only).
   */
  async exportAttendance(queryParams) {
    const filters = await this._buildFilters(queryParams);
    const records = await Attendance.find(filters)
      .populate('user', 'name email volunteerId')
      .populate('program', 'title programId')
      .sort({ attendanceDate: -1 });

    const exportData = records.map((r) => ({
      'Attendance ID': r.attendanceId,
      'Attendance Date': r.attendanceDate ? r.attendanceDate.toISOString().split('T')[0] : 'N/A',
      'Volunteer Name': r.user?.name || 'N/A',
      'Volunteer Email': r.user?.email || 'N/A',
      'Volunteer ID': r.user?.volunteerId || 'N/A',
      'Program Title': r.program?.title || 'N/A',
      'Program ID': r.program?.programId || 'N/A',
      Status: r.status,
      'Check-in Time': r.checkInTime ? r.checkInTime.toISOString() : 'N/A',
      'Check-out Time': r.checkOutTime ? r.checkOutTime.toISOString() : 'N/A',
      'Total Hours': r.totalHours,
      Remarks: r.remarks || '',
    }));

    return exportData;
  }
}

module.exports = new AttendanceService();
