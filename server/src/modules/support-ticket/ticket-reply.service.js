const ticketReplyRepository = require('./ticket-reply.repository');
const supportTicketRepository = require('./support-ticket.repository');
const conversationRepository = require('../conversation/conversation.repository');
const NotFoundError = require('../../utils/errors/NotFoundError');
const ValidationError = require('../../utils/errors/ValidationError');

class TicketReplyService {
  async createReply(userId, ticketId, data) {
    const ticket = await supportTicketRepository.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError('Support ticket not found');
    }

    const conversation = await conversationRepository.findById(ticket.conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found for this ticket');
    }

    const isParticipant = conversation.participants.some((p) => p.toString() === userId.toString());
    if (!isParticipant) {
      throw new ValidationError('You are not authorized to reply to this ticket');
    }

    const { message, isInternal = false } = data;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      throw new ValidationError('Reply message is required');
    }

    const reply = await ticketReplyRepository.create({
      ticketId,
      userId,
      message: message.trim(),
      isInternal,
    });

    return {
      reply,
      successMessage: 'Reply added successfully',
    };
  }

  async getReplies(userId, ticketId, query = {}) {
    const ticket = await supportTicketRepository.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError('Support ticket not found');
    }

    const conversation = await conversationRepository.findById(ticket.conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found for this ticket');
    }

    const isParticipant = conversation.participants.some((p) => p.toString() === userId.toString());
    if (!isParticipant) {
      throw new ValidationError('You are not authorized to view replies for this ticket');
    }

    const result = await ticketReplyRepository.findByTicket(ticketId, query);

    return {
      replies: result.replies,
      pagination: {
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 50,
        total: result.total,
        totalPages: Math.ceil(result.total / (Number(query.limit) || 50)) || 1,
      },
      successMessage: 'Replies retrieved successfully',
    };
  }

  async updateReply(userId, replyId, updateData) {
    const reply = await ticketReplyRepository.findById(replyId);

    if (!reply) {
      throw new NotFoundError('Reply not found');
    }

    if (reply.userId.toString() !== userId.toString()) {
      throw new ValidationError('You are not authorized to update this reply');
    }

    const allowedFields = ['message', 'isInternal'];
    const safeUpdate = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        safeUpdate[field] = updateData[field];
      }
    }

    const updated = await ticketReplyRepository.update(replyId, safeUpdate);

    return {
      reply: updated,
      successMessage: 'Reply updated successfully',
    };
  }

  async deleteReply(userId, replyId) {
    const reply = await ticketReplyRepository.findById(replyId);

    if (!reply) {
      throw new NotFoundError('Reply not found');
    }

    if (reply.userId.toString() !== userId.toString()) {
      throw new ValidationError('You are not authorized to delete this reply');
    }

    await ticketReplyRepository.delete(replyId);

    return {
      successMessage: 'Reply deleted successfully',
    };
  }
}

module.exports = new TicketReplyService();
