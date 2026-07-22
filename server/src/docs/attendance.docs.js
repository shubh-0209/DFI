/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Volunteer Attendance Management
 *
 * /api/v1/attendance/check-in:
 *   post:
 *     summary: Volunteer Check-In
 *     description: >
 *       Allows an authenticated volunteer to check in for a program they have joined.
 *       The program must be currently active (ongoing), and only one check-in is allowed per volunteer per program per day.
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [applicationId]
 *             properties:
 *               applicationId:
 *                 type: string
 *                 description: MongoDB ID of the volunteer's application for the program
 *                 example: 665f1b2c3d4e5f6789abcdef
 *     responses:
 *       201:
 *         description: Checked in successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       409:
 *         description: Conflict.
 *
 * /api/v1/attendance/check-out:
 *   patch:
 *     summary: Volunteer Check-Out
 *     description: >
 *       Allows an authenticated volunteer to check out. This will record the check-out time
 *       and automatically calculate the total volunteer hours worked.
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [attendanceId]
 *             properties:
 *               attendanceId:
 *                 type: string
 *                 description: The unique string ID (attendanceId) of the active check-in record
 *                 example: ATD-20231012-ABC12
 *     responses:
 *       200:
 *         description: Checked out successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Attendance record not found.
 *
 * /api/v1/attendance/me:
 *   get:
 *     summary: Get My Attendance History
 *     description: Returns paginated attendance records of the currently logged-in volunteer.
 *     tags: [Attendance]
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
 *           default: 10
 *       - in: query
 *         name: program
 *         schema:
 *           type: string
 *         description: Filter by program ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by date range start (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by date range end (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Attendance list retrieved successfully.
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
 *                   example: Attendance records retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     records:
 *                       type: array
 *                       items:
 *                         type: object
 *                     total:
 *                       type: integer
 *                       example: 5
 *
 * /api/v1/attendance/{id}:
 *   get:
 *     summary: Get Attendance Record Details
 *     description: Retrieve details of a specific attendance record. Volunteers can only view their own records; admins/coordinators can view all.
 *     tags: [Attendance]
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
 *         description: Attendance detail retrieved successfully.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Not found.
 *
 * /api/v1/admin/attendance:
 *   get:
 *     summary: List All Attendance Records (Admin Only)
 *     description: Retrieve a paginated list of all attendance records across the platform.
 *     tags: [Admin]
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
 *           default: 10
 *       - in: query
 *         name: program
 *         schema:
 *           type: string
 *         description: Filter by Program ObjectId
 *       - in: query
 *         name: volunteer
 *         schema:
 *           type: string
 *         description: Filter by Volunteer User ObjectId
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by specific date (YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [present, absent]
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by Program city
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Filter by Program state
 *     responses:
 *       200:
 *         description: Admin attendance list retrieved successfully.
 *
 * /api/v1/admin/attendance/{id}:
 *   patch:
 *     summary: Edit Attendance Manually (Admin Only)
 *     description: Allows admins to update check-in, check-out, status, and remarks. Total hours are automatically recalculated if times are modified.
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
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [present, absent]
 *               remarks:
 *                 type: string
 *               checkInTime:
 *                 type: string
 *                 format: date-time
 *               checkOutTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Attendance record updated successfully.
 *       400:
 *         description: Invalid time range or status.
 *
 * /api/v1/admin/attendance/bulk:
 *   post:
 *     summary: Bulk Update Attendance (Admin Only)
 *     description: Update status and/or remarks for multiple attendance records in bulk.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ids]
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["665f1b2c3d4e5f6789abcdef", "665f1b2c3d4e5f6789abcde0"]
 *               status:
 *                 type: string
 *                 enum: [present, absent]
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bulk attendance updated successfully.
 *
 * /api/v1/admin/attendance/statistics:
 *   get:
 *     summary: Get Attendance Analytics (Admin Only)
 *     description: Retrieve total records, present/absent counts, total hours, attendance percentage, daily trend, and program-wise breakdowns.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully.
 *
 * /api/v1/admin/attendance/export:
 *   get:
 *     summary: Export Attendance Records (Admin Only)
 *     description: Returns a simplified, flattened layout of all attendance records matching filters, suitable for tabular/CSV exports.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: program
 *         schema:
 *           type: string
 *       - in: query
 *         name: volunteer
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [present, absent]
 *     responses:
 *       200:
 *         description: Flattened attendance dataset retrieved successfully.
 */
