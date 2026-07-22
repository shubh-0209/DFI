const path = require('path');
// Load environment variables as early as possible, before any module that might read them
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Validate required environment variables — fail fast
const validateEnv = require('./utils/envValidator');
validateEnv();

const app = require('./app');
const { initializeSocket } = require('./socket/socketServer');
// removed announcement automation to prevent mongoose usage

// ─────────────────────────────────────────────
// Handle Uncaught Exceptions (synchronous errors not caught anywhere)
// ─────────────────────────────────────────────
process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  // eslint-disable-next-line no-console
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// ─────────────────────────────────────────────
// Seed Admin User (Standalone)
// ─────────────────────────────────────────────
(async () => {
  // removed announcement automation execution

  // ── Seed / ensure admin and superadmin users exist via Supabase Auth ────────────
  // Passwords live in Supabase Auth, NOT in our users table.
  try {
    const supabase   = require('./config/supabase');
    const adminEmail = 'induaggarwal@gmail.com';
    const adminPass  = 'dishaforindia';

    // 1. Check if a Supabase auth user already exists for this email
    const { data: listData } = await supabase.auth.admin.listUsers();
    const existingAuthUser = (listData?.users || []).find(u => u.email === adminEmail);

    let supabaseId;

    if (existingAuthUser) {
      supabaseId = existingAuthUser.id;
      // Ensure password is current (idempotent)
      await supabase.auth.admin.updateUserById(supabaseId, {
        password:      adminPass,
        email_confirm: true,
      });
      console.log('[SERVER] ✅ Admin Supabase auth user verified.');
    } else {
      // Create the Supabase auth user
      const { data: newAuthData, error: createErr } = await supabase.auth.admin.createUser({
        email:         adminEmail,
        password:      adminPass,
        email_confirm: true,
        user_metadata: { name: 'Indu Aggarwal', username: 'induaggarwal' },
      });
      if (createErr) throw createErr;
      supabaseId = newAuthData.user.id;
      console.log('[SERVER] ✅ Admin Supabase auth user created.');
    }

    // 2. Upsert the profile row in our users table natively via Supabase
    // mongoose-compat stores data in a JSONB 'document' column
    let { data: users } = await supabase.from('users').select('*').filter('document->>supabaseId', 'eq', supabaseId).limit(1);
    let profile = users && users.length > 0 ? users[0] : null;
    
    if (!profile) {
      const { data: emailUsers } = await supabase.from('users').select('*').filter('document->>email', 'eq', adminEmail).limit(1);
      profile = emailUsers && emailUsers.length > 0 ? emailUsers[0] : null;
    }

    if (profile) {
      let needsSave = false;
      const doc = { ...profile.document };
      
      if (doc.role !== 'admin')    { doc.role = 'admin';   needsSave = true; }
      if (doc.status !== 'active') { doc.status = 'active'; needsSave = true; }
      if (!doc.username)           { doc.username = 'induaggarwal'; needsSave = true; }
      if (!doc.supabaseId)         { doc.supabaseId = supabaseId; needsSave = true; }
      if (doc.password)            { doc.password = null; needsSave = true; }
      
      if (needsSave) {
        await supabase.from('users').update({ document: doc }).eq('_id', profile._id);
        console.log('[SERVER] ✅ Admin profile row updated.');
      }
    } else {
      const { generateVolunteerId } = require('./utils/volunteerId');
      const volunteerId = await generateVolunteerId();
      
      const { v4: uuidv4 } = require('uuid');
      await supabase.from('users').insert([{
        _id: uuidv4(),
        document: {
          supabaseId,
          volunteerId,
          name:     'Indu Aggarwal',
          username: 'induaggarwal',
          email:    adminEmail,
          role:     'admin',
          status:   'active',
          country:  'India',
        }
      }]);
      console.log('[SERVER] ✅ Admin profile row created.');
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[SERVER] ❌ Error seeding auth users:', err.message || err);
  }
})();

// ─────────────────────────────────────────────
// Start HTTP Server
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `[SERVER] 🚀 Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});

// Initialize Socket.IO
initializeSocket(server);

// Initialize Notification Automation
try {
  const { initializeNotificationAutomation } = require('./modules/notification/notification.automation');
  initializeNotificationAutomation();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('[SERVER] Failed to initialize notification automation:', err.message);
}

// ─────────────────────────────────────────────
// Handle Unhandled Promise Rejections (async errors not caught anywhere)
// ─────────────────────────────────────────────
process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.error('UNHANDLED REJECTION! 💥 Shutting down gracefully...');
  // eslint-disable-next-line no-console
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// ─────────────────────────────────────────────
// Graceful Shutdown on SIGTERM (e.g., Heroku, Docker, Kubernetes)
// ─────────────────────────────────────────────
process.on('SIGTERM', () => {
  // eslint-disable-next-line no-console
  console.log('[SERVER] 📴 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log('[SERVER] ✅ HTTP server closed.');
  });
});
