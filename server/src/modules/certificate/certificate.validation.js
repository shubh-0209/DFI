const ValidationError = require('../../utils/errors/ValidationError');

const validateGenerateCertificate = (req, res, next) => {
  const { programId, applicationId, attendanceId, volunteerHours } = req.body;
  const errors = [];

  if (!programId || typeof programId !== 'string' || programId.trim() === '') {
    errors.push({ field: 'programId', message: 'Program ID is required' });
  }

  if (applicationId && typeof applicationId !== 'string') {
    errors.push({ field: 'applicationId', message: 'Application ID must be a string' });
  }

  if (attendanceId && typeof attendanceId !== 'string') {
    errors.push({ field: 'attendanceId', message: 'Attendance ID must be a string' });
  }

  if (volunteerHours !== undefined && (typeof volunteerHours !== 'number' || volunteerHours < 0)) {
    errors.push({ field: 'volunteerHours', message: 'Volunteer hours must be a non-negative number' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Certificate generation validation failed', errors));
  }

  return next();
};

const validateAutoGenerate = (req, res, next) => {
  const { programId } = req.params;
  const errors = [];

  if (!programId || programId.trim() === '') {
    errors.push({ field: 'programId', message: 'Program ID is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Auto-generate validation failed', errors));
  }

  return next();
};

const validateDownloadCertificate = (req, res, next) => {
  const { id } = req.params;

  if (!id || id.trim() === '') {
    return next(new ValidationError('Validation failed', [{ field: 'id', message: 'Certificate ID is required' }]));
  }

  return next();
};

const validateVerifyCertificate = (req, res, next) => {
  const { certificateNumber } = req.params;

  if (!certificateNumber || certificateNumber.trim() === '') {
    return next(new ValidationError('Validation failed', [{ field: 'certificateNumber', message: 'Certificate number is required' }]));
  }

  return next();
};

const validateRevokeCertificate = (req, res, next) => {
  const { id } = req.params;

  if (!id || id.trim() === '') {
    return next(new ValidationError('Validation failed', [{ field: 'id', message: 'Certificate ID is required' }]));
  }

  return next();
};

const validateSearchCertificates = (req, res, next) => {
  const { page, limit, sort, filter, _search } = req.query;
  const errors = [];

  if (page !== undefined && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
    errors.push({ field: 'page', message: 'Page must be a positive integer' });
  }

  if (limit !== undefined && (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
    errors.push({ field: 'limit', message: 'Limit must be an integer between 1 and 100' });
  }

  if (sort && !['newest', 'oldest', 'program', 'volunteer'].includes(sort)) {
    errors.push({ field: 'sort', message: 'Invalid sort value' });
  }

  if (filter && !['all', 'issued', 'revoked', 'approved', 'rejected', 'verified', 'pending'].includes(filter)) {
    errors.push({ field: 'filter', message: 'Invalid filter value' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Certificate search validation failed', errors));
  }

  return next();
};

const validateAdminGenerateCertificate = (req, res, next) => {
  const { userId, programId, volunteerHours, skillsEarned } = req.body;
  const errors = [];

  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    errors.push({ field: 'userId', message: 'Volunteer user ID is required' });
  }

  if (!programId || typeof programId !== 'string' || programId.trim() === '') {
    errors.push({ field: 'programId', message: 'Program ID is required' });
  }

  if (volunteerHours !== undefined && (typeof volunteerHours !== 'number' || volunteerHours < 0)) {
    errors.push({ field: 'volunteerHours', message: 'Volunteer hours must be a non-negative number' });
  }

  if (skillsEarned !== undefined && !Array.isArray(skillsEarned)) {
    errors.push({ field: 'skillsEarned', message: 'Skills earned must be an array' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Admin certificate generation validation failed', errors));
  }

  return next();
};


module.exports = {
  validateGenerateCertificate,
  validateAutoGenerate,
  validateDownloadCertificate,
  validateVerifyCertificate,
  validateRevokeCertificate,
  validateSearchCertificates,
  validateAdminGenerateCertificate,
};
