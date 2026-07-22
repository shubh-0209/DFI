/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Get all users (Admin Only)
 *     description: >
 *       Returns a paginated list of all users with optional search, filters, and sorting.
 *       Only accessible by Admins and Super Admins.
 *     tags: [Admin]
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
 *         description: Users per page (max 100)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, username, or volunteerId
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [guest, volunteer, coordinator, admin, superadmin]
 *         description: Filter by role
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, active, inactive, suspended]
 *         description: Filter by account status
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city (partial match)
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Filter by state (partial match)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, name, email, points, status, role]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort direction
 *       - in: query
 *         name: showDeleted
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *           default: "false"
 *         description: Set to true to show only soft-deleted users
 *     responses:
 *       200:
 *         description: Users list retrieved.
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
 *                   example: Users retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 150
 *                         totalPages:
 *                           type: integer
 *                           example: 15
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         hasNextPage:
 *                           type: boolean
 *                           example: true
 *                         hasPreviousPage:
 *                           type: boolean
 *                           example: false
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationError'
 *       403:
 *         description: Forbidden — Admin role required.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/admin/users/statistics:
 *   get:
 *     summary: Get dashboard statistics (Admin Only)
 *     description: Returns aggregated platform statistics for the admin dashboard.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully.
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
 *                   example: Dashboard statistics retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                       example: 1450
 *                     totalVolunteers:
 *                       type: integer
 *                       example: 1400
 *                     totalAdmins:
 *                       type: integer
 *                       example: 5
 *                     totalCoordinators:
 *                       type: integer
 *                       example: 45
 *                     activeUsers:
 *                       type: integer
 *                       example: 1100
 *                     inactiveUsers:
 *                       type: integer
 *                       example: 250
 *                     suspendedUsers:
 *                       type: integer
 *                       example: 10
 *                     deletedUsers:
 *                       type: integer
 *                       example: 90
 *                     newThisMonth:
 *                       type: integer
 *                       example: 48
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationError'
 *       403:
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/admin/users/{id}:
 *   get:
 *     summary: Get user details by ID (Admin Only)
 *     description: Returns the complete profile of any user by their MongoDB ID.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB User ID
 *         example: 665f1b2c3d4e5f6789abcdef
 *     responses:
 *       200:
 *         description: User details retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid user ID format.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Soft delete a user (Admin Only)
 *     description: >
 *       Soft deletes a user — the record is retained in the database but hidden from
 *       all regular views. Admin cannot delete themselves or the last admin account.
 *     tags: [Admin]
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
 *         description: User soft deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden — Self-delete or last admin protection.
 *       404:
 *         description: User not found.
 *
 * /api/v1/admin/users/{id}/status:
 *   patch:
 *     summary: Update user status (Admin Only)
 *     description: >
 *       Changes the account status of any user.
 *       Admin cannot change their own status.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f1b2c3d4e5f6789abcdef
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *                 example: suspended
 *     responses:
 *       200:
 *         description: User status updated.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden — Cannot change own status.
 *       404:
 *         description: User not found.
 *
 * /api/v1/admin/users/{id}/role:
 *   patch:
 *     summary: Update user role (Admin Only)
 *     description: >
 *       Changes the role of any user.
 *       Cannot demote the last admin account.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f1b2c3d4e5f6789abcdef
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [volunteer, coordinator, admin]
 *                 example: admin
 *     responses:
 *       200:
 *         description: User role updated.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       409:
 *         description: Cannot demote the last admin.
 *
 * /api/v1/admin/users/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted user (Admin Only)
 *     description: Restores a previously soft-deleted user account to active status.
 *     tags: [Admin]
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
 *         description: User restored successfully.
 *       404:
 *         description: User not found.
 *       409:
 *         description: User is not deleted.
 */
