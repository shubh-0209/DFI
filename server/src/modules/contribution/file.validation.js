const path = require('path');
const {
  MESSAGES,
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
  DANGEROUS_EXTENSIONS,
  DANGEROUS_MIME_PREFIXES,
  UPLOAD_CONFIG,
} = require('./upload.constants');
const {
  isHiddenFile,
  hasDoubleExtension,
  hasPathTraversal,
  isScriptFile,
  getFileCategory,
  getMaxFileSize,
} = require('./file.utils');
const ValidationError = require('../../utils/errors/ValidationError');

const getAllAllowedExtensions = () => {
  return [
    ...ALLOWED_EXTENSIONS.image,
    ...ALLOWED_EXTENSIONS.txt,
    ...ALLOWED_EXTENSIONS.zip,
    ...ALLOWED_EXTENSIONS.doc,
    ...ALLOWED_EXTENSIONS.ppt,
    ...ALLOWED_EXTENSIONS.xls,
  ];
};

const validateMimeType = (mimeType) => {
  const allAllowed = [
    ...ALLOWED_MIME_TYPES.image,
    ...ALLOWED_MIME_TYPES.document,
    ...ALLOWED_MIME_TYPES.video,
    ...ALLOWED_MIME_TYPES.archive,
  ];

  if (!allAllowed.includes(mimeType)) {
    throw new ValidationError(MESSAGES.UNSUPPORTED_MIME_TYPE, [
      { field: 'mimeType', message: MESSAGES.UNSUPPORTED_MIME_TYPE },
    ]);
  }

  if (DANGEROUS_MIME_PREFIXES.some((prefix) => mimeType.startsWith(prefix))) {
    throw new ValidationError(MESSAGES.EXECUTABLE_NOT_ALLOWED, [
      { field: 'mimeType', message: MESSAGES.EXECUTABLE_NOT_ALLOWED },
    ]);
  }
};

const validateExtension = (filename) => {
  if (!filename || typeof filename !== 'string') {
    throw new ValidationError(MESSAGES.PATH_INJECTION_NOT_ALLOWED, [
      { field: 'file', message: MESSAGES.PATH_INJECTION_NOT_ALLOWED },
    ]);
  }

  const parsed = path.parse(filename);
  const extension = parsed.ext.replace('.', '').toLowerCase();

  if (isHiddenFile(filename)) {
    throw new ValidationError(MESSAGES.HIDDEN_FILE_NOT_ALLOWED, [
      { field: 'file', message: MESSAGES.HIDDEN_FILE_NOT_ALLOWED },
    ]);
  }

  if (hasDoubleExtension(filename)) {
    throw new ValidationError(MESSAGES.DOUBLE_EXTENSION_NOT_ALLOWED, [
      { field: 'file', message: MESSAGES.DOUBLE_EXTENSION_NOT_ALLOWED },
    ]);
  }

  if (hasPathTraversal(filename)) {
    throw new ValidationError(MESSAGES.PATH_INJECTION_NOT_ALLOWED, [
      { field: 'file', message: MESSAGES.PATH_INJECTION_NOT_ALLOWED },
    ]);
  }

  const allAllowed = getAllAllowedExtensions();
  if (!allAllowed.includes(extension)) {
    throw new ValidationError(MESSAGES.UNSUPPORTED_EXTENSION, [
      { field: 'file', message: MESSAGES.UNSUPPORTED_EXTENSION },
    ]);
  }

  if (DANGEROUS_EXTENSIONS.includes(extension)) {
    throw new ValidationError(MESSAGES.EXECUTABLE_NOT_ALLOWED, [
      { field: 'file', message: MESSAGES.EXECUTABLE_NOT_ALLOWED },
    ]);
  }

  if (isScriptFile('', extension)) {
    throw new ValidationError(MESSAGES.SCRIPT_NOT_ALLOWED, [
      { field: 'file', message: MESSAGES.SCRIPT_NOT_ALLOWED },
    ]);
  }

  return extension;
};

const validateFileSize = (size, mimeType, extension) => {
  const category = getFileCategory(mimeType, extension);
  const maxSize = getMaxFileSize(mimeType, extension);

  if (size > maxSize) {
    throw new ValidationError(MESSAGES.FILE_TOO_LARGE, [
      {
        field: 'file',
        message: `${MESSAGES.FILE_TOO_LARGE} (max ${maxSize / (1024 * 1024)}MB for ${category} files)`,
      },
    ]);
  }
};

const validateFileCount = (files) => {
  if (!Array.isArray(files) || files.length === 0) {
    throw new ValidationError('At least one file is required', [
      { field: 'files', message: 'At least one file is required' },
    ]);
  }

  if (files.length > UPLOAD_CONFIG.MAX_FILES_PER_REQUEST) {
    throw new ValidationError(MESSAGES.MULTIPLE_FILES_EXCEEDED, [
      {
        field: 'files',
        message: `${MESSAGES.MULTIPLE_FILES_EXCEEDED} (max ${UPLOAD_CONFIG.MAX_FILES_PER_REQUEST})`,
      },
    ]);
  }
};

const validateFile = (file) => {
  if (!file) {
    throw new ValidationError(MESSAGES.FILE_REQUIRED, [
      { field: 'file', message: MESSAGES.FILE_REQUIRED },
    ]);
  }

  const extension = validateExtension(file.originalname || file.name);
  validateMimeType(file.mimetype);
  validateFileSize(file.size, file.mimetype, extension);

  return extension;
};

module.exports = {
  validateFile,
  validateMimeType,
  validateExtension,
  validateFileSize,
  validateFileCount,
  getAllAllowedExtensions,
};
