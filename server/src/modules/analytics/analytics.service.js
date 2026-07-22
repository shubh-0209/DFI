const analyticsRepository = require('./analytics.repository');

class AnalyticsService {
  /**
   * Get volunteer dashboard statistics
   * @param {string} userId - The volunteer user ID
   * @returns {Promise<object>} Volunteer statistics
   */
  async getVolunteerDashboard(userId) {
    const stats = await analyticsRepository.getVolunteerStats(userId);
    return { volunteer: stats };
  }

  /**
   * Get volunteer rank separately
   * @param {string} userId - The volunteer user ID
   * @returns {Promise<object>} Rank object
   */
  async getVolunteerRank(userId) {
    const rank = await analyticsRepository.getVolunteerRank(userId);
    return { rank };
  }

  /**
   * Get admin dashboard statistics
   * @returns {Promise<object>} Admin statistics
   */
  async getAdminDashboard() {
    const stats = await analyticsRepository.getAdminStats();
    return { admin: stats };
  }

  /**
   * Get super admin dashboard statistics
   * @returns {Promise<object>} Super admin statistics
   */
  async getSuperAdminDashboard() {
    const stats = await analyticsRepository.getSuperAdminStats();
    return { superAdmin: stats };
  }

  // ============================================================
  // VOLUNTEER ANALYTICS
  // ============================================================

  /**
   * Get volunteer analytics report
   * @param {string} dateRange - Date range filter
   * @returns {Promise<object>} Volunteer analytics
   */
  async getVolunteerAnalytics(dateRange = null) {
    const analytics = await analyticsRepository.getVolunteerAnalytics(dateRange);
    return { volunteerAnalytics: analytics };
  }

  // ============================================================
  // PROGRAM ANALYTICS
  // ============================================================

  /**
   * Get program analytics report
   * @param {string} dateRange - Date range filter
   * @returns {Promise<object>} Program analytics
   */
  async getProgramAnalytics(dateRange = null) {
    const analytics = await analyticsRepository.getProgramAnalytics(dateRange);
    return { programAnalytics: analytics };
  }

  // ============================================================
  // APPLICATION ANALYTICS
  // ============================================================

  /**
   * Get application analytics report
   * @param {string} dateRange - Date range filter
   * @returns {Promise<object>} Application analytics
   */
  async getApplicationAnalytics(dateRange = null) {
    const analytics = await analyticsRepository.getApplicationAnalytics(dateRange);
    return { applicationAnalytics: analytics };
  }

  // ============================================================
  // ATTENDANCE ANALYTICS
  // ============================================================

  /**
   * Get attendance analytics report
   * @param {string} dateRange - Date range filter
   * @returns {Promise<object>} Attendance analytics
   */
  async getAttendanceAnalytics(dateRange = null) {
    const analytics = await analyticsRepository.getAttendanceAnalytics(dateRange);
    return { attendanceAnalytics: analytics };
  }

  // ============================================================
  // CERTIFICATE ANALYTICS
  // ============================================================

  /**
   * Get certificate analytics report
   * @param {string} dateRange - Date range filter
   * @returns {Promise<object>} Certificate analytics
   */
  async getCertificateAnalytics(dateRange = null) {
    const analytics = await analyticsRepository.getCertificateAnalytics(dateRange);
    return { certificateAnalytics: analytics };
  }

  // ============================================================
  // REWARD ANALYTICS
  // ============================================================

  /**
   * Get reward analytics report
   * @param {string} dateRange - Date range filter
   * @returns {Promise<object>} Reward analytics
   */
  async getRewardAnalytics(dateRange = null) {
    const analytics = await analyticsRepository.getRewardAnalytics(dateRange);
    return { rewardAnalytics: analytics };
  }

  // ============================================================
  // LEADERBOARD ANALYTICS
  // ============================================================

  /**
   * Get leaderboard analytics report
   * @param {number} limit - Number of top volunteers to return
   * @returns {Promise<object>} Leaderboard analytics
   */
  async getLeaderboardAnalytics(limit = 10) {
    const analytics = await analyticsRepository.getLeaderboardAnalytics(limit);
    return { leaderboardAnalytics: analytics };
  }

  // ============================================================
  // ORGANIZATION ANALYTICS
  // ============================================================

  /**
   * Get organization analytics report
   * @param {string} dateRange - Date range filter
   * @returns {Promise<object>} Organization analytics
   */
  async getOrganizationAnalytics(dateRange = null) {
    const analytics = await analyticsRepository.getOrganizationAnalytics(dateRange);
    return { organizationAnalytics: analytics };
  }
}

module.exports = new AnalyticsService();