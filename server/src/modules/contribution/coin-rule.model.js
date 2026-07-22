const mongoose = require('mongoose');

const coinRuleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Coin rule name is required'],
      trim: true,
      maxlength: [100, 'Coin rule name cannot exceed 100 characters'],
    },
    contributionCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContributionCategory',
      default: null,
      index: true,
    },
    contributionType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContributionType',
      default: null,
      index: true,
    },
    coins: {
      type: Number,
      required: [true, 'Coins amount is required'],
      min: [0, 'Coins cannot be negative'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    priority: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

coinRuleSchema.index({ contributionCategory: 1, isActive: 1 });
coinRuleSchema.index({ contributionType: 1, isActive: 1 });
coinRuleSchema.index({ isActive: 1, priority: -1 });

coinRuleSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const CoinRule = mongoose.model('CoinRule', coinRuleSchema);

module.exports = CoinRule;
