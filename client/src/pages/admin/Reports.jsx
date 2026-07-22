import SimpleLoader from '../../components/common/SimpleLoader';
import React, { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, Download, Calendar, Users, Award, Target, Clock, Gift, Building2, TrendingUp, History, Eye } from 'lucide-react';
import {
  generateReport,
  getReportHistory,
  getBusinessIntelligence,
  exportReport,
  DATE_RANGES,
  REPORT_TYPES,
  EXPORT_FORMATS,
  GROUP_BY_OPTIONS,
} from '../../services/reportsService';
import { exportCSV, exportExcel, exportPDF } from '../../utils/export';
import SkeletonLoader from '../../components/volunteer/SkeletonLoader';
import toast from 'react-hot-toast';

const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <button
    onClick={onClick}
    className={active ? 'btn btn-primary' : 'btn btn-secondary'}
    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
  >
    <Icon size={16} />
    {label}
    {count !== undefined && <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '0.125rem 0.5rem', fontSize: 'var(--text-xs)' }}>{count}</span>}
  </button>
);

const StatCard = ({ Icon, value, label, color = 'var(--color-primary)' }) => (
  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `4px solid ${color}` }}>
    <div style={{ padding: '0.75rem', backgroundColor: `${color}20`, color, borderRadius: '50%' }}>
      <Icon size={24} />
    </div>
    <div>
      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-heading)' }}>{value}</div>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-body)' }}>{label}</div>
    </div>
  </div>
);

const ReportBuilder = ({ onGenerate, loading, onReportTypeChange }) => {
  const [reportType, setReportType] = useState('volunteer');
  const [dateRange, setDateRange] = useState('this_month');
  const [exportFormat, setExportFormat] = useState('csv');
  const [groupBy, setGroupBy] = useState('none');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showBuilder, setShowBuilder] = useState(true);

  const handleGenerate = () => {
    onReportTypeChange?.(reportType);
    onGenerate({
      reportType,
      dateRange: dateRange || null,
      format: exportFormat,
      groupBy: groupBy === 'none' ? null : groupBy,
      sortOrder,
    });
  };

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0, fontSize: 'var(--text-xl)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={20} />
          Report Builder
        </h2>
        <button
          onClick={() => setShowBuilder(!showBuilder)}
          className="btn btn-secondary"
          style={{ fontSize: 'var(--text-base)' }}
        >
          {showBuilder ? 'Hide' : 'Show'} Builder
        </button>
      </div>

      {showBuilder && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: 'var(--text-base)', fontWeight: 500 }}>Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="form-input"
            >
              {REPORT_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: 'var(--text-base)', fontWeight: 500 }}>Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="form-input"
            >
              {DATE_RANGES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: 'var(--text-base)', fontWeight: 500 }}>Export Format</label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="form-input"
            >
              {EXPORT_FORMATS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: 'var(--text-base)', fontWeight: 500 }}>Group By</label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="form-input"
            >
              {GROUP_BY_OPTIONS.map(g => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: 'var(--text-base)', fontWeight: 500 }}>Sort Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="form-input"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {loading ? <SimpleLoader /> : <Download size={16} />}
              Generate Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ReportPreview = ({ reportData, reportType, onExport }) => {
  if (!reportData) return null;

  const renderVolunteerReport = () => {
    const data = reportData.data || [];
    return (
      <div className="grid grid-cols-2" style={{ gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
        {data.slice(0, 20).map((item, i) => (
          <div key={i} className="card" style={{ padding: '0.75rem' }}>
            <div style={{ fontWeight: 600 }}>{item.state || item.city || item.status || item.name}</div>
            <div style={{ color: 'var(--color-body)', fontSize: 'var(--text-base)' }}>
              {item.count !== undefined ? `${item.count} volunteers` : `${item.coins || 0} coins`}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderProgramReport = () => {
    const data = reportData.data || [];
    return (
      <div className="grid grid-cols-2" style={{ gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
        {data.slice(0, 20).map((item, i) => (
          <div key={i} className="card" style={{ padding: '0.75rem' }}>
            <div style={{ fontWeight: 600 }}>{item.title || item.category || item.status}</div>
            <div style={{ color: 'var(--color-body)', fontSize: 'var(--text-base)' }}>
              {item.registrations !== undefined ? `${item.registrations} registrations` : ''}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLeaderboardReport = () => {
    const data = reportData.data || {};
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h4 style={{ marginBottom: '0.5rem' }}>Top Volunteers by Hours</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(data.topByHours || []).slice(0, 5).map((vol, i) => (
              <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem' }}>
                <span>{i + 1}. {vol.name}</span>
                <span>{vol.totalHours} hours</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ marginBottom: '0.5rem' }}>Top Volunteers by Coins</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(data.topByCoins || []).slice(0, 5).map((vol, i) => (
              <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem' }}>
                <span>{i + 1}. {vol.name}</span>
                <span>{vol.coins} coins</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderReport = () => {
    switch (reportType) {
      case 'volunteer':
        return renderVolunteerReport();
      case 'program':
        return renderProgramReport();
      case 'application':
        return <div>{reportData.summary?.total || 0} applications</div>;
      case 'attendance':
        return <div>{reportData.summary?.total || 0} records, {reportData.summary?.totalHours || 0} hours</div>;
      case 'certificate':
        return <div>{reportData.summary?.total || 0} certificates issued</div>;
      case 'reward':
        return <div>{reportData.summary?.totalCoins || 0} coins distributed</div>;
      case 'leaderboard':
        return renderLeaderboardReport();
      case 'organization':
        return <div>{reportData.summary?.total || 0} organizations</div>;
      case 'platform':
        return (
          <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
            <StatCard Icon={Users} value={reportData.data?.volunteers?.total || 0} label="Total Volunteers" />
            <StatCard Icon={Calendar} value={reportData.data?.programs?.total || 0} label="Total Programs" />
            <StatCard Icon={Target} value={reportData.data?.applications?.approvalRate || 0} label="% Approval Rate" />
            <StatCard Icon={Clock} value={reportData.data?.attendance?.rate || 0} label="% Attendance" />
            <StatCard Icon={Award} value={reportData.data?.certificates?.generated || 0} label="Certificates" />
            <StatCard Icon={Gift} value={reportData.data?.rewards?.coinsDistributed || 0} label="Coins Distributed" />
            <StatCard Icon={Building2} value={reportData.data?.organizations?.total || 0} label="Organizations" />
          </div>
        );
      default:
        return <div>Report preview not available for this type</div>;
    }
  };

  return (
    <div className="card" style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Eye size={18} />
          Report Preview
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => onExport('csv')} className="btn btn-secondary" style={{ fontSize: 'var(--text-sm)', padding: '0.4rem 0.75rem' }}>CSV</button>
          <button onClick={() => onExport('excel')} className="btn btn-secondary" style={{ fontSize: 'var(--text-sm)', padding: '0.4rem 0.75rem' }}>Excel</button>
          <button onClick={() => onExport('pdf')} className="btn btn-secondary" style={{ fontSize: 'var(--text-sm)', padding: '0.4rem 0.75rem' }}>PDF</button>
        </div>
      </div>
      {renderReport()}
    </div>
  );
};

const BusinessIntelligencePanel = ({ data, loading }) => {
  if (loading) return <SimpleLoader />;
  if (!data) return null;

  return (
    <div className="card" style={{ marginTop: '1.5rem' }}>
      <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <TrendingUp size={20} />
        Business Intelligence
      </h3>
      <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
        <StatCard Icon={Users} value={`${data.volunteerRetentionRate || 0}%`} label="Volunteer Retention" />
        <StatCard Icon={Target} value={`${data.applicationConversionRate || 0}%`} label="Application Conversion" />
        <StatCard Icon={Calendar} value={`${data.programCompletionRate || 0}%`} label="Program Completion" />
        <StatCard Icon={Clock} value={data.averageVolunteerHours || 0} label="Avg Volunteer Hours" />
        <StatCard Icon={Gift} value={data.averageCoinsEarned || 0} label="Avg Coins Earned" />
      </div>
    </div>
  );
};

const ReportHistoryPanel = ({ history, loading }) => {
  if (loading) return <SimpleLoader />;
  if (!history?.reports?.length) return <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>No report history found</div>;

  return (
    <div className="card" style={{ marginTop: '1.5rem' }}>
      <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <History size={20} />
        Report History
      </h3>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {(history.reports || []).map((report, i) => (
          <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', marginBottom: '0.5rem' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{report.reportType}</div>
              <div style={{ fontSize: 'var(--text-base)', color: 'var(--color-body)' }}>
                {report.period && `${report.period} • `}
                {new Date(report.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--color-body)' }}>
              {report.exportFormat?.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Reports = () => {
  const [activeTab, setActiveTab] = useState('builder');
  const [reportType, setReportType] = useState('volunteer');
  const [reportData, setReportData] = useState(null);
  const [generateLoading, setGenerateLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ['report-history'],
    queryFn: async () => {
      const res = await getReportHistory();
      if (res?.success) return res.data;
      throw new Error(res?.message || 'Failed to load history');
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: biData, isLoading: biLoading } = useQuery({
    queryKey: ['business-intelligence'],
    queryFn: async () => {
      const res = await getBusinessIntelligence();
      if (res?.success) return res.data?.businessIntelligence;
      throw new Error(res?.message || 'Failed to load BI data');
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleGenerateReport = useCallback(async (filters) => {
    setGenerateLoading(true);
    try {
      const res = await generateReport({ ...filters, reportType });
      if (res?.success) {
        setReportData(res.data);
      }
    } catch (error) {
      console.error('Report generation failed:', error);
    } finally {
      setGenerateLoading(false);
      queryClient.invalidateQueries(['report-history']);
    }
  }, [reportType, queryClient]);

  const handleExport = useCallback(async (format) => {
    if (!reportData) return;
    const rType = reportData.reportType || reportType;
    try {
      toast.loading('Generating export…', { id: 'export' });
      const response = await exportReport(rType, { format, dateRange: reportData.period });
      // If it's a blob (server-side export worked), download it
      if (response instanceof Blob || (response && response.data instanceof Blob)) {
        const blob = response instanceof Blob ? response : response.data;
        const ext = format === 'excel' ? 'xlsx' : format;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${rType}_report.${ext}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.success('Export downloaded', { id: 'export' });
      } else {
        // Fallback to client-side export if server didn't return blob
        if (format === 'csv') {
          exportCSV(reportData.data, `${rType}_report.csv`);
        } else if (format === 'excel') {
          exportExcel(reportData.data, `${rType}_report.xlsx`);
        } else if (format === 'pdf') {
          const element = document.querySelector('.card');
          if (element) exportPDF(element, `${rType}_report.pdf`);
        }
        toast.success('Export generated', { id: 'export' });
      }
    } catch (err) {
      console.error('Server-side export failed, falling back:', err);
      // Fallback to client-side
      if (format === 'csv') {
        exportCSV(reportData.data, `${rType}_report.csv`);
      } else if (format === 'excel') {
        exportExcel(reportData.data, `${rType}_report.xlsx`);
      } else if (format === 'pdf') {
        const element = document.querySelector('.card');
        if (element) exportPDF(element, `${rType}_report.pdf`);
      }
      toast.dismiss('export');
    }
  }, [reportData, reportType]);

  const tabs = [
    { id: 'builder', label: 'Report Builder', icon: FileText },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'bi', label: 'Business Intelligence', icon: TrendingUp },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <div className="page-container" style={{ padding: '0.5rem 0 2rem 0' }}>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            icon={tab.icon}
            label={tab.label}
          />
        ))}
      </div>

      {activeTab === 'builder' && (
        <ReportBuilder onGenerate={handleGenerateReport} loading={generateLoading} onReportTypeChange={setReportType} />
      )}

      {activeTab === 'preview' && (
        <ReportPreview reportData={reportData} reportType={reportType} onExport={handleExport} />
      )}

      {activeTab === 'bi' && (
        <BusinessIntelligencePanel data={biData} loading={biLoading} />
      )}

      {activeTab === 'history' && (
        <ReportHistoryPanel history={history} loading={historyLoading} />
      )}
    </div>
  );
};

export default Reports;