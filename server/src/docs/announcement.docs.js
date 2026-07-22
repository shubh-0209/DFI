/**
 * @swagger
 * /api/v1/announcements:
 *   get:
 *     summary: Get all announcements
 *     description: >
 *       Retrieves a paginated list of announcements available to the current user,
 *       filtered by the user's role. Supports filtering by type, priority, target audience, and status.
 *     tags: [Announcements]
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
 *           enum: [general, program, emergency, maintenance, event, recruitment, system]
 *         description: Filter by announcement type
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, critical]
 *         description: Filter by priority
 *       - in: query
 *         name: targetAudience
 *         schema:
 *           type: string
 *           enum: [all_users, volunteers, ngos, admins, specific_users]
 *         description: Filter by target audience
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, scheduled, published, expired, archived]
 *         description: Filter by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: volunteer drive
 *         description: Search by title or message
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, priority, type, scheduledAt, expiresAt]
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
 *         description: Announcements retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnnouncementsResponse'
 *       401:
 *         $ref: '#/components/schemas/AuthenticationError'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/announcements/{id}:
 *   get:
 *     summary: Get a single announcement by ID
 *     description: Retrieves a specific announcement by its MongoDB ID or announcementId.
 *     tags: [Announcements]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f1b2c3d4e5f6789abcdef0
 *     responses:
 *       200:
 *         description: Announcement retrieved successfully.
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
 *                   example: Announcement retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     announcement:
 *                       $ref: '#/components/schemas/Announcement'
 *       401:
 *         $ref: '#/components/schemas/AuthenticationError'
 *       404:
 *         description: Announcement not found.
 *   delete:
 *     summary: Delete an announcement
 *     description: Soft deletes an announcement. Admin only.
 *     tags: [Announcements]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f1b2c3d4e5f6789abcdef0
 *     responses:
 *       200:
 *         description: Announcement deleted successfully.
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
 *                   example: Announcement deleted successfully
 *                 data:
 *                   type: object
 *                   example: {}
 *       401:
 *         $ref: '#/components/schemas/AuthenticationError'
 *       403:
 *         description: Forbidden — admin access required.
 *       404:
 *         description: Announcement not found.
 */

/**
 * @swagger
 * /api/v1/announcements:
 *   post:
 *     summary: Create a new announcement
 *     description: Creates a new announcement. Admin only.
 *     tags: [Announcements]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnnouncementCreateRequest'
 *           example:
 *             title: "Summer Volunteer Drive 2026"
 *             message: "We are launching our annual summer volunteer drive. Sign up now!"
 *             type: "recruitment"
 *             priority: "high"
 *             targetAudience: "all_users"
 *             status: "draft"
 *     responses:
 *       201:
 *         description: Announcement created successfully.
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
 *                   example: Announcement created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     announcement:
 *                       $ref: '#/components/schemas/Announcement'
 *       400:
 *         $ref: '#/components/schemas/ValidationError'
 *       401:
 *         $ref: '#/components/schemas/AuthenticationError'
 *       403:
 *         description: Forbidden — admin access required.
 */

/**
 * @swagger
 * /api/v1/announcements/{id}:
 *   patch:
 *     summary: Update an announcement
 *     description: Updates an announcement by ID. Admin only. Cannot update archived announcements.
 *     tags: [Announcements]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f1b2c3d4e5f6789abcdef0
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnnouncementUpdateRequest'
 *           example:
 *             title: "Updated: Summer Volunteer Drive 2026"
 *             priority: "critical"
 *             status: "published"
 *     responses:
 *       200:
 *         description: Announcement updated successfully.
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
 *                   example: Announcement updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     announcement:
 *                       $ref: '#/components/schemas/Announcement'
 *       400:
 *         $ref: '#/components/schemas/ValidationError'
 *       401:
 *         $ref: '#/components/schemas/AuthenticationError'
 *       403:
 *         description: Forbidden — admin access required.
 *       404:
 *         description: Announcement not found.
 */

/**
 * @swagger
 * /api/v1/announcements/{id}/publish:
 *   patch:
 *     summary: Publish an announcement
 *     description: Changes the announcement status to published. Admin only. Sets publishedAt to the current time.
 *     tags: [Announcements]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f1b2c3d4e5f6789abcdef0
 *     responses:
 *       200:
 *         description: Announcement published successfully.
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
 *                   example: Announcement published successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     announcement:
 *                       $ref: '#/components/schemas/Announcement'
 *       401:
 *         $ref: '#/components/schemas/AuthenticationError'
 *       403:
 *         description: Forbidden — admin access required.
 *       404:
 *         description: Announcement not found.
 */

/**
 * @swagger
 * /api/v1/announcements/{id}/archive:
 *   patch:
 *     summary: Archive an announcement
 *     description: Changes the announcement status to archived. Admin only.
 *     tags: [Announcements]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f1b2c3d4e5f6789abcdef0
 *     responses:
 *       200:
 *         description: Announcement archived successfully.
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
 *                   example: Announcement archived successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     announcement:
 *                       $ref: '#/components/schemas/Announcement'
 *       401:
 *         $ref: '#/components/schemas/AuthenticationError'
 *       403:
 *         description: Forbidden — admin access required.
 *       404:
 *         description: Announcement not found.
 */
