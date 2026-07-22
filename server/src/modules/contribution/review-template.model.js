const mongoose = require('mongoose');

const reviewTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Template name is required'],
      trim: true,
      maxlength: [100, 'Template name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      trim: true,
      index: true,
    },
    templateText: {
      type: String,
      required: [true, 'Template text is required'],
      trim: true,
      maxlength: [1000, 'Template text cannot exceed 1000 characters'],
    },
    action: {
      type: String,
      enum: ['approved', 'rejected', 'needs_changes'],
      index: true,
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

reviewTemplateSchema.index({ category: 1, action: 1, isActive: 1 });

reviewTemplateSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const ReviewTemplate = mongoose.model('ReviewTemplate', reviewTemplateSchema);

module.exports = ReviewTemplate;
