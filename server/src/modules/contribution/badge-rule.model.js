const mongoose = require('mongoose');

const badgeRuleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Badge name is required'],
      trim: true,
      maxlength: [100, 'Badge name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    icon: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      index: true,
    },
    requirements: {
      type: {
        approvedContributions: { type: Number, default: 0 },
        totalCoins: { type: Number, default: 0 },
        specificCategory: { type: String, trim: true },
        specificType: { type: String, trim: true },
      },
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    sortOrder: {
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

badgeRuleSchema.index({ slug: 1 }, { unique: true });
badgeRuleSchema.index({ isActive: 1, sortOrder: 1 });

badgeRuleSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const BadgeRule = mongoose.model('BadgeRule', badgeRuleSchema);

module.exports = BadgeRule;
