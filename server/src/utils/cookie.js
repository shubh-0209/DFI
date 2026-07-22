/**
 * cookie.js — DEPRECATED.
 *
 * This file is no longer used. Authentication tokens are no longer stored
 * in HttpOnly cookies. Supabase Auth manages token storage on the client
 * side via localStorage through the supabase-js SDK.
 *
 * SAFE TO DELETE once you confirm no other file imports from here.
 * Run: grep -r "utils/cookie" server/src  to verify zero imports.
 */

module.exports = {
  setRefreshTokenCookie: () => {},
  setAccessTokenCookie:  () => {},
  clearRefreshTokenCookie: () => {},
  clearAccessTokenCookie:  () => {},
  clearAllAuthCookies:   () => {},
};
