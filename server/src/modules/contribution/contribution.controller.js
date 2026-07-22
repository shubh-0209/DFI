const contributionService = require('./contribution.service');
const { successResponse } = require('../../utils/response');

class ContributionController {
  async createContribution(req, res, next) {
    try {
      const result = await contributionService.createDraft(req.user.id, req.body);
      return successResponse(res, 201, result.message, { contribution: result.contribution });
    } catch (error) {
      return next(error);
    }
  }

  async submitContribution(req, res, next) {
    try {
      const result = await contributionService.submitContribution(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, { contribution: result.contribution });
    } catch (error) {
      return next(error);
    }
  }

  async updateContribution(req, res, next) {
    try {
      const { files, ...data } = req.body;
      const result = await contributionService.saveDraft(req.params.id, req.user.id, data, files || []);
      return successResponse(res, 200, result.message, { contribution: result.contribution, version: result.version });
    } catch (error) {
      return next(error);
    }
  }

  async deleteContribution(req, res, next) {
    try {
      const result = await contributionService.deleteDraft(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, {});
    } catch (error) {
      return next(error);
    }
  }

  async getMyContributions(req, res, next) {
    try {
      const result = await contributionService.getMyContributions(req.user.id, req.query);
      return successResponse(res, 200, result.message, {
        contributions: result.contributions,
        pagination: result.pagination,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getContribution(req, res, next) {
    try {
      const result = await contributionService.getContribution(req.params.id, req.user.id, req.user.role);
      return successResponse(res, 200, result.message, { contribution: result.contribution });
    } catch (error) {
      return next(error);
    }
  }

  async getVersionHistory(req, res, next) {
    try {
      const result = await contributionService.getVersionHistory(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, { versions: result.versions });
    } catch (error) {
      return next(error);
    }
  }

  async getContributionReviews(req, res, next) {
    try {
      const result = await contributionService.getContributionReviews(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, { reviews: result.reviews });
    } catch (error) {
      return next(error);
    }
  }

  async getAdminContributions(req, res, next) {
    try {
      const result = await contributionService.getAdminContributions(req.query);
      return successResponse(res, 200, result.message, {
        contributions: result.contributions,
        pagination: result.pagination,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getAdminContributionDetail(req, res, next) {
    try {
      const result = await contributionService.getAdminContributionDetail(req.params.id);
      return successResponse(res, 200, result.message, {
        contribution: result.contribution,
        reviews: result.reviews,
      });
    } catch (error) {
      return next(error);
    }
  }

  async reviewContribution(req, res, next) {
    try {
      const { action, coinsAwarded, badgeAwarded, reason, feedback, internalNotes } = req.body;
      const result = await contributionService.reviewContribution(
        req.params.id,
        req.user.id,
        action,
        { coinsAwarded, badgeAwarded, reason, feedback, internalNotes }
      );
      return successResponse(res, 200, result.message, {
        contribution: result.contribution,
        review: result.review,
      });
    } catch (error) {
      return next(error);
    }
  }

  async featureContribution(req, res, next) {
    try {
      const result = await contributionService.featureContribution(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, { contribution: result.contribution });
    } catch (error) {
      return next(error);
    }
  }

  async archiveContribution(req, res, next) {
    try {
      const result = await contributionService.archiveContribution(req.params.id, req.user.id);
      return successResponse(res, 200, result.message, { contribution: result.contribution });
    } catch (error) {
      return next(error);
    }
  }

  async getReviewHistory(req, res, next) {
    try {
      const result = await contributionService.getReviewHistory(req.query);
      return successResponse(res, 200, result.message, {
        reviews: result.reviews,
        pagination: result.pagination,
      });
    } catch (error) {
      return next(error);
    }
  }

  async uploadFiles(req, res, next) {
    try {
      const result = await contributionService.uploadContributionFiles(
        req.params.id,
        req.user.id,
        req.files || []
      );
      return successResponse(res, 200, result.message, {
        files: result.files,
        version: result.version,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getTimeline(req, res, next) {
    try {
      const timeline = await contributionService.getTimeline();
      return successResponse(res, 200, 'Contribution timeline retrieved successfully', { timeline });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new ContributionController();

