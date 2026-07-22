/**
 * @swagger
 * tags:
 *   - name: Analytics
 *     description: Analytics Engine & Reports API
 */

// ============================================================
// DASHBOARD STATISTICS (Module 11.1)
// ============================================================

/**
 * @swagger
 * /analytics/dashboard/volunteer:
 *   get:
 *     summary: Get volunteer dashboard statistics
 *     description: Retrieve comprehensive statistics for the authenticated volunteer
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Volunteer dashboard statistics retrieved successfully
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
 *                   example: "Volunteer dashboard statistics retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     volunteer:
 *                       type: object
 *                       properties:
 *                         totalProgramsJoined:
 *                           type: integer
 *                         activePrograms:
 *                           type: integer
 *                         completedPrograms:
 *                           type: integer
 *                         pendingApplications:
 *                           type: integer
 *                         approvedApplications:
 *                           type: integer
 *                         rejectedApplications:
 *                           type: integer
 *                         totalAttendance:
 *                           type: integer
 *                         totalHours:
 *                           type: number
 *                         currentCoins:
 *                           type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /analytics/dashboard/admin:
 *   get:
 *     summary: Get admin dashboard statistics
 *     description: Retrieve comprehensive statistics for admin users
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard statistics retrieved successfully
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
 *                   example: "Admin dashboard statistics retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     admin:
 *                       type: object
 *                       properties:
 *                         users:
 *                           type: object
 *                           properties:
 *                             totalVolunteers:
 *                               type: integer
 *                             activeVolunteers:
 *                               type: integer
 *                             newVolunteersThisMonth:
 *                               type: integer
 *                         programs:
 *                           type: object
 *                           properties:
 *                             totalPrograms:
 *                               type: integer
 *                             activePrograms:
 *                               type: integer
 *                             draftPrograms:
 *                               type: integer
 *                             completedPrograms:
 *                               type: integer
 *                             cancelledPrograms:
 *                               type: integer
 *                         applications:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: integer
 *                             pending:
 *                               type: integer
 *                             approved:
 *                               type: integer
 *                             rejected:
 *                               type: integer
 *                         attendance:
 *                           type: object
 *                           properties:
 *                             totalAttendance:
 *                               type: integer
 *                             todaysAttendance:
 *                               type: integer
 *                             attendanceRate:
 *                               type: number
 *                         certificates:
 *                           type: object
 *                           properties:
 *                             generated:
 *                               type: integer
 *                         rewards:
 *                           type: object
 *                           properties:
 *                             coinsDistributed:
 *                               type: number
 *                             badgesAwarded:
 *                               type: integer
 *                             achievementsAwarded:
 *                               type: integer
 *                         organizations:
 *                           type: object
 *                           properties:
 *                             totalOrganizations:
 *                               type: integer
 *                             verifiedOrganizations:
 *                               type: integer
 *                             pendingOrganizations:
 *                               type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /analytics/dashboard/super-admin:
 *   get:
 *     summary: Get super admin dashboard statistics
 *     description: Retrieve comprehensive statistics including platform health for super admins
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Super admin dashboard statistics retrieved successfully
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
 *                   example: "Super admin dashboard statistics retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     superAdmin:
 *                       type: object
 *                       properties:
 *                         platform:
 *                           type: object
 *                           properties:
 *                             version:
 *                               type: string
 *                             dbHealth:
 *                               type: string
 *                             totalAdmins:
 *                               type: integer
 *                             totalRoles:
 *                               type: integer
 *                             totalPermissions:
 *                               type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

// ============================================================
// VOLUNTEER ANALYTICS (Module 11.2)
// ============================================================

/**
 * @swagger
 * /analytics/volunteers:
 *   get:
 *     summary: Get volunteer analytics report
 *     description: Retrieve comprehensive volunteer analytics including monthly growth, location distribution, and status breakdown
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dateRange
 *         schema:
 *           type: string
 *           enum: [today, this_week, this_month, last_month, last_3_months, last_6_months, last_year]
 *         description: Date range filter for the analytics
 *     responses:
 *       200:
 *         description: Volunteer analytics retrieved successfully
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
 *                   example: "Volunteer analytics retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     volunteerAnalytics:
 *                       type: object
 *                       properties:
 *                         totalVolunteers:
 *                           type: integer
 *                         activeVolunteers:
 *                           type: integer
 *                         inactiveVolunteers:
 *                           type: integer
 *                         growthRate:
 *                           type: object
 *                           properties:
 *                             rate:
 *                               type: number
 *                             direction:
 *                               type: string
 *                               enum: [up, down, same]
 *                         volunteersJoinedPerMonth:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               year:
 *                                 type: integer
 *                               month:
 *                                 type: integer
 *                               monthName:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *                         volunteersByState:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               state:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *                               percentage:
 *                                 type: number
 *                         volunteersByCity:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               city:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *                               percentage:
 *                                 type: number
 *                         statusDistribution:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               status:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

// ============================================================
// PROGRAM ANALYTICS (Module 11.2)
// ============================================================

/**
 * @swagger
 * /analytics/programs:
 *   get:
 *     summary: Get program analytics report
 *     description: Retrieve comprehensive program analytics including monthly creation, status distribution, and category breakdown
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dateRange
 *         schema:
 *           type: string
 *           enum: [today, this_week, this_month, last_month, last_3_months, last_6_months, last_year]
 *         description: Date range filter for the analytics
 *     responses:
 *       200:
 *         description: Program analytics retrieved successfully
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
 *                   example: "Program analytics retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     programAnalytics:
 *                       type: object
 *                       properties:
 *                         totalPrograms:
 *                           type: integer
 *                         activePrograms:
 *                           type: integer
 *                         completedPrograms:
 *                           type: integer
 *                         cancelledPrograms:
 *                           type: integer
 *                         programsCreatedPerMonth:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               year:
 *                                 type: integer
 *                               month:
 *                                 type: integer
 *                               monthName:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *                         statusDistribution:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               status:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *                         programsByCategory:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               category:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *                         programsByState:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               state:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

// ============================================================
// APPLICATION ANALYTICS (Module 11.2)
// ============================================================

/**
 * @swagger
 * /analytics/applications:
 *   get:
 *     summary: Get application analytics report
 *     description: Retrieve application analytics including monthly submissions, status distribution, and program-wise breakdown
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dateRange
 *         schema:
 *           type: string
 *           enum: [today, this_week, this_month, last_month, last_3_months, last_6_months, last_year]
 *         description: Date range filter for the analytics
 *     responses:
 *       200:
 *         description: Application analytics retrieved successfully
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
 *                   example: "Application analytics retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     applicationAnalytics:
 *                       type: object
 *                       properties:
 *                         totalApplications:
 *                           type: integer
 *                         approvalRate:
 *                           type: number
 *                         rejectionRate:
 *                           type: number
 *                         pendingRate:
 *                           type: number
 *                         applicationsPerMonth:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               year:
 *                                 type: integer
 *                               month:
 *                                 type: integer
 *                               monthName:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *                         statusDistribution:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               status:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *                         applicationsByProgram:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               program:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

// ============================================================
// ATTENDANCE ANALYTICS (Module 11.2)
// ============================================================

/**
 * @swagger
 * /analytics/attendance:
 *   get:
 *     summary: Get attendance analytics report
 *     description: Retrieve attendance analytics including total hours, daily/monthly attendance, and program-wise breakdown
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dateRange
 *         schema:
 *           type: string
 *           enum: [today, this_week, this_month, last_month, last_3_months, last_6_months, last_year]
 *         description: Date range filter for the analytics
 *     responses:
 *       200:
 *         description: Attendance analytics retrieved successfully
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
 *                   example: "Attendance analytics retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     attendanceAnalytics:
 *                       type: object
 *                       properties:
 *                         totalHours:
 *                           type: number
 *                         attendanceRate:
 *                           type: number
 *                         dailyAttendance:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               date:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *                         monthlyAttendance:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               year:
 *                                 type: integer
 *                               month:
 *                                 type: integer
 *                               monthName:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *                               totalHours:
 *                                 type: number
 *                         attendanceByProgram:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               program:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *                               totalHours:
 *                                 type: number
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

// ============================================================
// CERTIFICATE ANALYTICS (Module 11.2)
// ============================================================

/**
 * @swagger
 * /analytics/certificates:
 *   get:
 *     summary: Get certificate analytics report
 *     description: Retrieve certificate analytics including total generated, program-wise breakdown, and monthly issuance
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dateRange
 *         schema:
 *           type: string
 *           enum: [today, this_week, this_month, last_month, last_3_months, last_6_months, last_year]
 *         description: Date range filter for the analytics
 *     responses:
 *       200:
 *         description: Certificate analytics retrieved successfully
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
 *                   example: "Certificate analytics retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     certificateAnalytics:
 *                       type: object
 *                       properties:
 *                         certificatesGenerated:
 *                           type: integer
 *                         certificatesByProgram:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               program:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *                         certificatesByMonth:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               year:
 *                                 type: integer
 *                               month:
 *                                 type: integer
 *                               monthName:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

// ============================================================
// REWARD ANALYTICS (Module 11.2)
// ============================================================

/**
 * @swagger
 * /analytics/rewards:
 *   get:
 *     summary: Get reward analytics report
 *     description: Retrieve reward analytics including coins distributed, badges awarded, and achievements
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dateRange
 *         schema:
 *           type: string
 *           enum: [today, this_week, this_month, last_month, last_3_months, last_6_months, last_year]
 *         description: Date range filter for the analytics
 *     responses:
 *       200:
 *         description: Reward analytics retrieved successfully
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
 *                   example: "Reward analytics retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     rewardAnalytics:
 *                       type: object
 *                       properties:
 *                         coinsDistributed:
 *                           type: number
 *                         coinsEarnedByMonth:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               year:
 *                                 type: integer
 *                               month:
 *                                 type: integer
 *                               monthName:
 *                                 type: string
 *                               coins:
 *                                 type: number
 *                         badgesAwarded:
 *                           type: integer
 *                         achievementsAwarded:
 *                           type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

// ============================================================
// LEADERBOARD ANALYTICS (Module 11.2)
// ============================================================

/**
 * @swagger
 * /analytics/leaderboard:
 *   get:
 *     summary: Get leaderboard analytics report
 *     description: Retrieve leaderboard analytics including top volunteers by hours, coins, and activity
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of top volunteers to return
 *     responses:
 *       200:
 *         description: Leaderboard analytics retrieved successfully
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
 *                   example: "Leaderboard analytics retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     leaderboardAnalytics:
 *                       type: object
 *                       properties:
 *                         topVolunteers:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               userId:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                               totalHours:
 *                                 type: number
 *                         highestCoinEarners:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               userId:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                               coins:
 *                                 type: integer
 *                         mostActiveVolunteers:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               userId:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                               programsJoined:
 *                                 type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

// ============================================================
// ORGANIZATION ANALYTICS (Module 11.2)
// ============================================================

/**
 * @swagger
 * /analytics/organizations:
 *   get:
 *     summary: Get organization analytics report
 *     description: Retrieve organization analytics including total created, verified, and active organizations
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dateRange
 *         schema:
 *           type: string
 *           enum: [today, this_week, this_month, last_month, last_3_months, last_6_months, last_year]
 *         description: Date range filter for the analytics
 *     responses:
 *       200:
 *         description: Organization analytics retrieved successfully
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
 *                   example: "Organization analytics retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     organizationAnalytics:
 *                       type: object
 *                       properties:
 *                         organizationsCreated:
 *                           type: integer
 *                         verifiedOrganizations:
 *                           type: integer
 *                         activeOrganizations:
 *                           type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */