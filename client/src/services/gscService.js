/**
 * Google Search Console frontend service.
 * All requests go through the backend — secrets NEVER touch this file.
 */

import axios from 'axios';

// Production:
// https://seoplusplus-backend.vercel.app/api
//
// Local:
// http://localhost:5001/api
const API_BASE = `${import.meta.env.VITE_API_URL || '/api'}/google`;

// Axios instance with credentials (needed for session cookie)
const gscApi = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 30000,
});

/**
 * Extracts a meaningful error message from an axios error.
 * Prefers the server's JSON { error: "..." } body over the generic axios message.
 */
function extractError(err, fallback = 'An unexpected error occurred.') {
  return err.response?.data?.error || err.message || fallback;
}

/**
 * Check if the user is currently connected to Google Search Console.
 * @returns {{ connected: boolean, selectedSite: string|null }}
 */
export async function getGscStatus() {
  try {
    const res = await gscApi.get('/status');
    return res.data;
  } catch {
    return { connected: false, selectedSite: null };
  }
}

/**
 * Redirects the browser to the backend OAuth start endpoint.
 * The backend handles the actual Google redirect.
 */
export function startGoogleAuth() {
  window.location.href = `${import.meta.env.VITE_API_URL || '/api'}/google/auth`;
}

/**
 * Fetch the list of Search Console properties for the connected account.
 * @returns {Array<{ siteUrl: string, permissionLevel: string }>}
 */
export async function fetchGscProperties() {
  try {
    const res = await gscApi.get('/properties');

    if (!res.data.success) {
      throw new Error(res.data.error || 'Failed to fetch properties.');
    }

    return res.data.properties;
  } catch (err) {
    throw new Error(
      extractError(err, 'Failed to fetch Search Console properties.')
    );
  }
}

/**
 * Save the user's selected Search Console property.
 * @param {string} siteUrl - The property URL to select
 */
export async function selectGscProperty(siteUrl) {
  try {
    const res = await gscApi.post('/select-property', { siteUrl });

    if (!res.data.success) {
      throw new Error(res.data.error || 'Failed to select property.');
    }

    return res.data;
  } catch (err) {
    throw new Error(
      extractError(err, 'Failed to select property.')
    );
  }
}

/**
 * Fetch Search Console performance data for the selected property.
 * @param {number} days - Date range in days (default 28)
 */
export async function fetchSearchPerformance(days = 28) {
  try {
    const res = await gscApi.get('/search-performance', {
      params: { days },
    });

    if (!res.data.success) {
      throw new Error(
        res.data.error || 'Failed to fetch performance data.'
      );
    }

    return res.data;
  } catch (err) {
    throw new Error(
      extractError(
        err,
        'Failed to fetch Search Console performance data.'
      )
    );
  }
}

/**
 * Disconnect Google Search Console.
 */
export async function disconnectGsc() {
  try {
    await gscApi.post('/disconnect');
  } catch {
    // Ignore disconnect errors
  }
}