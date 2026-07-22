/**
 * auth.controller.js — HTTP handlers for Supabase-backed auth routes.
 *
 * No more cookies.  Tokens are returned in the JSON response body so
 * the client can store them in memory / localStorage and attach them
 * as Bearer headers.  Supabase handles token refresh natively on the
 * client side via the supabase-js SDK.
 */

const authService       = require('./auth.service');
const { MESSAGES }      = require('./auth.constants');
const { successResponse } = require('../../utils/response');

class AuthController {
  /* ── Register ──────────────────────────────────────────────────── */
  register = async (req, res, next) => {
    try {
      const user = await authService.register(req.body);
      return successResponse(res, 201, MESSAGES.REGISTER_SUCCESS, { user });
    } catch (err) {
      return next(err);
    }
  };

  /* ── Login ─────────────────────────────────────────────────────── */
  login = async (req, res, next) => {
    try {
      const { user, accessToken, refreshToken } = await authService.login(req.body);
      return successResponse(res, 200, MESSAGES.LOGIN_SUCCESS, {
        user,
        token:        accessToken,   // kept as 'token' so AuthContext doesn't need changes
        refreshToken,                // also expose for Supabase session restore
      });
    } catch (err) {
      return next(err);
    }
  };

  /* ── Logout ────────────────────────────────────────────────────── */
  logout = async (req, res, next) => {
    try {
      // req.supabaseToken is attached by the authenticate middleware
      await authService.logout(req.supabaseToken);
      return successResponse(res, 200, MESSAGES.LOGOUT_SUCCESS);
    } catch (err) {
      return next(err);
    }
  };

  /* ── Refresh session ───────────────────────────────────────────── */
  refreshToken = async (req, res, next) => {
    try {
      // Client sends the Supabase refresh token in the request body
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ success: false, message: 'refreshToken is required' });
      }
      const tokens = await authService.refreshSession(refreshToken);
      return successResponse(res, 200, MESSAGES.TOKEN_REFRESH_SUCCESS, {
        token:        tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } catch (err) {
      return next(err);
    }
  };

  /* ── Get current user ──────────────────────────────────────────── */
  getCurrentUser = async (req, res, next) => {
    try {
      // req.user is already loaded by authenticate middleware
      return successResponse(res, 200, 'User profile retrieved successfully', {
        user: req.user,
      });
    } catch (err) {
      return next(err);
    }
  };

  /* ── Forgot password ───────────────────────────────────────────── */
  forgotPassword = async (req, res, next) => {
    try {
      const result = await authService.forgotPassword(req.body.email);
      return successResponse(res, 200, result.message);
    } catch (err) {
      return next(err);
    }
  };

  /* ── Reset password ────────────────────────────────────────────── */
  // Supabase handles the reset via the redirect link it emails.
  // When the user clicks that link they land on the frontend which calls
  // supabase.auth.updateUser({ password }) directly.
  // We keep this stub so the route doesn't 404 if old links are used.
  resetPassword = async (req, res, next) => {
    try {
      return successResponse(res, 200,
        'Please use the link in your email to set your new password. ' +
        'If you arrived here by mistake, request a new password-reset email.'
      );
    } catch (err) {
      return next(err);
    }
  };

  /* ── Google OAuth — handled by Supabase on the client side ─────── */
  // The frontend calls supabase.auth.signInWithOAuth({ provider: 'google' }).
  // These server stubs are kept so existing URLs don't 404.
  googleLogin = (_req, res) => {
    return res.status(200).json({
      success: true,
      message: 'Use Supabase OAuth on the frontend. Call supabase.auth.signInWithOAuth.',
    });
  };

  googleCallback = (_req, res) => {
    // Supabase redirects back to the frontend directly after OAuth.
    const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${redirectUrl}/dashboard`);
  };
}

module.exports = new AuthController();
