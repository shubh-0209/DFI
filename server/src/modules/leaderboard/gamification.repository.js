const BadgeDefinition = require('./badge.model');
const UserBadge = require('./user-badge.model');
const AchievementDefinition = require('./achievement.model');
const UserAchievement = require('./user-achievement.model');
const VolunteerLevel = require('./volunteer-level.model');

class GamificationRepository {
  // ─── Badge Definitions ──────────────────────────────────────────
  async createBadge(badgeData) {
    return BadgeDefinition.create(badgeData);
  }

  async findBadgeById(id) {
    return BadgeDefinition.findOne({ _id: id, isDeleted: false });
  }

  async findBadgeByBadgeId(badgeId) {
    return BadgeDefinition.findOne({ badgeId, isDeleted: false });
  }

  async findActiveBadges(filters = {}, options = {}) {
    const { page = 1, limit = 50 } = options;
    const skip = (page - 1) * limit;

    const [badges, total] = await Promise.all([
      BadgeDefinition.find({ ...filters, isDeleted: false, isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BadgeDefinition.countDocuments({ ...filters, isDeleted: false, isActive: true }),
    ]);

    return { badges, total, page, limit };
  }

  async updateBadge(id, updateData) {
    return BadgeDefinition.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  // ─── User Badges ────────────────────────────────────────────────
  async createUserBadge(userBadgeData) {
    return UserBadge.create(userBadgeData);
  }

  async findUserBadges(userId, options = {}) {
    const { page = 1, limit = 50 } = options;
    const skip = (page - 1) * limit;

    const [badges, total] = await Promise.all([
      UserBadge.find({ user: userId, isDeleted: false })
        .sort({ earnedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      UserBadge.countDocuments({ user: userId, isDeleted: false }),
    ]);

    return { badges, total, page, limit };
  }

  async findUserBadge(userId, badgeId) {
    return UserBadge.findOne({ user: userId, badgeId, isDeleted: false });
  }

  async findUserBadgeByBadge(userId, badgeId) {
    return UserBadge.findOne({ user: userId, badge: badgeId, isDeleted: false });
  }

  // ─── Achievement Definitions ────────────────────────────────────
  async createAchievement(achievementData) {
    return AchievementDefinition.create(achievementData);
  }

  async findAchievementById(id) {
    return AchievementDefinition.findOne({ _id: id, isDeleted: false });
  }

  async findAchievementByAchievementId(achievementId) {
    return AchievementDefinition.findOne({ achievementId, isDeleted: false });
  }

  async findActiveAchievements(filters = {}, options = {}) {
    const { page = 1, limit = 50 } = options;
    const skip = (page - 1) * limit;

    const [achievements, total] = await Promise.all([
      AchievementDefinition.find({ ...filters, isDeleted: false, isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AchievementDefinition.countDocuments({ ...filters, isDeleted: false, isActive: true }),
    ]);

    return { achievements, total, page, limit };
  }

  async updateAchievement(id, updateData) {
    return AchievementDefinition.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  // ─── User Achievements ──────────────────────────────────────────
  async createUserAchievement(userAchievementData) {
    return UserAchievement.create(userAchievementData);
  }

  async findUserAchievements(userId, options = {}) {
    const { page = 1, limit = 50, completed } = options;
    const skip = (page - 1) * limit;

    const query = { user: userId, isDeleted: false };
    if (completed !== undefined) {
      query.completed = completed;
    }

    const [achievements, total] = await Promise.all([
      UserAchievement.find(query)
        .sort({ completedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      UserAchievement.countDocuments(query),
    ]);

    return { achievements, total, page, limit };
  }

  async findUserAchievement(userId, achievementId) {
    return UserAchievement.findOne({ user: userId, achievementId, isDeleted: false });
  }

  async findUserAchievementByAchievement(userId, achievementId) {
    return UserAchievement.findOne({ user: userId, achievement: achievementId, isDeleted: false });
  }

  async updateUserAchievement(id, updateData) {
    return UserAchievement.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  // ─── Volunteer Levels ──────────────────────────────────────────
  async createLevel(levelData) {
    return VolunteerLevel.create(levelData);
  }

  async findLevelByLevel(level) {
    return VolunteerLevel.findOne({ level, isDeleted: false, isActive: true });
  }

  async findAllLevels() {
    return VolunteerLevel.find({ isDeleted: false, isActive: true }).sort({ order: 1 }).lean();
  }

  async findNextLevel(currentOrder) {
    return VolunteerLevel.findOne({ order: currentOrder + 1, isDeleted: false, isActive: true }).lean();
  }

  async updateLevel(id, updateData) {
    return VolunteerLevel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  // ─── Bulk Operations ───────────────────────────────────────────
  async bulkUpsertBadges(entries) {
    const bulkOps = entries.map((entry) => ({
      updateOne: {
        filter: { user: entry.user, badgeId: entry.badgeId, isDeleted: false },
        update: { $set: { ...entry, updatedAt: new Date() } },
        upsert: true,
      },
    }));

    if (bulkOps.length === 0) return { modified: 0, upserted: 0 };

    const result = await UserBadge.bulkWrite(bulkOps, { ordered: false });
    return {
      modified: result.modifiedCount || 0,
      upserted: result.upsertedCount || 0,
    };
  }

  async bulkUpsertAchievements(entries) {
    const bulkOps = entries.map((entry) => ({
      updateOne: {
        filter: { user: entry.user, achievementId: entry.achievementId, isDeleted: false },
        update: { $set: { ...entry, updatedAt: new Date() } },
        upsert: true,
      },
    }));

    if (bulkOps.length === 0) return { modified: 0, upserted: 0 };

    const result = await UserAchievement.bulkWrite(bulkOps, { ordered: false });
    return {
      modified: result.modifiedCount || 0,
      upserted: result.upsertedCount || 0,
    };
  }
}

module.exports = new GamificationRepository();
