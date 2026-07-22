const mongoose = require('mongoose');

const beneficiaryVerificationSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      index: true,
    },
    verifierName: {
      type: String,
      required: [true, 'Verifier name is required'],
      trim: true,
    },
    verifierMobile: {
      type: String,
      required: [true, 'Verifier mobile number is required'],
      trim: true,
    },
    verifierRole: {
      type: String,
      required: [true, 'Verifier role is required'],
      trim: true,
    },
    verificationToken: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'yes', 'no'],
      default: 'pending',
      index: true,
    },
    respondedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const BeneficiaryVerification = mongoose.model('BeneficiaryVerification', beneficiaryVerificationSchema);

module.exports = BeneficiaryVerification;
