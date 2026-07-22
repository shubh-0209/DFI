const Program = require('../program/program.model');
const User = require('../user/user.model');
const Announcement = require('../announcement/announcement.model');
const { PROGRAM_STATUS } = require('../program/program.constants');
const { ROLES, STATUS } = require('../user/user.constants');
const { STATUS: ANNOUNCE_STATUS, TARGET_AUDIENCE } = require('../announcement/announcement.constants');
const { successResponse } = require('../../utils/response');

// GET /api/v1/public/programs
exports.getPrograms = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const programs = await Program.find({ status: PROGRAM_STATUS.PUBLISHED })
      .select('title slug shortDescription category tags mode startDate endDate country state city maxVolunteers')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const total = await Program.countDocuments({ status: PROGRAM_STATUS.PUBLISHED });

    return successResponse(res, 200, 'Public programs fetched successfully', {
      programs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/public/leaderboard/top
exports.getTopLeaderboard = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);

    const leaderboardService = require('../leaderboard/leaderboard.service');
    const topVolunteers = await leaderboardService.getTopVolunteers({ limit });

    // Map to structure nicely for the frontend public website
    const leaderboard = topVolunteers.map((vol, index) => ({
      id: vol.supabaseId || vol._id,
      rank: index + 1,
      name: vol.name,
      avatar: vol.profilePhoto || '',
      points: vol.points,
      level: vol.volunteerLevel,
      impactScore: vol.impactScore,
      location: [vol.city, vol.state].filter(Boolean).join(', ')
    }));

    return successResponse(res, 200, 'Top volunteers fetched successfully', { leaderboard });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/public/analytics/impact
exports.getImpactAnalytics = async (req, res, next) => {
  try {
    const totalVolunteers = await User.countDocuments({ role: ROLES.VOLUNTEER, status: STATUS.ACTIVE, isDeleted: false });
    const totalPrograms = await Program.countDocuments({ status: PROGRAM_STATUS.PUBLISHED });
    
    // Aggregate total hours and points across all active volunteers
    const aggregate = await User.aggregate([
      { $match: { role: ROLES.VOLUNTEER, status: STATUS.ACTIVE, isDeleted: false } },
      { $group: {
          _id: null,
          totalHours: { $sum: "$hoursCompleted" },
          totalPoints: { $sum: "$points" }
      }}
    ]);

    const stats = aggregate[0] || { totalHours: 0, totalPoints: 0 };

    return successResponse(res, 200, 'Impact analytics fetched successfully', {
      volunteers: totalVolunteers,
      programs: totalPrograms,
      totalHours: stats.totalHours,
      totalPoints: stats.totalPoints
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/public/announcements
exports.getAnnouncements = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 5, 20);
    
    const announcements = await Announcement.find({
      status: ANNOUNCE_STATUS.PUBLISHED,
      targetAudience: TARGET_AUDIENCE.ALL_USERS
    })
      .select('title message type priority publishedAt attachments isPinned')
      .sort({ isPinned: -1, publishedAt: -1 })
      .limit(limit)
      .lean();

    return successResponse(res, 200, 'Public announcements fetched successfully', { announcements });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/public/volunteers/count
exports.getVolunteerCount = async (req, res, next) => {
  try {
    const count = await User.countDocuments({ role: ROLES.VOLUNTEER, status: STATUS.ACTIVE, isDeleted: false });
    return successResponse(res, 200, 'Volunteer count fetched successfully', { count });
  } catch (err) {
    next(err);
  }
};
