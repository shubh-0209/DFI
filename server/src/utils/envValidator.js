/**
 * envValidator.js — Validates required environment variables at startup.
 * Fails fast if any required variable is missing.
 *
 * JWT_SECRET / JWT_REFRESH_SECRET are NO LONGER required — Supabase Auth
 * owns all token lifecycle management. Those keys have been removed.
 */

const REQUIRED_ENV_VARS = [
  'PORT',
  'NODE_ENV',
  'CORS_ORIGIN',
  // Supabase credentials (both required for the admin client used server-side)
  'SUPABASE_URL',
  'SUPABASE_KEY',
];

const validateEnv = () => {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  // At least one database connection must be present
  const hasPostgres = !!process.env.DATABASE_URL;
  const hasSupabase = !!(process.env.SUPABASE_URL && process.env.SUPABASE_KEY);

  if (!hasPostgres && !hasSupabase) {
    missing.push('DATABASE_URL (direct PostgreSQL) or SUPABASE_URL + SUPABASE_KEY');
  }

  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.error(
      `[ENV] ❌ Missing required environment variables:\n  ${missing.join('\n  ')}\n\n` +
      'Please set them in your .env file or Railway/Vercel environment settings.'
    );
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log('[ENV] ✅ All required environment variables are present.');
};

module.exports = validateEnv;
