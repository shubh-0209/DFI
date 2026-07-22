const gamificationRepository = require('./gamification.repository');
const userRepository = require('../user/user.repository');
const rewardRepository = require('../reward/reward.repository');
const certificateRepository = require('../certificate/certificate.repository');
const applicationRepository = require('../application/application.repository');
const {
  NotFoundError,
} = require('../../utils/errors');
const notificationService = require('../notification/notification.service');

class GamificationService {
  async _getUserStats(userId) {
    const [user, reward, certificates, applications] = await Promise.all([
      userRepository.findById(userId),
      rewardRepository.findByUser(userId),
      certificateRepository.findByUser(userId, { page: 1, limit: 1 }),
      applicationRepository.findByUser(userId, { status: 'completed' }, { page: 1, limit: 1 }),
    ]);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const completedApplications = applications.total || 0;

    return {
      userId,
      impactScore: reward?.currentImpactScore || 0,
      points: reward?.currentPoints || 0,
      coins: reward?.currentCoins || 0,
      volunteerHours: reward?.currentVolunteerHours || user.hoursCompleted || 0,
      programsCompleted: reward?.totalProgramsCompleted || user.programsCompleted || completedApplications || 0,
      certificates: certificates.total || 0,
    };
  }

  async _checkBadgeCriteria(userStats, badge) {
    const { criteria } = badge;

    switch (criteria.type) {
      case 'programs_completed':
        return userStats.programsCompleted >= criteria.target;
      case 'volunteer_hours':
        return userStats.volunteerHours >= criteria.target;
      case 'impact_score':
        return userStats.impactScore >= criteria.target;
      case 'coins':
        return userStats.coins >= criteria.target;
      case 'points':
        return userStats.points >= criteria.target;
      case 'certificates':
        return userStats.certificates >= criteria.target;
      default:
        return false;
    }
  }

  async _checkAchievementCriteria(userStats, achievement) {
    const { criteria } = achievement;

    switch (criteria.type) {
      case 'programs_completed':
        return userStats.programsCompleted >= criteria.target;
      case 'volunteer_hours':
        return userStats.volunteerHours >= criteria.target;
      case 'impact_score':
        return userStats.impactScore >= criteria.target;
      case 'coins':
        return userStats.coins >= criteria.target;
      case 'points':
        return userStats.points >= criteria.target;
      case 'certificates':
        return userStats.certificates >= criteria.target;
      default:
        return false;
    }
  }

  async evaluateBadges(userId) {
    const userStats = await this._getUserStats(userId);
    const activeBadges = await gamificationRepository.findActiveBadges({});

    const earnedBadges = [];
    const skippedBadges = [];

    for (const badge of activeBadges.badges) {
      const existingBadge = await gamificationRepository.findUserBadge(userId, badge.badgeId);
      if (existingBadge) {
        skippedBadges.push(badge.badgeId);
        continue;
      }

      const isEligible = await this._checkBadgeCriteria(userStats, badge);
      if (isEligible) {
        const userBadge = await gamificationRepository.createUserBadge({
          user: userId,
          badge: badge._id,
          badgeId: badge.badgeId,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          category: badge.category,
          earnedAt: new Date(),
        });

        earnedBadges.push(userBadge);

        try {
          await notificationService.sendInAppNotification('buildBadgeEarned', {
            recipientId: userId,
            badgeName: badge.name,
            badgeDescription: badge.description,
          });
        } catch (_error) {
          // Notification failure is non-blocking
        }
      }
    }

    return {
      earned: earnedBadges.length,
      skipped: skippedBadges.length,
      badges: earnedBadges,
    };
  }

  async evaluateAchievements(userId) {
    const userStats = await this._getUserStats(userId);
    const activeAchievements = await gamificationRepository.findActiveAchievements({});

    const updatedAchievements = [];
    const skippedAchievements = [];

    for (const achievement of activeAchievements.achievements) {
      const existingAchievement = await gamificationRepository.findUserAchievement(userId, achievement.achievementId);
      if (existingAchievement && existingAchievement.completed) {
        skippedAchievements.push(achievement.achievementId);
        continue;
      }

      let progressValue = 0;
      switch (achievement.criteria.type) {
        case 'programs_completed':
          progressValue = userStats.programsCompleted;
          break;
        case 'volunteer_hours':
          progressValue = userStats.volunteerHours;
          break;
        case 'impact_score':
          progressValue = userStats.impactScore;
          break;
        case 'coins':
          progressValue = userStats.coins;
          break;
        case 'points':
          progressValue = userStats.points;
          break;
        case 'certificates':
          progressValue = userStats.certificates;
          break;
        default:
          progressValue = 0;
      }

      const progress = Math.min(progressValue, achievement.criteria.target);
      const isCompleted = progress >= achievement.criteria.target;

      if (existingAchievement) {
        const updated = await gamificationRepository.updateUserAchievement(existingAchievement._id, {
          progress,
          completed: isCompleted,
          completedAt: isCompleted ? new Date() : existingAchievement.completedAt,
        });

        if (isCompleted) {
          updatedAchievements.push(updated);
        }
      } else {
        const newAchievement = await gamificationRepository.createUserAchievement({
          user: userId,
          achievement: achievement._id,
          achievementId: achievement.achievementId,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          category: achievement.category,
          criteriaType: achievement.criteria.type,
          target: achievement.criteria.target,
          progress,
          completed: isCompleted,
          completedAt: isCompleted ? new Date() : null,
          rewardPoints: achievement.rewardPoints || 0,
        });

        if (isCompleted) {
          updatedAchievements.push(newAchievement);
        }
      }
    }

    return {
      completed: updatedAchievements.length,
      skipped: skippedAchievements.length,
      achievements: updatedAchievements,
    };
  }

  async calculateVolunteerLevel(userId) {
    const userStats = await this._getUserStats(userId);
    const levels = await gamificationRepository.findAllLevels();

    let currentLevel = null;
    let nextLevel = null;

    for (const level of levels) {
      if (
        userStats.impactScore >= level.minImpact &&
        userStats.programsCompleted >= level.minProgramsCompleted &&
        userStats.volunteerHours >= level.minVolunteerHours
      ) {
        currentLevel = level;
      }
    }

    if (currentLevel) {
      nextLevel = await gamificationRepository.findNextLevel(currentLevel.order);
    }

    const userDoc = await userRepository.findById(userId);
    const previousLevel = userDoc?.volunteerLevel || null;
    if (currentLevel && previousLevel && currentLevel.title !== previousLevel) {
      try {
        await notificationService.sendInAppNotification('buildVolunteerLevelUp', {
          recipientId: userId,
          newLevel: currentLevel.title,
          previousLevel,
        });
      } catch (_error) {
        // Notification failure is non-blocking
      }
    }

    return {
      currentLevel,
      nextLevel,
      stats: userStats,
    };
  }

  async evaluateAll(userId) {
    const [badgesResult, achievementsResult, levelResult] = await Promise.all([
      this.evaluateBadges(userId),
      this.evaluateAchievements(userId),
      this.calculateVolunteerLevel(userId),
    ]);

    return {
      badges: badgesResult,
      achievements: achievementsResult,
      level: levelResult,
    };
  }

  async getBadges(userId, queryParams) {
    const { page, limit } = queryParams;
    return gamificationRepository.findUserBadges(userId, {
      page: Number(page) || 1,
      limit: Number(limit) || 50,
    });
  }

  async getAchievements(userId, queryParams) {
    const { page, limit, completed } = queryParams;
    return gamificationRepository.findUserAchievements(userId, {
      page: Number(page) || 1,
      limit: Number(limit) || 50,
      completed: completed !== undefined ? completed === 'true' : undefined,
    });
  }

  async getVolunteerLevel(userId) {
    const levelResult = await this.calculateVolunteerLevel(userId);
    return levelResult;
  }
}

module.exports = new GamificationService();
