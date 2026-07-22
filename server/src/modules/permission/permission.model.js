const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
  {
    permissionId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    module: {
      type: String,
      required: [true, 'Module is required'],
      trim: true,
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Permission code is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      trim: true,
    },
    isSystemPermission: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes optimized for queries
permissionSchema.index({ module: 1 });
permissionSchema.index({ action: 1, module: 1 });
permissionSchema.index({ code: 1 }, { unique: true });
permissionSchema.index({ isSystemPermission: 1 });
permissionSchema.index({ category: 1 });

permissionSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;