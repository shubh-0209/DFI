/**
 * @swagger
 * tags:
 *   - name: Applications
 *     description: Volunteer Applications Management
 */

/**
 * @swagger
 * /api/v1/applications:
 *   post:
 *     summary: Apply to a published program
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - programId
 *             properties:
 *               programId:
 *                 type: string
 *                 example: "665f1b2c3d4e5f6789abcdef"
 *               answers:
 *                 type: object
 *                 description: Dynamic application form answers
 *                 example:
 *                   whyJoin: "I want to contribute to the community"
 *                   experience: "2 years of volunteering"
 *                   availability: "Weekends"
 *     responses:
 *       201:
 *         description: Application submitted successfully
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
 *                   example: "Application submitted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     application:
 *                       $ref: '#/components/schemas/Application'
 *       400:
 *         description: Validation error or program not accepting applications
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Program not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Already applied to this program
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   get:
 *     summary: List applications (Admin/Coordinator only)
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 */

/**
 * @swagger
 * /api/v1/applications/me:
 *   get:
 *     summary: Get my applications
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/applications/{id}:
 *   get:
 *     summary: Get application by ID
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application retrieved successfully
 *       404:
 *         description: Application not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/applications/{id}/withdraw:
 *   patch:
 *     summary: Withdraw application (must be 24+ hours before program starts)
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application withdrawn successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Cannot withdraw (less than 24 hours or invalid status)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Application not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Application:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "665f1b2c3d4e5f6789abcdef"
 *         applicationId:
 *           type: string
 *           example: "APP000001"
 *         user:
 *           $ref: '#/components/schemas/User'
 *         program:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             title:
 *               type: string
 *             programId:
 *               type: string
 *         answers:
 *           type: object
 *           description: Dynamic application answers
 *         status:
 *           type: string
 *           enum: [applied, joined, completed, withdrawn, cancelled]
 *           example: "joined"
 *         appliedAt:
 *           type: string
 *           format: date-time
 *         joinedAt:
 *           type: string
 *           format: date-time
 *         withdrawnAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
