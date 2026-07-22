const mongoose = require('mongoose');
const {
  TYPES,
  PRIORITY,
  TARGET_AUDIENCE,
  STATUS,
  VALIDATION,
} = require('./announcement.constants');

const announcementSchema = new mongoose.Schema(
  {
    announcementId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [VALIDATION.TITLE_MAX_LENGTH, 'Title cannot exceed 255 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [VALIDATION.MESSAGE_MAX_LENGTH, 'Message cannot exceed 2000 characters'],
    },
    type: {
      type: String,
      enum: Object.values(TYPES),
      default: TYPES.GENERAL,
      required: [true, 'Announcement type is required'],
      index: true,
    },
    priority: {
      type: String,
      enum: Object.values(PRIORITY),
      default: PRIORITY.MEDIUM,
      index: true,
    },
    targetAudience: {
      type: String,
      enum: Object.values(TARGET_AUDIENCE),
      default: TARGET_AUDIENCE.ALL_USERS,
      index: true,
    },
    specificUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    scheduledAt: {
      type: Date,
      default: null,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by is required'],
      index: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    attachments: {
      type: [
        {
          name: { type: String, trim: true },
          url: { type: String, trim: true },
          type: { type: String, trim: true, default: 'file' },
          size: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
    // ── New fields ──────────────────────────────────────────────────
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },
    // Tracks which users have read this announcement (per-volunteer read state)
    readBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    // Optional call-to-action button displayed on the announcement card / detail
    actionButton: {
      type: {
        label: { type: String, trim: true },
        url: { type: String, trim: true },
      },
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.DRAFT,
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
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

announcementSchema.index({ type: 1, status: 1 });
announcementSchema.index({ targetAudience: 1, status: 1 });
announcementSchema.index({ createdBy: 1, createdAt: -1 });
announcementSchema.index({ scheduledAt: 1 }, { sparse: true });
announcementSchema.index({ expiresAt: 1 }, { sparse: true });
announcementSchema.index({ isPinned: 1, status: 1 });

announcementSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
