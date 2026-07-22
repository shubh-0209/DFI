const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    portfolioId: {
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
    contributionVersionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContributionVersion',
      default: null,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      index: true,
    },
    contributionType: {
      type: String,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
    },
    publicUrl: {
      type: String,
      trim: true,
    },
    coinsEarned: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    order: {
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

portfolioSchema.index({ userId: 1, featured: 1, createdAt: -1 });
portfolioSchema.index({ userId: 1, category: 1 });
portfolioSchema.index({ contributionId: 1 }, { unique: true, sparse: true });

portfolioSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
