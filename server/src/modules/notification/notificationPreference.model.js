const mongoose = require('mongoose');

const notificationPreferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      unique: true,
      index: true,
    },
    inAppEnabled: {
      type: Boolean,
      default: true,
    },
    emailEnabled: {
      type: Boolean,
      default: false,
    },
    pushEnabled: {
      type: Boolean,
      default: false,
    },
    smsEnabled: {
      type: Boolean,
      default: false,
    },
    types: {
      type: Map,
      of: Boolean,
      default: () => ({
        application: true,
        program: true,
        attendance: true,
        certificate: true,
        reward: true,
        leaderboard: true,
        system: true,
        announcement: true,
      }),
    },
    quietHours: {
      enabled: {
        type: Boolean,
        default: false,
      },
      startTime: {
        type: String,
        default: '22:00',
        match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM'],
      },
      endTime: {
        type: String,
        default: '08:00',
        match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM'],
      },
    },
    digestFrequency: {
      type: String,
      enum: ['instant', 'daily', 'weekly'],
      default: 'instant',
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

notificationPreferenceSchema.index({ user: 1 });

notificationPreferenceSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const NotificationPreference = mongoose.model('NotificationPreference', notificationPreferenceSchema);

module.exports = NotificationPreference;
