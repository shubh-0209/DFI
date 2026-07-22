/**
 * auth.repository.js — Profile-row helpers for Supabase-backed auth.
 *
 * All password / refreshToken / passwordResetToken operations are gone —
 * those now live in Supabase Auth and are never stored in our users table.
 *
 * This file exposes lightweight helpers that auth.service.js uses to
 * find and update the profile row in our PostgreSQL users table.
 */

const User = require('../user/user.model');

class AuthRepository {
  /** Find a profile by our internal _id */
  findById(id) {
    return User.findById(id);
  }

  /** Find a profile by Supabase auth user UUID */
  findBySupabaseId(supabaseId) {
    return User.findOne({ supabaseId });
  }

  /** Find a profile by email (used for legacy account linking) */
  findByEmail(email) {
    return User.findOne({ email });
  }

  /** Find a profile by username (used for uniqueness checks on register) */
  findByUsername(username) {
    return User.findOne({ username });
  }

  /** Find a profile by Google OAuth ID */
  findByGoogleId(googleId) {
    return User.findOne({ googleId });
  }

  /** Create a new profile row */
  create(profileData) {
    return User.create(profileData);
  }

  /** Update a profile row by _id */
  update(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, {
      new:            true,
      runValidators:  true,
    });
  }

  /** Hard-delete a profile row (admin use only) */
  delete(id) {
    return User.findByIdAndDelete(id);
  }

  /**
   * Find a profile by _id and ensure the user is active.
   * Returns null if not found or suspended.
   */
  async findActiveUser(id) {
    const { STATUS } = require('../user/user.constants');
    return User.findOne({ _id: id, status: { $ne: STATUS.SUSPENDED } });
  }
}

module.exports = new AuthRepository();
