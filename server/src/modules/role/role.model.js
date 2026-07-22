const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    roleId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      default: null,
    },
    name: {
      type: String,
      required: [true, 'Role name is required'],
      trim: true,
      maxlength: [100, 'Role name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Role slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
      },
    ],
    isSystemRole: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
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
  },
  {
    timestamps: true,
  }
);

// Indexes optimized for queries
roleSchema.index({ slug: 1 }, { unique: true });
roleSchema.index({ organization: 1 });
roleSchema.index({ isSystemRole: 1 });
roleSchema.index({ isActive: 1 });

roleSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;