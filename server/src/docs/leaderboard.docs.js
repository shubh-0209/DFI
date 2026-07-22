/**
 * @swagger
 * tags:
 *   - name: Leaderboard
 *     description: Volunteer Leaderboard Rankings
 *
 * /api/v1/leaderboard:
 *   get:
 *     summary: Get Leaderboard
 *     description: Retrieve the leaderboard with pagination, type filters (national/state/city), and sorting.
 *     tags: [Leaderboard]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [national, state, city]
 *           default: national
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [currentRank, nationalRank, stateRank, cityRank, totalImpact, totalPoints, totalVolunteerHours, totalProgramsCompleted, totalCoins]
 *           default: currentRank
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *     responses:
 *       200:
 *         description: Leaderboard retrieved successfully.
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
 *                   example: Leaderboard retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     leaderboard:
 *                       type: array
 *                       items:
 *                         type: object
 *                     total:
 *                       type: integer
 *                       example: 150
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *       401:
 *         description: Unauthorized.
 *       422:
 *         description: Validation failed.
 *
 * /api/v1/leaderboard/me:
 *   get:
 *     summary: Get My Rank
 *     description: Retrieve the current logged-in user's leaderboard ranking details across all scopes.
 *     tags: [Leaderboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Your rank retrieved successfully.
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
 *                   example: Your rank retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     currentRank:
 *                       type: integer
 *                       example: 12
 *                     cityRank:
 *                       type: integer
 *                       example: 3
 *                     stateRank:
 *                       type: integer
 *                       example: 8
 *                     nationalRank:
 *                       type: integer
 *                       example: 12
 *                     totalPoints:
 *                       type: number
 *                       example: 1250
 *                     totalCoins:
 *                       type: number
 *                       example: 300
 *                     totalImpact:
 *                       type: number
 *                       example: 450
 *                     totalVolunteerHours:
 *                       type: number
 *                       example: 120
 *                     totalProgramsCompleted:
 *                       type: number
 *                       example: 8
 *                     city:
 *                       type: string
 *                       example: Bengaluru
 *                     state:
 *                       type: string
 *                       example: Karnataka
 *                     lastCalculatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Leaderboard entry not found.
 *       401:
 *         description: Unauthorized.
 *
 * /api/v1/leaderboard/top:
 *   get:
 *     summary: Get Top Volunteers
 *     description: Retrieve top N volunteers by selected rank scope and optional geographic filters.
 *     tags: [Leaderboard]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [national, state, city]
 *           default: national
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Top volunteers retrieved successfully.
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
 *                   example: Top volunteers retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       currentRank:
 *                         type: integer
 *                       cityRank:
 *                         type: integer
 *                       stateRank:
 *                         type: integer
 *                       nationalRank:
 *                         type: integer
 *                       totalImpact:
 *                         type: number
 *                       totalPoints:
 *                         type: number
 *                       totalVolunteerHours:
 *                         type: number
 *                       totalProgramsCompleted:
 *                         type: number
 *                       totalCoins:
 *                         type: number
 *                       user:
 *                         type: object
 *       401:
 *         description: Unauthorized.
 *       422:
 *         description: Validation failed.
 *
 * /api/v1/leaderboard/refresh:
 *   post:
 *     summary: Refresh Leaderboard (Admin)
 *     description: Recalculate and refresh the entire leaderboard for all active volunteers. Admin only.
 *     tags: [Leaderboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Leaderboard refreshed successfully.
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
 *                   example: Leaderboard refreshed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     refreshed:
 *                       type: integer
 *                       example: 150
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-07-01T08:00:00.000Z
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden — Admin access required.
 */
