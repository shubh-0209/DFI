const mongoose = require('mongoose');
const { PROGRAM_STATUS, PROGRAM_MODE } = require('./program.constants');

const programSchema = new mongoose.Schema(
  {
    programId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Program title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [10000, 'Description cannot exceed 10000 characters'],
    },
    category: {
      type: String,
      trim: true,
      maxlength: [50, 'Category cannot exceed 50 characters'],
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [30, 'Each tag cannot exceed 30 characters'],
      },
    ],
    mode: {
      type: String,
      enum: Object.values(PROGRAM_MODE),
      default: PROGRAM_MODE.OFFLINE,
    },
    status: {
      type: String,
      enum: Object.values(PROGRAM_STATUS),
      default: PROGRAM_STATUS.DRAFT,
    },
    approvalRequired: {
      type: Boolean,
      default: false,
    },
    maxVolunteers: {
      type: Number,
      min: [1, 'Max volunteers must be at least 1'],
      max: [100000, 'Max volunteers cannot exceed 100000'],
      default: null,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    registrationDeadline: {
      type: Date,
    },
    country: {
      type: String,
      trim: true,
      default: 'India',
    },
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    customFields: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    programType: {
      type: String,
      enum: ['offline', 'field', 'remote'],
      required: true,
      default: 'offline',
    },
    activeQrToken: {
      token: { type: String, default: null },
      type: { type: String, enum: ['checkin', 'checkout'], default: null },
      expiresAt: { type: Date, default: null }
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    allowedRadiusMeters: {
      type: Number,
      default: 100,
    },
    verificationMethod: {
      type: String,
      enum: ['qr_and_gps', 'gps_only', 'offline_token', 'selfie'],
      default: 'qr_and_gps',
    },
    activeQrSecret: {
      type: String,
      default: null,
    },
    rewardCoins: {
      type: Number,
      min: [0, 'Reward coins cannot be negative'],
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isDeleted: {
      type: Boolean,
      default: false,
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

programSchema.index({ status: 1 });
programSchema.index({ category: 1 });
programSchema.index({ mode: 1 });
programSchema.index({ startDate: 1 });
programSchema.index({ endDate: 1 });
programSchema.index({ createdBy: 1 });
programSchema.index({ isDeleted: 1 });
programSchema.index({ createdAt: -1 });

programSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Program = mongoose.model('Program', programSchema);

module.exports = Program;
