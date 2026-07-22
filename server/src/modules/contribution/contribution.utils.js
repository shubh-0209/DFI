const crypto = require('crypto');

function generateContributionId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `CONTRIB-${timestamp}-${randomPart}`;
}

function generateVersionNumber(contribution) {
  if (!contribution || !Array.isArray(contribution.versions)) {
    return 1;
  }
  return contribution.versions.length + 1;
}

function contributionFormatter(contribution) {
  if (!contribution) return null;

  const formatted = contribution.toJSON ? contribution.toJSON() : contribution.toObject ? contribution.toObject() : contribution;

  const result = {
    _id: formatted._id,
    contributionId: formatted.contributionId,
    title: formatted.title,
    description: formatted.description,
    category: formatted.category,
    contributionType: formatted.contributionType,
    status: formatted.status,
    submittedBy: formatted.submittedBy,
    currentVersion: formatted.currentVersion,
    versions: formatted.versions,
    skillsUsed: formatted.skillsUsed || [],
    hoursWorked: formatted.hoursWorked || 0,
    tags: formatted.tags || [],
    adminAssigned: formatted.adminAssigned,
    reviewDeadline: formatted.reviewDeadline,
    totalCoinsAwarded: formatted.totalCoinsAwarded || 0,
    isFeatured: formatted.isFeatured || false,
    visibility: formatted.visibility,
    isDeleted: formatted.isDeleted,
    deletedAt: formatted.deletedAt,
    deletedBy: formatted.deletedBy,
    metadata: formatted.metadata || {},
    createdAt: formatted.createdAt,
    updatedAt: formatted.updatedAt,
  };

  return result;
}

function versionFormatter(version) {
  if (!version) return null;

  const formatted = version.toJSON ? version.toJSON() : version.toObject ? version.toObject() : version;

  const result = {
    _id: formatted._id,
    contributionId: formatted.contributionId,
    versionNumber: formatted.versionNumber,
    uploadedBy: formatted.uploadedBy,
    files: formatted.files || [],
    githubUrl: formatted.githubUrl,
    figmaUrl: formatted.figmaUrl,
    canvaUrl: formatted.canvaUrl,
    googleDriveUrl: formatted.googleDriveUrl,
    notes: formatted.notes,
    createdAt: formatted.createdAt,
    updatedAt: formatted.updatedAt,
  };

  return result;
}

module.exports = {
  generateContributionId,
  generateVersionNumber,
  contributionFormatter,
  versionFormatter,
};
