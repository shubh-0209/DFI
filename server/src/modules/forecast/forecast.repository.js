const User = require('../user/user.model');
const Program = require('../program/program.model');
const Application = require('../application/application.model');
const Attendance = require('../attendance/attendance.model');
const Certificate = require('../certificate/certificate.model');
const RewardTransaction = require('../reward-transaction/rewardTransaction.model');
const Organization = require('../organization/organization.model');

class ForecastRepository {
  _getMonthsAgo(n) {
    const d = new Date();
    d.setMonth(d.getMonth() - n);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  _matchBase(extra = {}) {
    return { isDeleted: false, ...extra };
  }

  async getVolunteerHistory() {
    const pipeline = [
      {
        $match: { role: 'volunteer', isDeleted: false },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: 1 },
          active: {
            $sum: {
              $cond: [{ $eq: ['$status', 'active'] }, 1, 0],
            },
          },
        },
      },
      { $project: { _id: 0, year: '$_id.year', month: '$_id.month', total: 1, active: 1 } },
      { $sort: { year: 1, month: 1 } },
    ];
    return User.aggregate(pipeline);
  }

  async getProgramHistory() {
    const from = this._getMonthsAgo(12);
    const pipeline = [
      { $match: { isDeleted: false, createdAt: { $gte: from } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, year: '$_id.year', month: '$_id.month', count: 1 } },
      { $sort: { year: 1, month: 1 } },
    ];
    return Program.aggregate(pipeline);
  }

  async getAttendanceHistory() {
    const from = this._getMonthsAgo(12);
    const pipeline = [
      { $match: { isDeleted: false, attendanceDate: { $gte: from } } },
      {
        $group: {
          _id: {
            year: { $year: '$attendanceDate' },
            month: { $month: '$attendanceDate' },
          },
          count: { $sum: 1 },
          hours: { $sum: '$totalHours' },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          count: 1,
          hours: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ];
    return Attendance.aggregate(pipeline);
  }

  async getRewardHistory() {
    const from = this._getMonthsAgo(12);
    const pipeline = [
      { $match: { isDeleted: false, createdAt: { $gte: from }, type: 'credit' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          redemptions: { $sum: 1 },
          coins: { $sum: '$coins' },
          points: { $sum: '$points' },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          redemptions: 1,
          coins: 1,
          points: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ];
    return RewardTransaction.aggregate(pipeline);
  }

  async getCertificateHistory() {
    const from = this._getMonthsAgo(12);
    const pipeline = [
      { $match: { isDeleted: false, issuedAt: { $gte: from } } },
      {
        $group: {
          _id: {
            year: { $year: '$issuedAt' },
            month: { $month: '$issuedAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, year: '$_id.year', month: '$_id.month', count: 1 } },
      { $sort: { year: 1, month: 1 } },
    ];
    return Certificate.aggregate(pipeline);
  }

  async getCoinDistributionHistory() {
    const from = this._getMonthsAgo(12);
    const pipeline = [
      { $match: { isDeleted: false, createdAt: { $gte: from } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          coins: { $sum: '$coins' },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          coins: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ];
    return RewardTransaction.aggregate(pipeline);
  }

  async getActiveVolunteersHistory() {
    const pipeline = [
      { $match: { isDeleted: false, role: 'volunteer', status: 'active' } },
      {
        $group: {
          _id: null,
          active: { $sum: 1 },
        },
      },
    ];
    const current = (await User.aggregate(pipeline))[0]?.active || 0;
    const monthly = await this.getVolunteerHistory();
    return { current, monthly };
  }

  async getNGOParticipationHistory() {
    const from = this._getMonthsAgo(12);
    const pipeline = [
      { $match: { isDeleted: false, createdAt: { $gte: from } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          count: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ];
    return Organization.aggregate(pipeline);
  }

  async getDashboardData() {
    const [totalVolunteers, activeVolunteers, totalPrograms, totalApplications, totalAttendance, totalCertificates, totalOrgs] = await Promise.all([
      User.countDocuments({ role: 'volunteer', isDeleted: false }),
      User.countDocuments({ role: 'volunteer', isDeleted: false, status: 'active' }),
      Program.countDocuments({ isDeleted: false }),
      Application.countDocuments({ isDeleted: false }),
      Attendance.countDocuments({ isDeleted: false }),
      Certificate.countDocuments({ isDeleted: false }),
      Organization.countDocuments({ isDeleted: false }),
    ]);

    return {
      totalVolunteers,
      activeVolunteers,
      totalPrograms,
      totalApplications,
      totalAttendance,
      totalCertificates,
      totalOrgs,
    };
  }

  async getCurrentValues() {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      volunteersThisMonth,
      volunteersLastMonth,
      programsThisMonth,
      programsLastMonth,
      attendanceThisMonth,
      attendanceLastMonth,
      certificatesThisMonth,
      certificatesLastMonth,
      rewardsThisMonth,
      rewardsLastMonth,
      coinsThisMonth,
      coinsLastMonth,
    ] = await Promise.all([
      User.countDocuments({ role: 'volunteer', isDeleted: false, createdAt: { $gte: thisMonth } }),
      User.countDocuments({ role: 'volunteer', isDeleted: false, createdAt: { $gte: lastMonth, $lt: thisMonth } }),
      Program.countDocuments({ isDeleted: false, createdAt: { $gte: thisMonth } }),
      Program.countDocuments({ isDeleted: false, createdAt: { $gte: lastMonth, $lt: thisMonth } }),
      Attendance.countDocuments({ isDeleted: false, attendanceDate: { $gte: thisMonth } }),
      Attendance.countDocuments({ isDeleted: false, attendanceDate: { $gte: lastMonth, $lt: thisMonth } }),
      Certificate.countDocuments({ isDeleted: false, issuedAt: { $gte: thisMonth } }),
      Certificate.countDocuments({ isDeleted: false, issuedAt: { $gte: lastMonth, $lt: thisMonth } }),
      RewardTransaction.countDocuments({ isDeleted: false, type: 'credit', createdAt: { $gte: thisMonth } }),
      RewardTransaction.countDocuments({ isDeleted: false, type: 'credit', createdAt: { $gte: lastMonth, $lt: thisMonth } }),
      RewardTransaction.aggregate([
        { $match: { isDeleted: false, createdAt: { $gte: thisMonth } } },
        { $group: { _id: null, total: { $sum: '$coins' } } },
      ]).then(r => r[0]?.total || 0),
      RewardTransaction.aggregate([
        { $match: { isDeleted: false, createdAt: { $gte: lastMonth, $lt: thisMonth } } },
        { $group: { _id: null, total: { $sum: '$coins' } } },
      ]).then(r => r[0]?.total || 0),
    ]);

    const activeVolunteers = await User.countDocuments({ role: 'volunteer', isDeleted: false, status: 'active' });
    const totalOrgs = await Organization.countDocuments({ isDeleted: false });

    return {
      volunteers: { current: volunteersThisMonth, previous: volunteersLastMonth },
      programs: { current: programsThisMonth, previous: programsLastMonth },
      attendance: { current: attendanceThisMonth, previous: attendanceLastMonth },
      certificates: { current: certificatesThisMonth, previous: certificatesLastMonth },
      rewards: { current: rewardsThisMonth, previous: rewardsLastMonth },
      coins: { current: coinsThisMonth, previous: coinsLastMonth },
      activeVolunteers,
      ngoParticipation: totalOrgs,
    };
  }
}

module.exports = new ForecastRepository();
