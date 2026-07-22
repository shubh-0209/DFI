const supportTicketRepository = require('./support-ticket.repository');
const ticketAutomationService = require('./ticket-automation.service');
const NotFoundError = require('../../utils/errors/NotFoundError');

class SupportTicketService {
  async createSupportTicket(userId, data) {
    const result = await ticketAutomationService.createSupportTicket(userId, data);
    return result;
  }

  async getUserTickets(userId, query = {}) {
    const { page = 1, limit = 20, status, priority } = query;
    const result = await supportTicketRepository.findByUser(userId, {
      page: Number(page),
      limit: Number(limit),
      status,
      priority,
    });

    return {
      tickets: result.tickets,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        totalPages: Math.ceil(result.total / Number(limit)) || 1,
      },
      successMessage: 'Support tickets retrieved successfully',
    };
  }

  async getAllTickets(query = {}) {
    const { page = 1, limit = 20, status, priority, assignedTo } = query;
    const result = await supportTicketRepository.findAll({
      page: Number(page),
      limit: Number(limit),
      status,
      priority,
      assignedTo,
    });

    return {
      tickets: result.tickets,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        totalPages: Math.ceil(result.total / Number(limit)) || 1,
      },
      successMessage: 'Support tickets retrieved successfully',
    };
  }

  async getTicket(userId, ticketId) {
    const ticket = await supportTicketRepository.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError('Support ticket not found');
    }

    return {
      ticket,
      successMessage: 'Support ticket retrieved successfully',
    };
  }

  async updateTicket(userId, ticketId, updateData) {
    const result = await ticketAutomationService.updateTicket(userId, ticketId, updateData);
    return result;
  }

  async updateTicketStatus(userId, ticketId, status) {
    const result = await ticketAutomationService.updateTicketStatus(userId, ticketId, status);
    return result;
  }

  async searchTickets(query = {}) {
    const { search, page = 1, limit = 20, status, priority, category, assignedTo, sortBy = 'createdAt', order = 'desc' } = query;
    const result = await supportTicketRepository.search({
      search,
      page: Number(page),
      limit: Number(limit),
      status,
      priority,
      category,
      assignedTo,
      sortBy,
      order,
    });

    return {
      tickets: result.tickets,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        totalPages: Math.ceil(result.total / Number(limit)) || 1,
      },
      successMessage: 'Support tickets searched successfully',
    };
  }

  async assignTicket(userId, ticketId, assignToUserId) {
    const result = await ticketAutomationService.assignTicket(userId, ticketId, assignToUserId);
    return result;
  }

  async resolveTicket(userId, ticketId, resolution) {
    const result = await ticketAutomationService.resolveTicket(userId, ticketId, resolution);
    return result;
  }

  async closeTicket(userId, ticketId) {
    const result = await ticketAutomationService.closeTicket(userId, ticketId);
    return result;
  }

  async deleteTicket(userId, ticketId) {
    const ticket = await supportTicketRepository.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError('Support ticket not found');
    }

    await supportTicketRepository.softDelete(ticketId, userId);

    return {
      successMessage: 'Support ticket deleted successfully',
    };
  }

  async getTicketHistory(userId, ticketId, query = {}) {
    const result = await ticketAutomationService.getTicketHistory(userId, ticketId, query);
    return result;
  }

  async escalateTicket(userId, ticketId) {
    const result = await ticketAutomationService.escalateTicket(userId, ticketId);
    return result;
  }
}

module.exports = new SupportTicketService();
