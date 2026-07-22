/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Server Health Check
 *     description: Returns the current operational status of the server, uptime, environment, and timestamp. Use this endpoint to verify the API is reachable and running.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running normally.
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
 *                   example: Server is healthy
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: UP
 *                     uptime:
 *                       type: string
 *                       example: 3720s
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-06-30T04:00:00.000Z"
 *                     environment:
 *                       type: string
 *                       example: development
 */
