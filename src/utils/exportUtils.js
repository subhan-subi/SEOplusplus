/**
 * Utility functions for exporting reports (PDF, CSV, Print)
 */

/**
 * Sanitizes a URL or domain string for safe use in filenames
 * e.g., "https://www.example.com/path" -> "example-com"
 *
 * @param {string} input - URL or domain
 * @param {string} prefix - Filename prefix (e.g., "seo-audit", "dr-report")
 * @param {string} ext - Extension without dot (e.g., "pdf", "csv")
 * @returns {string} Sanitized filename
 */
export function sanitizeFilename(input, prefix = 'report', ext = 'pdf') {
  if (!input || typeof input !== 'string') {
    return `${prefix}-${Date.now()}.${ext}`;
  }

  let clean = input.trim().toLowerCase();

  // Strip protocol
  clean = clean.replace(/^https?:\/\//i, '');

  // Strip port, query string, hash, trailing slashes
  clean = clean.split('/')[0].split('?')[0].split('#')[0].split(':')[0];

  // Strip leading www.
  clean = clean.replace(/^www\./i, '');

  // Replace invalid filename characters and dots with hyphens
  clean = clean.replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  if (!clean) {
    clean = 'website';
  }

  return `${prefix}-${clean}.${ext}`;
}

/**
 * Triggers a client-side download for a Blob
 *
 * @param {Blob} blob - Blob data
 * @param {string} filename - Target filename
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 200);
}

/**
 * Converts an array of rows (or structured tables) into RFC 4180 compliant CSV string
 *
 * @param {Array<Array<string|number|null|undefined>>} rows
 * @returns {string} CSV text
 */
export function generateCsv(rows) {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          if (cell === null || cell === undefined) return '""';
          const str = String(cell);
          // Escape quotes by doubling them
          if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return `"${str}"`;
        })
        .join(',')
    )
    .join('\r\n');
}

/**
 * Formats a date into a clean, localized string
 *
 * @param {string|Date} dateInput
 * @returns {{ dateStr: string, timeStr: string, fullStr: string }}
 */
export function formatReportDate(dateInput) {
  const d = dateInput ? new Date(dateInput) : new Date();
  const safeDate = isNaN(d.getTime()) ? new Date() : d;

  const dateStr = safeDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const timeStr = safeDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return {
    dateStr,
    timeStr,
    fullStr: `${dateStr} at ${timeStr}`
  };
}
