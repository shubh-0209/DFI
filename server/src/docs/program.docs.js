/**
 * @swagger
 * tags:
 *   - name: Programs
 *     description: Program Management
 */

/**
 * @swagger
 * /api/v1/programs:
 *   post:
 *     summary: Create a new program
 *     tags: [Programs]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 150
 *                 example: "Community Cleanup Drive"
 *               shortDescription:
 *                 type: string
 *                 maxLength: 300
 *                 example: "Monthly beach cleanup initiative"
 *               description:
 *                 type: string
 *                 maxLength: 10000
 *                 example: "Join us for our monthly beach cleanup..."
 *               category:
 *                 type: string
 *                 maxLength: 50
 *                 example: "Environment"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["cleanup", "environment", "community"]
 *               mode:
 *                 type: string
 *                 enum: [online, offline, hybrid]
 *                 default: offline
 *               approvalRequired:
 *                 type: boolean
 *                 default: false
 *               maxVolunteers:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 100000
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-15T00:00:00Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-15T23:59:59Z"
 *               registrationDeadline:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-10T23:59:59Z"
 *               country:
 *                 type: string
 *                 default: "India"
 *               state:
 *                 type: string
 *                 example: "Maharashtra"
 *               city:
 *                 type: string
 *                 example: "Mumbai"
 *               address:
 *                 type: string
 *                 example: "Marine Drive, Mumbai"
 *               customFields:
 *                 type: object
 *                 example: { "certificateTemplate": "template1" }
 *     responses:
 *       201:
 *         description: Program created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
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
 *       403:
 *         description: Forbidden - Admin/Coordinator access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   get:
 *     summary: List programs with pagination, search, and filters
 *     tags: [Programs]
 *     security:
 *       - BearerAuth: []
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
 *           default: 10
 *         description: Items per page (max 100)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title, description, tags, category
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Filter by state
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country
 *       - in: query
 *         name: mode
 *         schema:
 *           type: string
 *           enum: [online, offline, hybrid]
 *         description: Filter by mode
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, pending_approval, published, registration_closed, ongoing, completed, cancelled, archived]
 *         description: Filter by status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Sort field (createdAt, startDate, registrationDeadline, title, status)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Programs list retrieved
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
 *                   example: "Programs retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     programs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Program'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 50
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         totalPages:
 *                           type: integer
 *                           example: 5
 *                         hasNextPage:
 *                           type: boolean
 *                           example: true
 *                         hasPreviousPage:
 *                           type: boolean
 *                           example: false
 */

/**
 * @swagger
 * /api/v1/programs/statistics:
 *   get:
 *     summary: Get program statistics
 *     tags: [Programs]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Program statistics retrieved
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
 *                   example: "Program statistics retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     draft:
 *                       type: integer
 *                       example: 10
 *                     published:
 *                       type: integer
 *                       example: 25
 *                     ongoing:
 *                       type: integer
 *                       example: 5
 *                     completed:
 *                       type: integer
 *                       example: 8
 *                     cancelled:
 *                       type: integer
 *                       example: 2
 *                     archived:
 *                       type: integer
 *                       example: 0
 *       403:
 *         description: Forbidden - Admin/Coordinator access required
 */

/**
 * @swagger
 * /api/v1/programs/{id}/status:
 *   patch:
 *     summary: Change program status
 *     tags: [Programs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Program ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [draft, pending_approval, published, registration_closed, ongoing, completed, cancelled, archived]
 *                 example: "published"
 *     responses:
 *       200:
 *         description: Program status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid status transition
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
 *       403:
 *         description: Forbidden - Admin/Coordinator access required
 */

/**
 * @swagger
 * /api/v1/programs/{id}:
 *   get:
 *     summary: Get program by ID
 *     tags: [Programs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Program ID
 *     responses:
 *       200:
 *         description: Program retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Program not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update program
 *     tags: [Programs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Program ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 150
 *               shortDescription:
 *                 type: string
 *                 maxLength: 300
 *               description:
 *                 type: string
 *                 maxLength: 10000
 *               category:
 *                 type: string
 *                 maxLength: 50
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               mode:
 *                 type: string
 *                 enum: [online, offline, hybrid]
 *               approvalRequired:
 *                 type: boolean
 *               maxVolunteers:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 100000
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               registrationDeadline:
 *                 type: string
 *                 format: date-time
 *               customFields:
 *                 type: object
 *     responses:
 *       200:
 *         description: Program updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
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
 *       403:
 *         description: Forbidden - Admin/Coordinator access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete program (soft delete)
 *     tags: [Programs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Program ID
 *     responses:
 *       200:
 *         description: Program deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Program not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin/Coordinator access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/programs/{id}/publish:
 *   patch:
 *     summary: Publish a draft program
 *     tags: [Programs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Program ID
 *     responses:
 *       200:
 *         description: Program published successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error - missing required fields
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
 *       403:
 *         description: Forbidden - Admin/Coordinator access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/programs/{id}/archive:
 *   patch:
 *     summary: Archive a published program
 *     tags: [Programs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Program ID
 *     responses:
 *       200:
 *         description: Program archived successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error - program must be published
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
 *       403:
 *         description: Forbidden - Admin/Coordinator access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/programs/{id}/restore:
 *   patch:
 *     summary: Restore a deleted program
 *     tags: [Programs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Program ID
 *     responses:
 *       200:
 *         description: Program restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error - program is not deleted
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
 *       403:
 *         description: Forbidden - Admin/Super Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Program:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "665f1b2c3d4e5f6789abcdef"
 *         programId:
 *           type: string
 *           example: "PROG000001"
 *         title:
 *           type: string
 *           example: "Community Cleanup Drive"
 *         slug:
 *           type: string
 *           example: "community-cleanup-drive"
 *         shortDescription:
 *           type: string
 *           example: "Monthly beach cleanup initiative"
 *         description:
 *           type: string
 *           example: "Join us for our monthly beach cleanup..."
 *         category:
 *           type: string
 *           example: "Environment"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["cleanup", "environment"]
 *         mode:
 *           type: string
 *           enum: [online, offline, hybrid]
 *           example: "offline"
 *         status:
 *           type: string
 *           enum: [draft, pending_approval, published, registration_closed, ongoing, completed, cancelled, archived]
 *           example: "published"
 *         approvalRequired:
 *           type: boolean
 *           example: false
 *         maxVolunteers:
 *           type: integer
 *           example: 50
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         registrationDeadline:
 *           type: string
 *           format: date-time
 *         country:
 *           type: string
 *           example: "India"
 *         state:
 *           type: string
 *           example: "Maharashtra"
 *         city:
 *           type: string
 *           example: "Mumbai"
 *         address:
 *           type: string
 *           example: "Marine Drive, Mumbai"
 *         customFields:
 *           type: object
 *         createdBy:
 *           $ref: '#/components/schemas/User'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
