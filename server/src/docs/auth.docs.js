/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new volunteer account
 *     description: >
 *       Creates a new volunteer account on the Disha for India platform.
 *       A unique sequential **Volunteer ID** (e.g. `DISHA000001`) is auto-generated.
 *       The account is created with **pending** status by default.
 *       Passwords are bcrypt-hashed before storage.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             complete:
 *               summary: Full registration payload
 *               value:
 *                 name: Arjun Mehta
 *                 username: arjun_mehta
 *                 email: arjun.mehta@disha.org
 *                 password: SecurePass123!
 *                 phone: "+919876543210"
 *             minimal:
 *               summary: Minimal registration payload (no phone)
 *               value:
 *                 name: Priya Singh
 *                 username: priya_singh
 *                 email: priya.singh@disha.org
 *                 password: SecurePass123!
 *     responses:
 *       201:
 *         description: Registration successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Registration successful. Welcome to Disha for India!
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation failed — missing or invalid fields.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example:
 *               success: false
 *               message: Validation Failed
 *               errors:
 *                 - field: email
 *                   message: Valid email is required
 *                 - field: password
 *                   message: Password must be at least 8 characters
 *       409:
 *         description: Conflict — email or username already registered.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Email is already registered.
 *       429:
 *         description: Too many registration attempts from this IP.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RateLimitError'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login with email or username
 *     description: >
 *       Authenticates an existing user using either their **email** or **username** alongside
 *       their password.
 *
 *       On success, returns a short-lived **JWT access token** in the response body and
 *       sets a long-lived **HTTP-only refresh token cookie** automatically.
 *
 *       Use the `accessToken` as a `Bearer` token for all subsequent protected requests.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             withEmail:
 *               summary: Login with email
 *               value:
 *                 email: arjun.mehta@disha.org
 *                 password: SecurePass123!
 *             withUsername:
 *               summary: Login with username
 *               value:
 *                 username: arjun_mehta
 *                 password: SecurePass123!
 *     responses:
 *       200:
 *         description: Login successful.
 *         headers:
 *           Set-Cookie:
 *             description: >
 *               HTTP-only refresh token cookie.
 *               `refreshToken=<token>; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged in successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationError'
 *             example:
 *               success: false
 *               message: Invalid email or password.
 *       429:
 *         description: Too many failed login attempts.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RateLimitError'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout the current user
 *     description: >
 *       Invalidates the current session by removing the refresh token from the database
 *       and clearing the `refreshToken` HTTP-only cookie.
 *
 *       The **access token must be sent** in the `Authorization` header.
 *
 *       After logout, the access token will stop working once it expires naturally.
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged out successfully.
 *                 data:
 *                   type: object
 *                   example: {}
 *       401:
 *         description: Missing or invalid access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationError'
 *             example:
 *               success: false
 *               message: Access token is missing. Please log in.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh JWT access token
 *     description: >
 *       Issues a new **access token** and **refresh token** pair using the existing
 *       `refreshToken` stored in the HTTP-only cookie (Token Rotation).
 *
 *       The old refresh token is invalidated after use.
 *
 *       This endpoint is automatically called by the frontend when the access token expires.
 *       No request body is needed — the cookie is read automatically.
 *     tags: [Auth]
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         required: true
 *         schema:
 *           type: string
 *         description: The HTTP-only refresh token set during login.
 *     responses:
 *       200:
 *         description: Token refreshed successfully.
 *         headers:
 *           Set-Cookie:
 *             description: New HTTP-only refresh token cookie.
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Token refreshed successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Refresh token missing, invalid, or expired.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationError'
 *             example:
 *               success: false
 *               message: Invalid refresh token or session expired.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request a password reset link
 *     description: >
 *       Sends a **password reset email** to the registered email address containing
 *       a secure one-time token link.
 *
 *       The reset token **expires in 10 minutes**.
 *
 *       For security, the API always returns the same success response regardless of
 *       whether the email exists — this prevents user enumeration attacks.
 *
 *       **Rate Limited:** 3 requests per hour per IP.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *           example:
 *             email: arjun.mehta@disha.org
 *     responses:
 *       200:
 *         description: Reset email sent (or silently ignored if email not found).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset link has been sent to your email.
 *                 data:
 *                   type: object
 *                   example: {}
 *       400:
 *         description: Validation failed — invalid email format.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       429:
 *         description: Too many password reset requests.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RateLimitError'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/auth/reset-password/{token}:
 *   post:
 *     summary: Reset password using a valid reset token
 *     description: >
 *       Accepts the one-time **password reset token** (from the email link) and a new password.
 *
 *       On success:
 *       - The password is updated with a new bcrypt hash.
 *       - The reset token is invalidated immediately.
 *       - All active refresh tokens (sessions) are revoked — the user must log in again.
 *
 *       The token is valid for **10 minutes** from the time the reset email was sent.
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The raw password reset token received in the email link.
 *         example: a3f8c2b1e5d7...
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *           example:
 *             password: NewSecurePass456!
 *             confirmPassword: NewSecurePass456!
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password has been reset successfully.
 *                 data:
 *                   type: object
 *                   example: {}
 *       400:
 *         description: Token invalid/expired, or passwords do not match.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example:
 *               success: false
 *               message: Password reset token is invalid or has expired.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get the current authenticated user
 *     description: >
 *       Returns the complete profile of the currently authenticated user.
 *
 *       The **JWT access token** must be provided in the `Authorization` header.
 *       Sensitive fields such as `password` and `refreshToken` are never returned.
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User profile retrieved successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Missing or invalid access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationError'
 *             examples:
 *               missingToken:
 *                 summary: No token provided
 *                 value:
 *                   success: false
 *                   message: Access token is missing. Please log in.
 *               invalidToken:
 *                 summary: Token is tampered or expired
 *                 value:
 *                   success: false
 *                   message: Invalid or expired access token. Please log in again.
 *               userDeleted:
 *                 summary: Token valid but user no longer exists
 *                 value:
 *                   success: false
 *                   message: User belonging to this token no longer exists.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
