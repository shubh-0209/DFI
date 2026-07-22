/**
 * @swagger
 * tags:
 *   - name: Reports
 *     description: Advanced Reporting & Business Intelligence API
 */

// ============================================================
// REPORT GENERATION
// ============================================================

/**
 * @swagger
 * /reports/generate:
 *   post:
 *     summary: Generate a new report
 *     description: Generate a report and save to history
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportType:
 *                 type: string
 *                 enum: [volunteer, program, application, attendance, certificate, reward, leaderboard, organization, platform, impact]
 *               dateRange:
 *                 type: string
 *                 enum: [today, this_week, this_month, last_month, last_3_months, last_6_months, last_year]
 *               format:
 *                 type: string
 *                 enum: [csv, excel, pdf]
 *               organization:
 *                 type: string
 *                 description: Organization ID filter
 *               program:
 *                 type: string
 *                 description: Program ID filter
 *     responses:
 *       200:
 *         description: Report generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

// ============================================================
// REPORT PREVIEW
// ============================================================

/**
 * @swagger
 * /reports/preview:
 *   get:
 *     summary: Preview a report
 *     description: Preview report data before exporting
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: reportType
 *         schema:
 *           type: string
 *           enum: [volunteer, program, application, attendance, certificate, reward, leaderboard, organization, platform, impact]
 *         required: true
 *         description: Type of report to preview
 *       - in: query
 *         name: dateRange
 *         schema:
 *           type: string
 *           enum: [today, this_week, this_month, last_month, last_3_months, last_6_months, last_year]
 *         description: Date range filter
 *     responses:
 *       200:
 *         description: Report preview fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     preview:
 *                       type: object
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

// ============================================================
// REPORT EXPORT
// ============================================================

/**
 * @swagger
 * /reports/export/{reportType}:
 *   get:
 *     summary: Export a report
 *     description: Export report in CSV, Excel, or PDF format
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportType
 *         schema:
 *           type: string
 *           enum: [volunteer, program, application, attendance, certificate, reward, leaderboard, organization, platform, impact]
 *         required: true
 *         description: Type of report to export
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv, excel, pdf]
 *         description: Export format (default: csv)
 *       - in: query
 *         name: dateRange
 *         schema:
 *           type: string
 *           enum: [today, this_week, this_month, last_month, last_3_months, last_6_months, last_year]
 *         description: Date range filter
 *     responses:
 *       200:
 *         description: Report exported successfully
 *         content:
 *           application/csv:
 *             schema:
 *               type: string
 *           200:
 *             application/pdf:
 *               schema:
 *                 type: string
 *           200:
 *             application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *               schema:
 *                 type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

// ============================================================
// REPORT HISTORY
// ============================================================

/**
 * @swagger
 * /reports/history:
 *   get:
 *     summary: Get report history
 *     description: Retrieve all reports generated by the user
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Report history fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     reports:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           reportId:
 *                             type: string
 *                           reportType:
 *                             type: string
 *                           generatedAt:
 *                             type: string
 *                             format: date-time
 *                           filters:
 *                             type: object
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         pages:
 *                           type: integer
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

// ============================================================
// BUSINESS INTELLIGENCE
// ============================================================

/**
 * @swagger
 * /reports/bi:
 *   get:
 *     summary: Get business intelligence data
 *     description: Retrieve comprehensive business intelligence metrics
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Business intelligence data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     businessIntelligence:
 *                       type: object
 *                       properties:
 *                         topPerformingPrograms:
 *                           type: array
 *                         topVolunteers:
 *                           type: array
 *                         mostActiveOrganizations:
 *                           type: array
 *                         highestAttendance:
 *                           type: array
 *                         volunteerRetentionRate:
 *                           type: number
 *                         applicationConversionRate:
 *                           type: number
 *                         programCompletionRate:
 *                           type: number
 *                         averageAttendance:
 *                           type: number
 *                         averageVolunteerHours:
 *                           type: number
 *                         averageCoinsEarned:
 *                           type: number
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

// ============================================================
// COMPARISON DATA
// ============================================================

/**
 * @swagger
 * /reports/compare/{compareType}:
 *   get:
 *     summary: Get comparison data
 *     description: Compare data between periods or entities
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: compareType
 *         schema:
 *           type: string
 *           enum: [month, year]
 *         required: true
 *         description: Comparison type
 *     responses:
 *       200:
 *         description: Comparison data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     comparison:
 *                       type: object
 *                       properties:
 *                         comparisonType:
 *                           type: string
 *                         currentPeriod:
 *                           type: object
 *                           properties:
 *                             label:
 *                               type: string
 *                             value:
 *                               type: number
 *                         previousPeriod:
 *                           type: object
 *                           properties:
 *                             label:
 *                               type: string
 *                             value:
 *                               type: number
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */