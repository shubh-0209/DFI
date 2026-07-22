import React from 'react';
import { FileText, FileSpreadsheet, FileDown } from 'lucide-react';
import { exportCSV, exportExcel, exportPDF } from '../../utils/export';

const ExportButtons = ({ data, fileName, onExport }) => {
  const handleCSV = () => {
    const csvData = onExport ? onExport('csv') : data;
    if (csvData?.length) exportCSV(csvData, `${fileName}.csv`);
  };
  
  const handleExcel = () => {
    const excelData = onExport ? onExport('excel') : data;
    if (excelData?.length) exportExcel(excelData, `${fileName}.xlsx`);
  };
  
  const handlePDF = () => {
    const pdfData = onExport ? onExport('pdf') : data;
    if (pdfData?.length) exportPDF(pdfData, `${fileName}.pdf`);
  };

  if (!data?.length && !onExport) return null;

  return (
    <div className="flex gap-2" role="group" aria-label="Export options">
      <button
        onClick={handleCSV}
        className="btn btn-secondary"
        style={{ padding: '0.4rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
        aria-label="Export as CSV"
        title="Export as CSV"
      >
        <FileText size={14} />
        <span className="hidden sm:inline">CSV</span>
      </button>
      <button
        onClick={handleExcel}
        className="btn btn-secondary"
        style={{ padding: '0.4rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
        aria-label="Export as Excel"
        title="Export as Excel"
      >
        <FileSpreadsheet size={14} />
        <span className="hidden sm:inline">Excel</span>
      </button>
      <button
        onClick={handlePDF}
        className="btn btn-secondary"
        style={{ padding: '0.4rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
        aria-label="Export as PDF"
        title="Export as PDF"
      >
        <FileDown size={14} />
        <span className="hidden sm:inline">PDF</span>
      </button>
    </div>
  );
};

export default ExportButtons;
