/**
 * Helmet security configuration.
 * @see https://helmetjs.github.io/
 */
const helmetConfig = {
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: [
  "'self'",
  "https://disha-frontend.onrender.com",
  "https://disha-for-india.onrender.com",
],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  // Cross-Origin Embedder Policy
  crossOriginEmbedderPolicy: false, // Disabled to avoid breaking API responses
  // DNS Prefetch Control
  dnsPrefetchControl: { allow: false },
  // Frameguard (X-Frame-Options: DENY)
  frameguard: { action: 'deny' },
  // Hide X-Powered-By header
  hidePoweredBy: true,
  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true,
  },
  // IE No Open
  ieNoOpen: true,
  // No Sniff (X-Content-Type-Options: nosniff)
  noSniff: true,
  // Origin Agent Cluster
  originAgentCluster: true,
  // Permitted Cross Domain Policies
  permittedCrossDomainPolicies: false,
  // Referrer Policy
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  // XSS Filter (legacy IE)
  xssFilter: true,
};

module.exports = helmetConfig;
