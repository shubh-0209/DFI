/**
 * auth.middleware.js — Supabase JWT verification middleware.
 *
 * Replaces the old jwt.verify(token, JWT_SECRET) approach.
 * Now calls supabase.auth.getUser(token) which:
 *  - Validates the JWT signature against Supabase's public keys
 *  - Checks expiry
 *  - Returns the Supabase auth user on success
 *
 * After verification, we load the full profile from our users table
 * and attach it to req.user — so all downstream controllers and services
 * continue to work without any changes.
 */

const supabase     = require('../config/supabase');
const User         = require('../modules/user/user.model');
const { MESSAGES } = require('../modules/auth/auth.constants');
const { STATUS }   = require('../modules/user/user.constants');
const { AuthenticationError } = require('../utils/errors');

/**
 * Primary authentication middleware.
 * Reads Bearer token from Authorization header, verifies with Supabase,
 * loads the profile from our users table, sets req.user.
 */
const authenticate = async (req, res, next) => {
  try {
    // Extract Bearer token
    const authHeader = req.headers['authorization'] || req.headers['Authorization'] || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return next(new AuthenticationError(MESSAGES.MISSING_TOKEN));
    }

    // Verify with Supabase — network call but cached internally
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return next(new AuthenticationError(MESSAGES.INVALID_TOKEN));
    }

    const supabaseUser = data.user;

    // Load the profile row from our users table
    let profile = await User.findOne({ supabaseId: supabaseUser.id });

    if (!profile) {
      // Could be a legacy account not yet linked — try email
      profile = await User.findOne({ email: supabaseUser.email });
      if (profile) {
        // Link it silently
        profile.supabaseId = supabaseUser.id;
        await profile.save();
      }
    }

    if (!profile) {
      // Auto-create user profile row for Google OAuth / Supabase Auth authenticated users
      const email = supabaseUser.email;
      const name = supabaseUser.user_metadata?.full_name || supabaseUser.email.split('@')[0];
      const username = (supabaseUser.user_metadata?.user_name || supabaseUser.email.split('@')[0] || 'user_' + Date.now().toString(36)).toLowerCase().replace(/[^a-z0-9_]/g, '');

      // Ensure username is valid and unique
      let finalUsername = username;
      if (finalUsername.length < 3) {
        finalUsername = finalUsername + '_dfi';
      }
      let existingUsername = await User.findOne({ username: finalUsername });
      let counter = 1;
      while (existingUsername) {
        finalUsername = `${username}_${counter}`;
        existingUsername = await User.findOne({ username: finalUsername });
        counter++;
      }

      profile = await User.create({
        supabaseId: supabaseUser.id,
        email: email,
        name: name,
        username: finalUsername,
        role: 'volunteer',
        status: STATUS.ACTIVE,
      });
    }

    if (profile.status === STATUS.SUSPENDED) {
      return next(new AuthenticationError(MESSAGES.BLOCKED_USER));
    }

    // Attach the full profile so existing controllers keep working
    // Also store the raw Supabase user and current access token for logout
    req.user              = profile;
    req.supabaseUser      = supabaseUser;
    req.supabaseToken     = token;

    return next();
  } catch (err) {
    return next(err);
  }
};

/**
 * Authorization middleware — restricts access to specific roles.
 * Works the same as before; role comes from our users table profile.
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new AuthenticationError(MESSAGES.UNAUTHORIZED));
  }
  
  const flattenedRoles = roles.flat(Infinity).map(r => r.toLowerCase());
  const userRole = req.user.role?.toLowerCase();

  if (!flattenedRoles.includes(userRole)) {
    return next(new AuthenticationError(MESSAGES.FORBIDDEN));
  }
  return next();
};

/**
 * Optional authentication — populates req.user if a valid token is present,
 * but does NOT block the request if the token is absent or invalid.
 */
const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return next();

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return next();

    const profile = await User.findOne({ supabaseId: data.user.id })
      || await User.findOne({ email: data.user.email });

    if (profile && profile.status !== STATUS.SUSPENDED) {
      req.user          = profile;
      req.supabaseUser  = data.user;
      req.supabaseToken = token;
    }
  } catch (_) {
    // Fail silently for optional auth
  }
  return next();
};

module.exports = { authenticate, authorize, optionalAuthenticate };
