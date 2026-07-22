/**
 * auth.service.js — Authentication via Supabase Auth.
 *
 * Supabase Auth owns:
 *  - Passwords (hashed internally by Supabase, never bcrypt'd here)
 *  - Access tokens  (JWT, 1-hour by default)
 *  - Refresh tokens (long-lived, stored by Supabase)
 *  - Email verification / password-reset emails
 *
 * Our users table (PostgreSQL via mongoose-compat) owns:
 *  - role, username, volunteerId, profilePhoto, skills, etc.
 *  - Linked to Supabase auth user via supabaseId field (= Supabase user.id)
 *
 * Flow for login:
 *  1. supabase.auth.signInWithPassword  → returns { session, user }
 *  2. Look up our users table by supabaseId  → profile row
 *  3. Return { user: profile, accessToken, refreshToken }
 *
 * The backend NEVER stores or rotates refresh tokens itself anymore.
 * Supabase handles that internally.
 */

const supabase         = require('../../config/supabase');
const User             = require('../user/user.model');
const { MESSAGES }     = require('./auth.constants');
const { STATUS, ROLES } = require('../user/user.constants');
const {
  ConflictError,
  AuthenticationError,
  NotFoundError,
} = require('../../utils/errors');
const { generateVolunteerId } = require('../../utils/volunteerId');
const notificationService     = require('../notification/notification.service');

/* ─── helpers ──────────────────────────────────────────────────────────────── */

/**
 * Find or create the profile row in our users table for a given Supabase user.
 * On first sign-in the row is created; on subsequent sign-ins it is returned as-is.
 */
async function findOrCreateProfile(supabaseUser, extra = {}) {
  const supabaseId = supabaseUser.id;
  const email      = supabaseUser.email;

  // Try to find an existing profile linked to this Supabase auth user
  let profile = await User.findOne({ supabaseId });

  // Legacy accounts may have been created before supabaseId was added — link them
  if (!profile && email) {
    profile = await User.findOne({ email });
    if (profile) {
      profile.supabaseId = supabaseId;
      await profile.save();
    }
  }

  if (!profile) {
    // Brand new user — create profile row
    const volunteerId = await generateVolunteerId();
    const meta        = supabaseUser.user_metadata || {};

    profile = await User.create({
      supabaseId,
      volunteerId,
      name:     meta.name     || extra.name     || email.split('@')[0],
      username: meta.username || extra.username || `user_${volunteerId}`,
      email,
      role:     extra.role   || ROLES.VOLUNTEER,
      status:   STATUS.ACTIVE,
      profilePhoto: meta.avatar_url || '',
    });

    // Welcome notification — non-blocking
    notificationService.sendInAppNotification('buildWelcome', {
      recipientId: profile._id.toString(),
      name:        profile.name,
    }).catch(() => {});
  }

  return profile;
}

/* ─── service class ─────────────────────────────────────────────────────────── */

class AuthService {
  /**
   * Register a new user.
   * 1. Create Supabase auth user (handles password hashing + email uniqueness)
   * 2. Create profile row in users table
   */
  async register(userData) {
    const { name, username, email, password, phone } = userData;

    // Check username uniqueness in our table (Supabase doesn't know about usernames)
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      throw new ConflictError(MESSAGES.USERNAME_ALREADY_EXISTS);
    }

    // Create Supabase auth user — returns 422 if email already registered
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,                   // skip email verification for now
      user_metadata: { name, username },
    });

    if (error) {
      if (error.message?.toLowerCase().includes('already') ||
          error.message?.toLowerCase().includes('registered') ||
          error.status === 422) {
        throw new ConflictError(MESSAGES.EMAIL_ALREADY_EXISTS);
      }
      throw new AuthenticationError(error.message || 'Registration failed');
    }

    const volunteerId = await generateVolunteerId();
    const profile = await User.create({
      supabaseId:  data.user.id,
      volunteerId,
      name,
      username,
      email,
      phone:  phone || '',
      role:   ROLES.VOLUNTEER,
      status: STATUS.ACTIVE,
    });

    // Welcome notification — non-blocking
    notificationService.sendInAppNotification('buildWelcome', {
      recipientId: profile._id.toString(),
      name:        profile.name,
    }).catch(() => {});

    return profile;
  }

  /**
   * Log in with email + password via Supabase.
   * Returns the profile row from our users table plus the Supabase session tokens.
   */
  async login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Supabase returns "Invalid login credentials" for wrong password
      throw new AuthenticationError(MESSAGES.INVALID_CREDENTIALS);
    }

    const { session, user: supabaseUser } = data;

    const profile = await findOrCreateProfile(supabaseUser);

    if (profile.status === STATUS.SUSPENDED) {
      // Sign the Supabase user out immediately so the token is revoked
      await supabase.auth.admin.signOut(session.access_token).catch(() => {});
      throw new AuthenticationError('Your account has been suspended. Please contact support.');
    }

    // Update last-login timestamps — non-blocking
    User.findByIdAndUpdate(profile._id, {
      lastLogin:  new Date(),
      lastActive: new Date(),
    }).catch(() => {});

    return {
      user:         profile,
      accessToken:  session.access_token,
      refreshToken: session.refresh_token,
    };
  }

  /**
   * Log out — revoke the Supabase session on the server side.
   * The frontend must also call supabase.auth.signOut() to clear local storage.
   */
  async logout(accessToken) {
    // Best-effort server-side revocation; ignore errors
    await supabase.auth.admin.signOut(accessToken).catch(() => {});
  }

  /**
   * Refresh the access token using a Supabase refresh token.
   * Returns new accessToken + refreshToken.
   */
  async refreshSession(refreshToken) {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data?.session) {
      throw new AuthenticationError('Session expired. Please log in again.');
    }

    return {
      accessToken:  data.session.access_token,
      refreshToken: data.session.refresh_token,
    };
  }

  /**
   * Get the profile for the currently authenticated user.
   * supabaseUserId is decoded from the verified JWT in the middleware.
   */
  async getCurrentUser(supabaseUserId) {
    let profile = await User.findOne({ supabaseId: supabaseUserId });
    if (!profile) {
      // Fallback: fetch from Supabase and create profile
      const { data } = await supabase.auth.admin.getUserById(supabaseUserId);
      if (!data?.user) throw new NotFoundError('User not found');
      profile = await findOrCreateProfile(data.user);
    }
    return profile;
  }

  /**
   * Trigger a password-reset email via Supabase.
   */
  async forgotPassword(email) {
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`;

    // Supabase sends the reset email; we don't care if the email exists or not
    // (Supabase handles enumeration protection)
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    return { message: MESSAGES.PASSWORD_RESET_EMAIL_SENT };
  }

  /**
   * Complete the Google OAuth flow initiated by Supabase.
   * Called after the frontend exchanges the OAuth code for a session.
   * Returns the profile row + session tokens.
   */
  async googleCallback(supabaseUser, session) {
    const profile = await findOrCreateProfile(supabaseUser, {
      name: supabaseUser.user_metadata?.full_name,
    });

    return {
      user:         profile,
      accessToken:  session.access_token,
      refreshToken: session.refresh_token,
    };
  }
}

module.exports = new AuthService();
