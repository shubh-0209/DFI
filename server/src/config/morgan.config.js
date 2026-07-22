const morgan = require('morgan');

/**
 * Morgan HTTP request logger configuration.
 * - Development: 'dev' format (colorized, concise)
 * - Production:  'combined' Apache-style format for log aggregators
 */
const getMorganMiddleware = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    // Combined format provides: remote-addr, date, method, url, status, response-time, referrer, user-agent
    return morgan('combined');
  }

  // Dev format: status code coloured by response status, response time
  return morgan('dev');
};

module.exports = getMorganMiddleware;
