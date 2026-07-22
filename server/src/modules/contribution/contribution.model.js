const mongoose = require('mongoose');
const {
  STATUS,
  CATEGORY,
  CONTRIBUTION_TYPE,
  VISIBILITY,
  REVIEW_ACTION,
  VALIDATION,
} = require('./contribution.constants');

const contributionVersionSchema = new mongoose.Schema(
  {
    contributionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contribution',
      required: [true, 'Contribution ID is required'],
      index: true,
    },
    versionNumber: {
      type: Number,
      required: [true, 'Version number is required'],
      min: [1, 'Version number must be at least 1'],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploaded by is required'],
      index: true,
    },
    files: {
      type: [
        {
          originalName: { type: String, trim: true },
          storageKey: { type: String, trim: true },
          publicUrl: { type: String, trim: true },
          mimeType: { type: String, trim: true },
          size: { type: Number, default: 0 },
          type: { type: String, trim: true },
          previewUrl: { type: String, trim: true },
          thumbnailUrl: { type: String, trim: true },
          isPrimary: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    figmaUrl: {
      type: String,
      trim: true,
    },
    canvaUrl: {
      type: String,
      trim: true,
    },
    googleDriveUrl: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [VALIDATION.FEEDBACK_MAX_LENGTH, 'Notes cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

contributionVersionSchema.index({ contributionId: 1, versionNumber: -1 });

const contributionSchema = new mongoose.Schema(
  {
    contributionId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [VALIDATION.TITLE_MAX_LENGTH, 'Title cannot exceed 255 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [VALIDATION.DESCRIPTION_MAX_LENGTH, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      enum: Object.values(CATEGORY),
      required: [true, 'Category is required'],
      index: true,
    },
    contributionType: {
      type: String,
      enum: Object.values(CONTRIBUTION_TYPE),
      required: [true, 'Contribution type is required'],
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.PENDING,
      index: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Submitted by is required'],
      index: true,
    },
    currentVersion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContributionVersion',
      default: null,
    },
    versions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'ContributionVersion',
      default: [],
    },
    skillsUsed: {
      type: [String],
      default: [],
      index: false,
    },
    hoursWorked: {
      type: Number,
      default: 0,
      min: [0, 'Hours worked cannot be negative'],
    },
    tags: {
      type: [String],
      default: [],
      maxlength: [VALIDATION.TAGS_MAX, `Cannot exceed ${VALIDATION.TAGS_MAX} tags`],
    },
    adminAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    reviewDeadline: {
      type: Date,
      default: null,
      index: true,
    },
    totalCoinsAwarded: {
      type: Number,
      default: 0,
      min: [0, 'Total coins awarded cannot be negative'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    visibility: {
      type: String,
      enum: Object.values(VISIBILITY),
      default: VISIBILITY.PRIVATE,
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
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

contributionSchema.index({ status: 1, category: 1 });
contributionSchema.index({ contributionType: 1, status: 1 });
contributionSchema.index({ submittedBy: 1, status: 1 });
contributionSchema.index({ submittedBy: 1, createdAt: -1 });
contributionSchema.index({ tags: 1 });
contributionSchema.index({ visibility: 1, status: 1 });
contributionSchema.index({ isFeatured: 1, status: 1 });
contributionSchema.index({ reviewDeadline: 1 }, { sparse: true });
contributionSchema.index({ adminAssigned: 1, status: 1 });

contributionSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const contributionReviewSchema = new mongoose.Schema(
  {
    contributionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contribution',
      required: [true, 'Contribution ID is required'],
      index: true,
    },
    versionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContributionVersion',
      default: null,
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reviewed by is required'],
      index: true,
    },
    action: {
      type: String,
      enum: Object.values(REVIEW_ACTION),
      required: [true, 'Review action is required'],
    },
    coinsAwarded: {
      type: Number,
      default: 0,
      min: [0, 'Coins awarded cannot be negative'],
    },
    badgeAwarded: {
      type: String,
      trim: true,
    },
    reason: {
      type: String,
      trim: true,
      maxlength: [VALIDATION.FEEDBACK_MAX_LENGTH, 'Reason cannot exceed 1000 characters'],
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: [VALIDATION.FEEDBACK_MAX_LENGTH, 'Feedback cannot exceed 1000 characters'],
    },
    internalNotes: {
      type: String,
      trim: true,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

contributionReviewSchema.index({ contributionId: 1, createdAt: -1 });
contributionReviewSchema.index({ reviewedBy: 1, createdAt: -1 });
contributionReviewSchema.index({ contributionId: 1, versionId: 1 });

const Contribution = mongoose.model('Contribution', contributionSchema);
const ContributionVersion = mongoose.model('ContributionVersion', contributionVersionSchema);
const ContributionReview = mongoose.model('ContributionReview', contributionReviewSchema);

module.exports = {
  Contribution,
  ContributionVersion,
  ContributionReview,
};
