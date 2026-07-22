const ticketHistoryRepository = require('./ticket-history.repository');
const supportTicketRepository = require('./support-ticket.repository');
const conversationRepository = require('../conversation/conversation.repository');
const { TICKET_STATUS, TICKET_PRIORITIES } = require('./support-ticket.constants');
const { CHANNEL } = require('../notification/notification.constants');
const notificationService = require('../notification/notification.service');
const templates = require('../notification/notification.templates');
const NotFoundError = require('../../utils/errors/NotFoundError');
const ValidationError = require('../../utils/errors/ValidationError');

const ESCALATION_RULES = {
  URGENT: { hours: 2, escalateTo: 'superadmin' },
  HIGH: { hours: 24, escalateTo: 'admin' },
  MEDIUM: { hours: 48, escalateTo: 'support' },
};

const PRIORITY_MATRIX = {
  technical: 'medium',
  programs: 'medium',
  certificates: 'medium',
  rewards: 'low',
  attendance: 'low',
  applications: 'medium',
  ngo: 'medium',
  volunteer: 'low',
  general: 'medium',
};

class SupportTicketAutomationService {
  async _logHistory(userId, ticketId, action, field, oldValue, newValue, description, metadata = {}) {
    await ticketHistoryRepository.create({
      ticketId,
      userId,
      action,
      field,
      oldValue: oldValue || null,
      newValue: newValue || null,
      description: description || `${action} ${field}`,
      metadata,
    });
  }

  async _sendNotification(recipientId, templateKey, templateData) {
    try {
      const payload = templates[templateKey]({ recipientId, ...templateData });
      await notificationService.createNotification({
        recipient: recipientId,
        title: payload.title,
        message: payload.message,
        type: payload.type,
        category: payload.category,
        priority: payload.priority,
        channel: payload.channel || CHANNEL.IN_APP,
        relatedEntityType: 'support_ticket',
        relatedEntityId: templateData.ticketId,
        metadata: payload.metadata || {},
        actionUrl: payload.actionUrl || null,
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }
  }

  async _sendEmail(_recipientEmail, _subject, _html) {
    try {
      // Future-ready: connect to email provider
      // await emailProvider.send({ to: recipientEmail, subject, html });
    } catch (_error) {
      // Email failure is non-blocking
    }
  }

  _determinePriority(category, userPriority) {
    if (userPriority && Object.values(TICKET_PRIORITIES).includes(userPriority)) {
      return userPriority;
    }
    return PRIORITY_MATRIX[category] || 'medium';
  }

  async createSupportTicket(userId, data) {
    const { subject, description, category = 'general', priority, participantIds = [] } = data;

    const conversation = await conversationRepository.create({
      participants: [userId, ...participantIds],
      type: 'support',
      title: subject,
      status: 'active',
    });

    const autoPriority = this._determinePriority(category, priority);

    const ticket = await supportTicketRepository.create({
      conversationId: conversation._id,
      userId,
      subject,
      description,
      category,
      priority: autoPriority,
      status: TICKET_STATUS.OPEN,
    });

    await this._logHistory(userId, ticket._id, 'created', 'ticket', null, ticket.ticketId, 'Ticket created');

    try {
      await this._sendNotification(userId, 'buildTicketCreated', {
        ticketId: ticket.ticketId,
        subject,
      });
    } catch (_error) {
      // Notification failure is non-blocking
    }

    try {
      const admins = await require('../../user/user.model').find({ role: { $in: ['ADMIN', 'SUPER_ADMIN'] } }, '_id email');
      for (const admin of admins) {
        await this._sendNotification(admin._id, 'buildAdminTicketAssigned', {
          ticketId: ticket.ticketId,
          subject,
        });
      }
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return {
      ticket,
      conversation,
      successMessage: 'Support ticket created successfully',
    };
  }

  async updateTicket(userId, ticketId, updateData) {
    const ticket = await supportTicketRepository.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError('Support ticket not found');
    }

    const allowedFields = ['subject', 'description', 'priority', 'category', 'resolution'];
    const safeUpdate = {};
    const historyLogs = [];

    for (const field of allowedFields) {
      if (updateData[field] !== undefined && ticket[field] !== updateData[field]) {
        historyLogs.push({ field, oldValue: ticket[field], newValue: updateData[field] });
        safeUpdate[field] = updateData[field];
      }
    }

    if (updateData.status) {
      const validStatuses = Object.values(TICKET_STATUS);
      if (!validStatuses.includes(updateData.status)) {
        throw new ValidationError('Invalid ticket status');
      }
      if (ticket.status !== updateData.status) {
        historyLogs.push({ field: 'status', oldValue: ticket.status, newValue: updateData.status });
      }
      safeUpdate.status = updateData.status;
      if (updateData.status === TICKET_STATUS.RESOLVED) {
        safeUpdate.resolvedAt = new Date();
      }
      if (updateData.status === TICKET_STATUS.CLOSED) {
        safeUpdate.closedAt = new Date();
      }
    }

    const updated = await supportTicketRepository.update(ticketId, safeUpdate);

    for (const log of historyLogs) {
      await this._logHistory(userId, ticketId, 'updated', log.field, String(log.oldValue ?? ''), String(log.newValue ?? ''));
    }

    if (historyLogs.some((log) => log.field === 'status' && log.newValue === TICKET_STATUS.RESOLVED)) {
      await this._sendNotification(ticket.userId, 'buildTicketResolved', {
        ticketId: ticket.ticketId,
        subject: ticket.subject,
      });
    }

    if (historyLogs.some((log) => log.field === 'status' && log.newValue === TICKET_STATUS.CLOSED)) {
      await this._sendNotification(ticket.userId, 'buildTicketClosed', {
        ticketId: ticket.ticketId,
        subject: ticket.subject,
      });
    }

    return {
      ticket: updated,
      successMessage: 'Support ticket updated successfully',
    };
  }

  async assignTicket(userId, ticketId, assignToUserId) {
    const ticket = await supportTicketRepository.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError('Support ticket not found');
    }

    const previousAssignee = ticket.assignedTo;

    const updated = await supportTicketRepository.update(ticketId, {
      assignedTo: assignToUserId,
      status: TICKET_STATUS.IN_PROGRESS,
    });

    await this._logHistory(userId, ticketId, 'assigned', 'assignedTo', previousAssignee?.toString() || '', assignToUserId, 'Ticket assigned');

    await this._sendNotification(assignToUserId, 'buildAdminTicketAssigned', {
      ticketId: ticket.ticketId,
      subject: ticket.subject,
    });

    await this._sendNotification(ticket.userId, 'buildTicketUpdated', {
      ticketId: ticket.ticketId,
      subject: ticket.subject,
      update: 'assigned to support agent',
    });

    return {
      ticket: updated,
      successMessage: 'Support ticket assigned successfully',
    };
  }

  async resolveTicket(userId, ticketId, resolution) {
    const ticket = await supportTicketRepository.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError('Support ticket not found');
    }

    const updated = await supportTicketRepository.update(ticketId, {
      status: TICKET_STATUS.RESOLVED,
      resolution: resolution || null,
      resolvedAt: new Date(),
    });

    await this._logHistory(userId, ticketId, 'resolved', 'status', TICKET_STATUS.IN_PROGRESS, TICKET_STATUS.RESOLVED, 'Ticket resolved');

    await this._sendNotification(ticket.userId, 'buildTicketResolved', {
      ticketId: ticket.ticketId,
      subject: ticket.subject,
    });

    return {
      ticket: updated,
      successMessage: 'Support ticket resolved successfully',
    };
  }

  async closeTicket(userId, ticketId) {
    const ticket = await supportTicketRepository.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError('Support ticket not found');
    }

    const updated = await supportTicketRepository.update(ticketId, {
      status: TICKET_STATUS.CLOSED,
      closedAt: new Date(),
    });

    await this._logHistory(userId, ticketId, 'closed', 'status', TICKET_STATUS.RESOLVED, TICKET_STATUS.CLOSED, 'Ticket closed');

    await this._sendNotification(ticket.userId, 'buildTicketClosed', {
      ticketId: ticket.ticketId,
      subject: ticket.subject,
    });

    return {
      ticket: updated,
      successMessage: 'Support ticket closed successfully',
    };
  }

  async getTicketHistory(userId, ticketId, query = {}) {
    const ticket = await supportTicketRepository.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError('Support ticket not found');
    }

    const result = await ticketHistoryRepository.findByTicket(ticketId, query);

    return {
      history: result.history,
      pagination: {
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 50,
        total: result.total,
        totalPages: Math.ceil(result.total / (Number(query.limit) || 50)) || 1,
      },
      successMessage: 'Ticket history retrieved successfully',
    };
  }

  async escalateTicket(userId, ticketId) {
    const ticket = await supportTicketRepository.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError('Support ticket not found');
    }

    const rule = ESCALATION_RULES[ticket.priority] || ESCALATION_RULES.MEDIUM;

    const updated = await supportTicketRepository.update(ticketId, {
      priority: 'urgent',
    });

    await this._logHistory(userId, ticketId, 'escalated', 'priority', ticket.priority, 'urgent', `Ticket escalated to ${rule.escalateTo}`);

    try {
      const admins = await require('../../user/user.model').find({ role: { $in: ['ADMIN', 'SUPER_ADMIN'] } }, '_id email');
      for (const admin of admins) {
        await this._sendNotification(admin._id, 'buildAdminTicketAssigned', {
          ticketId: ticket.ticketId,
          subject: ticket.subject,
        });
      }
    } catch (_error) {
      // Notification failure is non-blocking
    }

    return {
      ticket: updated,
      successMessage: 'Support ticket escalated successfully',
    };
  }

  async checkEscalations() {
    const tickets = await supportTicketRepository.findAll({ status: TICKET_STATUS.OPEN });
    const now = new Date();

    for (const ticket of tickets) {
      const rule = ESCALATION_RULES[ticket.priority] || ESCALATION_RULES.MEDIUM;
      const created = new Date(ticket.createdAt);
      const hoursElapsed = (now - created) / (1000 * 60 * 60);

      if (hoursElapsed >= rule.hours && ticket.priority !== 'urgent') {
        await this.escalateTicket(null, ticket._id);
      }
    }
  }
}

module.exports = new SupportTicketAutomationService();
