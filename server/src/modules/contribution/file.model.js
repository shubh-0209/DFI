const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    fileId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: [true, 'Original name is required'],
      trim: true,
    },
    storageKey: {
      type: String,
      required: [true, 'Storage key is required'],
      trim: true,
      unique: true,
    },
    publicUrl: {
      type: String,
      required: [true, 'Public URL is required'],
      trim: true,
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      trim: true,
      index: true,
    },
    extension: {
      type: String,
      required: [true, 'Extension is required'],
      trim: true,
      lowercase: true,
      index: true,
    },
    size: {
      type: Number,
      required: [true, 'File size is required'],
      min: [0, 'File size cannot be negative'],
    },
    checksum: {
      type: String,
      trim: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploaded by is required'],
      index: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    contributionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contribution',
      default: null,
      index: true,
    },
    versionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContributionVersion',
      default: null,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

fileSchema.index({ mimeType: 1, isDeleted: 1 });
fileSchema.index({ extension: 1, isDeleted: 1 });
fileSchema.index({ uploadedBy: 1, uploadedAt: -1 });
fileSchema.index({ contributionId: 1, isDeleted: 1 });
fileSchema.index({ storageKey: 1 });

fileSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const ContributionFile = mongoose.model('ContributionFile', fileSchema);

module.exports = ContributionFile;
