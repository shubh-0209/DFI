const contributionRepository = require('./contribution.repository');
const { generateContributionId, contributionFormatter, versionFormatter } = require('./contribution.utils');
const { STATUS, REVIEW_ACTION, MESSAGES, DEFAULTS } = require('./contribution.constants');
const { NotFoundError, ValidationError, ConflictError, AuthorizationError } = require('../../utils/errors');
const notificationService = require('../notification/notification.service');
const { contributionAutomation } = require('./contribution.automation');
const uploadService = require('./upload.service');
const User = require('../user/user.model');
const ROLES = require('../../constants/roles.constants');

class ContributionService {
  async createDraft(userId, data) {
    const contribution = await contributionRepository.create({
      contributionId: generateContributionId(),
      title: data.title || '',
      description: data.description || '',
      category: data.category || DEFAULTS.CATEGORY,
      contributionType: data.contributionType || DEFAULTS.CONTRIBUTION_TYPE,
      status: STATUS.DRAFT,
      submittedBy: userId,
      skillsUsed: data.skillsUsed || [],
      hoursWorked: data.hoursWorked || 0,
      tags: data.tags || [],
      visibility: data.visibility || DEFAULTS.VISIBILITY,
      metadata: data.metadata || {},
    });

    try {
      await notificationService.sendInAppNotification('buildProfileUpdated', {
        recipientId: userId,
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    const populated = await contributionRepository.findById(contribution._id);

    return {
      contribution: contributionFormatter(populated),
      message: MESSAGES.DRAFT_SAVED,
    };
  }

  async saveDraft(contributionId, userId, data, files = []) {
    const contribution = await contributionRepository.findByContributionId(contributionId);

    if (!contribution) {
      throw new NotFoundError(MESSAGES.CONTRIBUTION_NOT_FOUND);
    }

    const ownerId = contribution.submittedBy._id || contribution.submittedBy;
    if (ownerId.toString() !== userId.toString()) {
      throw new AuthorizationError('You can only edit your own contributions');
    }

    if (contribution.status === STATUS.PENDING || contribution.status === STATUS.UNDER_REVIEW) {
      throw new ValidationError(MESSAGES.CANNOT_EDIT_SUBMITTED);
    }

    if (contribution.status === STATUS.APPROVED || contribution.status === STATUS.REJECTED) {
      throw new ValidationError(MESSAGES.CANNOT_EDIT_SUBMITTED);
    }

    const versionNumber = contribution.versions.length + 1;

    const versionData = {
      contributionId: contribution._id,
      versionNumber,
      uploadedBy: userId,
      files: files || [],
      githubUrl: data.githubUrl || null,
      figmaUrl: data.figmaUrl || null,
      canvaUrl: data.canvaUrl || null,
      googleDriveUrl: data.googleDriveUrl || null,
      notes: data.notes || '',
    };

    const version = await contributionRepository.createVersion(versionData);

    await contributionRepository.addVersionToContribution(contribution._id, version._id);
    await contributionRepository.updateCurrentVersion(contribution._id, version._id);

    const updatedContribution = await contributionRepository.update(contribution._id, {
      title: data.title || contribution.title,
      description: data.description || contribution.description,
      category: data.category || contribution.category,
      contributionType: data.contributionType || contribution.contributionType,
      skillsUsed: data.skillsUsed || contribution.skillsUsed,
      hoursWorked: data.hoursWorked || contribution.hoursWorked,
      tags: data.tags || contribution.tags,
      visibility: data.visibility || contribution.visibility,
    });

    try {
      await notificationService.sendInAppNotification('buildProfileUpdated', {
        recipientId: userId,
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    const populated = await contributionRepository.findById(updatedContribution._id);

    return {
      contribution: contributionFormatter(populated),
      version: versionFormatter(version),
      message: MESSAGES.VERSION_CREATED,
    };
  }

  async submitContribution(contributionId, userId) {
    const contribution = await contributionRepository.findByContributionId(contributionId);

    if (!contribution) {
      throw new NotFoundError(MESSAGES.CONTRIBUTION_NOT_FOUND);
    }

    const ownerId = contribution.submittedBy._id || contribution.submittedBy;
    if (ownerId.toString() !== userId.toString()) {
      throw new AuthorizationError('You can only submit your own contributions');
    }

    if (contribution.status !== STATUS.DRAFT && contribution.status !== STATUS.NEEDS_CHANGES) {
      throw new ValidationError('Only draft or needs_changes contributions can be submitted');
    }

    const hasFiles = contribution.currentVersion && contribution.currentVersion.files && contribution.currentVersion.files.length > 0;
    const hasLinks = (
      (contribution.currentVersion && contribution.currentVersion.githubUrl) ||
      (contribution.currentVersion && contribution.currentVersion.figmaUrl) ||
      (contribution.currentVersion && contribution.currentVersion.canvaUrl) ||
      (contribution.currentVersion && contribution.currentVersion.googleDriveUrl)
    );

    if (!hasFiles && !hasLinks) {
      throw new ValidationError('At least one file or external link is required to submit');
    }

    if (!contribution.title || contribution.title.trim() === '') {
      throw new ValidationError('Title is required');
    }

    if (!contribution.description || contribution.description.trim() === '') {
      throw new ValidationError('Description is required');
    }

    if (!contribution.category) {
      throw new ValidationError('Category is required');
    }

    const duplicateSubmission = await contributionRepository.existsByTitleAndUser(
      contribution.title,
      userId,
      contribution._id
    );

    if (duplicateSubmission) {
      throw new ConflictError(MESSAGES.DUPLICATE_SUBMISSION);
    }

    const updatedContribution = await contributionRepository.update(contribution._id, {
      status: STATUS.PENDING,
    });

    try {
      const adminUsers = await User.find({ role: { $in: [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR, ROLES.REVIEWER] } });
      const admins = adminUsers.map((u) => u._id);
      for (const adminId of admins) {
        await notificationService.sendInAppNotification('buildAdminAnnouncement', {
          recipientId: adminId,
          title: 'New Contribution Submitted',
          message: `A new contribution "${contribution.title}" has been submitted for review.`,
        });
      }
    } catch (_error) {
      // Notification failure is non-blocking
    }

    const populated = await contributionRepository.findById(updatedContribution._id);

    return {
      contribution: contributionFormatter(populated),
      message: MESSAGES.CONTRIBUTION_CREATED,
    };
  }

  async getMyContributions(userId, queryParams = {}) {
    const { page = 1, limit = 10, status } = queryParams;

    const filters = {};
    if (status && status !== '') {
      filters.status = status;
    }

    const result = await contributionRepository.findMyContributions(userId, filters, {
      page: Number(page),
      limit: Number(limit),
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    const totalPages = Math.ceil(result.total / result.limit);

    return {
      contributions: result.contributions.map(contributionFormatter),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages,
        hasNextPage: result.page < totalPages,
        hasPreviousPage: result.page > 1,
      },
      message: MESSAGES.CONTRIBUTIONS_FETCHED,
    };
  }

  async getContribution(contributionId, userId, userRole) {
    const contribution = await contributionRepository.findByContributionId(contributionId);

    if (!contribution) {
      throw new NotFoundError(MESSAGES.CONTRIBUTION_NOT_FOUND);
    }

    const ownerId = contribution.submittedBy._id || contribution.submittedBy;
    const isAdmin = [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR, ROLES.REVIEWER].includes(userRole);

    if (!isAdmin && ownerId.toString() !== userId.toString()) {
      throw new NotFoundError(MESSAGES.CONTRIBUTION_NOT_FOUND);
    }

    return {
      contribution: contributionFormatter(contribution),
      message: MESSAGES.CONTRIBUTION_FETCHED,
    };
  }

  async getVersionHistory(contributionId, userId) {
    const contribution = await contributionRepository.findByContributionId(contributionId);

    if (!contribution) {
      throw new NotFoundError(MESSAGES.CONTRIBUTION_NOT_FOUND);
    }

    const ownerId = contribution.submittedBy._id || contribution.submittedBy;
    if (ownerId.toString() !== userId.toString()) {
      throw new NotFoundError(MESSAGES.CONTRIBUTION_NOT_FOUND);
    }

    const versions = await contributionRepository.findVersionsByContribution(contribution._id);

    return {
      versions: versions.map(versionFormatter),
      message: MESSAGES.CONTRIBUTIONS_FETCHED,
    };
  }

  async getContributionReviews(contributionId, userId) {
    const contribution = await contributionRepository.findByContributionId(contributionId);

    if (!contribution) {
      throw new NotFoundError(MESSAGES.CONTRIBUTION_NOT_FOUND);
    }

    const ownerId = contribution.submittedBy._id || contribution.submittedBy;
    if (ownerId.toString() !== userId.toString()) {
      throw new NotFoundError(MESSAGES.CONTRIBUTION_NOT_FOUND);
    }

    const reviews = await contributionRepository.findReviewsByContribution(contribution._id);

    return {
      reviews: reviews.map((review) => ({
        _id: review._id,
        action: review.action,
        coinsAwarded: review.coinsAwarded,
        badgeAwarded: review.badgeAwarded,
        reason: review.reason,
        feedback: review.feedback,
        reviewedBy: review.reviewedBy,
        reviewedAt: review.reviewedAt,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      })),
      message: MESSAGES.CONTRIBUTIONS_FETCHED,
    };
  }

  async deleteDraft(contributionId, userId) {
    const contribution = await contributionRepository.findByContributionId(contributionId);

    if (!contribution) {
      throw new NotFoundError(MESSAGES.CONTRIBUTION_NOT_FOUND);
    }

    const ownerId = contribution.submittedBy._id || contribution.submittedBy;
    if (ownerId.toString() !== userId.toString()) {
      throw new AuthorizationError('You can only delete your own contributions');
    }

    if (contribution.status !== STATUS.DRAFT) {
      throw new ValidationError(MESSAGES.CANNOT_DELETE_SUBMITTED);
    }

    await contributionRepository.softDelete(contribution._id, userId);

    return {
      message: MESSAGES.CONTRIBUTION_DELETED,
    };
  }

  async getAdminContributions(query = {}) {
    const { page = 1, limit = 10, status, category, contributionType, submittedBy, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const filters = {};
    if (status && status !== '') filters.status = status;
    if (category && category !== '') filters.category = category;
    if (contributionType && contributionType !== '') filters.contributionType = contributionType;
    if (submittedBy && submittedBy !== '') filters.submittedBy = submittedBy;
    if (search && search.trim() !== '') filters.search = search.trim();

    const result = await contributionRepository.findAdminContributions(filters, {
      page: Number(page),
      limit: Number(limit),
      sortBy,
      sortOrder,
    });

    const totalPages = Math.ceil(result.total / result.limit);

    return {
      contributions: result.contributions.map(contributionFormatter),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages,
        hasNextPage: result.page < totalPages,
        hasPreviousPage: result.page > 1,
      },
      message: MESSAGES.CONTRIBUTIONS_FETCHED,
    };
  }

  async getAdminContributionDetail(contributionId) {
    const contribution = await contributionRepository.findByIdWithVersions(contributionId);

    if (!contribution || contribution.isDeleted) {
      throw new NotFoundError(MESSAGES.CONTRIBUTION_NOT_FOUND);
    }

    const reviews = await contributionRepository.findReviewsByContribution(contribution._id);

    return {
      contribution: contributionFormatter(contribution),
      reviews: reviews.map((review) => ({
        _id: review._id,
        action: review.action,
        coinsAwarded: review.coinsAwarded,
        badgeAwarded: review.badgeAwarded,
        reason: review.reason,
        feedback: review.feedback,
        internalNotes: review.internalNotes,
        reviewedBy: review.reviewedBy,
        reviewedAt: review.reviewedAt,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      })),
      message: MESSAGES.CONTRIBUTION_FETCHED,
    };
  }

  async reviewContribution(contributionId, reviewerId, action, data = {}) {
    const contribution = await contributionRepository.findByContributionId(contributionId);

    if (!contribution) {
      throw new NotFoundError(MESSAGES.CONTRIBUTION_NOT_FOUND);
    }

    if (contribution.isDeleted) {
      throw new NotFoundError(MESSAGES.CONTRIBUTION_NOT_FOUND);
    }

    const validActions = Object.values(REVIEW_ACTION);
    if (!validActions.includes(action)) {
      throw new ValidationError(MESSAGES.INVALID_REVIEW_ACTION);
    }

    if (contribution.status === STATUS.UNDER_REVIEW) {
      const existingReview = await contributionRepository.findReviewsByContribution(contribution._id);
      const activeReview = existingReview.find(
        (r) => r.action === REVIEW_ACTION.APPROVED || r.action === REVIEW_ACTION.NEEDS_CHANGES
      );
      if (activeReview) {
        throw new ValidationError(MESSAGES.ALREADY_UNDER_REVIEW);
      }
    }

    const reviewData = {
      contributionId: contribution._id,
      versionId: contribution.currentVersion || null,
      reviewedBy: reviewerId,
      action,
      coinsAwarded: data.coinsAwarded || 0,
      badgeAwarded: data.badgeAwarded || null,
      reason: data.reason || null,
      feedback: data.feedback || null,
      internalNotes: data.internalNotes || null,
      reviewedAt: new Date(),
    };

    const review = await contributionRepository.createReview(reviewData);

    let newStatus = contribution.status;
    switch (action) {
      case REVIEW_ACTION.APPROVED:
        newStatus = STATUS.APPROVED;
        break;
      case REVIEW_ACTION.REJECTED:
        newStatus = STATUS.REJECTED;
        break;
      case REVIEW_ACTION.NEEDS_CHANGES:
        newStatus = STATUS.NEEDS_CHANGES;
        break;
      default:
        newStatus = STATUS.PENDING;
    }

    let updatedContribution = await contributionRepository.updateStatus(contribution._id, newStatus);

    if (action === REVIEW_ACTION.APPROVED && data.coinsAwarded > 0) {
      updatedContribution = await contributionRepository.update(contribution._id, {
        totalCoinsAwarded: (contribution.totalCoinsAwarded || 0) + data.coinsAwarded,
      });
    }

    // Fire notification in the background — do NOT await it, it's non-critical
    // and was the main cause of slow approval responses.
    setImmediate(() => {
      const volunteerId = contribution.submittedBy._id || contribution.submittedBy;
      let notificationTitle = 'Contribution Updated';
      let notificationMessage = `Your contribution "${contribution.title}" has been updated.`;

      if (action === REVIEW_ACTION.APPROVED) {
        notificationTitle = 'Contribution Approved';
        notificationMessage = `Congratulations! Your contribution "${contribution.title}" has been approved.`;
      } else if (action === REVIEW_ACTION.REJECTED) {
        notificationTitle = 'Contribution Rejected';
        notificationMessage = `Your contribution "${contribution.title}" has been rejected. ${data.reason ? 'Reason: ' + data.reason : ''}`;
      } else if (action === REVIEW_ACTION.NEEDS_CHANGES) {
        notificationTitle = 'Changes Requested';
        notificationMessage = `Your contribution "${contribution.title}" needs changes. ${data.feedback || 'Please review the feedback.'}`;
      }

      notificationService.createNotification({
        recipient: volunteerId,
        title: notificationTitle,
        message: notificationMessage,
        type: 'contribution_review',
        category: 'contribution',
        priority: action === REVIEW_ACTION.APPROVED ? 'high' : 'medium',
        channel: 'in-app',
        status: 'sent',
        relatedEntityType: 'contribution',
        relatedEntityId: contribution._id,
        metadata: {
          contributionId: contribution._id,
          action,
          coinsAwarded: data.coinsAwarded || 0,
          badgeAwarded: data.badgeAwarded,
        },
      }).catch((_error) => {
        /* eslint-disable-next-line no-console */
        console.error('[ContributionService] Notification failed:', _error.message);
      });
    });

    // Fire automation in the background — already fire-and-forget
    contributionAutomation.handleReviewEvent(updatedContribution, review, action, {
      coinsAwarded: data.coinsAwarded || 0,
      badgeAwarded: data.badgeAwarded,
      reason: data.reason,
      feedback: data.feedback,
    }).catch((_automationError) => {
      /* eslint-disable-next-line no-console */
      console.error('[ContributionService] Review automation failed:', _automationError.message);
    });

    // Use updatedContribution directly — no need for another round-trip to Supabase
    // just to re-fetch what we already have.
    const formatted = contributionFormatter(updatedContribution);

    return {
      contribution: formatted,
      review: {
        _id: review._id,
        action: review.action,
        coinsAwarded: review.coinsAwarded,
        badgeAwarded: review.badgeAwarded,
        reason: review.reason,
        feedback: review.feedback,
        internalNotes: review.internalNotes,
        reviewedBy: review.reviewedBy,
        reviewedAt: review.reviewedAt,
        createdAt: review.createdAt,
      },
      message: action === REVIEW_ACTION.APPROVED
        ? MESSAGES.CONTRIBUTION_APPROVED
        : action === REVIEW_ACTION.REJECTED
          ? MESSAGES.CONTRIBUTION_REJECTED
          : MESSAGES.CONTRIBUTION_MARKED_NEEDS_CHANGES,
    };
  }

  async featureContribution(contributionId, reviewerId) {
    const contribution = await contributionRepository.findByContributionId(contributionId);

    if (!contribution) {
      throw new NotFoundError(MESSAGES.CONTRIBUTION_NOT_FOUND);
    }

    if (contribution.isDeleted) {
      throw new NotFoundError(MESSAGES.CONTRIBUTION_NOT_FOUND);
    }

    if (contribution.status !== STATUS.APPROVED) {
      throw new ValidationError('Only approved contributions can be featured');
    }

    const updatedContribution = await contributionRepository.updateFeature(contribution._id, true);
    await contributionRepository.updateVisibility(contribution._id, 'featured');

    // Fire notification in background
    setImmediate(() => {
      const volunteerId = contribution.submittedBy._id || contribution.submittedBy;
      notificationService.createNotification({
        recipient: volunteerId,
        title: 'Contribution Featured',
        message: `Congratulations! Your contribution "${contribution.title}" has been featured.`,
        type: 'contribution_featured',
        category: 'contribution',
        priority: 'high',
        channel: 'in-app',
        status: 'sent',
        relatedEntityType: 'contribution',
        relatedEntityId: contribution._id,
        metadata: { contributionId: contribution._id, featuredBy: reviewerId },
      }).catch(() => {});
    });

    // Fire automation in the background
    contributionAutomation.handleFeatureEvent(updatedContribution, reviewerId).catch((_automationError) => {
      /* eslint-disable-next-line no-console */
      console.error('[ContributionService] Feature automation failed:', _automationError.message);
    });

    return {
      contribution: contributionFormatter(updatedContribution),
      message: MESSAGES.CONTRIBUTION_FEATURED,
    };
  }

  async archiveContribution(contributionId, reviewerId) {
    const contribution = await contributionRepository.findByContributionId(contributionId);

    if (!contribution) {
      throw new NotFoundError(MESSAGES.CONTRIBUTION_NOT_FOUND);
    }

    if (contribution.isDeleted) {
      throw new NotFoundError(MESSAGES.CONTRIBUTION_NOT_FOUND);
    }

    const updatedContribution = await contributionRepository.updateStatus(contribution._id, STATUS.ARCHIVED);
    await contributionRepository.updateVisibility(contribution._id, 'private');

    // Fire notification in background
    setImmediate(() => {
      const volunteerId = contribution.submittedBy._id || contribution.submittedBy;
      notificationService.createNotification({
        recipient: volunteerId,
        title: 'Contribution Archived',
        message: `Your contribution "${contribution.title}" has been archived.`,
        type: 'contribution_archived',
        category: 'contribution',
        priority: 'medium',
        channel: 'in-app',
        status: 'sent',
        relatedEntityType: 'contribution',
        relatedEntityId: contribution._id,
        metadata: { contributionId: contribution._id, archivedBy: reviewerId },
      }).catch(() => {});
    });

    // Fire automation in the background
    contributionAutomation.handleArchiveEvent(updatedContribution, reviewerId).catch((_automationError) => {
      /* eslint-disable-next-line no-console */
      console.error('[ContributionService] Archive automation failed:', _automationError.message);
    });

    return {
      contribution: contributionFormatter(updatedContribution),
      message: MESSAGES.CONTRIBUTION_ARCHIVED,
    };
  }

  async getReviewHistory(query = {}) {
    const { page = 1, limit = 10, reviewedBy, contributionId } = query;

    const result = await contributionRepository.findReviewHistory({
      page: Number(page),
      limit: Number(limit),
      reviewedBy,
      contributionId,
    });

    const totalPages = Math.ceil(result.total / result.limit);

    return {
      reviews: result.reviews.map((review) => ({
        _id: review._id,
        contributionId: review.contributionId,
        versionId: review.versionId,
        action: review.action,
        coinsAwarded: review.coinsAwarded,
        badgeAwarded: review.badgeAwarded,
        reason: review.reason,
        feedback: review.feedback,
        internalNotes: review.internalNotes,
        reviewedBy: review.reviewedBy,
        reviewedAt: review.reviewedAt,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      })),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages,
        hasNextPage: result.page < totalPages,
        hasPreviousPage: result.page > 1,
      },
      message: MESSAGES.CONTRIBUTIONS_FETCHED,
    };
  }
  async uploadContributionFiles(contributionId, userId, files = []) {
    const contribution = await contributionRepository.findByContributionId(contributionId);

    if (!contribution) {
      throw new NotFoundError(MESSAGES.CONTRIBUTION_NOT_FOUND);
    }

    const ownerId = contribution.submittedBy._id || contribution.submittedBy;
    if (ownerId.toString() !== userId.toString()) {
      throw new AuthorizationError('You can only upload files to your own contributions');
    }

    if (!files || files.length === 0) {
      throw new ValidationError('No files provided', [{ field: 'files', message: 'No files provided' }]);
    }

    // Upload files to Cloudinary via the upload service
    const uploadedFiles = await uploadService.uploadMultipleFiles(files, userId, {
      contributionId: contribution._id,
    });

    // Build structured file metadata for the version
    const fileMetadata = uploadedFiles.map((f) => ({
      originalName: f.originalName,
      storageKey: f.storageKey,
      publicUrl: f.publicUrl,
      mimeType: f.mimeType,
      size: f.size,
    }));

    // Create a new version with these files
    const versionNumber = (contribution.versions || []).length + 1;
    const version = await contributionRepository.createVersion({
      contributionId: contribution._id,
      versionNumber,
      uploadedBy: userId,
      files: fileMetadata,
    });

    await contributionRepository.addVersionToContribution(contribution._id, version._id);
    await contributionRepository.updateCurrentVersion(contribution._id, version._id);

    return {
      files: fileMetadata,
      version: versionFormatter(version),
      message: 'Files uploaded successfully',
    };
  }

  async getTimeline() {
    return [
      { stage: 'Register', icon: 'UserPlus', description: 'Create your volunteer profile and set your interests.' },
      { stage: 'Choose Category', icon: 'FolderOpen', description: 'Pick a contribution category that matches your skills.' },
      { stage: 'Create Contribution', icon: 'PlusCircle', description: 'Upload your work with title, description, and files.' },
      { stage: 'Submit for Review', icon: 'Send', description: 'Send your contribution for NGO partner verification.' },
      { stage: 'Get Verified', icon: 'ShieldCheck', description: 'Partner reviews and approves your contribution.' },
      { stage: 'Earn Rewards', icon: 'Award', description: 'Receive coins, badges, and certificates for your work.' },
    ];
  }
}

module.exports = new ContributionService();
