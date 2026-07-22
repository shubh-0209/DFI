const certificateService = require('./certificate.service');
const { MESSAGES } = require('./certificate.constants');
const { successResponse } = require('../../utils/response');

class CertificateController {
  generateCertificate = async (req, res, next) => {
    try {
      const { programId, applicationId, attendanceId, volunteerHours } = req.body;
      const certificate = await certificateService.generateCertificate(
        req.user.id,
        programId,
        { applicationId, attendanceId, volunteerHours },
        req.user.id,
        `${req.protocol}://${req.get('host')}`
      );
      return successResponse(res, 201, MESSAGES.CERTIFICATE_GENERATED, certificate);
    } catch (error) {
      return next(error);
    }
  };

  autoGenerateForProgram = async (req, res, next) => {
    try {
      const { programId } = req.params;
      const results = await certificateService.autoGenerateForProgram(programId);
      return successResponse(res, 200, 'Auto-generation completed', results);
    } catch (error) {
      return next(error);
    }
  };

  verifyCertificate = async (req, res, next) => {
    try {
      const result = await certificateService.verifyCertificate(req.params.certificateNumber);
      return successResponse(res, 200, MESSAGES.CERTIFICATE_VERIFIED, result);
    } catch (error) {
      return next(error);
    }
  };

  downloadCertificate = async (req, res, next) => {
    try {
      const result = await certificateService.downloadCertificate(req.params.id, req.user.id, req.user.role);
      const certificate = result.certificate;
      const filename = `certificate-${certificate.certificateNumber}.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      if (result.certificateUrl) {
        const response = await fetch(result.certificateUrl);
        const chunks = [];
        for await (const chunk of response.body) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        return res.send(buffer);
      }

      return res.send(result.pdfBuffer);
    } catch (error) {
      return next(error);
    }
  };

  revokeCertificate = async (req, res, next) => {
    try {
      const revoked = await certificateService.revokeCertificate(req.params.id, req.user.id);
      return successResponse(res, 200, MESSAGES.CERTIFICATE_REVOKED, revoked);
    } catch (error) {
      return next(error);
    }
  };

  getMyCertificates = async (req, res, next) => {
    try {
      const result = await certificateService.getMyCertificates(req.user.id, req.query);
      return successResponse(res, 200, MESSAGES.CERTIFICATES_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  searchCertificates = async (req, res, next) => {
    try {
      const result = await certificateService.searchCertificates(req.query);
      return successResponse(res, 200, MESSAGES.CERTIFICATES_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  getCertificateHistory = async (req, res, next) => {
    try {
      const result = await certificateService.getCertificateHistory(req.params.id);
      return successResponse(res, 200, 'Certificate history retrieved successfully', result);
    } catch (error) {
      return next(error);
    }
  };

  bulkGenerateCertificates = async (req, res, next) => {
    try {
      const { programId } = req.params;
      const results = await certificateService.bulkGenerateCertificates(programId, req.user.id);
      return successResponse(res, 200, MESSAGES.CERTIFICATES_BULK_GENERATED, results);
    } catch (error) {
      return next(error);
    }
  };

  getCertificate = async (req, res, next) => {
    try {
      const result = await certificateService.getCertificate(req.params.id);
      return successResponse(res, 200, MESSAGES.CERTIFICATE_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  approveCertificate = async (req, res, next) => {
    try {
      const updated = await certificateService.approveCertificate(req.params.id, req.user.id);
      return successResponse(res, 200, MESSAGES.CERTIFICATE_APPROVED, updated);
    } catch (error) {
      return next(error);
    }
  };

  rejectCertificate = async (req, res, next) => {
    try {
      const updated = await certificateService.rejectCertificate(req.params.id);
      return successResponse(res, 200, MESSAGES.CERTIFICATE_REJECTED, updated);
    } catch (error) {
      return next(error);
    }
  };

  deleteCertificate = async (req, res, next) => {
    try {
      const deleted = await certificateService.deleteCertificate(req.params.id);
      return successResponse(res, 200, MESSAGES.CERTIFICATE_DELETED, deleted);
    } catch (error) {
      return next(error);
    }
  };

  adminGenerateCertificate = async (req, res, next) => {
    try {
      const result = await certificateService.adminGenerateCertificate(req.user.id, req.body, `${req.protocol}://${req.get('host')}`);
      return successResponse(res, 201, MESSAGES.CERTIFICATE_GENERATED, result);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = new CertificateController();
