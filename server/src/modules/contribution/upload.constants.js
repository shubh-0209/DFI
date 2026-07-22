const ALLOWED_MIME_TYPES = {
  image: ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/svg+xml'],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ],
  video: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'],
  archive: ['application/zip', 'application/x-zip-compressed', 'application/vnd.rar', 'application/x-rar-compressed'],
};

const ALLOWED_EXTENSIONS = {
  pdf: ['pdf'],
  doc: ['doc', 'docx'],
  ppt: ['ppt', 'pptx'],
  xls: ['xls', 'xlsx'],
  txt: ['txt'],
  zip: ['zip', 'rar'],
  image: ['png', 'jpg', 'jpeg', 'webp', 'svg'],
  video: ['mp4', 'mov', 'avi', 'webm'],
};

const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024,
  document: 25 * 1024 * 1024,
  video: 200 * 1024 * 1024,
  archive: 100 * 1024 * 1024,
};

const MESSAGES = {
  FILE_TOO_LARGE: 'File exceeds maximum size limit',
  UNSUPPORTED_MIME_TYPE: 'Unsupported file type',
  UNSUPPORTED_EXTENSION: 'Unsupported file extension',
  EXECUTABLE_NOT_ALLOWED: 'Executable files are not allowed',
  SCRIPT_NOT_ALLOWED: 'Script files are not allowed',
  HIDDEN_FILE_NOT_ALLOWED: 'Hidden files are not allowed',
  DOUBLE_EXTENSION_NOT_ALLOWED: 'Files with double extensions are not allowed',
  PATH_INJECTION_NOT_ALLOWED: 'Invalid filename',
  FILE_REQUIRED: 'File is required',
  UPLOAD_SUCCESS: 'File uploaded successfully',
  UPLOAD_FAILED: 'File upload failed',
  DELETE_SUCCESS: 'File deleted successfully',
  DELETE_FAILED: 'File deletion failed',
  STORAGE_NOT_CONFIGURED: 'Storage service is not configured',
  FILE_NOT_FOUND: 'File not found',
  INVALID_FILE_METADATA: 'Invalid file metadata',
  MULTIPLE_FILES_EXCEEDED: 'Cannot upload more than 10 files at once',
};

const DANGEROUS_EXTENSIONS = [
  'exe', 'bat', 'cmd', 'sh', 'bash', 'ps1', 'vbs',
  'js', 'php', 'py', 'rb', 'pl', 'asp', 'aspx', 'jsp',
  'war', 'dll', 'so', 'dylib', 'msi', 'app', 'deb', 'rpm',
];

const DANGEROUS_MIME_PREFIXES = [
  'application/x-msdownload',
  'application/x-executable',
  'application/x-sharedlib',
  'application/x-archive',
  'application/x-binary',
  'application/x-msdos-program',
];

const HIDDEN_FILE_PREFIX = '.';

const UPLOAD_CONFIG = {
  MAX_FILES_PER_REQUEST: 10,
  TEMP_UPLOAD_PREFIX: 'temp_',
  STORAGE_FOLDER: 'disha/contributions',
};

module.exports = {
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZES,
  MESSAGES,
  DANGEROUS_EXTENSIONS,
  DANGEROUS_MIME_PREFIXES,
  HIDDEN_FILE_PREFIX,
  UPLOAD_CONFIG,
};
