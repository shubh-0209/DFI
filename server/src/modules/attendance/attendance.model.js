const mongoose = require('mongoose');
const { ATTENDANCE_STATUS, VALIDATION } = require('./attendance.constants');

const attendanceSchema = new mongoose.Schema(
  {
    // ─── Identification ──────────────────────────────────────────────
    attendanceId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    // ─── Relationships ───────────────────────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'Application reference is required'],
      index: true,
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: [true, 'Program reference is required'],
      index: true,
    },

    // ─── Attendance Information ──────────────────────────────────────
    attendanceDate: {
      type: Date,
      required: [true, 'Attendance date is required'],
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(ATTENDANCE_STATUS),
      required: [true, 'Attendance status is required'],
      default: ATTENDANCE_STATUS.PRESENT,
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    totalHours: {
      type: Number,
      default: 0,
      min: [0, 'Total hours cannot be negative'],
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: [
        VALIDATION.REMARKS_MAX_LENGTH,
        `Remarks cannot exceed ${VALIDATION.REMARKS_MAX_LENGTH} characters`,
      ],
    },
    checkInCoordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    },
    checkOutCoordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    },
    deviceInfo: {
      userAgent: { type: String },
      ipAddress: { type: String }
    },
    checkInType: {
      type: String,
      enum: ['qr', 'gps'],
      default: 'gps'
    },
    villageName: {
      type: String,
      trim: true
    },
    isOfflineSync: {
      type: Boolean,
      default: false
    },
    flaggedReason: {
      type: String,
      default: null
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Admin/Coordinator who marked this attendance is required'],
    },

    // ─── Audit & Soft Delete ─────────────────────────────────────────
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

// ─── Compound Indexes ────────────────────────────────────────────────
// Prevent a user from having duplicate attendance for the same program on the same day.
// We index by user, program, and attendanceDate.
// Note: attendanceDate must be normalized to midnight UTC to effectively use a unique constraint,
// but indexing the raw date is still beneficial for queries.
attendanceSchema.index({ user: 1, program: 1, attendanceDate: 1 });
// Dashboard optimization
attendanceSchema.index({ user: 1, isDeleted: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
