const mongoose = require('mongoose');

const contributionStatisticsSchema = new mongoose.Schema(
  {
    statisticsId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
      index: true,
    },
    totalContributions: {
      type: Number,
      default: 0,
      min: [0, 'Total contributions cannot be negative'],
    },
    approvedContributions: {
      type: Number,
      default: 0,
      min: [0, 'Approved contributions cannot be negative'],
    },
    rejectedContributions: {
      type: Number,
      default: 0,
      min: [0, 'Rejected contributions cannot be negative'],
    },
    pendingContributions: {
      type: Number,
      default: 0,
      min: [0, 'Pending contributions cannot be negative'],
    },
    draftContributions: {
      type: Number,
      default: 0,
      min: [0, 'Draft contributions cannot be negative'],
    },
    needsChangesContributions: {
      type: Number,
      default: 0,
      min: [0, 'Needs changes contributions cannot be negative'],
    },
    categoryCounts: {
      type: Map,
      of: { type: Number, default: 0 },
      default: {},
    },
    totalHoursContributed: {
      type: Number,
      default: 0,
      min: [0, 'Total hours contributed cannot be negative'],
    },
    totalCoinsEarned: {
      type: Number,
      default: 0,
      min: [0, 'Total coins earned cannot be negative'],
    },
    totalFilesUploaded: {
      type: Number,
      default: 0,
      min: [0, 'Total files uploaded cannot be negative'],
    },
    averageReviewTime: {
      type: Number,
      default: 0,
    },
    lastContributionAt: {
      type: Date,
      default: null,
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
  },
  {
    timestamps: true,
  }
);

contributionStatisticsSchema.index({ userId: 1 });

contributionStatisticsSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const ContributionStatistics = mongoose.model('ContributionStatistics', contributionStatisticsSchema);

module.exports = ContributionStatistics;
