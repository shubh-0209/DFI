/**
 * @swagger
 * tags:
 *   - name: Certificates
 *     description: Volunteer Certificate Generation & Verification
 *
 * /api/v1/certificates/generate:
 *   post:
 *     summary: Generate Certificate (Volunteer)
 *     description: Generate a certificate for a completed program. Attendance criteria must be met.
 *     tags: [Certificates]
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
 *                 description: MongoDB ID of the completed program
 *                 example: 665f1b2c3d4e5f6789abcdef
 *               applicationId:
 *                 type: string
 *                 description: MongoDB ID of the application
 *                 example: 665f1b2c3d4e5f6789abcdef
 *               attendanceId:
 *                 type: string
 *                 description: MongoDB ID of the attendance record
 *                 example: 665f1b2c3d4e5f6789abcdef
 *               volunteerHours:
 *                 type: number
 *                 description: Override volunteer hours
 *                 example: 40
 *     responses:
 *       201:
 *         description: Certificate generated successfully.
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
 *                   example: Certificate generated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     certificateId:
 *                       type: string
 *                       example: CERT-20260101-A1B2C3
 *                     certificateNumber:
 *                       type: string
 *                       example: DISHA-CERT-2026-000001
 *                     certificateUrl:
 *                       type: string
 *                       example: https://res.cloudinary.com/disha/image/upload/v1/certificates/cert.pdf
 *                     verificationUrl:
 *                       type: string
 *                       example: http://localhost:5000/api/v1/certificates/verify/DISHA-CERT-2026-000001
 *                     qrCode:
 *                       type: string
 *                     volunteerHours:
 *                       type: number
 *                       example: 40
 *                     issuedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation failed - program not completed or attendance criteria not met.
 *       409:
 *         description: Certificate already exists for this program.
 *       401:
 *         description: Unauthorized.
 *
 * /api/v1/certificates/admin/auto-generate/{programId}:
 *   post:
 *     summary: Auto-Generate Certificates for Completed Program (Admin)
 *     description: Admin-only endpoint to automatically generate certificates for all eligible volunteers in a completed program.
 *     tags: [Certificates]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: programId
 *         required: true
 *         schema:
 *           type: string
 *         example: 665f1b2c3d4e5f6789abcdef
 *     responses:
 *       200:
 *         description: Auto-generation completed.
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
 *                   example: Auto-generation completed
 *                 data:
 *                   type: object
 *                   properties:
 *                     generated:
 *                       type: integer
 *                     skipped:
 *                       type: integer
 *                     failed:
 *                       type: array
 *       404:
 *         description: Program not found or not completed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden - Admin access required.
 *
 * /api/v1/certificates/admin/{id}/approve:
 *   post:
 *     summary: Approve Certificate (Admin)
 *     description: Admin-only endpoint to approve a certificate.
 *     tags: [Certificates]
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
 *         description: Certificate approved successfully.
 *       404:
 *         description: Certificate not found.
 *       403:
 *         description: Forbidden - Admin access required.
 *       400:
 *         description: Bad request - certificate cannot be approved.
 *
 * /api/v1/certificates/admin/{id}/reject:
 *   post:
 *     summary: Reject Certificate (Admin)
 *     description: Admin-only endpoint to reject a certificate.
 *     tags: [Certificates]
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
 *         description: Certificate rejected successfully.
 *       404:
 *         description: Certificate not found.
 *       403:
 *         description: Forbidden - Admin access required.
 *       400:
 *         description: Bad request - certificate cannot be rejected.
 *
 * /api/v1/certificates/admin/{id}:
 *   delete:
 *     summary: Delete Certificate (Admin)
 *     description: Admin-only endpoint to softly delete a certificate.
 *     tags: [Certificates]
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
 *         description: Certificate deleted successfully.
 *       404:
 *         description: Certificate not found.
 *       403:
 *         description: Forbidden - Admin access required.
 *       400:
 *         description: Bad request - cannot delete issued certificate.
 *
 * /api/v1/certificates/admin/generate:
 *   post:
 *     summary: Issue Certificate Manually (Admin)
 *     description: Admin-only endpoint to manually issue a certificate for a specific volunteer and program, bypassing attendance and program completion checks.
 *     tags: [Certificates]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - programId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: MongoDB ID of the volunteer
 *               programId:
 *                 type: string
 *                 description: MongoDB ID of the program
 *               volunteerHours:
 *                 type: number
 *                 description: Hours to record on the certificate
 *                 example: 40
 *               completionDate:
 *                 type: string
 *                 format: date-time
 *                 description: Completion date to display on the certificate
 *               skillsEarned:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Skills earned
 *               description:
 *                 type: string
 *                 description: Custom description text for the certificate
 *     responses:
 *       201:
 *         description: Certificate issued successfully.
 *       404:
 *         description: Volunteer or program not found.
 *       403:
 *         description: Forbidden - Admin access required.
 *       409:
 *         description: Certificate already exists for this volunteer and program.
 * */
