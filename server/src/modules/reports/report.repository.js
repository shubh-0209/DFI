const Report = require('./report.model');
const User = require('../user/user.model');
const Program = require('../program/program.model');
const Organization = require('../organization/organization.model');
const Certificate = require('../certificate/certificate.model');
const Attendance = require('../attendance/attendance.model');
const Application = require('../application/application.model');
const RewardTransaction = require('../reward-transaction/rewardTransaction.model');
const { REPORT_TYPES, REPORT_PERIODS } = require('./report.model');

const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 100) / 100;
};

class ReportRepository {
  _buildDateFilter(dateRange, dateField, query = {}) {
    const now = new Date();
    const filter = { ...query, isDeleted: false };

    switch (dateRange) {
      case REPORT_PERIODS.TODAY: {
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(now);
        todayEnd.setHours(23, 59, 59, 999);
        filter[dateField] = { $gte: todayStart, $lt: todayEnd };
        break;
      }

      case REPORT_PERIODS.THIS_WEEK: {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        filter[dateField] = { $gte: startOfWeek, $lt: endOfWeek };
        break;
      }

      case REPORT_PERIODS.THIS_MONTH: {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);
        filter[dateField] = { $gte: startOfMonth, $lt: endOfMonth };
        break;
      }

      case REPORT_PERIODS.LAST_MONTH: {
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        lastMonthEnd.setHours(23, 59, 59, 999);
        filter[dateField] = { $gte: lastMonthStart, $lt: lastMonthEnd };
        break;
      }

      case REPORT_PERIODS.LAST_3_MONTHS: {
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        threeMonthsAgo.setHours(0, 0, 0, 0);
        filter[dateField] = { $gte: threeMonthsAgo };
        break;
      }

      case REPORT_PERIODS.LAST_6_MONTHS: {
        const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(now.getMonth() - 6);
        sixMonthsAgo.setHours(0, 0, 0, 0);
        filter[dateField] = { $gte: sixMonthsAgo };
        break;
      }

      case REPORT_PERIODS.LAST_YEAR: {
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        oneYearAgo.setHours(0, 0, 0, 0);
        filter[dateField] = { $gte: oneYearAgo };
        break;
      }

      case REPORT_PERIODS.MONTHLY: {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filter[dateField] = { $gte: startOfMonth };
        break;
      }

      case REPORT_PERIODS.QUARTERLY: {
        const quarterStart = new Date(now);
        quarterStart.setMonth(now.getMonth() - 3);
        quarterStart.setHours(0, 0, 0, 0);
        filter[dateField] = { $gte: quarterStart };
        break;
      }

      case REPORT_PERIODS.ANNUAL: {
        const yearStart = new Date(now.getFullYear(), 0, 1);
        filter[dateField] = { $gte: yearStart };
        break;
      }

      default:
        break;
    }

    return filter;
  }

  async createReportHistory(reportData) {
    const count = await Report.countDocuments({});
    const reportId = `RPT${String(count + 1).padStart(6, '0')}`;

    const report = new Report({
      reportId,
      ...reportData,
    });

    return report.save();
  }

  async getReportHistory(userId, query = {}) {
    const filter = { isDeleted: false };

    if (userId) {
      filter.generatedBy = userId;
    }

    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;

    const reports = await Report.find(filter)
      .populate('generatedBy', 'name email')
      .populate('organization', 'name')
      .populate('program', 'title')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Report.countDocuments(filter);

    return {
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getVolunteerReport(filters = {}) {
    const dateFilter = filters.dateRange ? this._buildDateFilter(filters.dateRange, 'createdAt', {}) : {};

    const baseQuery = { role: 'volunteer', isDeleted: false, ...dateFilter };

    if (filters.organization) {
      baseQuery.organization = filters.organization;
    }

    if (filters.state) {
      baseQuery.state = filters.state;
    }

    if (filters.status) {
      baseQuery.status = filters.status;
    }

    let volunteers = await User.find(baseQuery)
      .select('name email state city coins volunteerLevel createdAt')
      .sort({ [filters.sortBy || 'createdAt']: filters.sortOrder === 'asc' ? 1 : -1 })
      .lean();

    if (filters.groupBy && filters.groupBy !== 'none') {
      const groupField = filters.groupBy;
      volunteers = await User.aggregate([
        { $match: { role: 'volunteer', isDeleted: false, ...dateFilter } },
        { $group: { _id: `$${groupField}`, count: { $sum: 1 } } },
        { $project: { _id: 0, [groupField]: '$_id', count: 1 } },
        { $sort: { count: -1 } },
      ]);
    }

    return {
      reportType: REPORT_TYPES.VOLUNTEER,
      data: volunteers,
      summary: {
        total: volunteers.length,
        dateRange: filters.dateRange,
      },
    };
  }

  async getProgramReport(filters = {}) {
    const dateFilter = filters.dateRange ? this._buildDateFilter(filters.dateRange, 'createdAt', {}) : {};

    let query = { isDeleted: false, ...dateFilter };

    if (filters.organization) {
      query.createdBy = filters.organization;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.state) {
      query.state = filters.state;
    }

    let programs = await Program.find(query)
      .select('title category status startDate endDate createdAt maxVolunteers')
      .sort({ [filters.sortBy || 'createdAt']: filters.sortOrder === 'asc' ? 1 : -1 })
      .lean();

    if (filters.groupBy && filters.groupBy !== 'none') {
      const groupField = filters.groupBy;
      programs = await Program.aggregate([
        { $match: { isDeleted: false, ...dateFilter } },
        { $group: { _id: `$${groupField}`, count: { $sum: 1 } } },
        { $project: { _id: 0, [groupField]: '$_id', count: 1 } },
        { $sort: { count: -1 } },
      ]);
    }

    const totalRegistrations = await Application.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$program', count: { $sum: 1 } } },
    ]);

    const programIds = programs.map(p => p._id);
    const programRegistrations = {};
    totalRegistrations.forEach(r => {
      if (programIds.includes(r._id.toString())) {
        programRegistrations[r._id.toString()] = r.count;
      }
    });

    programs = programs.map(p => ({
      ...p,
      _id: p._id.toString(),
      registrations: programRegistrations[p._id.toString()] || 0,
    }));

    return {
      reportType: REPORT_TYPES.PROGRAM,
      data: programs,
      summary: {
        total: programs.length,
        dateRange: filters.dateRange,
      },
    };
  }

  async getApplicationReport(filters = {}) {
    const dateFilter = filters.dateRange ? this._buildDateFilter(filters.dateRange, 'appliedAt', {}) : {};

    let query = { isDeleted: false, ...dateFilter };

    if (filters.program) {
      query.program = filters.program;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    const applications = await Application.find(query)
      .populate('user', 'name email')
      .populate('program', 'title')
      .sort({ [filters.sortBy || 'appliedAt']: filters.sortOrder === 'asc' ? 1 : -1 })
      .lean();

    return {
      reportType: REPORT_TYPES.APPLICATION,
      data: applications,
      summary: {
        total: applications.length,
        dateRange: filters.dateRange,
      },
    };
  }

  async getAttendanceReport(filters = {}) {
    const dateFilter = filters.dateRange ? this._buildDateFilter(filters.dateRange, 'attendanceDate', {}) : {};

    let query = { isDeleted: false, ...dateFilter };

    if (filters.program) {
      query.program = filters.program;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    const attendance = await Attendance.find(query)
      .populate('user', 'name email')
      .populate('program', 'title')
      .sort({ [filters.sortBy || 'attendanceDate']: filters.sortOrder === 'asc' ? 1 : -1 })
      .lean();

    const totalHours = attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0);
    const avgHours = attendance.length > 0 ? totalHours / attendance.length : 0;

    return {
      reportType: REPORT_TYPES.ATTENDANCE,
      data: attendance,
      summary: {
        total: attendance.length,
        totalHours,
        averageHours: Math.round(avgHours * 100) / 100,
        dateRange: filters.dateRange,
      },
    };
  }

  async getCertificateReport(filters = {}) {
    const dateFilter = filters.dateRange ? this._buildDateFilter(filters.dateRange, 'issuedAt', {}) : {};

    let query = { status: 'issued', isDeleted: false, ...dateFilter };

    if (filters.program) {
      query.program = filters.program;
    }

    const certificates = await Certificate.find(query)
      .populate('user', 'name email')
      .populate('program', 'title')
      .sort({ [filters.sortBy || 'issuedAt']: filters.sortOrder === 'asc' ? 1 : -1 })
      .lean();

    return {
      reportType: REPORT_TYPES.CERTIFICATE,
      data: certificates,
      summary: {
        total: certificates.length,
        dateRange: filters.dateRange,
      },
    };
  }

  async getRewardReport(filters = {}) {
    const dateFilter = filters.dateRange ? this._buildDateFilter(filters.dateRange, 'createdAt', {}) : {};

    const rewards = await RewardTransaction.find({
      isDeleted: false,
      coins: { $gt: 0 },
      ...dateFilter,
    })
      .populate('user', 'name email')
      .populate('program', 'title')
      .sort({ [filters.sortBy || 'createdAt']: filters.sortOrder === 'asc' ? 1 : -1 })
      .lean();

    return {
      reportType: REPORT_TYPES.REWARD,
      data: rewards,
      summary: {
        total: rewards.length,
        totalCoins: rewards.reduce((sum, r) => sum + r.coins, 0),
        dateRange: filters.dateRange,
      },
    };
  }

  async getLeaderboardReport(filters = {}) {
    const limit = parseInt(filters.limit, 10) || 10;

    const topByHours = await Attendance.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$user', totalHours: { $sum: '$totalHours' } } },
      { $sort: { totalHours: -1 } },
      { $limit: limit },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { _id: 0, userId: '$_id', name: '$user.name', email: '$user.email', totalHours: 1 } },
    ]);

    const topByCoins = await User.aggregate([
      { $match: { role: 'volunteer', isDeleted: false } },
      { $sort: { coins: -1 } },
      { $limit: limit },
      { $project: { _id: 0, userId: '$_id', name: '$name', email: '$email', coins: 1 } },
    ]);

    return {
      reportType: REPORT_TYPES.LEADERBOARD,
      data: {
        topByHours,
        topByCoins,
      },
      summary: {
        total: topByHours.length + topByCoins.length,
      },
    };
  }

  async getOrganizationReport(filters = {}) {
    const dateFilter = filters.dateRange ? this._buildDateFilter(filters.dateRange, 'createdAt', {}) : {};

    const organizations = await Organization.find({
      isDeleted: false,
      ...dateFilter,
    })
      .populate('owner', 'name email')
      .sort({ [filters.sortBy || 'createdAt']: filters.sortOrder === 'asc' ? 1 : -1 })
      .lean();

    return {
      reportType: REPORT_TYPES.ORGANIZATION,
      data: organizations,
      summary: {
        total: organizations.length,
        dateRange: filters.dateRange,
      },
    };
  }

  async getPlatformReport(filters = {}) {
    const [
      totalVolunteers,
      activeVolunteers,
      totalPrograms,
      activePrograms,
      totalApplications,
      approvedApplications,
      totalAttendance,
      presentAttendance,
      certificatesGenerated,
      coinsDistributedAgg,
      totalOrganizations,
      verifiedOrganizations,
    ] = await Promise.all([
      User.countDocuments({ role: 'volunteer', isDeleted: false }),
      User.countDocuments({ role: 'volunteer', status: 'active', isDeleted: false }),
      Program.countDocuments({ isDeleted: false }),
      Program.countDocuments({ status: { $in: ['published', 'ongoing', 'registration_closed'] }, isDeleted: false }),
      Application.countDocuments({ isDeleted: false }),
      Application.countDocuments({ status: { $in: ['approved', 'joined'] }, isDeleted: false }),
      Attendance.countDocuments({ isDeleted: false }),
      Attendance.countDocuments({ status: 'present', isDeleted: false }),
      Certificate.countDocuments({ status: 'issued', isDeleted: false }),
      RewardTransaction.aggregate([
        { $match: { isDeleted: false, coins: { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: '$coins' } } },
      ]),
      Organization.countDocuments({ isDeleted: false }),
      Organization.countDocuments({ verificationStatus: 'verified', isDeleted: false }),
    ]);

    return {
      reportType: REPORT_TYPES.PLATFORM,
      data: {
        volunteers: {
          total: totalVolunteers,
          active: activeVolunteers,
          growthRate: 0,
        },
        programs: {
          total: totalPrograms,
          active: activePrograms,
        },
        applications: {
          total: totalApplications,
          approvalRate: calculatePercentage(approvedApplications, totalApplications),
        },
        attendance: {
          total: totalAttendance,
          rate: calculatePercentage(presentAttendance, totalAttendance),
        },
        certificates: {
          generated: certificatesGenerated,
        },
        rewards: {
          coinsDistributed: coinsDistributedAgg[0]?.total || 0,
        },
        organizations: {
          total: totalOrganizations,
          verified: verifiedOrganizations,
        },
      },
      summary: {
        dateRange: filters.dateRange,
      },
    };
  }

  async getImpactReport(filters = {}) {
    const [
      volunteersByState,
      volunteersByCity,
      hoursByProgram,
      applicationsByProgram,
      coinsByMonth,
    ] = await Promise.all([
      User.aggregate([
        { $match: { role: 'volunteer', isDeleted: false } },
        { $group: { _id: '$state', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      User.aggregate([
        { $match: { role: 'volunteer', isDeleted: false } },
        { $group: { _id: '$city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Attendance.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: '$program', totalHours: { $sum: '$totalHours' } } },
        { $sort: { totalHours: -1 } },
        { $limit: 10 },
        { $lookup: { from: 'programs', localField: '_id', foreignField: '_id', as: 'program' } },
        { $unwind: { path: '$program', preserveNullAndEmptyArray: true } },
        { $project: { _id: 0, program: '$program.title', totalHours: 1 } },
      ]),
      Application.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: '$program', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $lookup: { from: 'programs', localField: '_id', foreignField: '_id', as: 'program' } },
        { $unwind: { path: '$program', preserveNullAndEmptyArray: true } },
        { $project: { _id: 0, program: '$program.title', count: 1 } },
      ]),
      RewardTransaction.aggregate([
        { $match: { isDeleted: false, coins: { $gt: 0 } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, coins: { $sum: '$coins' } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

    return {
      reportType: REPORT_TYPES.IMPACT,
      data: {
        volunteersByState,
        volunteersByCity,
        hoursByProgram,
        applicationsByProgram,
        coinsByMonth,
      },
      summary: {
        dateRange: filters.dateRange,
      },
    };
  }

  async getComparisonData(compareType) {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const currentYearStart = new Date(now.getFullYear(), 0, 1);
    const previousYearStart = new Date(now.getFullYear() - 1, 0, 1);
    const previousYearEnd = new Date(now.getFullYear() - 1, 11, 31);

    switch (compareType) {
      case 'month': {
        const [current, previous] = await Promise.all([
          User.countDocuments({ role: 'volunteer', createdAt: { $gte: currentMonthStart }, isDeleted: false }),
          User.countDocuments({ role: 'volunteer', createdAt: { $gte: previousMonthStart, $lt: previousMonthEnd }, isDeleted: false }),
        ]);
        return {
          comparisonType: 'Current Month vs Previous Month',
          currentPeriod: { label: 'Current Month', value: current },
          previousPeriod: { label: 'Previous Month', value: previous },
        };
      }

      case 'year': {
        const [current, previous] = await Promise.all([
          User.countDocuments({ role: 'volunteer', createdAt: { $gte: currentYearStart }, isDeleted: false }),
          User.countDocuments({ role: 'volunteer', createdAt: { $gte: previousYearStart, $lt: previousYearEnd }, isDeleted: false }),
        ]);
        return {
          comparisonType: 'Current Year vs Previous Year',
          currentPeriod: { label: 'Current Year', value: current },
          previousPeriod: { label: 'Previous Year', value: previous },
        };
      }

      default:
        return null;
    }
  }

  async getBusinessIntelligence() {
    const [
      topPrograms,
      topVolunteers,
      mostActiveOrganizations,
      highestAttendance,
      mostRewarded,
      fastestGrowingState,
      volunteerRetention,
      applicationConversion,
      programCompletion,
      avgAttendance,
      avgHours,
      avgCoins,
    ] = await Promise.all([
      Program.aggregate([
        { $match: { isDeleted: false } },
        { $lookup: { from: 'applications', localField: '_id', foreignField: 'program', as: 'applications' } },
        { $addFields: { applicationCount: { $size: '$applications' } } },
        { $sort: { applicationCount: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, title: 1, applicationCount: 1 } },
      ]),
      User.aggregate([
        { $match: { role: 'volunteer', isDeleted: false } },
        { $sort: { coins: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, name: 1, coins: 1 } },
      ]),
      Organization.aggregate([
        { $match: { isDeleted: false } },
        { $lookup: { from: 'users', localField: '_id', foreignField: 'organization', as: 'users' } },
        { $addFields: { volunteerCount: { $size: '$users' } } },
        { $sort: { volunteerCount: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, name: 1, volunteerCount: 1 } },
      ]),
      Attendance.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: '$program', totalHours: { $sum: '$totalHours' } } },
        { $sort: { totalHours: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'programs', localField: '_id', foreignField: '_id', as: 'program' } },
        { $unwind: { path: '$program', preserveNullAndEmptyArray: true } },
        { $project: { _id: 0, program: '$program.title', totalHours: 1 } },
      ]),
      User.aggregate([
        { $match: { role: 'volunteer', isDeleted: false } },
        { $sort: { coins: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, name: 1, coins: 1 } },
      ]),
      User.aggregate([
        { $match: { role: 'volunteer', isDeleted: false, state: { $exists: true, $ne: '' } } },
        { $group: { _id: '$state', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]),
      this._calculateVolunteerRetention(),
      this._calculateApplicationConversion(),
      this._calculateProgramCompletion(),
      this._calculateAvgAttendance(),
      this._calculateAvgHours(),
      this._calculateAvgCoins(),
    ]);

    return {
      topPerformingPrograms: topPrograms,
      topVolunteers,
      mostActiveOrganizations,
      highestAttendance,
      mostRewardedVolunteers: mostRewarded,
      fastestGrowingState: fastestGrowingState[0] || null,
      volunteerRetentionRate: volunteerRetention,
      applicationConversionRate: applicationConversion,
      programCompletionRate: programCompletion,
      averageAttendance: avgAttendance,
      averageVolunteerHours: avgHours,
      averageCoinsEarned: avgCoins,
    };
  }

  async _calculateVolunteerRetention() {
    const totalVolunteers = await User.countDocuments({ role: 'volunteer', isDeleted: false });
    const activeVolunteers = await User.countDocuments({ role: 'volunteer', status: 'active', isDeleted: false });
    return calculatePercentage(activeVolunteers, totalVolunteers);
  }

  async _calculateApplicationConversion() {
    const totalApplications = await Application.countDocuments({ isDeleted: false });
    const joinedApplications = await Application.countDocuments({ status: 'joined', isDeleted: false });
    return calculatePercentage(joinedApplications, totalApplications);
  }

  async _calculateProgramCompletion() {
    const totalPrograms = await Program.countDocuments({ isDeleted: false });
    const completedPrograms = await Program.countDocuments({ status: 'completed', isDeleted: false });
    return calculatePercentage(completedPrograms, totalPrograms);
  }

  async _calculateAvgAttendance() {
    const result = await Attendance.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: null, avg: { $avg: 1 } } },
    ]);
    return result[0]?.avg || 0;
  }

  async _calculateAvgHours() {
    const result = await Attendance.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: null, avgHours: { $avg: '$totalHours' } } },
    ]);
    return result[0]?.avgHours || 0;
  }

  async _calculateAvgCoins() {
    const result = await User.aggregate([
      { $match: { role: 'volunteer', isDeleted: false } },
      { $group: { _id: null, avgCoins: { $avg: '$coins' } } },
    ]);
    return result[0]?.avgCoins || 0;
  }

  async generateExportData(reportType, filters = {}) {
    const reportData = await this[`get${this._getReportMethodName(reportType)}Report`](filters);
    return reportData;
  }

  _getReportMethodName(reportType) {
    const typeMap = {
      [REPORT_TYPES.VOLUNTEER]: 'Volunteer',
      [REPORT_TYPES.PROGRAM]: 'Program',
      [REPORT_TYPES.APPLICATION]: 'Application',
      [REPORT_TYPES.ATTENDANCE]: 'Attendance',
      [REPORT_TYPES.CERTIFICATE]: 'Certificate',
      [REPORT_TYPES.REWARD]: 'Reward',
      [REPORT_TYPES.LEADERBOARD]: 'Leaderboard',
      [REPORT_TYPES.ORGANIZATION]: 'Organization',
      [REPORT_TYPES.PLATFORM]: 'Platform',
      [REPORT_TYPES.IMPACT]: 'Impact',
    };
    return typeMap[reportType] || 'Volunteer';
  }
}

module.exports = new ReportRepository();
module.exports.ReportRepository = ReportRepository;