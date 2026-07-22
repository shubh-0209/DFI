const mongoose = require('mongoose');

const achievementDefinitionSchema = new mongoose.Schema(
  {
    achievementId: {
      type: String,
      unique: true,
      required: [true, 'Achievement ID is required'],
      trim: true,
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
    criteria: {
      type: {
        type: String,
        required: true,
        enum: ['programs_completed', 'volunteer_hours', 'impact_score', 'coins', 'points', 'certificates', 'attendance_days', 'streak_days', 'custom'],
      },
      target: { type: Number, required: true, min: 0 },
      programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', default: null },
      customCondition: { type: String, trim: true, default: '' },
    },
    rewardPoints: {
      type: Number,
      default: 0,
      min: [0, 'Reward points cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
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

achievementDefinitionSchema.index({ achievementId: 1 });
achievementDefinitionSchema.index({ category: 1, isActive: 1 });

achievementDefinitionSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const AchievementDefinition = mongoose.model('AchievementDefinition', achievementDefinitionSchema);

module.exports = AchievementDefinition;
