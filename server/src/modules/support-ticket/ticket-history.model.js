const mongoose = require('mongoose');

const ticketHistorySchema = new mongoose.Schema(
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
      required: [true, 'User ID is required'],
      index: true,
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      enum: ['created', 'updated', 'status_changed', 'assigned', 'resolved', 'closed', 'deleted', 'replied', 'priority_changed', 'category_changed', 'escalated'],
      index: true,
    },
    field: {
      type: String,
      required: [true, 'Field is required'],
      enum: ['subject', 'description', 'priority', 'category', 'status', 'assignedTo', 'resolution', 'reply', 'escalation', 'ticket'],
      index: true,
    },
    oldValue: {
      type: String,
      default: null,
    },
    newValue: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
      maxlength: 500,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

ticketHistorySchema.index({ ticketId: 1, createdAt: -1 });
ticketHistorySchema.index({ userId: 1, action: 1 });

ticketHistorySchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const TicketHistory = mongoose.model('TicketHistory', ticketHistorySchema);

module.exports = TicketHistory;
