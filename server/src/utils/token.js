/**
 * token.js — DEPRECATED.
 *
 * Password-reset token generation/hashing was used by the old custom auth flow.
 * Password resets are now handled entirely by Supabase Auth via
 * supabase.auth.resetPasswordForEmail() which sends the reset email and manages
 * the token lifecycle internally.
 *
 * SAFE TO DELETE once you confirm no other file imports from here.
 * Run: grep -r "utils/token" server/src  to verify zero imports.
 */

module.exports = {
  generatePasswordResetToken: () => '',
  hashPasswordResetToken:     () => '',
};
