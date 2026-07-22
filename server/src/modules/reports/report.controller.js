const reportService = require('./report.service');
const { MESSAGES } = require('./report.constants');
const { successResponse } = require('../../utils/response');
const { convertToCSV } = require('./report.utils');

class ReportController {
  generateReport = async (req, res, next) => {
    try {
      const { reportType } = req.body;
      const filters = {
        dateRange: req.body.dateRange,
        organization: req.body.organization,
        program: req.body.program,
        state: req.body.state,
        status: req.body.status,
        category: req.body.category,
        limit: req.body.limit,
        sortBy: req.body.sortBy,
        sortOrder: req.body.sortOrder,
        groupBy: req.body.groupBy,
        format: req.body.format,
        pageSize: req.body.pageSize,
        orientation: req.body.orientation,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      };

      const result = await reportService.generateReport(req.user.id, reportType, filters);
      return successResponse(res, 200, MESSAGES.REPORT_GENERATED, result);
    } catch (error) {
      return next(error);
    }
  };

  previewReport = async (req, res, next) => {
    try {
      const { reportType } = req.query;
      const filters = {
        dateRange: req.query.dateRange,
        organization: req.query.organization,
        program: req.query.program,
        state: req.query.state,
        status: req.query.status,
        limit: req.query.limit,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder,
        groupBy: req.query.groupBy,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
      };

      const result = await reportService.getReportPreview(reportType, filters);
      return successResponse(res, 200, MESSAGES.REPORT_PREVIEW_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  exportReport = async (req, res, next) => {
    try {
      const { reportType } = req.params;
      const filters = {
        dateRange: req.query.dateRange,
        organization: req.query.organization,
        program: req.query.program,
        state: req.query.state,
        status: req.query.status,
        limit: req.query.limit,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder,
        groupBy: req.query.groupBy,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
      };

      const format = req.query.format || 'csv';
      const result = await reportService.exportReport(reportType, filters, format);
      const data = result.data;

      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${reportType}_report.csv`);
        return res.send(convertToCSV(data));
      }

      if (format === 'excel') {
        const XLSX = require('xlsx');
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(Array.isArray(data) ? data : [data]);
        XLSX.utils.book_append_sheet(wb, ws, 'Report');
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${reportType}_report.xlsx`);
        return res.send(buffer);
      }

      if (format === 'pdf') {
        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument({
          size: req.query.pageSize || 'a4',
          layout: req.query.orientation || 'portrait',
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${reportType}_report.pdf`);

        doc.fontSize(16).text(`Disha for India - ${reportType} Report`, 50, 50);
        doc.fontSize(10).text(`Generated: ${new Date().toISOString()}`, 50, 80);
        doc.text(`Period: ${req.query.dateRange || 'All Time'}`, 50, 95);

        let y = 130;
        if (data && typeof data === 'object') {
          const dataRows = Array.isArray(data) ? data : [data];
          for (const row of dataRows) {
            if (y > 750) {
              doc.addPage();
              y = 50;
            }
            const rowStr = Object.entries(row)
              .map(([k, v]) => `${k}: ${v}`)
              .join(' | ');
            doc.text(rowStr, 50, y);
            y += 15;
          }
        }

        doc.pipe(res);
        doc.finalize();
      }

      return successResponse(res, 200, MESSAGES.REPORT_EXPORTED, result);
    } catch (error) {
      return next(error);
    }
  };

  getReportHistory = async (req, res, next) => {
    try {
      const query = {
        page: req.query.page,
        limit: req.query.limit,
      };

      const result = await reportService.getReportHistory(req.user.id, query);
      return successResponse(res, 200, MESSAGES.HISTORY_FETCHED, result);
    } catch (error) {
      return next(error);
    }
  };

  getBusinessIntelligence = async (req, res, next) => {
    try {
      const filters = {
        dateRange: req.query.dateRange,
        organization: req.query.organization,
      };

      const result = await reportService.getBusinessIntelligence(filters);
      return successResponse(res, 200, MESSAGES.BI_DATA_FETCHED, { businessIntelligence: result });
    } catch (error) {
      return next(error);
    }
  };

  getComparisonData = async (req, res, next) => {
    try {
      const { compareType } = req.params;
      const result = await reportService.getComparisonData(compareType);
      return successResponse(res, 200, MESSAGES.COMPARISON_DATA_FETCHED, { comparison: result });
    } catch (error) {
      return next(error);
    }
  };

  getVolunteerReport = async (req, res, next) => {
    try {
      const filters = this._buildFilters(req);
      const result = await reportService.getVolunteerReport(filters);
      return successResponse(res, 200, MESSAGES.REPORT_FETCHED, { report: result });
    } catch (error) {
      return next(error);
    }
  };

  getProgramReport = async (req, res, next) => {
    try {
      const filters = this._buildFilters(req);
      const result = await reportService.getProgramReport(filters);
      return successResponse(res, 200, MESSAGES.REPORT_FETCHED, { report: result });
    } catch (error) {
      return next(error);
    }
  };

  getApplicationReport = async (req, res, next) => {
    try {
      const filters = this._buildFilters(req);
      const result = await reportService.getApplicationReport(filters);
      return successResponse(res, 200, MESSAGES.REPORT_FETCHED, { report: result });
    } catch (error) {
      return next(error);
    }
  };

  getAttendanceReport = async (req, res, next) => {
    try {
      const filters = this._buildFilters(req);
      const result = await reportService.getAttendanceReport(filters);
      return successResponse(res, 200, MESSAGES.REPORT_FETCHED, { report: result });
    } catch (error) {
      return next(error);
    }
  };

  getCertificateReport = async (req, res, next) => {
    try {
      const filters = this._buildFilters(req);
      const result = await reportService.getCertificateReport(filters);
      return successResponse(res, 200, MESSAGES.REPORT_FETCHED, { report: result });
    } catch (error) {
      return next(error);
    }
  };

  getRewardReport = async (req, res, next) => {
    try {
      const filters = this._buildFilters(req);
      const result = await reportService.getRewardReport(filters);
      return successResponse(res, 200, MESSAGES.REPORT_FETCHED, { report: result });
    } catch (error) {
      return next(error);
    }
  };

  getLeaderboardReport = async (req, res, next) => {
    try {
      const filters = this._buildFilters(req);
      const result = await reportService.getLeaderboardReport(filters);
      return successResponse(res, 200, MESSAGES.REPORT_FETCHED, { report: result });
    } catch (error) {
      return next(error);
    }
  };

  getOrganizationReport = async (req, res, next) => {
    try {
      const filters = this._buildFilters(req);
      const result = await reportService.getOrganizationReport(filters);
      return successResponse(res, 200, MESSAGES.REPORT_FETCHED, { report: result });
    } catch (error) {
      return next(error);
    }
  };

  getPlatformReport = async (req, res, next) => {
    try {
      const filters = this._buildFilters(req);
      const result = await reportService.getPlatformReport(filters);
      return successResponse(res, 200, MESSAGES.REPORT_FETCHED, { report: result });
    } catch (error) {
      return next(error);
    }
  };

  getImpactReport = async (req, res, next) => {
    try {
      const filters = this._buildFilters(req);
      const result = await reportService.getImpactReport(filters);
      return successResponse(res, 200, MESSAGES.REPORT_FETCHED, { report: result });
    } catch (error) {
      return next(error);
    }
  };

  _buildFilters(req) {
    return {
      dateRange: req.query.dateRange,
      organization: req.query.organization,
      program: req.query.program,
      state: req.query.state,
      status: req.query.status,
      limit: parseInt(req.query.limit, 10) || 10,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      groupBy: req.query.groupBy,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };
  }
}

module.exports = new ReportController();