const mongoose = require('mongoose');

const ticketReplySchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SupportTicket',
      required: [true, 'Ticket ID is required'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    message: {
      type: String,
      required: [true, 'Reply message is required'],
      maxlength: [2000, 'Reply message cannot exceed 2000 characters'],
    },
    isInternal: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ticketReplySchema.index({ ticketId: 1, createdAt: 1 });

ticketReplySchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const TicketReply = mongoose.model('TicketReply', ticketReplySchema);

module.exports = TicketReply;
