const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  PASSWORD_RESET: 'password_reset',
};

const MESSAGES = {
  REGISTER_SUCCESS: 'Registration successful. Welcome to Disha for India!',
  LOGIN_SUCCESS: 'Logged in successfully.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  TOKEN_REFRESH_SUCCESS: 'Token refreshed successfully.',
  PASSWORD_RESET_EMAIL_SENT: 'Password reset link has been sent to your email.',
  PASSWORD_RESET_SUCCESS: 'Password has been reset successfully.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  UNAUTHORIZED: 'Unauthorized access. Please log in.',
  FORBIDDEN: 'Access forbidden. You do not have the required permissions.',
  EMAIL_ALREADY_EXISTS: 'Email is already registered.',
  USERNAME_ALREADY_EXISTS: 'Username is already taken.',
  MISSING_TOKEN: 'Access token is missing. Please log in.',
  INVALID_TOKEN: 'Invalid or expired access token. Please log in again.',
  USER_NOT_FOUND: 'User belonging to this token no longer exists.',
  BLOCKED_USER: 'Your account has been suspended. Please contact support.',
  DELETED_USER: 'Your account has been deactivated or deleted.',
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Railway sets NODE_ENV=production automatically. Add RAILWAY_ENVIRONMENT as an
// additional signal so cookies are always correctly configured on Railway.
const isProduction =
  process.env.NODE_ENV === 'production' ||
  process.env.RENDER === 'true' ||
  !!process.env.RAILWAY_ENVIRONMENT ||
  (process.env.FRONTEND_URL && process.env.FRONTEND_URL.includes('https'));

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days — slides on every refresh
};

const HEADERS = {
  AUTH_HEADER: 'authorization',
  BEARER_PREFIX: 'Bearer ',
};

module.exports = {
  TOKEN_TYPES,
  MESSAGES,
  HTTP_STATUS,
  COOKIE_OPTIONS,
  HEADERS,
};
