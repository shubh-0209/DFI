/**
 * @swagger
 * tags:
 *   - name: Gamification
 *     description: Badges, Achievements & Volunteer Levels
 *
 * /api/v1/leaderboard/badges:
 *   get:
 *     summary: Get My Badges
 *     description: Retrieve all badges earned by the current user.
 *     tags: [Gamification]
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
 *           default: 50
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Badges retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       422:
 *         description: Validation failed.
 *
 * /api/v1/leaderboard/achievements:
 *   get:
 *     summary: Get My Achievements
 *     description: Retrieve all achievements for the current user with progress tracking.
 *     tags: [Gamification]
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
 *           default: 50
 *           maximum: 100
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *           description: Filter by completion status
 *     responses:
 *       200:
 *         description: Achievements retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       422:
 *         description: Validation failed.
 *
 * /api/v1/leaderboard/level:
 *   get:
 *     summary: Get My Volunteer Level
 *     description: Retrieve the current user's volunteer level, progress to next level, and requirements.
 *     tags: [Gamification]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Volunteer level retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *
 * /api/v1/leaderboard/evaluate:
 *   post:
 *     summary: Evaluate Gamification (Admin)
 *     description: Manually trigger evaluation of badges, achievements, and volunteer level for the current user. Admin only.
 *     tags: [Gamification]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Gamification evaluation completed successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden — Admin access required.
 */
