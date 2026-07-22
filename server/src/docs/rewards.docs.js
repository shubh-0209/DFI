/**
 * @swagger
 * tags:
 *   - name: Certificates
 *     description: Volunteer Certificate Management
 *   - name: Rewards
 *     description: Volunteer Reward Profiles & Balances
 *   - name: RewardTransactions
 *     description: Reward Transaction History
 *
 * /api/v1/certificates:
 *   get:
 *     summary: Get My Certificates (Skeleton)
 *     tags: [Certificates]
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
 *     responses:
 *       200:
 *         description: Certificates retrieved successfully.
 *
 * /api/v1/certificates/{id}:
 *   get:
 *     summary: Get Certificate by ID (Skeleton)
 *     tags: [Certificates]
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
 *         description: Certificate retrieved successfully.
 *       404:
 *         description: Not found.
 *
 * /api/v1/certificates/verify/{certificateNumber}:
 *   get:
 *     summary: Verify Certificate by Number (Public)
 *     description: Public endpoint to verify authenticity of a certificate using its unique number.
 *     tags: [Certificates]
 *     parameters:
 *       - in: path
 *         name: certificateNumber
 *         required: true
 *         schema:
 *           type: string
 *         example: DISHA-CERT-2026-000001
 *     responses:
 *       200:
 *         description: Certificate verified successfully.
 *       404:
 *         description: Certificate not found or invalid.
 *
 * /api/v1/rewards/me:
 *   get:
 *     summary: Get My Reward Profile (Skeleton)
 *     tags: [Rewards]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Reward profile retrieved successfully.
 *
 * /api/v1/rewards/history:
 *   get:
 *     summary: Get My Reward Transaction History (Skeleton)
 *     tags: [RewardTransactions]
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
 *     responses:
 *       200:
 *         description: Reward transaction history retrieved successfully.
 */
