const mongoose = require('mongoose');
const { APPLICATION_STATUS } = require('./application.constants');

const applicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: [true, 'Program is required'],
    },
    answers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // Optional notes from admins/reviewers regarding the application
    reviewNotes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.APPLIED,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    joinedAt: {
      type: Date,
      default: null,
    },
    withdrawnAt: {
      type: Date,
      default: null,
    },
    withdrawnBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    proofUrl: {
      type: String,
      trim: true,
      default: null,
    },
    proofNotes: {
      type: String,
      trim: true,
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isAudited: {
      type: Boolean,
      default: false,
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
  },
  {
    timestamps: true,
  }
);

// ─── Compound Indexes ────────────────────────────────────────────────
applicationSchema.index({ user: 1 });
applicationSchema.index({ program: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ appliedAt: -1 });
// Prevent a volunteer from submitting more than one active application per program
applicationSchema.index(
  { user: 1, program: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: false,
      status: { $in: ['applied', 'joined', 'approved'] },
    },
  }
);
// Dashboard optimization
applicationSchema.index({ user: 1, isDeleted: 1, status: 1 });

applicationSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
