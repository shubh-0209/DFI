const mongoose = require('mongoose');

const eventEvidenceSchema = new mongoose.Schema(
  {
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
      index: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    groupPhotos: [{ type: String }],
    eventPhotos: [{ type: String }],
    summary: {
      type: String,
      required: [true, 'Event summary is required'],
      trim: true,
    },
    totalHours: {
      type: Number,
      min: [0, 'Total hours cannot be negative'],
    },
    numberOfBeneficiaries: {
      type: Number,
      min: [0, 'Number of beneficiaries cannot be negative'],
    },
  },
  { timestamps: true }
);

const volunteerEvidenceSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      unique: true, // One evidence submission per application
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
      index: true,
    },
    // Field Program Evidence
    photos: {
      type: [String],
      validate: {
        validator: function (val) {
          // Validate only for field programs (will check in service logic as well)
          return val.length === 0 || (val.length >= 3 && val.length <= 5);
        },
        message: 'Must upload between 3 and 5 photos',
      },
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    beneficiariesCount: {
      type: Number,
      min: [0, 'Beneficiaries count cannot be negative'],
    },
    subjectTaught: {
      type: String,
      trim: true,
    },
    durationMinutes: {
      type: Number,
      min: [0, 'Duration cannot be negative'],
    },
    villageName: {
      type: String,
      trim: true,
    },
    optionalMaterialUrls: [{ type: String }],
    reflection: {
      activityConducted: { type: String, trim: true },
      beneficiariesLearned: { type: String, trim: true },
      challengesFaced: { type: String, trim: true },
      impactCreated: { type: String, trim: true },
    },
    // Remote Program Evidence
    submissionUrl: {
      type: String,
      trim: true,
    },
    submissionFileUrl: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const EventEvidence = mongoose.model('EventEvidence', eventEvidenceSchema);
const VolunteerEvidence = mongoose.model('VolunteerEvidence', volunteerEvidenceSchema);

module.exports = { EventEvidence, VolunteerEvidence };
