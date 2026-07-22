/**
 * api.js — Axios instance for backend API calls.
 *
 * Token management is now handled entirely by the Supabase SDK.
 * supabase.auth.onAuthStateChange() keeps AuthContext (and therefore
 * api.defaults.headers.Authorization) up to date whenever the SDK
 * silently refreshes the access token.
 *
 * This interceptor's only job:
 *  1. Attach the current Supabase access token to every request.
 *  2. On 401: ask the Supabase SDK for a fresh session once, retry.
 *  3. If the refresh fails → dispatch auth-expired so AuthContext clears state.
 *  4. Normalise all error shapes to { message, status, data }.
 */

import axios  from 'axios';
import { logMalformedResponse } from './loggingService';

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  '/api/v1';

// ─── Axios instance ───────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  // No withCredentials — we're no longer using HttpOnly cookies
});

// ─── Helper ───────────────────────────────────────────────────────────────────
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

const redirectToLogin = () => {
  const onAuthPage =
    window.location.pathname === '/login' ||
    window.location.pathname === '/';
  if (!onAuthPage) {
    window.dispatchEvent(new CustomEvent('auth-expired'));
  }
};

// ─── Request interceptor ──────────────────────────────────────────────────────
// Always use the freshest token from the Supabase SDK so silent refreshes
// are picked up automatically without any manual rotation logic.
api.interceptors.request.use(
  async (config) => {
    try {
      // Lazy import to avoid circular deps at module load time
      const { supabase } = await import('./supabaseClient');
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers['Authorization'] = `Bearer ${session.access_token}`;
      }
    } catch {
      // If Supabase isn't available, fall back to whatever is already set
    }
    return config;
  },
  (err) => Promise.reject(err),
);

// ─── Response interceptor ─────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue  = [];

const drainQueue = (err, token = null) => {
  failedQueue.forEach((p) => (err ? p.reject(err) : p.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  // Unwrap the Axios envelope — callers receive the response body directly
  (response) => response.data,

  async (error) => {
    const original = error.config;
    const status   = error.response?.status;

    const isAuthEndpoint =
      original?.url?.includes('/auth/login')         ||
      original?.url?.includes('/auth/register')      ||
      original?.url?.includes('/auth/refresh-token') ||
      original?.url?.includes('/auth/logout')        ||
      original?.url?.includes('/auth/me');

    if (status === 401 && isAuthEndpoint) {
      redirectToLogin();
      return Promise.reject(buildError(error));
    }

    // On any other 401: ask Supabase to refresh the session, retry once
    if (status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers['Authorization'] = `Bearer ${token}`;
          return api(original);
        }).catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      try {
        const { supabase } = await import('./supabaseClient');
        // refreshSession() reads the stored refresh token from localStorage automatically
        const { data, error: sbErr } = await supabase.auth.refreshSession();

        if (sbErr || !data?.session) {
          throw sbErr || new Error('Session refresh failed — please log in again');
        }

        const newToken = data.session.access_token;

        // Keep axios default header in sync immediately
        setAuthToken(newToken);
        drainQueue(null, newToken);

        original.headers['Authorization'] = `Bearer ${newToken}`;
        return api(original);
      } catch (refreshErr) {
        drainQueue(refreshErr);
        // Clear stale axios header so no further requests go out with a dead token
        setAuthToken(null);
        logMalformedResponse({ endpoint: original?.url, status, refreshErr: refreshErr?.message });
        redirectToLogin();
        return Promise.reject(buildError(refreshErr));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(buildError(error));
  },
);

function buildError(error) {
  if (error?.message && !error?.isAxiosError && !error?.response) return error;
  return {
    message:       error?.response?.data?.message || error?.message || 'Something went wrong.',
    status:        error?.response?.status,
    data:          error?.response?.data,
    originalError: error,
  };
}

export default api;
