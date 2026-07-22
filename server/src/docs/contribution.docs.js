/**
 * @swagger
 * /api/v1/contributions:
 *   get:
 *     summary: Get all contributions
 *     description: Placeholder endpoint for fetching contributions.
 *     tags: [Contributions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Contributions retrieved successfully.
 *   post:
 *     summary: Create a new contribution
 *     description: Placeholder endpoint for submitting a contribution.
 *     tags: [Contributions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Contribution created successfully.
 */

/**
 * @swagger
 * /api/v1/contributions/{id}:
 *   get:
 *     summary: Get a single contribution by ID
 *     description: Placeholder endpoint for fetching a single contribution.
 *     tags: [Contributions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contribution retrieved successfully.
 *   patch:
 *     summary: Update a contribution
 *     description: Placeholder endpoint for updating a contribution.
 *     tags: [Contributions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contribution updated successfully.
 *   delete:
 *     summary: Delete a contribution
 *     description: Placeholder endpoint for deleting a contribution.
 *     tags: [Contributions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contribution deleted successfully.
 */

/**
 * @swagger
 * /api/v1/contributions/my-contributions:
 *   get:
 *     summary: Get current user's contributions
 *     description: Placeholder endpoint for fetching the current user's contributions.
 *     tags: [Contributions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User contributions retrieved successfully.
 */

/**
 * @swagger
 * /api/v1/contributions/upload:
 *   post:
 *     summary: Upload a contribution file
 *     description: Placeholder endpoint for uploading contribution files.
 *     tags: [Contributions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: File uploaded successfully.
 */

/**
 * @swagger
 * /api/v1/admin/contributions:
 *   get:
 *     summary: Get all contributions for admin review queue
 *     description: Admin endpoint to view all contributions with filters, search, and pagination.
 *     tags: [Admin Contributions]
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, pending, under_review, approved, rejected, needs_changes, archived]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: contributionType
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin contributions retrieved successfully.
 *       401:
 *         $ref: '#/components/schemas/AuthenticationError'
 *       403:
 *         description: Forbidden — admin access required.
 */

/**
 * @swagger
 * /api/v1/admin/contributions/{id}:
 *   get:
 *     summary: Get contribution detail for admin
 *     description: Admin endpoint to view full contribution details including review history.
 *     tags: [Admin Contributions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contribution detail retrieved successfully.
 *       401:
 *         $ref: '#/components/schemas/AuthenticationError'
 *       403:
 *         description: Forbidden — admin access required.
 *       404:
 *         description: Contribution not found.
 */

/**
 * @swagger
 * /api/v1/admin/contributions/{id}/review:
 *   post:
 *     summary: Review a contribution
 *     description: Admin endpoint to approve, reject, or mark a contribution as needs changes.
 *     tags: [Admin Contributions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [approved, rejected, needs_changes]
 *               coinsAwarded:
 *                 type: number
 *               badgeAwarded:
 *                 type: string
 *               reason:
 *                 type: string
 *               feedback:
 *                 type: string
 *               internalNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review submitted successfully.
 *       401:
 *         $ref: '#/components/schemas/AuthenticationError'
 *       403:
 *         description: Forbidden — admin access required.
 *       404:
 *         description: Contribution not found.
 */

/**
 * @swagger
 * /api/v1/admin/contributions/{id}/feature:
 *   post:
 *     summary: Feature a contribution
 *     description: Admin endpoint to feature an approved contribution.
 *     tags: [Admin Contributions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contribution featured successfully.
 *       401:
 *         $ref: '#/components/schemas/AuthenticationError'
 *       403:
 *         description: Forbidden — admin access required.
 *       404:
 *         description: Contribution not found.
 */

/**
 * @swagger
 * /api/v1/admin/contributions/{id}/archive:
 *   post:
 *     summary: Archive a contribution
 *     description: Admin endpoint to archive a contribution.
 *     tags: [Admin Contributions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contribution archived successfully.
 *       401:
 *         $ref: '#/components/schemas/AuthenticationError'
 *       403:
 *         description: Forbidden — admin access required.
 *       404:
 *         description: Contribution not found.
 */

/**
 * @swagger
 * /api/v1/admin/contributions/review-history:
 *   get:
 *     summary: Get review history
 *     description: Admin endpoint to view all review history across contributions.
 *     tags: [Admin Contributions]
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
 *       - in: query
 *         name: reviewedBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: contributionId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review history retrieved successfully.
 *       401:
 *         $ref: '#/components/schemas/AuthenticationError'
 *       403:
 *         description: Forbidden — admin access required.
 */
