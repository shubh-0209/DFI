const mongoose = require('mongoose');
const { STATUS, MEMBER_ROLE, TASK_STATUS } = require('./collaboration.constants');

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Workspace name is required'],
      trim: true,
      maxlength: [100, 'Workspace name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
      index: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    memberDetails: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: Object.values(MEMBER_ROLE),
          default: MEMBER_ROLE.MEMBER,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        invitedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          default: null,
        },
      },
    ],
    sharedNotes: [
      {
        title: {
          type: String,
          trim: true,
          maxlength: [100, 'Note title cannot exceed 100 characters'],
        },
        content: {
          type: String,
          trim: true,
          maxlength: [2000, 'Note content cannot exceed 2000 characters'],
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    sharedFiles: [
      {
        name: {
          type: String,
          trim: true,
          required: true,
        },
        url: {
          type: String,
          trim: true,
        },
        fileType: {
          type: String,
          trim: true,
        },
        size: {
          type: Number,
          default: 0,
        },
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    taskAssignments: [
      {
        title: {
          type: String,
          trim: true,
          required: true,
          maxlength: [100, 'Task title cannot exceed 100 characters'],
        },
        description: {
          type: String,
          trim: true,
          maxlength: [500, 'Task description cannot exceed 500 characters'],
        },
        assignedTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        assignedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        status: {
          type: String,
          enum: Object.values(TASK_STATUS),
          default: TASK_STATUS.PENDING,
        },
        dueDate: {
          type: Date,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        completedAt: {
          type: Date,
          default: null,
        },
      },
    ],
    activityLog: [
      {
        action: {
          type: String,
          trim: true,
          required: true,
        },
        performedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        targetType: {
          type: String,
          trim: true,
        },
        targetId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        metadata: {
          type: mongoose.Schema.Types.Mixed,
          default: {},
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    invitations: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        email: {
          type: String,
          trim: true,
          lowercase: true,
        },
        invitedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: Object.values(MEMBER_ROLE),
          default: MEMBER_ROLE.MEMBER,
        },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'declined', 'expired'],
          default: 'pending',
        },
        token: {
          type: String,
          unique: true,
          sparse: true,
        },
        expiresAt: {
          type: Date,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    joinRequests: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        requestedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['pending', 'approved', 'declined'],
          default: 'pending',
        },
        reviewedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        reviewedAt: {
          type: Date,
        },
        message: {
          type: String,
          trim: true,
          maxlength: [200, 'Message cannot exceed 200 characters'],
        },
      },
    ],
    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE,
      index: true,
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

workspaceSchema.index({ createdBy: 1, createdAt: -1 });
workspaceSchema.index({ status: 1, isDeleted: 1 });

workspaceSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const CollaborationWorkspace = mongoose.model('CollaborationWorkspace', workspaceSchema);

module.exports = CollaborationWorkspace;
