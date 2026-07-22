const fs = require('fs');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

require('./config/passport'); // DEPRECATED — Google OAuth now via Supabase SDK on the frontend
const getCorsConfig    = require('./config/cors.config');
const helmetConfig     = require('./config/helmet.config');
const getMorganMiddleware = require('./config/morgan.config');
// Removed globalLimiter import
const swaggerSpec = require('./config/swagger.config');
const errorHandler = require('./middlewares/error.middleware');
const notFoundHandler = require('./middlewares/notFound.middleware');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const programRoutes = require('./modules/program/program.routes');
const applicationRoutes = require('./modules/application/application.routes');
const attendanceRoutes = require('./modules/attendance/attendance.routes');
const certificateRoutes = require('./modules/certificate/certificate.routes');
const rewardRoutes = require('./modules/reward/reward.routes');
const leaderboardRoutes = require('./modules/leaderboard/leaderboard.routes');
const notificationRoutes = require('./modules/notification/notification.routes');
const organizationRoutes = require('./modules/organization/organization.routes');
const permissionRoutes = require('./modules/permission/permission.routes');
const roleRoutes = require('./modules/role/role.routes');
const analyticsRoutes = require('./modules/analytics/analytics.routes');
const reportsRoutes = require('./modules/reports/report.routes');
const conversationRoutes = require('./modules/conversation/conversation.routes');
const messageRoutes = require('./modules/message/message.routes');
const supportTicketRoutes = require('./modules/support-ticket/support-ticket.routes');
const announcementRoutes = require('./modules/announcement/announcement.routes');
const collaborationRoutes = require('./modules/collaboration/collaboration.routes');
const matchingRoutes = require('./modules/matching/matching.routes');
require('./modules/matching/recommendation.model');
const evidenceRoutes = require('./modules/evidence/evidence.routes');
require('./modules/evidence/evidence.model');
const verificationRoutes = require('./modules/verification/verification.routes');
require('./modules/verification/verification.model');
const forecastRoutes = require('./modules/forecast/forecast.routes');
const contributionRoutes = require('./modules/contribution/contribution.routes');
// Removed all explicit model imports to avoid mongoose dependency
const contributionConfigRoutes = require('./modules/contribution/contribution-config.routes');
const { successResponse } = require('./utils/response');

const app = express();

// ─────────────────────────────────────────────
// Trust proxy for proper IP detection behind reverse proxy (Render)
// ─────────────────────────────────────────────
app.set('trust proxy', 1);

// ─────────────────────────────────────────────
// 1. Security Headers (Helmet)
// ─────────────────────────────────────────────
app.use(helmet(helmetConfig));

// ─────────────────────────────────────────────
// 2. CORS
// ─────────────────────────────────────────────
app.use(cors(getCorsConfig()));

// ─────────────────────────────────────────────
// 3. HTTP Request Logging (Morgan)
// ─────────────────────────────────────────────
app.use(getMorganMiddleware());

// ─────────────────────────────────────────────
// 4. Body Parsing (with request size limits)
// ─────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─────────────────────────────────────────────
// 5. Cookie Parsing — REMOVED (Supabase Auth uses no HttpOnly cookies)
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// 6. Gzip Compression
// ─────────────────────────────────────────────
app.use(compression());

// ─────────────────────────────────────────────
// 7. Passport Initialization — REMOVED (Google OAuth now via Supabase SDK)
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// 8. Global Rate Limiter (Production only) - REMOVED
// Rate limiting is now applied individually per-route via authenticatedLimiter and publicLimiter
// ─────────────────────────────────────────────
// if (process.env.NODE_ENV === 'production') {
//   app.use('/api', globalLimiter);
// }

// ─────────────────────────────────────────────
// 9. Health Check
// ─────────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
  res.json({ status: "ok" });
});

// ─────────────────────────────────────────────
// 9.5. Root endpoint for Render health checks
// ─────────────────────────────────────────────
app.get('/', (req, res) => {
  return successResponse(res, 200, 'API Running', {
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/api/v1/health',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      programs: '/api/v1/programs',
      applications: '/api/v1/applications',
      attendance: '/api/v1/attendance',
      certificates: '/api/v1/certificates',
      rewards: '/api/v1/rewards',
      leaderboard: '/api/v1/leaderboard',
      notifications: '/api/v1/notifications',
      analytics: '/api/v1/analytics',
      reports: '/api/v1/reports',
      announcements: '/api/v1/announcements',
      collaboration: '/api/v1/collaboration',
      matching: '/api/v1/matching',
      contributions: '/api/v1/contributions',
      'contribution-config': '/api/v1/contributions/config',
    },
  });
});

// ─────────────────────────────────────────────
// 10. API Routes
// ─────────────────────────────────────────────
const publicRoutes = require('./modules/public/public.routes');

app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/programs', programRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/certificates', certificateRoutes);
app.use('/api/v1/rewards', rewardRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/organizations', organizationRoutes);
app.use('/api/v1/permissions', permissionRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/reports', reportsRoutes);
app.use('/api/v1/conversations', messageRoutes);
app.use('/api/v1/conversations', conversationRoutes);
app.use('/api/v1/support-tickets', supportTicketRoutes);
app.use('/api/v1/announcements', announcementRoutes);
app.use('/api/v1/collaboration', collaborationRoutes);
app.use('/api/v1/matching', matchingRoutes);
app.use('/api/v1/forecast', forecastRoutes);
app.use('/api/v1/contributions', contributionRoutes);
app.use('/api/v1/contributions/config', contributionConfigRoutes);
app.use('/api/v1/evidence', evidenceRoutes);
app.use('/api/v1/verifications', verificationRoutes);

// ─────────────────────────────────────────────
// 11. Swagger API Documentation
// ─────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─────────────────────────────────────────────
// 12. Serve React static build + SPA fallback
// ─────────────────────────────────────────────
const clientBuildPath = path.join(__dirname, '../../client/dist');

// Serve static files with fine-grained cache control:
// - index.html: never cache (always serve fresh so stale chunk references can't occur after deployments)
// - hashed JS/CSS assets: cache for 1 year (safe — Vite embeds a content hash in the filename)
app.use(
  express.static(clientBuildPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      } else if (/\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|ico|webp)$/i.test(filePath)) {
        // Hashed filenames — safe to cache aggressively
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  })
);

// SPA fallback middleware: any non-API, non-static GET returns index.html
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api') || req.path.startsWith('/api-docs')) return next();

  // If the request is for a static asset (contains a dot) but wasn't served by express.static,
  // the file doesn't exist (e.g., a stale JS chunk from a previous deployment).
  // Return a plain-text 404 — NOT JSON — so the browser shows a proper error instead of
  // crashing the React runtime with an unexpected token error (which causes the white screen).
  if (req.path.includes('.')) {
    return res.status(404).type('text').send('Not Found');
  }

  const indexPath = path.join(clientBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    // Always serve index.html with no-cache headers to prevent stale chunk references
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.sendFile(indexPath);
  }
  return next();
});

// ─────────────────────────────────────────────
// 13. 404 Handler (must be after all routes and docs)
// ─────────────────────────────────────────────
app.use(notFoundHandler);

// ─────────────────────────────────────────────
// 13. Global Error Handler (must be last)
// ─────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;