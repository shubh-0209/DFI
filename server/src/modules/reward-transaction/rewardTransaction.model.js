const mongoose = require('mongoose');
const { TRANSACTION_TYPE } = require('./rewardTransaction.constants');

const rewardTransactionSchema = new mongoose.Schema(
  {
    // ─── Identification ──────────────────────────────────────────────
    transactionId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    // ─── Ownership ───────────────────────────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },

    // ─── Optional Context References ─────────────────────────────────
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      default: null,
    },
    certificate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate',
      default: null,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      default: null,
    },
    attendance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attendance',
      default: null,
    },

    // ─── Transaction Data ─────────────────────────────────────────────
    type: {
      type: String,
      enum: Object.values(TRANSACTION_TYPE),
      required: [true, 'Transaction type is required'],
      index: true,
    },
    reason: {
      type: String,
      trim: true,
      required: [true, 'Reason is required'],
      maxlength: [500, 'Reason cannot exceed 500 characters'],
    },
    coins: {
      type: Number,
      default: 0,
    },
    points: {
      type: Number,
      default: 0,
    },
    impact: {
      type: Number,
      default: 0,
    },
    // ─── Soft Delete ─────────────────────────────────────────────────
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

rewardTransactionSchema.index({ user: 1, createdAt: -1 });
rewardTransactionSchema.index({ type: 1 });
// Dashboard optimization
rewardTransactionSchema.index({ user: 1, isDeleted: 1 });

rewardTransactionSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const RewardTransaction = mongoose.model('RewardTransaction', rewardTransactionSchema);

module.exports = RewardTransaction;
