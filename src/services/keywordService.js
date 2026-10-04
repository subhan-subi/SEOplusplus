import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL || '/api').trim().replace(/\/+$/, '');

/**
 * Validates a seed keyword on the client before submission.
 *
 * @param {string} input
 * @returns {string|null} Error message or null if valid
 */
export function validateClientSeed(input) {
  if (!input || typeof input !== 'string') {
    return 'Please enter a seed keyword (e.g. "seo tools").';
  }

  const clean = input.trim().replace(/\s+/g, ' ');
  if (!clean) {
    return 'Please enter a seed keyword.';
  }

  if (/<[^>]*>|[<>]|javascript:/i.test(input)) {
    return 'HTML or script tags are not allowed in the seed keyword.';
  }

  if (clean.length < 2) {
    return 'Seed keyword must be at least 2 characters long.';
  }

  if (clean.length > 80) {
    return 'Seed keyword is too long. Please enter a phrase under 80 characters.';
  }

  return null;
}

/**
 * Requests keyword ideas from the backend API.
 * Calls official Google Ads API for search volume, competition, and CPC bids.
 *
 * @param {string} keyword
 * @param {Object} options - { country, language, mode }
 * @returns {Promise<Object>} Keyword ideas result with real metrics
 */
export async function findKeywordIdeas(keyword, options = {}) {
  const clean = (keyword || '').trim().replace(/\s+/g, ' ');

  try {
    const response = await axios.post(`${API_BASE}/keywords/find`, {
      keyword: clean,
      country: options.country || undefined,
      language: options.language || undefined,
      mode: options.mode || undefined
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });

    if (response.data && response.data.success) {
      return response.data;
    }

    throw new Error(response.data?.error || 'Failed to retrieve keyword ideas.');
  } catch (err) {
    const responseData = err.response?.data;
    const error = new Error(responseData?.error || err.message || 'Unable to retrieve keyword data.');
    error.status = err.response?.status;
    error.requiresAuth = responseData?.requiresAuth || false;
    error.authUrl = responseData?.authUrl || '/api/google-ads/auth';
    error.code = responseData?.code;
    throw error;
  }
}

/**
 * Checks Google Ads API configuration status from the backend.
 *
 * @returns {Promise<Object>} { isConfigured, hasClientId, hasClientSecret, hasCustomerId, hasRefreshToken }
 */
export async function checkGoogleAdsStatus() {
  try {
    const response = await axios.get(`${API_BASE}/google-ads/status`, {
      timeout: 8000
    });
    return response.data;
  } catch (err) {
    return {
      success: false,
      isConfigured: false,
      error: err.message
    };
  }
}
