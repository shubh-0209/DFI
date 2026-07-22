const mongoose = require('mongoose');

const badgeDefinitionSchema = new mongoose.Schema(
  {
    badgeId: {
      type: String,
      unique: true,
      required: [true, 'Badge ID is required'],
      trim: true,
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
    criteria: {
      type: {
        type: String,
        required: true,
        enum: ['programs_completed', 'volunteer_hours', 'impact_score', 'coins', 'points', 'certificates', 'attendance_days', 'custom'],
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

badgeDefinitionSchema.index({ badgeId: 1 });
badgeDefinitionSchema.index({ category: 1, isActive: 1 });

badgeDefinitionSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const BadgeDefinition = mongoose.model('BadgeDefinition', badgeDefinitionSchema);

module.exports = BadgeDefinition;
