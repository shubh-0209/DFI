const mongoose = require('mongoose');

const contributionTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Type name is required'],
      trim: true,
      maxlength: [100, 'Type name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

contributionTypeSchema.index({ slug: 1 }, { unique: true });
contributionTypeSchema.index({ isActive: 1, sortOrder: 1 });

contributionTypeSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const ContributionType = mongoose.model('ContributionType', contributionTypeSchema);

module.exports = ContributionType;
