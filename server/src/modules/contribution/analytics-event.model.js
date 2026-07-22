const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      trim: true,
      index: true,
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
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
    status: {
      type: String,
      trim: true,
      index: true,
    },
    coins: {
      type: Number,
      default: 0,
    },
    badge: {
      type: String,
      trim: true,
    },
    timeToReview: {
      type: Number,
      default: 0,
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

analyticsEventSchema.index({ eventType: 1, createdAt: -1 });
analyticsEventSchema.index({ entityType: 1, entityId: 1 });
analyticsEventSchema.index({ userId: 1, createdAt: -1 });
analyticsEventSchema.index({ category: 1, createdAt: -1 });

analyticsEventSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);

module.exports = AnalyticsEvent;
