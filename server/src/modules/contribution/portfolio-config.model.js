const mongoose = require('mongoose');

const portfolioConfigSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Config key is required'],
      trim: true,
      unique: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Config value is required'],
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

portfolioConfigSchema.index({ key: 1 }, { unique: true });
portfolioConfigSchema.index({ isActive: 1 });

portfolioConfigSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const PortfolioConfig = mongoose.model('PortfolioConfig', portfolioConfigSchema);

module.exports = PortfolioConfig;
