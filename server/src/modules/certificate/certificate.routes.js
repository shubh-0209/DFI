const express = require('express');
const certificateController = require('./certificate.controller');
const {
  validateGenerateCertificate,
  validateAutoGenerate,
  validateDownloadCertificate,
  validateVerifyCertificate,
  validateRevokeCertificate,
  validateSearchCertificates,
  validateAdminGenerateCertificate,
} = require('./certificate.validation');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');
const { authorize } = require('../../middlewares/rbac.middleware');
const ROLES = require('../../constants/roles.constants');

const router = express.Router();

router.get('/verify/:certificateNumber', validateVerifyCertificate, certificateController.verifyCertificate);

router.use(authenticate);
router.use(authenticatedLimiter);

router.post('/generate', validateGenerateCertificate, certificateController.generateCertificate);
router.get('/me', validateSearchCertificates, certificateController.getMyCertificates);
router.get('/', validateSearchCertificates, certificateController.searchCertificates);
router.get('/:id', validateDownloadCertificate, certificateController.getCertificate);
router.get('/:id/download', validateDownloadCertificate, certificateController.downloadCertificate);
router.get('/:id/history', validateDownloadCertificate, certificateController.getCertificateHistory);

router.use(authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN));

router.post('/admin/auto-generate/:programId', validateAutoGenerate, certificateController.autoGenerateForProgram);
router.post('/admin/:id/revoke', validateRevokeCertificate, certificateController.revokeCertificate);
router.post('/admin/:id/approve', validateRevokeCertificate, certificateController.approveCertificate);
router.post('/admin/:id/reject', validateRevokeCertificate, certificateController.rejectCertificate);
router.delete('/admin/:id', validateRevokeCertificate, certificateController.deleteCertificate);
router.post('/admin/generate', validateAdminGenerateCertificate, certificateController.adminGenerateCertificate);
router.post('/admin/bulk-generate/:programId', validateAutoGenerate, certificateController.bulkGenerateCertificates);

module.exports = router;
