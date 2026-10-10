import React, { useState } from 'react';
import { Download, FileText, Table, Printer, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

/**
 * Reusable Export & Print Controls for DR Checker & SEO Checker
 *
 * @param {Function} onExportPdf - async callback to trigger PDF download
 * @param {Function} onExportCsv - callback to trigger CSV download
 * @param {Function} onPrint - callback to trigger print dialog
 * @param {string} reportType - 'DR' or 'SEO'
 * @param {string} targetName - Target domain or URL
 */
export default function ExportReportControls({
  onExportPdf,
  onExportCsv,
  onPrint,
  reportType = 'SEO',
  targetName = ''
}) {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const { showToast } = useToast();

  const handlePdfClick = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    try {
      await onExportPdf();
      showToast(`${reportType} audit report PDF downloaded successfully!`, 'success');
    } catch (err) {
      console.error('PDF export error:', err);
      showToast(err.message || 'Failed to generate PDF report. Please try again.', 'error');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCsvClick = () => {
    if (isExportingCsv) return;
    setIsExportingCsv(true);
    try {
      onExportCsv();
      showToast(`${reportType} data exported as CSV spreadsheet!`, 'success');
    } catch (err) {
      console.error('CSV export error:', err);
      showToast(err.message || 'Failed to export CSV. Please try again.', 'error');
    } finally {
      setIsExportingCsv(false);
    }
  };

  const handlePrintClick = () => {
    try {
      onPrint();
    } catch (err) {
      console.error('Print error:', err);
      showToast('Could not open print dialog.', 'error');
    }
  };

  return (
    <div className="export-controls-wrap d-flex align-items-center flex-wrap gap-2">
      {/* Download PDF Button */}
      <button
        type="button"
        id="btn-export-pdf"
        className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1 shadow-xs fw-medium"
        onClick={handlePdfClick}
        disabled={isExportingPdf || isExportingCsv}
        title="Download professional multi-page PDF report"
      >
        {isExportingPdf ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            <span>Generating PDF...</span>
          </>
        ) : (
          <>
            <Download size={15} />
            <span>Download PDF</span>
          </>
        )}
      </button>

      {/* Export CSV Button */}
      <button
        type="button"
        id="btn-export-csv"
        className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1 shadow-xs fw-medium"
        onClick={handleCsvClick}
        disabled={isExportingPdf || isExportingCsv}
        title="Export raw data and checklist findings for spreadsheet analysis (CSV)"
      >
        <Table size={15} />
        <span>Export CSV</span>
      </button>

      {/* Print Report Button */}
      <button
        type="button"
        id="btn-print-report"
        className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1 shadow-xs fw-medium"
        onClick={handlePrintClick}
        disabled={isExportingPdf || isExportingCsv}
        title="Open print-optimized version or save to PDF via browser print"
      >
        <Printer size={15} />
        <span>Print Report</span>
      </button>
    </div>
  );
}
