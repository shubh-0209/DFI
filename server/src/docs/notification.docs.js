/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     summary: Get notifications for the current user
 *     description: >
 *       Retrieves a paginated list of notifications for the currently authenticated user.
 *       Supports filtering by type, category, priority, read status, and date range.
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Items per page (max 100)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [application, program, attendance, certificate, reward, leaderboard, system, announcement]
 *         description: Filter by notification type
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           example: general
 *         description: Filter by category
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, critical]
 *         description: Filter by priority
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: boolean
 *         description: Filter by read status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by end date
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: createdAt
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationsResponse'
 *       401:
 *         description: Missing or invalid access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationError'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/notifications/search:
 *   get:
 *     summary: Search notifications by keyword
 *     description: >
 *       Searches notifications by title or message for the currently authenticated user.
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         schema:
 *           type: string
 *           example: certificate
 *         description: Search keyword
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Search results retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationsResponse'
 *       400:
 *         description: Search query is required.
 *       401:
 *         description: Missing or invalid access token.
 */

/**
 * @swagger
 * /api/v1/notifications/unread:
 *   get:
 *     summary: Get unread notifications for the current user
 *     description: >
 *       Retrieves a paginated list of unread notifications for the currently authenticated user.
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Unread notifications retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationsResponse'
 *       401:
 *         description: Missing or invalid access token.
 */

/**
 * @swagger
 * /api/v1/notifications/unread/count:
 *   get:
 *     summary: Get unread notification count
 *     description: >
 *       Returns the count of unread notifications for the currently authenticated user.
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnreadCountResponse'
 *       401:
 *         description: Missing or invalid access token.
 */

/**
 * @swagger
 * /api/v1/notifications/{id}:
 *   get:
 *     summary: Get a single notification by ID
 *     description: >
 *       Retrieves a specific notification for the currently authenticated user.
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f1b2c3d4e5f6789abcdef
 *     responses:
 *       200:
 *         description: Notification retrieved successfully.
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
 *                   example: Notification retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     notification:
 *                       $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Missing or invalid access token.
 *       404:
 *         description: Notification not found.
 *   delete:
 *     summary: Delete a notification
 *     description: >
 *       Soft deletes a notification for the currently authenticated user.
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f1b2c3d4e5f6789abcdef
 *     responses:
 *       200:
 *         description: Notification deleted successfully.
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
 *                   example: Notification deleted successfully
 *                 data:
 *                   type: object
 *                   example: {}
 *       401:
 *         description: Missing or invalid access token.
 *       404:
 *         description: Notification not found.
 */

/**
 * @swagger
 * /api/v1/notifications/{id}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     description: >
 *       Marks a specific notification as read for the currently authenticated user.
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f1b2c3d4e5f6789abcdef
 *     responses:
 *       200:
 *         description: Notification marked as read successfully.
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
 *                   example: Notification updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     notification:
 *                       $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Missing or invalid access token.
 *       404:
 *         description: Notification not found.
 */

/**
 * @swagger
 * /api/v1/notifications/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted notification
 *     description: >
 *       Restores a previously soft-deleted notification for the currently authenticated user.
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f1b2c3d4e5f6789abcdef
 *     responses:
 *       200:
 *         description: Notification restored successfully.
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
 *                   example: Notification restored successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     notification:
 *                       $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Missing or invalid access token.
 *       404:
 *         description: Notification not found.
 */

/**
 * @swagger
 * /api/v1/notifications/read-all:
 *   patch:
 *     summary: Mark all notifications as read for the current user
 *     description: >
 *       Marks all unread notifications as read for the currently authenticated user.
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read successfully.
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
 *                   example: All notifications marked as read
 *                 data:
 *                   type: object
 *                   properties:
 *                     modifiedCount:
 *                       type: integer
 *                       example: 5
 *       401:
 *         description: Missing or invalid access token.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/v1/notifications/preferences:
 *   get:
 *     summary: Get notification preferences for the current user
 *     description: >
 *       Retrieves notification preferences for the currently authenticated user.
 *       Creates default preferences if none exist.
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Notification preferences retrieved successfully.
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
 *                   example: Notification preferences retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     preferences:
 *                       $ref: '#/components/schemas/NotificationPreference'
 *       401:
 *         description: Missing or invalid access token.
 *   put:
 *     summary: Update notification preferences for the current user
 *     description: >
 *       Updates notification preferences for the currently authenticated user.
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationPreferenceUpdate'
 *           example:
 *             inAppEnabled: true
 *             emailEnabled: false
 *             types:
 *               application: true
 *               program: true
 *               attendance: false
 *     responses:
 *       200:
 *         description: Notification preferences updated successfully.
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
 *                   example: Notification preferences updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     preferences:
 *                       $ref: '#/components/schemas/NotificationPreference'
 *       401:
 *         description: Missing or invalid access token.
 *       400:
 *         description: Validation failed.
 *         content:
 *           $ref: '#/components/schemas/ValidationError'
 */
