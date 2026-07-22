const Attendance = require('./attendance.model');

class AttendanceRepository {
  /**
   * Create a new attendance record.
   */
  async create(attendanceData) {
    return Attendance.create(attendanceData);
  }

  /**
   * Find an attendance record by its MongoDB ID.
   */
  async findById(id) {
    return Attendance.findById(id);
  }

  /**
   * Find an attendance record by its custom attendanceId.
   */
  async findByAttendanceId(attendanceId) {
    return Attendance.findOne({ attendanceId, isDeleted: false });
  }

  /**
   * Find attendance records by application ID.
   */
  async findByApplication(applicationId) {
    return Attendance.find({ application: applicationId, isDeleted: false });
  }

  /**
   * Find attendance records by program ID.
   */
  async findByProgram(programId) {
    return Attendance.find({ program: programId, isDeleted: false });
  }

  /**
   * Find attendance records by volunteer ID.
   */
  async findByVolunteer(userId) {
    return Attendance.find({ user: userId, isDeleted: false });
  }

  /**
   * Find attendance records by date.
   */
  async findByDate(date) {
    return Attendance.find({ attendanceDate: date, isDeleted: false });
  }

  /**
   * Update an attendance record.
   */
  async update(id, updateData) {
    return Attendance.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  /**
   * Soft delete an attendance record.
   */
  async softDelete(id, deletedById) {
    return Attendance.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: deletedById,
      },
      { new: true }
    );
  }

  // ─── Module 6.2 Specific Methods ─────────────────────────────────

  /**
   * Perform volunteer check-in (saves the record).
   */
  async checkIn(attendanceData) {
    return this.create(attendanceData);
  }

  /**
   * Perform volunteer check-out by updating checkout fields.
   */
  async checkOut(id, checkOutTime, totalHours) {
    return this.update(id, { checkOutTime, totalHours });
  }

  /**
   * Find today's attendance record for a volunteer in a program.
   * Compares the normalized date (midnight UTC).
   */
  async findTodayAttendance(userId, programId, date) {
    return Attendance.findOne({
      user: userId,
      program: programId,
      attendanceDate: date,
      isDeleted: false,
    });
  }

  /**
   * Find all attendance records for a volunteer.
   */
  async findVolunteerAttendance(userId) {
    return this.findByVolunteer(userId);
  }

  /**
   * Update attendance data.
   */
  async updateAttendance(id, updateData) {
    return this.update(id, updateData);
  }

  // ─── Module 6.3 Specific Methods ─────────────────────────────────

  /**
   * Retrieve paginated attendance for a single volunteer.
   */
  async findMyAttendance(userId, filters = {}, options = {}) {
    const { page = 1, limit = 10, sortBy = 'attendanceDate', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const query = { user: userId, isDeleted: false, ...filters };

    const [records, total] = await Promise.all([
      Attendance.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('program', 'title programId startDate endDate status category city mode')
        .lean(),
      Attendance.countDocuments(query),
    ]);

    return { records, total, page, limit };
  }

  /**
   * Retrieve attendance details for verification.
   */
  async findAttendanceById(id) {
    return Attendance.findOne({ _id: id, isDeleted: false })
      .populate('user', 'name email volunteerId role')
      .populate('program', 'title programId startDate endDate status category city mode');
  }

  /**
   * Admin attendance listing with pagination, search, sorting and filters.
   */
  async findAdminAttendance(filters = {}, options = {}) {
    const { page = 1, limit = 10, sortBy = 'attendanceDate', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [records, total] = await Promise.all([
      Attendance.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email volunteerId')
        .populate('program', 'title programId city state')
        .lean(),
      Attendance.countDocuments(filters),
    ]);

    return { records, total, page, limit };
  }

  /**
   * Bulk update attendance records.
   */
  async bulkUpdateAttendance(ids, updateData) {
    return Attendance.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      { $set: updateData },
      { runValidators: true }
    );
  }

  /**
   * Aggregate attendance statistics for admin dashboard.
   */
  async getAttendanceStatistics() {
    const [totalRecords, presentCount, absentCount] = await Promise.all([
      Attendance.countDocuments({ isDeleted: false }),
      Attendance.countDocuments({ status: 'present', isDeleted: false }),
      Attendance.countDocuments({ status: 'absent', isDeleted: false }),
    ]);

    const totalHoursResult = await Attendance.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: null, total: { $sum: '$totalHours' } } },
    ]);
    const totalVolunteerHours = totalHoursResult[0]?.total || 0;

    const attendancePercentage =
      totalRecords > 0 ? Math.round((presentCount / totalRecords) * 10000) / 100 : 0;

    const dailyAttendance = await Attendance.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$attendanceDate' } },
          presentCount: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] },
          },
          absentCount: {
            $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const programWiseAttendance = await Attendance.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$program',
          totalHours: { $sum: '$totalHours' },
          presentCount: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] },
          },
          totalCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'programs',
          localField: '_id',
          foreignField: '_id',
          as: 'programDetails',
        },
      },
      { $unwind: '$programDetails' },
      {
        $project: {
          programId: '$_id',
          title: '$programDetails.title',
          totalHours: 1,
          presentCount: 1,
          totalCount: 1,
        },
      },
    ]);

    return {
      totalRecords,
      presentCount,
      absentCount,
      totalVolunteerHours: Math.round(totalVolunteerHours * 100) / 100,
      attendancePercentage,
      dailyAttendance,
      programWiseAttendance,
    };
  }
}

module.exports = new AttendanceRepository();
