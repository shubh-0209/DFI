const mongoose = require('mongoose');
const { ORGANIZATION_TYPE, VERIFICATION_STATUS } = require('./organization.constants');

const organizationSchema = new mongoose.Schema(
  {
    organizationId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
      maxlength: [150, 'Organization name cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    shortName: {
      type: String,
      trim: true,
      maxlength: [50, 'Short name cannot exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    logo: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number'],
    },
    website: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters'],
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: 'India',
    },
    pincode: {
      type: String,
      trim: true,
    },
    socialLinks: {
      type: {
        facebook: { type: String, trim: true },
        twitter: { type: String, trim: true },
        linkedin: { type: String, trim: true },
        instagram: { type: String, trim: true },
        github: { type: String, trim: true },
      },
      default: {},
    },
    foundedYear: {
      type: Number,
      min: [1000, 'Founded year is not valid'],
      max: [new Date().getFullYear(), 'Founded year cannot be in the future'],
    },
    organizationType: {
      type: String,
      enum: Object.values(ORGANIZATION_TYPE),
      default: null,
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.PENDING,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewNotes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Review notes cannot exceed 1000 characters'],
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
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

// Indexes optimized for queries
organizationSchema.index({ name: 1 });
organizationSchema.index({ slug: 1 }, { unique: true, sparse: true });
organizationSchema.index({ organizationId: 1 }, { unique: true, sparse: true });
organizationSchema.index({ organizationType: 1 });
organizationSchema.index({ verificationStatus: 1 });
organizationSchema.index({ isActive: 1 });
organizationSchema.index({ createdAt: -1 });
organizationSchema.index({ owner: 1 });
organizationSchema.index({ 'socialLinks.facebook': 1, 'socialLinks.twitter': 1, 'socialLinks.linkedin': 1 });

organizationSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;