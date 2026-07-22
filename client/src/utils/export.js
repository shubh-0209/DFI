import { parse } from 'json-2-csv';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Export data as CSV file.
 * @param {Array<Object>} data - Array of objects to export.
 * @param {string} fileName - Name of the file (including .csv).
 */
export const exportCSV = async (data, fileName) => {
  try {
    const csv = await parse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('CSV export error', err);
  }
};

/**
 * Export data as Excel (.xlsx) file.
 */
export const exportExcel = (data, fileName) => {
  try {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
  } catch (err) {
    console.error('Excel export error', err);
  }
};

/**
 * Export a DOM element (passed by selector) as PDF.
 * This utility captures the element using html2canvas then adds it to a PDF.
 * @param {HTMLElement|Element|string} elementOrId - DOM element or selector string.
 * @param {string} fileName - PDF file name.
 */
export const exportPDF = async (elementOrId, fileName) => {
  try {
    let element;
    if (typeof elementOrId === 'string') {
      element = document.querySelector(elementOrId);
    } else {
      element = elementOrId;
    }
    if (!element) {
      console.error('Element not found for PDF export');
      return;
    }
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(fileName);
  } catch (err) {
    console.error('PDF export error', err);
  }
};
