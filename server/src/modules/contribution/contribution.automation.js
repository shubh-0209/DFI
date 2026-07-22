/* eslint-disable no-console */
const contributionRewardRepository = require('./contribution-reward.repository');
const activityTimelineRepository = require('./activity-timeline.repository');
const portfolioRepository = require('./portfolio.repository');
const contributionStatisticsRepository = require('./contribution-statistics.repository');
const analyticsEventRepository = require('./analytics-event.repository');
const rewardTransactionRepository = require('../reward-transaction/rewardTransaction.repository');
const rewardRepository = require('../reward/reward.repository');
const leaderboardService = require('../leaderboard/leaderboard.service');
const gamificationService = require('../leaderboard/gamification.service');
const User = require('../user/user.model');
const { v4: uuidv4 } = require('uuid');
const { REVIEW_ACTION } = require('./contribution.constants');
const { TRANSACTION_TYPE } = require('../reward-transaction/rewardTransaction.constants');

class ContributionAutomation {
  async handleReviewEvent(contribution, review, action, data = {}) {
    const contributions = contribution._id || contribution;
    const contributionId = contributions.toString();
    const reviewerId = review.reviewedBy ? (review.reviewedBy._id || review.reviewedBy).toString() : null;

    const automationLog = {
      event: action,
      contributionId,
      reviewId: review._id.toString(),
      reviewerId,
      timestamp: new Date(),
    };

    try {
      switch (action) {
        case REVIEW_ACTION.APPROVED:
          await this._handleApproved(contribution, review, data);
          break;
        case REVIEW_ACTION.REJECTED:
          await this._handleRejected(contribution, review, data);
          break;
        case REVIEW_ACTION.NEEDS_CHANGES:
          await this._handleNeedsChanges(contribution, review, data);
          break;
        default:
          break;
      }

      automationLog.success = true;
    } catch (error) {
      automationLog.success = false;
      automationLog.error = error.message;
      console.error('[ContributionAutomation] Event failed:', error.message);
    }

    return automationLog;
  }

  async handleFeatureEvent(contribution, reviewerId) {
    try {
      await this._createActivityTimeline(contribution.submittedBy, 'contribution_featured', 'contribution', contribution._id, {
        title: 'Contribution Featured',
        description: `Your contribution "${contribution.title}" has been featured.`,
        contributionId: contribution._id,
      });

      await this._createAnalyticsEvent('contribution_featured', 'contribution', contribution._id, contribution.submittedBy, {
        reviewerId,
        category: contribution.category,
        contributionType: contribution.contributionType,
      });

      console.log(`[ContributionAutomation] Featured event processed for contribution ${contribution._id}`);
    } catch (error) {
      console.error('[ContributionAutomation] Feature event failed:', error.message);
    }
  }

  async handleArchiveEvent(contribution, reviewerId) {
    try {
      await this._createActivityTimeline(contribution.submittedBy, 'contribution_archived', 'contribution', contribution._id, {
        title: 'Contribution Archived',
        description: `Your contribution "${contribution.title}" has been archived.`,
        contributionId: contribution._id,
      });

      await this._createAnalyticsEvent('contribution_archived', 'contribution', contribution._id, contribution.submittedBy, {
        reviewerId,
        category: contribution.category,
        contributionType: contribution.contributionType,
      });

      console.log(`[ContributionAutomation] Archive event processed for contribution ${contribution._id}`);
    } catch (error) {
      console.error('[ContributionAutomation] Archive event failed:', error.message);
    }
  }

  async _handleApproved(contribution, review, data = {}) {
    const volunteerId = contribution.submittedBy._id || contribution.submittedBy;
    const coinsAwarded = data.coinsAwarded || 0;

    console.log(`[ContributionAutomation] _handleApproved START — volunteer: ${volunteerId}, coins: ${coinsAwarded}, contribution: ${contribution._id}`);

    const contributionReward = await contributionRewardRepository.create({
      contributionRewardId: `CR-${Date.now().toString(36).toUpperCase()}-${uuidv4().substring(0, 8).toUpperCase()}`,
      userId: volunteerId,
      contributionId: contribution._id,
      reviewId: review._id,
      coinsAwarded,
      badgeAwarded: data.badgeAwarded || null,
      status: 'pending',
    });

    console.log(`[ContributionAutomation] contributionReward created: ${contributionReward._id}`);

    try {
      // 1. Create transaction record
      const rewardTransaction = await rewardTransactionRepository.create({
        transactionId: `TXN-${Date.now().toString(36).toUpperCase()}-${uuidv4().substring(0, 8).toUpperCase()}`,
        user: volunteerId,
        type: TRANSACTION_TYPE.EARNED,
        reason: `Contribution reward for "${contribution.title}"`,
        coins: coinsAwarded,
        points: 0,
        impact: 0,
      });

      console.log(`[ContributionAutomation] rewardTransaction created: ${rewardTransaction._id}`);

      await contributionRewardRepository.updateTransaction(contributionReward._id, rewardTransaction._id);

      // 2. Update the Reward profile (upsert — create it if volunteer has none yet)
      if (coinsAwarded > 0) {
        await rewardRepository.incrementCoins(volunteerId, coinsAwarded);
        console.log(`[ContributionAutomation] rewardRepository.incrementCoins done`);

        // 3. Credit coins directly on the User document
        try {
          const userUpdateResult = await User.updateOne(
            { _id: volunteerId.toString() },
            { $inc: { coins: coinsAwarded } }
          );
          console.log(`[ContributionAutomation] User.coins incremented — matchedCount: ${userUpdateResult?.matchedCount}, modifiedCount: ${userUpdateResult?.modifiedCount}`);
        } catch (userUpdateError) {
          console.error(`[ContributionAutomation] User.coins increment FAILED:`, userUpdateError.message);
          // Don't throw — reward profile is already updated, this is a sync issue
        }
      }
    } catch (error) {
      console.error(`[ContributionAutomation] _handleApproved coin crediting FAILED:`, error.message, error.stack);
      await contributionRewardRepository.updateStatus(contributionReward._id, 'failed', error.message);
      throw error;
    }

    await contributionRewardRepository.updateStatus(contributionReward._id, 'completed');
    console.log(`[ContributionAutomation] contributionReward marked completed`);

    await this._createActivityTimeline(volunteerId, 'contribution_approved', 'contribution', contribution._id, {
      title: 'Contribution Approved',
      description: `Your contribution "${contribution.title}" has been approved.${coinsAwarded > 0 ? ` You earned ${coinsAwarded} coins.` : ''}`,
      contributionId: contribution._id,
      coinsEarned: coinsAwarded,
      reviewId: review._id,
    });

    await this._createPortfolioEntry(contribution, review, coinsAwarded);

    await this._updateContributionStatistics(volunteerId, contribution, 'approved');

    await this._createAnalyticsEvent('contribution_approved', 'contribution', contribution._id, volunteerId, {
      reviewerId: review.reviewedBy,
      category: contribution.category,
      contributionType: contribution.contributionType,
      coins: coinsAwarded,
      badge: data.badgeAwarded,
      timeToReview: review.reviewedAt ? new Date(review.reviewedAt) - new Date(contribution.createdAt) : 0,
    });

    if (data.badgeAwarded) {
      try {
        await gamificationService.evaluateBadges(volunteerId);
      } catch (_error) {
        console.error('[ContributionAutomation] Badge evaluation failed:', _error.message);
      }
    }



    try {
      await gamificationService.evaluateAll(volunteerId);
    } catch (_error) {
      console.error('[ContributionAutomation] Gamification evaluation failed:', _error.message);
    }

    console.log(`[ContributionAutomation] Approved event processed for contribution ${contribution._id}`);
  }

  async _handleRejected(contribution, review, data = {}) {
    const volunteerId = contribution.submittedBy._id || contribution.submittedBy;

    await this._createActivityTimeline(volunteerId, 'contribution_rejected', 'contribution', contribution._id, {
      title: 'Contribution Rejected',
      description: `Your contribution "${contribution.title}" has been rejected.${data.reason ? ` Reason: ${data.reason}` : ''}`,
      contributionId: contribution._id,
      reviewId: review._id,
      reason: data.reason,
    });

    await this._updateContributionStatistics(volunteerId, contribution, 'rejected');

    await this._createAnalyticsEvent('contribution_rejected', 'contribution', contribution._id, volunteerId, {
      reviewerId: review.reviewedBy,
      category: contribution.category,
      contributionType: contribution.contributionType,
      reason: data.reason,
      timeToReview: review.reviewedAt ? new Date(review.reviewedAt) - new Date(contribution.createdAt) : 0,
    });

    console.log(`[ContributionAutomation] Rejected event processed for contribution ${contribution._id}`);
  }

  async _handleNeedsChanges(contribution, review, data = {}) {
    const volunteerId = contribution.submittedBy._id || contribution.submittedBy;

    await this._createActivityTimeline(volunteerId, 'contribution_needs_changes', 'contribution', contribution._id, {
      title: 'Changes Requested',
      description: `Your contribution "${contribution.title}" needs changes.${data.feedback ? ` Feedback: ${data.feedback}` : ''}`,
      contributionId: contribution._id,
      reviewId: review._id,
      feedback: data.feedback,
    });

    await this._createAnalyticsEvent('contribution_needs_changes', 'contribution', contribution._id, volunteerId, {
      reviewerId: review.reviewedBy,
      category: contribution.category,
      contributionType: contribution.contributionType,
      feedback: data.feedback,
      timeToReview: review.reviewedAt ? new Date(review.reviewedAt) - new Date(contribution.createdAt) : 0,
    });

    console.log(`[ContributionAutomation] Needs changes event processed for contribution ${contribution._id}`);
  }

  async _createActivityTimeline(userId, action, entityType, entityId, metadata = {}) {
    const timeline = await activityTimelineRepository.create({
      timelineId: `TL-${Date.now().toString(36).toUpperCase()}-${uuidv4().substring(0, 8).toUpperCase()}`,
      userId,
      action,
      entityType,
      entityId,
      title: metadata.title || action,
      description: metadata.description || '',
      metadata,
    });

    return timeline;
  }

  async _createPortfolioEntry(contribution, review, coinsEarned) {
    const volunteerId = contribution.submittedBy._id || contribution.submittedBy;
    const existing = await portfolioRepository.findByContribution(contribution._id);

    if (existing) {
      await portfolioRepository.updateFeatured(contribution._id, true);
      return existing;
    }

    const currentVersion = contribution.currentVersion;
    let thumbnailUrl = '';
    let publicUrl = '';

    if (currentVersion && currentVersion.files && currentVersion.files.length > 0) {
      const primaryFile = currentVersion.files.find((f) => f.isPrimary) || currentVersion.files[0];
      thumbnailUrl = primaryFile.thumbnailUrl || primaryFile.previewUrl || primaryFile.publicUrl || '';
      publicUrl = primaryFile.publicUrl || '';
    }

    const portfolio = await portfolioRepository.create({
      portfolioId: `PF-${Date.now().toString(36).toUpperCase()}-${uuidv4().substring(0, 8).toUpperCase()}`,
      userId: volunteerId,
      contributionId: contribution._id,
      contributionVersionId: currentVersion || null,
      title: contribution.title,
      description: contribution.description,
      category: contribution.category,
      contributionType: contribution.contributionType,
      thumbnailUrl,
      publicUrl,
      coinsEarned,
      featured: true,
    });

    return portfolio;
  }

  async _updateContributionStatistics(userId, contribution, status) {
    const stats = await contributionStatisticsRepository.findByUser(userId);

    if (!stats) {
      await contributionStatisticsRepository.create({
        statisticsId: `CS-${Date.now().toString(36).toUpperCase()}-${uuidv4().substring(0, 8).toUpperCase()}`,
        userId,
        totalContributions: 1,
        approvedContributions: status === 'approved' ? 1 : 0,
        rejectedContributions: status === 'rejected' ? 1 : 0,
        pendingContributions: status === 'pending' ? 1 : 0,
        draftContributions: status === 'draft' ? 1 : 0,
        needsChangesContributions: status === 'needs_changes' ? 1 : 0,
        categoryCounts: { [contribution.category]: 1 },
        totalHoursContributed: contribution.hoursWorked || 0,
        lastContributionAt: new Date(),
      });
    } else {
      const updateData = {
        totalContributions: (stats.totalContributions || 0) + 1,
        lastContributionAt: new Date(),
      };

      if (status === 'approved') {
        updateData.approvedContributions = (stats.approvedContributions || 0) + 1;
      } else if (status === 'rejected') {
        updateData.rejectedContributions = (stats.rejectedContributions || 0) + 1;
      } else if (status === 'pending') {
        updateData.pendingContributions = (stats.pendingContributions || 0) + 1;
      } else if (status === 'needs_changes') {
        updateData.needsChangesContributions = (stats.needsChangesContributions || 0) + 1;
      }

      const categoryCounts = { ...(stats.categoryCounts || {}) };
      categoryCounts[contribution.category] = (categoryCounts[contribution.category] || 0) + 1;
      updateData.categoryCounts = categoryCounts;
      updateData.totalHoursContributed = (stats.totalHoursContributed || 0) + (contribution.hoursWorked || 0);

      await contributionStatisticsRepository.update(userId, updateData);
    }
  }

  async _createAnalyticsEvent(eventType, entityType, entityId, userId, metadata = {}) {
    const analyticsEvent = await analyticsEventRepository.create({
      eventId: `AE-${Date.now().toString(36).toUpperCase()}-${uuidv4().substring(0, 8).toUpperCase()}`,
      eventType,
      entityType,
      entityId,
      userId,
      reviewerId: metadata.reviewerId || null,
      category: metadata.category || null,
      contributionType: metadata.contributionType || null,
      status: metadata.status || null,
      coins: metadata.coins || 0,
      badge: metadata.badge || null,
      timeToReview: metadata.timeToReview || 0,
      metadata,
    });

    return analyticsEvent;
  }
}

const contributionAutomation = new ContributionAutomation();

const initializeContributionAutomation = () => {
  console.log('[ContributionAutomation] Initialized');
  return contributionAutomation;
};

module.exports = {
  contributionAutomation,
  initializeContributionAutomation,
};
