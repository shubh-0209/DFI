const mongoose = require('mongoose');
const { NOTIFICATION_TYPES, PRIORITY, CHANNEL, STATUS } = require('./notification.constants');

const notificationSchema = new mongoose.Schema(
  {
    notificationId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient is required'],
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [255, 'Title cannot exceed 255 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      required: [true, 'Notification type is required'],
      index: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'announcement',
      index: true,
    },
    actionUrl: {
      type: String,
      trim: true,
      default: null,
    },
    icon: {
      type: String,
      trim: true,
      default: null,
    },
    priority: {
      type: String,
      enum: Object.values(PRIORITY),
      default: PRIORITY.MEDIUM,
      index: true,
    },
    channel: {
      type: String,
      enum: Object.values(CHANNEL),
      default: CHANNEL.IN_APP,
    },
    relatedEntityType: {
      type: String,
      trim: true,
      default: null,
    },
    relatedEntityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    scheduledFor: {
      type: Date,
      default: null,
      index: true,
    },
    sentAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.PENDING,
      index: true,
    },
    failureReason: {
      type: String,
      trim: true,
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

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1, status: 1 });
notificationSchema.index({ relatedEntityType: 1, relatedEntityId: 1 });
notificationSchema.index({ expiresAt: 1 }, { sparse: true, expireAfterSeconds: 0 });
// Dashboard optimization
notificationSchema.index({ recipient: 1, isDeleted: 1, isRead: 1 });

notificationSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
