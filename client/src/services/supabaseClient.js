/**
 * supabaseClient.js — Browser-side Supabase client.
 *
 * Uses the ANON (public) key — safe to expose in the browser.
 * NEVER use the service role key here.
 *
 * Responsibilities on the frontend:
 *  - supabase.auth.signInWithPassword()   → login
 *  - supabase.auth.signUp()               → register
 *  - supabase.auth.signOut()              → logout (clears local session)
 *  - supabase.auth.getSession()           → restore session on page load
 *  - supabase.auth.onAuthStateChange()    → react to token refresh / logout
 *  - supabase.auth.signInWithOAuth()      → Google OAuth
 *  - supabase.auth.resetPasswordForEmail()→ forgot password
 *
 * Session storage: Supabase stores the session in localStorage by default,
 * so the access token survives page reloads and the SDK auto-refreshes it
 * before expiry — no manual refresh-token logic needed on the client.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    '[supabaseClient] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set. ' +
    'Copy them from your Supabase project settings → API → Project API keys (anon/public).'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession:     true,          // keep session across page reloads
    autoRefreshToken:   true,          // SDK refreshes access token automatically
    detectSessionInUrl: true,          // pick up OAuth redirect tokens from URL hash
    storageKey:         'dfi_session', // namespace so multiple Supabase apps don't clash
  },
});

export default supabase;
