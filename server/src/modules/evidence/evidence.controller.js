const applicationService = require('../application/application.service');
const { successResponse } = require('../../utils/response');

class EvidenceController {
  submitEvidence = async (req, res, next) => {
    try {
      const result = await applicationService.submitEvidence(req.user.id, req.params.id, req.body);
      return successResponse(res, 200, 'Evidence submitted successfully', result);
    } catch (error) {
      return next(error);
    }
  };

  submitEventEvidence = async (req, res, next) => {
    try {
      const result = await applicationService.submitEventEvidence(req.user.id, req.params.id, req.body);
      return successResponse(res, 200, 'Event evidence submitted successfully', result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new EvidenceController();
