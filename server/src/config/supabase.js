/**
 * supabase.js — Server-side Supabase admin client.
 *
 * Uses the SERVICE_ROLE key so it can:
 *  - Create / delete auth users
 *  - Look up users by email
 *  - Set custom user metadata (role, username, volunteerId)
 *  - Verify access tokens via supabase.auth.getUser()
 *
 * NEVER expose this client or the service role key to the browser.
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL        = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_KEY; // sb_secret_… / service_role key

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error(
    '[supabase] SUPABASE_URL and SUPABASE_KEY (service role) must be set in environment variables.'
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,   // server doesn't need to refresh
    persistSession:   false,   // stateless server
    detectSessionInUrl: false,
  },
});

module.exports = supabase;
