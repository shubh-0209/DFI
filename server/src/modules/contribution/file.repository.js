const ContributionFile = require('./file.model');

class FileRepository {
  async create(fileData) {
    const file = new ContributionFile(fileData);
    await file.save();
    return file;
  }

  async findById(id) {
    return ContributionFile.findById(id);
  }

  async findByStorageKey(storageKey) {
    return ContributionFile.findOne({ storageKey, isDeleted: false });
  }

  async findByContribution(contributionId) {
    return ContributionFile.find({ contributionId, isDeleted: false }).sort({ uploadedAt: -1 });
  }

  async findByIdentifier(fileId) {
    return ContributionFile.findOne({ fileId, isDeleted: false });
  }

  async softDelete(id, deletedBy) {
    return ContributionFile.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }

  async permanentDelete(id) {
    return ContributionFile.findByIdAndDelete(id);
  }

  async softDeleteByStorageKey(storageKey, deletedBy) {
    return ContributionFile.findOneAndUpdate(
      { storageKey, isDeleted: false },
      { isDeleted: true, deletedAt: new Date(), deletedBy },
      { new: true }
    );
  }

  async findByVersion(versionId) {
    return ContributionFile.find({ versionId, isDeleted: false }).sort({ uploadedAt: -1 });
  }
}

module.exports = new FileRepository();
