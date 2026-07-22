/**
 * loggingService.js
 *
 * Client-side logging utility. Logs to console in all environments.
 * The /api/v1/log endpoint does not exist on the server, so we never
 * make a network call — that was causing a cascade of 404 errors.
 */

export const logMalformedResponse = (payload) => {
  // Always log to console — never network-call a non-existent /log endpoint
  console.warn('[DFI] Malformed API response:', payload);
};

export default { logMalformedResponse };
