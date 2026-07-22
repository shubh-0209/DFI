/**
 * socketServer.js — WebSocket server with Supabase JWT verification.
 *
 * The old jwt.verify(token, JWT_SECRET) call is replaced with
 * supabase.auth.getUser(token), matching the HTTP auth middleware.
 * No more -refreshToken or -password field selects.
 */

const { Server } = require('socket.io');
const supabase = require('../config/supabase');
const User     = require('../modules/user/user.model');
const getCorsConfig = require('../config/cors.config');

let io = null;
const onlineUsers = new Map();

const getSocketServer  = () => io;
const getOnlineUsers   = () => Array.from(onlineUsers.keys());

const broadcastToUser = (userId, event, data) => {
  if (io) io.to(`user:${String(userId)}`).emit(event, data);
};

const broadcastToConversation = (conversationId, event, data) => {
  if (io) io.to(`conversation:${conversationId}`).emit(event, data);
};

const broadcastToAll = (event, data) => {
  if (io) io.emit(event, data);
};

const logSocketEvent = (event, userId, data = {}) => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(`[Socket] ${event}`, { userId, ...data });
  }
};

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: getCorsConfig(),
    path: '/socket.io/',
  });

  // ── Authentication middleware ─────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication error: Token required'));
      }

      // Verify via Supabase — same approach as HTTP auth.middleware.js
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data?.user) {
        return next(new Error('Authentication error: Invalid token'));
      }

      // Load our profile row (no password / refreshToken fields needed)
      let profile = await User.findOne({ supabaseId: data.user.id });
      if (!profile) {
        profile = await User.findOne({ email: data.user.email });
        if (profile) {
          // Link legacy account silently
          profile.supabaseId = data.user.id;
          await profile.save();
        }
      }

      if (!profile || profile.status === 'suspended') {
        return next(new Error('Authentication error: User not found or suspended'));
      }

      socket.user = profile;
      return next();
    } catch (err) {
      return next(new Error('Authentication error: ' + (err.message || 'Unknown error')));
    }
  });

  // ── Connection handler ────────────────────────────────────────────
  io.on('connection', (socket) => {
    const user = socket.user;
    const uid  = user._id.toString();

    socket.join(`user:${uid}`);
    onlineUsers.set(uid, {
      userId:   uid,
      name:     user.name,
      email:    user.email,
      socketId: socket.id,
    });
    io.emit('user-online', { userId: uid, name: user.name, email: user.email, online: true });
    logSocketEvent('connect', uid, { socketId: socket.id });

    socket.on('join-room', (conversationId) => {
      if (!conversationId || typeof conversationId !== 'string') return;
      socket.join(`conversation:${conversationId}`);
      logSocketEvent('join-room', uid, { conversationId });
    });

    socket.on('leave-room', (conversationId) => {
      if (!conversationId || typeof conversationId !== 'string') return;
      socket.leave(`conversation:${conversationId}`);
      logSocketEvent('leave-room', uid, { conversationId });
    });

    socket.on('typing', ({ conversationId }) => {
      if (!conversationId || typeof conversationId !== 'string') return;
      socket.to(`conversation:${conversationId}`).emit('typing', {
        userId: uid, conversationId, name: user.name,
      });
    });

    socket.on('stop-typing', ({ conversationId }) => {
      if (!conversationId || typeof conversationId !== 'string') return;
      socket.to(`conversation:${conversationId}`).emit('stop-typing', {
        userId: uid, conversationId,
      });
    });

    socket.on('message-read', async ({ conversationId, messageId }) => {
      if (!conversationId || !messageId) return;
      socket.to(`conversation:${conversationId}`).emit('message-read', {
        userId: uid, conversationId, messageId,
      });
      try {
        const Message = require('../modules/message/message.model');
        await Message.updateOne(
          { _id: messageId, conversationId },
          {
            $set:      { status: 'read' },
            $addToSet: { readBy: { userId: user._id, readAt: new Date() } },
          }
        );
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error updating message status to read:', err);
      }
      logSocketEvent('message-read', uid, { conversationId, messageId });
    });

    socket.on('message-delivered', async ({ conversationId, messageId }) => {
      if (!conversationId || !messageId) return;
      socket.to(`conversation:${conversationId}`).emit('message-delivered', {
        userId: uid, conversationId, messageId,
      });
      try {
        const Message = require('../modules/message/message.model');
        await Message.updateOne(
          { _id: messageId, conversationId, status: 'sent' },
          { $set: { status: 'delivered' } }
        );
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error updating message status to delivered:', err);
      }
      logSocketEvent('message-delivered', uid, { conversationId, messageId });
    });

    socket.on('disconnect', (reason) => {
      onlineUsers.delete(uid);
      io.emit('user-offline', { userId: uid, name: user.name, email: user.email, online: false });
      socket.leave(`user:${uid}`);
      logSocketEvent('disconnect', uid, { reason });
    });
  });

  return io;
};

module.exports = {
  initializeSocket,
  getSocketServer,
  broadcastToUser,
  broadcastToConversation,
  broadcastToAll,
  getOnlineUsers,
  logSocketEvent,
};
