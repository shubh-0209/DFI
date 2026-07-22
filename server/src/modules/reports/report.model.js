const mongoose = require('mongoose');

const REPORT_TYPES = {
  VOLUNTEER: 'volunteer',
  PROGRAM: 'program',
  APPLICATION: 'application',
  ATTENDANCE: 'attendance',
  CERTIFICATE: 'certificate',
  REWARD: 'reward',
  LEADERBOARD: 'leaderboard',
  ORGANIZATION: 'organization',
  PLATFORM: 'platform',
  IMPACT: 'impact',
};

const EXPORT_FORMATS = {
  CSV: 'csv',
  EXCEL: 'excel',
  PDF: 'pdf',
};

const REPORT_PERIODS = {
  TODAY: 'today',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  LAST_3_MONTHS: 'last_3_months',
  LAST_6_MONTHS: 'last_6_months',
  LAST_YEAR: 'last_year',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  ANNUAL: 'annual',
  CUSTOM: 'custom',
};

const PAGE_SIZES = {
  A4: 'a4',
  LETTER: 'letter',
};

const ORIENTATIONS = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape',
};

const reportSchema = new mongoose.Schema(
  {
    reportId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    reportType: {
      type: String,
      enum: Object.values(REPORT_TYPES),
      required: [true, 'Report type is required'],
      index: true,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Generator is required'],
      index: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      default: null,
      index: true,
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      default: null,
      index: true,
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    period: {
      type: String,
      enum: Object.values(REPORT_PERIODS),
      default: REPORT_PERIODS.THIS_MONTH,
    },
    dateRange: {
      startDate: Date,
      endDate: Date,
    },
    filters: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    exportFormat: {
      type: String,
      enum: Object.values(EXPORT_FORMATS),
      default: EXPORT_FORMATS.CSV,
    },
    pageSize: {
      type: String,
      enum: Object.values(PAGE_SIZES),
      default: PAGE_SIZES.A4,
    },
    orientation: {
      type: String,
      enum: Object.values(ORIENTATIONS),
      default: ORIENTATIONS.PORTRAIT,
    },
    includeCharts: {
      type: Boolean,
      default: true,
    },
    includeTables: {
      type: Boolean,
      default: true,
    },
    includeTotals: {
      type: Boolean,
      default: true,
    },
    includeSubtotals: {
      type: Boolean,
      default: false,
    },
    grouping: {
      type: String,
      trim: true,
      default: null,
    },
    sortOrder: {
      type: String,
      enum: ['asc', 'desc'],
      default: 'desc',
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ createdAt: -1 });
reportSchema.index({ reportType: 1, createdAt: -1 });
reportSchema.index({ generatedBy: 1, createdAt: -1 });

reportSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
module.exports.REPORT_TYPES = REPORT_TYPES;
module.exports.EXPORT_FORMATS = EXPORT_FORMATS;
module.exports.REPORT_PERIODS = REPORT_PERIODS;
module.exports.PAGE_SIZES = PAGE_SIZES;
module.exports.ORIENTATIONS = ORIENTATIONS;