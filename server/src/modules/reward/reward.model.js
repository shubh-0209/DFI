const mongoose = require('mongoose');
const { generateRewardId } = require('./reward.utils');

const rewardSchema = new mongoose.Schema(
  {
    // ─── Identification ──────────────────────────────────────────────
    rewardId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      default: generateRewardId,
    },

    // ─── Ownership ───────────────────────────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
      index: true,
    },

    // ─── Balances ─────────────────────────────────────────────────────
    currentCoins: {
      type: Number,
      default: 0,
      min: [0, 'Coins cannot be negative'],
    },
    currentPoints: {
      type: Number,
      default: 0,
      min: [0, 'Points cannot be negative'],
    },
    currentImpactScore: {
      type: Number,
      default: 0,
      min: [0, 'Impact score cannot be negative'],
    },
    currentVolunteerHours: {
      type: Number,
      default: 0,
      min: [0, 'Volunteer hours cannot be negative'],
    },

    // ─── Totals ───────────────────────────────────────────────────────
    totalCertificates: {
      type: Number,
      default: 0,
      min: [0, 'Total certificates cannot be negative'],
    },
    totalProgramsCompleted: {
      type: Number,
      default: 0,
      min: [0, 'Total programs completed cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

rewardSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Reward = mongoose.model('Reward', rewardSchema);

module.exports = Reward;
