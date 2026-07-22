const mongoose = require('mongoose');

const fileTypeConfigSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'File type name is required'],
      trim: true,
      maxlength: [100, 'File type name cannot exceed 100 characters'],
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      trim: true,
    },
    extension: {
      type: String,
      required: [true, 'Extension is required'],
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      enum: ['image', 'document', 'video', 'archive', 'other'],
      required: [true, 'Category is required'],
      index: true,
    },
    maxSize: {
      type: Number,
      required: [true, 'Max size is required'],
      min: [0, 'Max size cannot be negative'],
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

fileTypeConfigSchema.index({ extension: 1, isActive: 1 }, { unique: true });
fileTypeConfigSchema.index({ mimeType: 1, isActive: 1 });
fileTypeConfigSchema.index({ category: 1, isActive: 1 });

fileTypeConfigSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const FileTypeConfig = mongoose.model('FileTypeConfig', fileTypeConfigSchema);

module.exports = FileTypeConfig;
