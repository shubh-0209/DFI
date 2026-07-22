const reportRepository = require('./report.repository');
const { REPORT_TYPES, EXPORT_FORMATS } = require('./report.model');

class ReportService {
  async generateReport(userId, reportType, filters = {}) {
    const reportData = {
      generatedBy: userId,
      reportType,
      ...filters,
    };

    const history = await reportRepository.createReportHistory(reportData);
    const data = await reportRepository[`get${this._getReportMethodName(reportType)}Report`](filters);

    return {
      ...data,
      reportId: history.reportId,
      history,
    };
  }

  async getReportPreview(reportType, filters = {}) {
    const data = await reportRepository[`get${this._getReportMethodName(reportType)}Report`](filters);
    return {
      preview: data,
      filters,
    };
  }

  async exportReport(reportType, filters = {}, format = EXPORT_FORMATS.CSV) {
    const data = await reportRepository[`get${this._getReportMethodName(reportType)}Report`](filters);
    return {
      format,
      data,
    };
  }

  async getReportHistory(userId, query = {}) {
    return reportRepository.getReportHistory(userId, query);
  }

  async getBusinessIntelligence() {
    return reportRepository.getBusinessIntelligence();
  }

  async getComparisonData(compareType) {
    return reportRepository.getComparisonData(compareType);
  }

  async getVolunteerReport(filters = {}) {
    return reportRepository.getVolunteerReport(filters);
  }

  async getProgramReport(filters = {}) {
    return reportRepository.getProgramReport(filters);
  }

  async getApplicationReport(filters = {}) {
    return reportRepository.getApplicationReport(filters);
  }

  async getAttendanceReport(filters = {}) {
    return reportRepository.getAttendanceReport(filters);
  }

  async getCertificateReport(filters = {}) {
    return reportRepository.getCertificateReport(filters);
  }

  async getRewardReport(filters = {}) {
    return reportRepository.getRewardReport(filters);
  }

  async getLeaderboardReport(filters = {}) {
    return reportRepository.getLeaderboardReport(filters);
  }

  async getOrganizationReport(filters = {}) {
    return reportRepository.getOrganizationReport(filters);
  }

  async getPlatformReport(filters = {}) {
    return reportRepository.getPlatformReport(filters);
  }

  async getImpactReport(filters = {}) {
    return reportRepository.getImpactReport(filters);
  }

  _getReportMethodName(reportType) {
    const typeMap = {
      [REPORT_TYPES.VOLUNTEER]: 'Volunteer',
      [REPORT_TYPES.PROGRAM]: 'Program',
      [REPORT_TYPES.APPLICATION]: 'Application',
      [REPORT_TYPES.ATTENDANCE]: 'Attendance',
      [REPORT_TYPES.CERTIFICATE]: 'Certificate',
      [REPORT_TYPES.REWARD]: 'Reward',
      [REPORT_TYPES.LEADERBOARD]: 'Leaderboard',
      [REPORT_TYPES.ORGANIZATION]: 'Organization',
      [REPORT_TYPES.PLATFORM]: 'Platform',
      [REPORT_TYPES.IMPACT]: 'Impact',
    };
    return typeMap[reportType] || 'Volunteer';
  }
}

module.exports = new ReportService();