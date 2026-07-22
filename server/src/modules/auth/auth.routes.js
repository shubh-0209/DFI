/**
 * auth.routes.js — Authentication routes (Supabase-backed).
 *
 * Removed:
 *  - Cookie-based refresh (Supabase handles this on the client)
 *  - Passport Google OAuth (replaced by Supabase OAuth on the frontend)
 *
 * Kept:
 *  - POST /login        — email + password → Supabase session
 *  - POST /register     — create Supabase auth user + profile row
 *  - POST /logout       — server-side session revocation (best-effort)
 *  - POST /refresh-token — exchange Supabase refresh token for new access token
 *  - POST /forgot-password — trigger Supabase password-reset email
 *  - POST /reset-password/:token — stub (Supabase handles via redirect link)
 *  - GET  /me           — return current user profile (requires auth)
 */

const express        = require('express');
const authController = require('./auth.controller');
const validateForgotPassword = require('./forgotPassword.validation');
const validateLogin          = require('./login.validation');
const validateRegister       = require('./register.validation');
const { authenticate }       = require('../../middlewares/auth.middleware');
const { authenticatedLimiter } = require('../../config/rateLimiter.config');
const { authLimiter, forgotPasswordLimiter } = require('../../config/rateLimiter.config');

const router = express.Router();

// ── Public routes ────────────────────────────────────────────────
router.post('/register',       authLimiter,           validateRegister,       authController.register);
router.post('/login',          authLimiter,           validateLogin,          authController.login);
router.post('/refresh-token',                                                  authController.refreshToken);
router.post('/forgot-password', forgotPasswordLimiter, validateForgotPassword, authController.forgotPassword);
router.post('/reset-password/:token',                                          authController.resetPassword);

// Google OAuth stubs (frontend now uses Supabase SDK directly)
router.get('/google',           authController.googleLogin);
router.get('/google/callback',  authController.googleCallback);

// ── Protected routes ─────────────────────────────────────────────
router.post('/logout', authenticate, authenticatedLimiter, authController.logout);
router.get('/me',      authenticate, authenticatedLimiter, authController.getCurrentUser);

module.exports = router;
