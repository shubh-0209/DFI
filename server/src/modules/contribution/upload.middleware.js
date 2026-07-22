const multer = require('multer');
const { validateFile } = require('./file.validation');
const { MESSAGES, UPLOAD_CONFIG } = require('./upload.constants');
const ValidationError = require('../../utils/errors/ValidationError');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  try {
    validateFile(file);
    cb(null, true);
  } catch (error) {
    cb(new ValidationError(error.message, error.errors || []), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
});

const uploadSingle = (fieldName = 'file') => {
  return (req, res, next) => {
    const singleUpload = upload.single(fieldName);
    singleUpload(req, res, (err) => {
      if (err) {
        if (err instanceof ValidationError) {
          return res.status(400).json({
            success: false,
            message: err.message,
            errors: err.errors,
          });
        }
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: MESSAGES.FILE_TOO_LARGE,
            errors: [{ field: 'file', message: MESSAGES.FILE_TOO_LARGE }],
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed',
        });
      }
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: MESSAGES.FILE_REQUIRED,
          errors: [{ field: 'file', message: MESSAGES.FILE_REQUIRED }],
        });
      }
      return next();
    });
  };
};

const uploadMultiple = (fieldName = 'files', maxCount = UPLOAD_CONFIG.MAX_FILES_PER_REQUEST) => {
  return (req, res, next) => {
    const multipleUpload = upload.array(fieldName, maxCount);
    multipleUpload(req, res, (err) => {
      if (err) {
        if (err instanceof ValidationError) {
          return res.status(400).json({
            success: false,
            message: err.message,
            errors: err.errors,
          });
        }
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: MESSAGES.FILE_TOO_LARGE,
            errors: [{ field: 'file', message: MESSAGES.FILE_TOO_LARGE }],
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: MESSAGES.MULTIPLE_FILES_EXCEEDED,
            errors: [
              {
                field: 'files',
                message: `${MESSAGES.MULTIPLE_FILES_EXCEEDED} (max ${maxCount})`,
              },
            ],
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed',
        });
      }
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: MESSAGES.FILE_REQUIRED,
          errors: [{ field: 'files', message: MESSAGES.FILE_REQUIRED }],
        });
      }
      return next();
    });
  };
};

module.exports = {
  uploadSingle,
  uploadMultiple,
};
