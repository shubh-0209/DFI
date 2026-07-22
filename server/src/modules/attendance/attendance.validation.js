const mongoose = require('mongoose');
const ValidationError = require('../../utils/errors/ValidationError');

/**
 * Helper to validate pagination and sorting params.
 */
const validatePagination = (query, errors) => {
  const { page, limit, sortOrder } = query;

  if (page !== undefined) {
    const p = Number(page);
    if (!Number.isInteger(p) || p < 1) {
      errors.push({ field: 'page', message: 'Page must be a positive integer' });
    }
  }

  if (limit !== undefined) {
    const l = Number(limit);
    if (!Number.isInteger(l) || l < 1 || l > 100) {
      errors.push({ field: 'limit', message: 'Limit must be an integer between 1 and 100' });
    }
  }

  if (sortOrder !== undefined && !['asc', 'desc'].includes(sortOrder)) {
    errors.push({ field: 'sortOrder', message: 'Sort order must be asc or desc' });
  }
};

/**
 * Validation for checking in.
 */
const validateCheckIn = (req, res, next) => {
  const { applicationId } = req.body;
  const errors = [];

  if (!applicationId) {
    errors.push({ field: 'applicationId', message: 'Application ID is required' });
  } else if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    errors.push({ field: 'applicationId', message: 'Invalid Application ID format' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Check-in validation failed', errors));
  }

  return next();
};

/**
 * Validation for checking out.
 */
const validateCheckOut = (req, res, next) => {
  const { attendanceId } = req.body;
  const errors = [];

  if (!attendanceId) {
    errors.push({ field: 'attendanceId', message: 'Attendance ID is required' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Check-out validation failed', errors));
  }

  return next();
};

/**
 * Validation for manually marking / editing attendance (Admin).
 */
const validateMarkAttendance = (req, res, next) => {
  const { id } = req.params;
  const { status, remarks, checkInTime, checkOutTime } = req.body;
  const errors = [];

  if (!mongoose.Types.ObjectId.isValid(id)) {
    errors.push({ field: 'id', message: 'Invalid attendance ID' });
  }

  if (status && !['present', 'absent'].includes(status)) {
    errors.push({ field: 'status', message: 'Status must be either present or absent' });
  }

  if (remarks && remarks.length > 500) {
    errors.push({ field: 'remarks', message: 'Remarks cannot exceed 500 characters' });
  }

  if (checkInTime && isNaN(Date.parse(checkInTime))) {
    errors.push({ field: 'checkInTime', message: 'Invalid check-in time format' });
  }

  if (checkOutTime && isNaN(Date.parse(checkOutTime))) {
    errors.push({ field: 'checkOutTime', message: 'Invalid check-out time format' });
  }

  if (checkInTime && checkOutTime) {
    if (new Date(checkOutTime) < new Date(checkInTime)) {
      errors.push({
        field: 'checkOutTime',
        message: 'Check-out time cannot be before check-in time',
      });
    }
  }

  if (errors.length > 0) {
    return next(new ValidationError('Mark attendance validation failed', errors));
  }

  return next();
};

/**
 * Validation for getting a specific attendance record.
 */
const validateGetAttendance = (req, res, next) => {
  const { id } = req.params;
  const errors = [];

  if (!mongoose.Types.ObjectId.isValid(id)) {
    errors.push({ field: 'id', message: 'Invalid attendance ID format' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Get attendance validation failed', errors));
  }

  return next();
};

/**
 * Validation for getting my attendance.
 */
const validateMyAttendance = (req, res, next) => {
  const errors = [];
  const { program, startDate, endDate } = req.query;

  validatePagination(req.query, errors);

  if (program && !mongoose.Types.ObjectId.isValid(program)) {
    errors.push({ field: 'program', message: 'Invalid program ID format' });
  }

  if (startDate && isNaN(Date.parse(startDate))) {
    errors.push({ field: 'startDate', message: 'Invalid startDate format' });
  }

  if (endDate && isNaN(Date.parse(endDate))) {
    errors.push({ field: 'endDate', message: 'Invalid endDate format' });
  }

  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    errors.push({ field: 'endDate', message: 'endDate cannot be before startDate' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('My attendance validation failed', errors));
  }

  return next();
};

/**
 * Validation for admin getting attendance history.
 */
const validateAttendanceHistory = (req, res, next) => {
  const errors = [];
  const { program, volunteer, date, startDate, endDate, status } = req.query;

  validatePagination(req.query, errors);

  if (program && !mongoose.Types.ObjectId.isValid(program)) {
    errors.push({ field: 'program', message: 'Invalid program ID format' });
  }

  if (volunteer && !mongoose.Types.ObjectId.isValid(volunteer)) {
    errors.push({ field: 'volunteer', message: 'Invalid volunteer ID format' });
  }

  if (status && !['present', 'absent'].includes(status)) {
    errors.push({ field: 'status', message: 'Status must be either present or absent' });
  }

  if (date && isNaN(Date.parse(date))) {
    errors.push({ field: 'date', message: 'Invalid date format' });
  }

  if (startDate && isNaN(Date.parse(startDate))) {
    errors.push({ field: 'startDate', message: 'Invalid startDate format' });
  }

  if (endDate && isNaN(Date.parse(endDate))) {
    errors.push({ field: 'endDate', message: 'Invalid endDate format' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Attendance history validation failed', errors));
  }

  return next();
};

/**
 * Validation for bulk attendance marking.
 */
const validateBulkAttendance = (req, res, next) => {
  const { ids, status, remarks } = req.body;
  const errors = [];

  if (!ids) {
    errors.push({ field: 'ids', message: 'Attendance IDs are required' });
  } else if (!Array.isArray(ids) || ids.length === 0) {
    errors.push({ field: 'ids', message: 'Attendance IDs must be a non-empty array' });
  } else {
    ids.forEach((id, index) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        errors.push({ field: `ids[${index}]`, message: 'Invalid ID format' });
      }
    });
  }

  if (status && !['present', 'absent'].includes(status)) {
    errors.push({ field: 'status', message: 'Status must be either present or absent' });
  }

  if (remarks && remarks.length > 500) {
    errors.push({ field: 'remarks', message: 'Remarks cannot exceed 500 characters' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Bulk attendance validation failed', errors));
  }

  return next();
};

module.exports = {
  validateCheckIn,
  validateCheckOut,
  validateMarkAttendance,
  validateGetAttendance,
  validateMyAttendance,
  validateAttendanceHistory,
  validateBulkAttendance,
};
