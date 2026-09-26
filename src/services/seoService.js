import axios from 'axios';

const API_BASE = '/api';

/**
 * Normalizes input URL string on the client before submission
 */
export function sanitizeClientUrl(url) {
  if (!url) return '';
  let trimmed = url.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }
  return trimmed;
}

/**
 * Requests SEO analysis from the backend API
 */
export async function analyzeWebsite(url) {
  try {
    const cleanUrl = sanitizeClientUrl(url);
    const response = await axios.post(`${API_BASE}/analyze`, { url: cleanUrl }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 25000 // 25s timeout for complete audit
    });

    if (response.data && response.data.success) {
      // Save last audit to sessionStorage for refresh retention
      try {
        sessionStorage.setItem('seoly_last_audit', JSON.stringify(response.data));
      } catch (e) {
        // Storage might be full or disabled
      }
      return response.data;
    }

    throw new Error(response.data?.error || 'Analysis failed. Please check the URL.');
  } catch (err) {
    if (err.response?.data?.error) {
      throw new Error(err.response.data.error);
    }
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      throw new Error('Analysis timed out. The target website took too long to respond.');
    }
    throw new Error(err.message || 'We could not analyze this website. Please verify the URL and try again.');
  }
}

/**
 * Retrieves cached last audit from sessionStorage
 */
export function getCachedAudit() {
  try {
    const cached = sessionStorage.getItem('seoly_last_audit');
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    // Ignore error
  }
  return null;
}

/**
 * Clears stored audit
 */
export function clearCachedAudit() {
  try {
    sessionStorage.removeItem('seoly_last_audit');
  } catch (e) {
    // Ignore error
  }
}
