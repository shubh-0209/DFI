/**
 * @swagger
 * /api/v1/organizations:
 *   get:
 *     summary: List all organizations
 *     description: Retrieve a paginated list of organizations.
 *     tags: [Organization]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Organizations retrieved successfully
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create an organization
 *     description: Create a new organization (Super Admin only).
 *     tags: [Organization]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Disha for India
 *               slug:
 *                 type: string
 *                 example: disha-for-india
 *     responses:
 *       201:
 *         description: Organization created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Super Admin access required

 * /api/v1/organizations/{id}:
 *   get:
 *     summary: Get organization by ID
 *     tags: [Organization]
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
 *         description: Organization retrieved successfully
 *       404:
 *         description: Organization not found
 *   put:
 *     summary: Update organization
 *     tags: [Organization]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Organization updated successfully
 *   delete:
 *     summary: Delete organization
 *     tags: [Organization]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Organization deleted successfully
 *   patch:
 *     summary: Organization action (approve/reject/activate/deactivate/archive/restore)
 *     tags: [Organization]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Action completed successfully
 */