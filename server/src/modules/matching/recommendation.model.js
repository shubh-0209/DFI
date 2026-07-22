const mongoose = require('mongoose');

const savedRecommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      default: null,
      index: true,
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    score: {
      type: Number,
      required: [true, 'Score is required'],
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot exceed 100'],
    },
    reasonForRecommendation: {
      type: String,
      trim: true,
      default: '',
    },
    matchingSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    missingSkills: [
      {
        type: String,
        trim: true,
      },
    ],
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

savedRecommendationSchema.index({ user: 1, createdAt: -1 });
savedRecommendationSchema.index({ user: 1, program: 1 });
savedRecommendationSchema.index({ user: 1, volunteer: 1 });

const SavedRecommendation = mongoose.model('SavedRecommendation', savedRecommendationSchema, 'recommendations');

module.exports = SavedRecommendation;
