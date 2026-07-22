const { v4: uuidv4 } = require('uuid');
const path = require('path');
const crypto = require('crypto');
const {
  HIDDEN_FILE_PREFIX,
  MAX_FILE_SIZES,
  UPLOAD_CONFIG,
} = require('./upload.constants');

const generateChecksum = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

const sanitizeFilename = (originalName) => {
  const parsed = path.parse(originalName);
  const baseName = parsed.name.replace(/[^a-zA-Z0-9_-]/g, '_');
  const extension = parsed.ext.replace('.', '').toLowerCase();
  return { baseName, extension };
};

const generateStorageKey = (originalName) => {
  const { baseName, extension } = sanitizeFilename(originalName);
  const uniqueId = uuidv4();
  return `${UPLOAD_CONFIG.STORAGE_FOLDER}/${uniqueId}_${baseName}.${extension}`;
};

const isHiddenFile = (filename) => {
  const parts = filename.split('.');
  return parts.some((part) => part === '' || part.startsWith(HIDDEN_FILE_PREFIX));
};

const hasDoubleExtension = (filename) => {
  const parts = filename.split('.');
  return parts.length > 2;
};

const hasPathTraversal = (filename) => {
  return (
    filename.includes('..') ||
    filename.includes('/') ||
    filename.includes('\\') ||
    filename.startsWith('~') ||
    filename.includes('~')
  );
};

const getFileCategory = (mimeType, extension) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (
    ['application/zip', 'application/x-zip-compressed', 'application/vnd.rar', 'application/x-rar-compressed'].includes(mimeType) ||
    ['zip', 'rar'].includes(extension)
  ) {
    return 'archive';
  }
  return 'document';
};

const getMaxFileSize = (mimeType, extension) => {
  const category = getFileCategory(mimeType, extension);
  return MAX_FILE_SIZES[category] || MAX_FILE_SIZES.document;
};

const isScriptFile = (mimeType, extension) => {
  const scriptExtensions = ['js', 'php', 'py', 'rb', 'pl', 'sh', 'bash', 'ps1'];
  const scriptMimePrefixes = ['text/javascript', 'application/javascript', 'application/x-php', 'text/x-python'];
  return (
    scriptExtensions.includes(extension) ||
    scriptMimePrefixes.some((prefix) => mimeType.startsWith(prefix))
  );
};

module.exports = {
  generateChecksum,
  sanitizeFilename,
  generateStorageKey,
  isHiddenFile,
  hasDoubleExtension,
  hasPathTraversal,
  getFileCategory,
  getMaxFileSize,
  isScriptFile,
};
