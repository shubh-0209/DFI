const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema(
  {
    leaderboardId: {
      type: String,
      unique: true,
      required: [true, 'Leaderboard ID is required'],
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
      index: true,
    },

    currentRank: {
      type: Number,
      default: null,
      min: [1, 'Rank must be at least 1'],
      index: true,
    },
    cityRank: {
      type: Number,
      default: null,
      min: [1, 'City rank must be at least 1'],
      index: true,
    },
    stateRank: {
      type: Number,
      default: null,
      min: [1, 'State rank must be at least 1'],
      index: true,
    },
    nationalRank: {
      type: Number,
      default: null,
      min: [1, 'National rank must be at least 1'],
      index: true,
    },

    totalPoints: {
      type: Number,
      default: 0,
      min: [0, 'Total points cannot be negative'],
    },
    totalCoins: {
      type: Number,
      default: 0,
      min: [0, 'Total coins cannot be negative'],
    },
    totalImpact: {
      type: Number,
      default: 0,
      min: [0, 'Total impact cannot be negative'],
    },
    totalVolunteerHours: {
      type: Number,
      default: 0,
      min: [0, 'Total volunteer hours cannot be negative'],
    },
    totalProgramsCompleted: {
      type: Number,
      default: 0,
      min: [0, 'Total programs completed cannot be negative'],
    },

    badges: {
      type: [String],
      default: [],
    },
    achievements: {
      type: [String],
      default: [],
    },

    city: {
      type: String,
      trim: true,
      index: true,
    },
    state: {
      type: String,
      trim: true,
      index: true,
    },
    country: {
      type: String,
      trim: true,
      default: 'India',
      index: true,
    },

    lastCalculatedAt: {
      type: Date,
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

leaderboardSchema.index({ currentRank: 1 });
leaderboardSchema.index({ nationalRank: 1 });
leaderboardSchema.index({ cityRank: 1 });
leaderboardSchema.index({ stateRank: 1 });
leaderboardSchema.index({ user: 1, isDeleted: 1 });

leaderboardSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

module.exports = Leaderboard;
