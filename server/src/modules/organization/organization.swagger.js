/**
 * @swagger
 * tags:
 *   - name: Organization
 *     description: Organization Management
 *   - name: Role
 *     description: Role Management
 *   - name: Permission
 *     description: Permission Management
 */

/**
 * @swagger
 * /organizations:
 *   post:
 *     summary: Create a new organization
 *     description: Super Admin creates a new organization with initial details
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 150
 *               shortName:
 *                 type: string
 *                 maxLength: 50
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *               logo:
 *                 type: string
 *                 format: uri
 *               coverImage:
 *                 type: string
 *                 format: uri
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *                 pattern: '^\\+?[1-9]\\d{1,14}$'
 *               website:
 *                 type: string
 *                 format: uri
 *               address:
 *                 type: string
 *                 maxLength: 200
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *                 default: India
 *               pincode:
 *                 type: string
 *               foundedYear:
 *                 type: integer
 *                 minimum: 1000
 *               organizationType:
 *                 type: string
 *                 enum: [ngo, trust, college, university, corporate, government, community]
 *     responses:
 *       201:
 *         description: Organization created successfully
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
 *                   example: Organization created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Organization'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *     security:
 *       - bearerAuth: []
 *     x-permission-required: superadmin
 */

/**
 * @swagger
 * /organizations:
 *   get:
 *     summary: List organizations
 *     description: Get paginated list of organizations with optional filters
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
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
 *         name: organizationType
 *         schema:
 *           type: string
 *           enum: [ngo, trust, college, university, corporate, government, community]
 *       - in: query
 *         name: verificationStatus
 *         schema:
 *           type: string
 *           enum: [pending, verified, rejected]
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Organizations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     organizations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Organization'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /organizations/{id}:
 *   get:
 *     summary: Get organization by ID
 *     description: Retrieve a single organization's details
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization ID or slug
 *     responses:
 *       200:
 *         description: Organization retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /organizations/{id}:
 *   put:
 *     summary: Update organization
 *     description: Update organization details (owner or admin only)
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Organization updated successfully
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /organizations/{id}/approve:
 *   patch:
 *     summary: Approve organization
 *     description: Admin approves a pending organization
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Organization approved
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /organizations/{id}/reject:
 *   patch:
 *     summary: Reject organization
 *     description: Admin rejects a pending organization
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
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
 *             required:
 *               - rejectionReason
 *             properties:
 *               rejectionReason:
 *                 type: string
 *               reviewNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Organization rejected
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /organizations/{id}/assign-admin:
 *   patch:
 *     summary: Assign admin to organization
 *     description: Admin assigns a user as organization admin
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
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
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin assigned successfully
 */

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a new role
 *     description: Create a new role with specified permissions
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Role created successfully
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: List roles
 *     description: Get paginated list of roles
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Roles retrieved successfully
 */

/**
 * @swagger
 * /permissions:
 *   get:
 *     summary: List permissions
 *     description: Get paginated list of permissions
 *     tags: [Permission]
 *     security:
 *       - bearerAuth: []
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
 *       - in: query
 *         name: module
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permissions retrieved successfully
 */

/**
 * @swagger
 * /permissions:
 *   post:
 *     summary: Create permission
 *     description: Create a new custom permission
 *     tags: [Permission]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - module
 *               - action
 *             properties:
 *               code:
 *                 type: string
 *                 example: "custom_module:action"
 *               module:
 *                 type: string
 *               action:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Permission created successfully
 */

/**
 * @swagger
 * /admin/users/statistics:
 *   get:
 *     summary: Get admin dashboard statistics
 *     description: Retrieve user statistics for admin dashboard
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                     activeUsers:
 *                       type: integer
 *                     pendingUsers:
 *                       type: integer
 *                     totalHoursLogged:
 *                       type: number
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all users
 *     description: Admin can search and filter users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, username, or volunteerId
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */

/**
 * @swagger
 * /admin/users/{id}/status:
 *   patch:
 *     summary: Update user status
 *     description: Admin changes user account status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *     responses:
 *       200:
 *         description: Status updated successfully
 */

/**
 * @swagger
 * /admin/users/{id}/role:
 *   patch:
 *     summary: Update user role
 *     description: Admin changes user's role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
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
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [guest, volunteer, coordinator, admin, superadmin]
 *     responses:
 *       200:
 *         description: Role updated successfully
 */

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete user
 *     description: Soft delete a user account
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */

/**
 * @swagger
 * /admin/users/{id}/restore:
 *   patch:
 *     summary: Restore user
 *     description: Restore a soft-deleted user account
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User restored successfully
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Organization:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         organizationId:
 *           type: string
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         website:
 *           type: string
 *         address:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         country:
 *           type: string
 *         foundedYear:
 *           type: integer
 *         organizationType:
 *           type: string
 *         verificationStatus:
 *           type: string
 *         isActive:
 *           type: boolean
 *         owner:
 *           $ref: '#/components/schemas/UserRef'
 *         admins:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserRef'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Role:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         roleId:
 *           type: string
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         isSystemRole:
 *           type: boolean
 *         isActive:
 *           type: boolean
 *         permissions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PermissionRef'
 * 
 *     Permission:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         permissionId:
 *           type: string
 *         code:
 *           type: string
 *         module:
 *           type: string
 *         action:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         isSystemPermission:
 *           type: boolean
 * 
 *     UserRef:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 * 
 *     PermissionRef:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         code:
 *           type: string
 * 
 *     Pagination:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         currentPage:
 *           type: integer
 *         limit:
 *           type: integer
 *         hasNextPage:
 *           type: boolean
 *         hasPreviousPage:
 *           type: boolean
 * 
 *   responses:
 *     BadRequest:
 *       description: Bad request - validation error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *     Unauthorized:
 *       description: Unauthorized - authentication required
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: Unauthorized
 *     Forbidden:
 *       description: Forbidden - insufficient permissions
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: Forbidden
 *     NotFound:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: Organization not found
 */