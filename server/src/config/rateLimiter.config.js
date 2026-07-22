const { rateLimit } = require('express-rate-limit');

const messagePayload = {
  success: false,
  message: 'Too many requests. Please try again later.',
  code: 'RATE_LIMITED'
};

/**
 * Public API Rate Limiter
 * Used for unauthenticated public endpoints.
 * Higher tolerance (500 req / 15 mins) to prevent blocking CGNAT mobile users.
 */
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req) => `ip:${req.ip}`,
  skip: (req) => req.originalUrl === '/health' || req.originalUrl === '/api/v1/health',
  message: messagePayload,
});

/**
 * Authentication Rate Limiter
 * Stricter limit (20 req / 15 mins) for login, signup, password reset.
 * Uses IP + Email combination to prevent brute force and credential stuffing.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = req.body?.email?.toLowerCase().trim() || 'no-email';
    return `ip:${req.ip}:email:${email}`;
  },
  skipSuccessfulRequests: true,
  message: messagePayload,
});

/**
 * Authenticated API Rate Limiter
 * Applied AFTER the authenticate middleware.
 * Uses verified req.user.id to rate limit per user regardless of shared CGNAT IP.
 */
const authenticatedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req) => {
    if (req.user && (req.user.id || req.user._id)) {
      return `user:${req.user.id || req.user._id}`;
    }
    return `ip:${req.ip}`;
  },
  message: messagePayload,
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 3,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = req.body?.email?.toLowerCase().trim() || 'no-email';
    return `ip:${req.ip}:email:${email}`;
  },
  message: messagePayload,
});

module.exports = {
  publicLimiter,
  authLimiter,
  authenticatedLimiter,
  forgotPasswordLimiter,
};
