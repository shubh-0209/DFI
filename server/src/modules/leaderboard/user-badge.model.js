const mongoose = require('mongoose');

const userBadgeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BadgeDefinition',
      required: [true, 'Badge reference is required'],
    },
    badgeId: {
      type: String,
      required: [true, 'Badge ID is required'],
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Badge name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Badge description is required'],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, 'Badge icon is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Badge category is required'],
      trim: true,
      index: true,
    },
    earnedAt: {
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
  },
  {
    timestamps: true,
  }
);

userBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });
userBadgeSchema.index({ user: 1, earnedAt: -1 });

userBadgeSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const UserBadge = mongoose.model('UserBadge', userBadgeSchema);

module.exports = UserBadge;
