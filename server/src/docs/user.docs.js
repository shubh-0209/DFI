/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Get current user profile
 *     description: >
 *       Returns the complete profile of the currently authenticated user.
 *       Sensitive fields such as password and refreshToken are never returned.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully.
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
 *                   example: User profile retrieved successfully
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
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   put:
 *     summary: Update current user profile
 *     description: >
 *       Updates the profile details of the currently authenticated user.
 *       System-managed fields (email, role, status, points, etc.) are ignored.
 *       Profile completion, strength, and volunteer level are automatically recalculated on every update.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *           examples:
 *             basic:
 *               summary: Basic information update
 *               value:
 *                 name: Arjun Mehta
 *                 phone: "+919876543210"
 *                 about: Passionate about social impact and education in rural India.
 *             full:
 *               summary: Full profile update
 *               value:
 *                 name: Arjun Mehta
 *                 username: arjun_mehta
 *                 phone: "+919876543210"
 *                 gender: male
 *                 dateOfBirth: "2000-04-15"
 *                 college: IIT Delhi
 *                 course: B.Tech Computer Science
 *                 graduationYear: 2022
 *                 educationLevel: Graduate
 *                 city: New Delhi
 *                 state: Delhi
 *                 country: India
 *                 about: Passionate about social impact and education in rural India.
 *                 skills:
 *                   - Teaching
 *                   - Node.js
 *                   - React
 *                 languages:
 *                   - English
 *                   - Hindi
 *                 interests:
 *                   - Education
 *                   - Environment
 *                 availability:
 *                   - Weekends
 *                   - Evenings
 *                 linkedin: https://linkedin.com/in/arjunmehta
 *                 portfolio: https://arjunmehta.dev
 *     responses:
 *       200:
 *         description: Profile updated successfully.
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
 *                   example: Profile updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Missing or invalid access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationError'
 *       409:
 *         description: Username already taken.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: Username is already taken
 *
 * /api/v1/users/profile-completion:
 *   get:
 *     summary: Get profile completion breakdown
 *     description: >
 *       Returns the current authenticated user's profile completion percentage,
 *       profile strength label, volunteer level, and a field-by-field breakdown
 *       showing exactly which profile sections are filled and which are missing.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile completion retrieved successfully.
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
 *                   example: Profile completion retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     profileCompletion:
 *                       type: integer
 *                       example: 64
 *                     profileStrength:
 *                       type: string
 *                       enum: [Weak, Average, Good, Excellent]
 *                       example: Good
 *                     volunteerLevel:
 *                       type: string
 *                       enum: [Beginner, Contributor, Mentor, Leader, Ambassador]
 *                       example: Beginner
 *                     breakdown:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: boolean
 *                           example: true
 *                         phone:
 *                           type: boolean
 *                           example: true
 *                         about:
 *                           type: boolean
 *                           example: false
 *                         city:
 *                           type: boolean
 *                           example: true
 *                         college:
 *                           type: boolean
 *                           example: true
 *                         course:
 *                           type: boolean
 *                           example: true
 *                         skills:
 *                           type: boolean
 *                           example: true
 *                         languages:
 *                           type: boolean
 *                           example: false
 *                         interests:
 *                           type: boolean
 *                           example: false
 *                         availability:
 *                           type: boolean
 *                           example: false
 *                         linkedin:
 *                           type: boolean
 *                           example: true
 *                         portfolio:
 *                           type: boolean
 *                           example: false
 *                         profilePhoto:
 *                           type: boolean
 *                           example: false
 *                         resume:
 *                           type: boolean
 *                           example: false
 *       401:
 *         description: Missing or invalid access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationError'
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/users/statistics:
 *   get:
 *     summary: Get volunteer statistics
 *     description: >
 *       Returns all volunteer statistics for the current authenticated user,
 *       including points, hours completed, programs, certificates, referrals,
 *       impact score, current level, and progress to the next level.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Volunteer statistics retrieved successfully.
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
 *                   example: Volunteer statistics retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     points:
 *                       type: integer
 *                       example: 120
 *                     hoursCompleted:
 *                       type: number
 *                       example: 34.5
 *                     programsJoined:
 *                       type: integer
 *                       example: 5
 *                     programsCompleted:
 *                       type: integer
 *                       example: 3
 *                     certificatesEarned:
 *                       type: integer
 *                       example: 2
 *                     referralCount:
 *                       type: integer
 *                       example: 4
 *                     impactScore:
 *                       type: integer
 *                       example: 350
 *                     volunteerLevel:
 *                       type: string
 *                       example: Contributor
 *                     profileCompletion:
 *                       type: integer
 *                       example: 64
 *                     profileStrength:
 *                       type: string
 *                       example: Good
 *                     nextLevel:
 *                       type: string
 *                       example: Mentor
 *                     pointsToNextLevel:
 *                       type: integer
 *                       example: 380
 *       401:
 *         description: Missing or invalid access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationError'
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/users/profile-photo:
 *   patch:
 *     summary: Upload profile photo
 *     description: Uploads and sets the profile photo for the current authenticated user. Implemented in Module 3.4.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile photo uploaded successfully.
 *       401:
 *         description: Unauthorized.
 *
 * /api/v1/users/resume:
 *   patch:
 *     summary: Upload resume
 *     description: Uploads and sets the resume URL for the current authenticated user. Implemented in Module 3.4.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Resume uploaded successfully.
 *       401:
 *         description: Unauthorized.
 *
 * /api/v1/users/public/{username}:
 *   get:
 *     summary: Get public profile by username
 *     description: Retrieves the public-facing profile of a user by their username.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         example: arjun_mehta
 *     responses:
 *       200:
 *         description: Public profile retrieved successfully.
 *       404:
 *         description: User not found.
 *
 * /api/v1/users:
 *   get:
 *     summary: Search users (Admin/Coordinator Only)
 *     description: Search and filter users. Restricted to admins, superadmins, and coordinators.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Users list retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
