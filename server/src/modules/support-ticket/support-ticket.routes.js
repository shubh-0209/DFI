const express = require('express');
const supportTicketController = require('./support-ticket.controller');
const ticketReplyController = require('./ticket-reply.controller');
const {
  validateCreateSupportTicket,
  validateGetSupportTickets,
  validateGetSupportTicket,
  validateUpdateSupportTicket,
  validateAssignTicket,
  validateSearchTickets,
  validateStatusUpdate,
} = require('./support-ticket.validation');
const {
  validateCreateReply,
  validateUpdateReply,
} = require('./ticket-reply.validation');
const { authenticate, authorize } = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');

const router = express.Router();

router.post('/', authenticate, authenticatedLimiter, validateCreateSupportTicket, supportTicketController.createSupportTicket);

router.get('/my-tickets', authenticate, authenticatedLimiter, validateGetSupportTickets, supportTicketController.getUserTickets);

router.get('/search', authenticate, authenticatedLimiter, validateSearchTickets, supportTicketController.searchTickets);

router.get('/', authenticate, authenticatedLimiter, authorize(['COORDINATOR', 'ADMIN', 'SUPER_ADMIN']), validateGetSupportTickets, supportTicketController.getAllTickets);

router.get('/:id', authenticate, authenticatedLimiter, validateGetSupportTicket, supportTicketController.getTicket);

router.patch('/:id', authenticate, authenticatedLimiter, validateUpdateSupportTicket, supportTicketController.updateTicket);

router.patch('/:id/status', authenticate, authenticatedLimiter, validateStatusUpdate, supportTicketController.updateTicketStatus);

router.post('/:id/assign', authenticate, authenticatedLimiter, authorize(['COORDINATOR', 'ADMIN', 'SUPER_ADMIN']), validateAssignTicket, supportTicketController.assignTicket);

router.post('/:id/resolve', authenticate, authenticatedLimiter, authorize(['COORDINATOR', 'ADMIN', 'SUPER_ADMIN']), validateGetSupportTicket, supportTicketController.resolveTicket);

router.post('/:id/close', authenticate, authenticatedLimiter, authorize(['COORDINATOR', 'ADMIN', 'SUPER_ADMIN']), validateGetSupportTicket, supportTicketController.closeTicket);

router.post('/:id/reply', authenticate, authenticatedLimiter, validateCreateReply, ticketReplyController.createReply);

router.get('/:id/replies', authenticate, authenticatedLimiter, ticketReplyController.getReplies);

router.patch('/replies/:replyId', authenticate, authenticatedLimiter, validateUpdateReply, ticketReplyController.updateReply);

router.delete('/replies/:replyId', authenticate, authenticatedLimiter, ticketReplyController.deleteReply);

router.get('/:id/history', authenticate, authenticatedLimiter, supportTicketController.getTicketHistory);

router.post('/:id/escalate', authenticate, authenticatedLimiter, authorize(['COORDINATOR', 'ADMIN', 'SUPER_ADMIN']), supportTicketController.escalateTicket);

router.delete('/:id', authenticate, authenticatedLimiter, validateGetSupportTicket, supportTicketController.deleteTicket);

module.exports = router;
