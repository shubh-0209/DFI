const mongoose = require('mongoose');

const userAchievementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    achievement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AchievementDefinition',
      required: [true, 'Achievement reference is required'],
    },
    achievementId: {
      type: String,
      required: [true, 'Achievement ID is required'],
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Achievement title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Achievement description is required'],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, 'Achievement icon is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Achievement category is required'],
      trim: true,
      index: true,
    },
    criteriaType: {
      type: String,
      required: [true, 'Criteria type is required'],
      trim: true,
    },
    target: {
      type: Number,
      required: [true, 'Target is required'],
      min: [0, 'Target cannot be negative'],
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, 'Progress cannot be negative'],
    },
    completed: {
      type: Boolean,
      default: false,
      index: true,
    },
    completedAt: {
      type: Date,
      default: null,
      index: true,
    },
    rewardPoints: {
      type: Number,
      default: 0,
      min: [0, 'Reward points cannot be negative'],
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

userAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });
userAchievementSchema.index({ user: 1, completed: 1, completedAt: -1 });

userAchievementSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);

module.exports = UserAchievement;
