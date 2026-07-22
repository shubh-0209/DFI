const applicationService = require('../application/application.service');
const { successResponse } = require('../../utils/response');

class VerificationController {
  confirmBeneficiary = async (req, res, next) => {
    try {
      const { token } = req.params;
      const { response } = req.query; // 'yes' or 'no'
      const result = await applicationService.confirmBeneficiaryVerification(token, response);
      return successResponse(res, 200, 'Beneficiary verification updated successfully', result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new VerificationController();
