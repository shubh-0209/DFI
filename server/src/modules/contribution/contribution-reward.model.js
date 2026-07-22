const mongoose = require('mongoose');

const contributionRewardSchema = new mongoose.Schema(
  {
    contributionRewardId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    contributionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contribution',
      required: [true, 'Contribution ID is required'],
      index: true,
    },
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContributionReview',
      required: [true, 'Review ID is required'],
      index: true,
    },
    rewardTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RewardTransaction',
      default: null,
    },
    coinsAwarded: {
      type: Number,
      required: [true, 'Coins awarded is required'],
      min: [0, 'Coins awarded cannot be negative'],
    },
    badgeAwarded: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    failureReason: {
      type: String,
      trim: true,
    },
    retryCount: {
      type: Number,
      default: 0,
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

contributionRewardSchema.index({ userId: 1, createdAt: -1 });
contributionRewardSchema.index({ contributionId: 1 });
contributionRewardSchema.index({ reviewId: 1 });
contributionRewardSchema.index({ status: 1 });

contributionRewardSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const ContributionReward = mongoose.model('ContributionReward', contributionRewardSchema);

module.exports = ContributionReward;
