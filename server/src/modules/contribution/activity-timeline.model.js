const mongoose = require('mongoose');

const activityTimelineSchema = new mongoose.Schema(
  {
    timelineId: {
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
    action: {
      type: String,
      required: [true, 'Action is required'],
      trim: true,
    },
    entityType: {
      type: String,
      required: [true, 'Entity type is required'],
      trim: true,
      index: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Entity ID is required'],
      index: true,
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
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

activityTimelineSchema.index({ userId: 1, createdAt: -1 });
activityTimelineSchema.index({ entityType: 1, entityId: 1 });

activityTimelineSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const ActivityTimeline = mongoose.model('ActivityTimeline', activityTimelineSchema);

module.exports = ActivityTimeline;
