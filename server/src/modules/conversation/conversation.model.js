const mongoose = require('mongoose');
const { CONVERSATION_TYPES, CONVERSATION_STATUS } = require('./conversation.constants');

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    type: {
      type: String,
      enum: Object.values(CONVERSATION_TYPES),
      default: CONVERSATION_TYPES.PRIVATE,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(CONVERSATION_STATUS),
      default: CONVERSATION_STATUS.ACTIVE,
      index: true,
    },
    lastMessageAt: {
      type: Date,
      default: null,
      index: true,
    },
    lastMessagePreview: {
      type: String,
      default: null,
      maxlength: 255,
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
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

conversationSchema.index({ participants: 1, createdAt: -1 });
conversationSchema.index({ type: 1, status: 1 });

conversationSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
