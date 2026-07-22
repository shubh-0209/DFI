const mongoose = require('mongoose');
const { ROLES, STATUS } = require('./user.constants');

const userSchema = new mongoose.Schema(
  {
    // ─── Authentication & System Fields ─────────────────────────
    volunteerId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.VOLUNTEER,
    },
    permissions: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.PENDING,
    },

    // ─── Basic Information ───────────────────────────────────────
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, 'Please fill a valid phone number'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    },
    dateOfBirth: {
      type: Date,
    },

    // ─── Education ───────────────────────────────────────────────
    college: {
      type: String,
      trim: true,
    },
    course: {
      type: String,
      trim: true,
    },
    graduationYear: {
      type: Number,
    },
    educationLevel: {
      type: String,
      trim: true,
    },

    // ─── Location ────────────────────────────────────────────────
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

    // ─── Volunteer Profile ───────────────────────────────────────
    profilePhoto: {
      type: String,
      default: '',
    },
    about: {
      type: String,
      trim: true,
      maxlength: [500, 'About section cannot exceed 500 characters'],
    },
    languages: [{ type: String, trim: true }],
    skills: [{ type: String, trim: true }],
    interests: [{ type: String, trim: true }],
    availability: [{ type: String, trim: true }],
    resume: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    portfolio: {
      type: String,
      trim: true,
    },

    // ─── Volunteer Statistics ────────────────────────────────────
    points: {
      type: Number,
      default: 0,
      min: [0, 'Points cannot be negative'],
    },
    hoursCompleted: {
      type: Number,
      default: 0,
      min: [0, 'Hours completed cannot be negative'],
    },
    programsJoined: {
      type: Number,
      default: 0,
      min: [0, 'Programs joined cannot be negative'],
    },
    programsCompleted: {
      type: Number,
      default: 0,
      min: [0, 'Programs completed cannot be negative'],
    },
    certificatesEarned: {
      type: Number,
      default: 0,
      min: [0, 'Certificates earned cannot be negative'],
    },
    referralCount: {
      type: Number,
      default: 0,
      min: [0, 'Referral count cannot be negative'],
    },
    impactScore: {
      type: Number,
      default: 0,
      min: [0, 'Impact score cannot be negative'],
    },
    // ─── Coins ───────────────────────────────────────────────────────
    coins: {
      type: Number,
      default: 0,
      min: [0, 'Coins cannot be negative'],
    },

    // ─── Profile Progress ────────────────────────────────────────
    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    profileStrength: {
      type: String,
      enum: ['Weak', 'Average', 'Good', 'Excellent'],
      default: 'Weak',
    },
    volunteerLevel: {
      type: String,
      enum: ['Beginner', 'Contributor', 'Mentor', 'Leader', 'Ambassador', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Legend'],
      default: 'Beginner',
    },
    trustScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 80,
    },

    // ─── Settings & Preferences ──────────────────────────────────
    notificationPreferences: {
      emailNotifications: { type: Boolean, default: true },
      platformNotifications: { type: Boolean, default: true },
      contributionUpdates: { type: Boolean, default: true },
      announcementNotifications: { type: Boolean, default: true },
      marketplaceUpdates: { type: Boolean, default: true },
    },
    privacySettings: {
      publicProfile: { type: Boolean, default: true },
      contributionVisibility: { type: Boolean, default: true },
      contactVisibility: { type: Boolean, default: false },
    },
    appearance: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
      language: { type: String, default: 'en' },
    },

    // ─── Soft Delete Fields ──────────────────────────────────────
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

    // ─── Integration & Token Fields ──────────────────────────────
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    supabaseId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    lastLogin: {
      type: Date,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ─────────────────────────────────────────────────────
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ points: -1 });
userSchema.index({ isDeleted: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ googleId: 1 }, { sparse: true });
// Compound index for ultra-fast volunteer rank querying
userSchema.index({ role: 1, isDeleted: 1, coins: -1 });
// Indexes for location fields
userSchema.index({ state: 1 });
userSchema.index({ city: 1 });

// ─── JSON Transform ──────────────────────────────────────────────
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.refreshToken;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
