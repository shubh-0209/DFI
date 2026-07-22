const { v4: uuidv4 } = require('uuid');
const { storageService } = require('./storage.service');
const fileRepository = require('./file.repository');
const {
  validateMimeType,
  validateExtension,
  validateFileSize,
  validateFileCount,
} = require('./file.validation');
const { generateChecksum, generateStorageKey, getFileCategory } = require('./file.utils');
const { MESSAGES, UPLOAD_CONFIG } = require('./upload.constants');
const {
  NotFoundError,
  ValidationError,
  AuthorizationError,
} = require('../../utils/errors');
const ROLES = require('../../constants/roles.constants');

class UploadService {
  async uploadFile(file, uploadedBy, options = {}) {
    const { contributionId, versionId } = options;

    if (!file) {
      throw new ValidationError(MESSAGES.FILE_REQUIRED, [
        { field: 'file', message: MESSAGES.FILE_REQUIRED },
      ]);
    }

    const extension = validateExtension(file.originalname || file.name);
    validateMimeType(file.mimetype);
    validateFileSize(file.size, file.mimetype, extension);

    const buffer = file.buffer;
    if (!buffer || buffer.length === 0) {
      throw new ValidationError(MESSAGES.INVALID_FILE_METADATA, [
        { field: 'file', message: MESSAGES.INVALID_FILE_METADATA },
      ]);
    }

    const checksum = generateChecksum(buffer);
    const category = getFileCategory(file.mimetype, extension);
    const storageKey = generateStorageKey(file.originalname || file.name);

    // eslint-disable-next-line no-console
    console.log(
      `[ContributionUpload] Uploading file: ${file.originalname || file.name} (${file.size} bytes, ${file.mimetype}) by user ${uploadedBy}`
    );

    const uploadResult = await storageService.uploadFile(buffer, {
      folder: UPLOAD_CONFIG.STORAGE_FOLDER,
      resourceType: category === 'image' ? 'image' : category === 'video' ? 'video' : 'auto',
      publicId: storageKey.replace(/\.[^/.]+$/, ''),
    });

    const fileData = {
      fileId: `FILE-${Date.now().toString(36).toUpperCase()}-${uuidv4().substring(0, 8).toUpperCase()}`,
      originalName: file.originalname || file.name,
      storageKey: uploadResult.storageKey,
      publicUrl: uploadResult.publicUrl,
      mimeType: file.mimetype,
      extension,
      size: file.size,
      checksum,
      uploadedBy,
      uploadedAt: new Date(),
      isDeleted: false,
      contributionId: contributionId || null,
      versionId: versionId || null,
      metadata: {
        category,
        width: uploadResult.width,
        height: uploadResult.height,
        duration: uploadResult.duration,
      },
    };

    const savedFile = await fileRepository.create(fileData);

    // eslint-disable-next-line no-console
    console.log(`[ContributionUpload] File uploaded successfully: ${savedFile.fileId}`);

    return savedFile;
  }

  async uploadMultipleFiles(files, uploadedBy, options = {}) {
    validateFileCount(files);

    const uploadedFiles = [];
    for (const file of files) {
      const savedFile = await this.uploadFile(file, uploadedBy, options);
      uploadedFiles.push(savedFile);
    }

    return uploadedFiles;
  }

  async deleteFile(id, deletedBy) {
    const file = await fileRepository.findById(id);
    if (!file || file.isDeleted) {
      throw new NotFoundError(MESSAGES.FILE_NOT_FOUND);
    }

    // eslint-disable-next-line no-console
    console.log(`[ContributionUpload] Deleting file: ${file.fileId}`);

    try {
      await storageService.deleteFile(file.storageKey);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        `[ContributionUpload] Storage deletion failed for ${file.storageKey}:`,
        error.message
      );
      throw new Error(MESSAGES.DELETE_FAILED);
    }

    await fileRepository.softDelete(id, deletedBy);

    // eslint-disable-next-line no-console
    console.log(`[ContributionUpload] File deleted successfully: ${file.fileId}`);

    return { message: MESSAGES.DELETE_SUCCESS };
  }

  async getFileUrl(id, requestingUserId, userRole) {
    const file = await fileRepository.findById(id);
    if (!file || file.isDeleted) {
      throw new NotFoundError(MESSAGES.FILE_NOT_FOUND);
    }

    const isAdmin = [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR, ROLES.REVIEWER].includes(
      userRole
    );
    const isOwner = file.uploadedBy.toString() === requestingUserId.toString();

    if (!isAdmin && !isOwner) {
      throw new AuthorizationError('You are not authorized to access this file');
    }

    // eslint-disable-next-line no-console
    console.log(`[ContributionUpload] File accessed: ${file.fileId} by user ${requestingUserId}`);

    return {
      url: file.publicUrl,
      file: {
        fileId: file.fileId,
        originalName: file.originalName,
        mimeType: file.mimeType,
        extension: file.extension,
        size: file.size,
        publicUrl: file.publicUrl,
      },
    };
  }

  async getFileByIdentifier(fileId, requestingUserId, userRole) {
    const file = await fileRepository.findByIdentifier(fileId);
    if (!file || file.isDeleted) {
      throw new NotFoundError(MESSAGES.FILE_NOT_FOUND);
    }

    const isAdmin = [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COORDINATOR, ROLES.REVIEWER].includes(
      userRole
    );
    const isOwner = file.uploadedBy.toString() === requestingUserId.toString();

    if (!isAdmin && !isOwner) {
      throw new AuthorizationError('You are not authorized to access this file');
    }

    return {
      url: file.publicUrl,
      file: {
        fileId: file.fileId,
        originalName: file.originalName,
        mimeType: file.mimeType,
        extension: file.extension,
        size: file.size,
        publicUrl: file.publicUrl,
      },
    };
  }
}

module.exports = new UploadService();
