'use strict';

const axios = require('axios');

/**
 * Official Ahrefs APIv3 free/public Domain Rating endpoint.
 * Method: GET
 * Docs:   https://docs.ahrefs.com/en/api/reference/public/get-domain-rating-free
 */
const AHREFS_DR_FREE_ENDPOINT = 'https://api.ahrefs.com/v3/public/domain-rating-free';
const REQUEST_TIMEOUT_MS = 20000;

/**
 * Normalizes and validates a target domain string.
 * Strips protocols, trailing paths, query strings, and whitespace.
 *
 * @param {string} rawInput
 * @returns {string} Normalized domain (e.g. "example.com")
 */
function normalizeTargetDomain(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') {
    const err = new Error('Please enter a website domain (e.g. example.com).');
    err.statusCode = 400;
    throw err;
  }

  let domain = rawInput.trim();
  if (!domain) {
    const err = new Error('Please enter a website domain (e.g. example.com).');
    err.statusCode = 400;
    throw err;
  }

  // Prepend https:// if protocol is missing so URL parser works reliably
  const withProtocol = /^https?:\/\//i.test(domain) ? domain : `https://${domain}`;

  let parsed;
  try {
    parsed = new URL(withProtocol);
  } catch {
    const err = new Error('The domain format is invalid. Example: example.com');
    err.statusCode = 400;
    throw err;
  }

  let hostname = parsed.hostname.toLowerCase();

  // Remove trailing dot if present (FQDN notation)
  if (hostname.endsWith('.')) {
    hostname = hostname.slice(0, -1);
  }

  // Block localhost, IP literals, and reserved local/internal domains
  const prohibitedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]'];
  if (
    prohibitedHosts.includes(hostname) ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.test') ||
    hostname.endsWith('.invalid')
  ) {
    const err = new Error('Local, internal, or test network domains cannot be checked.');
    err.statusCode = 400;
    throw err;
  }

  // Check valid domain format: must contain at least one dot with valid labels
  const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i;
  if (!domainRegex.test(hostname) || hostname.length > 253) {
    const err = new Error('Please enter a valid domain name (e.g. example.com).');
    err.statusCode = 400;
    throw err;
  }

  return hostname;
}

/**
 * Queries the official Ahrefs APIv3 free public Domain Rating endpoint.
 *
 * Endpoint: GET https://api.ahrefs.com/v3/public/domain-rating-free
 * Auth:     Authorization: Bearer <AHREFS_API_KEY>
 * Params:   target=<domain>&output=json
 *
 * Response: { "domain_rating": { "domain_rating": <number> }, "license": "..." }
 *
 * @param {string} targetInput - Domain or website input
 * @returns {Promise<Object>} Domain rating result
 */
async function fetchDomainRating(targetInput) {
  const cleanDomain = normalizeTargetDomain(targetInput);

  // Read AHREFS_API_KEY securely from process.env — never expose to frontend
  const apiKey = process.env.AHREFS_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    const err = new Error('Ahrefs API key is not configured on the server. Please ensure AHREFS_API_KEY is set in your environment variables.');
    err.statusCode = 503;
    throw err;
  }

  let responseData;

  try {
    const response = await axios.get(AHREFS_DR_FREE_ENDPOINT, {
      params: {
        target: cleanDomain,
        output: 'json'
      },
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Accept': 'application/json',
        'User-Agent': 'SEOplusplus-DR-Checker/1.0'
      },
      timeout: REQUEST_TIMEOUT_MS
    });
    responseData = response.data;
  } catch (err) {
    handleAhrefsError(err, cleanDomain);
  }

  // Parse official free-endpoint response structure:
  // { "domain_rating": { "domain_rating": <number> }, "license": "..." }
  let rawDr = null;

  if (responseData) {
    if (
      responseData.domain_rating &&
      typeof responseData.domain_rating === 'object' &&
      typeof responseData.domain_rating.domain_rating === 'number'
    ) {
      // Primary: nested object structure from free endpoint
      rawDr = responseData.domain_rating.domain_rating;
    } else if (typeof responseData.domain_rating === 'number') {
      // Fallback: flat number (older response variants)
      rawDr = responseData.domain_rating;
    } else if (typeof responseData.dr === 'number') {
      // Fallback: alternative key
      rawDr = responseData.dr;
    }
  }

  if (rawDr === null || rawDr === undefined || isNaN(Number(rawDr))) {
    const err = new Error(`Unexpected response structure received from Ahrefs API for domain "${cleanDomain}".`);
    err.statusCode = 502;
    throw err;
  }

  // Clamp to [0, 100], preserve one decimal place
  const domainRating = Math.max(0, Math.min(100, Math.round(Number(rawDr) * 10) / 10));

  return {
    success: true,
    domain: cleanDomain,
    target: cleanDomain,
    domainRating,
    ahrefsRank: null, // Free endpoint does not return ahrefs_rank
    metric: 'Ahrefs Domain Rating (DR)',
    source: 'Ahrefs Public API v3',
    checkedAt: new Date().toISOString()
  };
}

/**
 * Translates Ahrefs API errors into secure, user-friendly messages
 * without exposing the Ahrefs API key in any response.
 *
 * @param {Error} err
 * @param {string} domain
 */
function handleAhrefsError(err, domain) {
  if (err.response) {
    const status = err.response.status;
    const data = err.response.data;

    if (status === 400) {
      const customErr = new Error(`Ahrefs API reported an invalid target parameter for "${domain}". Please check the domain format.`);
      customErr.statusCode = 400;
      throw customErr;
    }

    if (status === 401) {
      const customErr = new Error('Ahrefs API authentication failed. The configured API key is invalid, unauthorized, or expired. Please verify AHREFS_API_KEY in your server environment.');
      customErr.statusCode = 401;
      throw customErr;
    }

    if (status === 403) {
      const customErr = new Error('Ahrefs API access forbidden. Ensure the API key has public Domain Rating access enabled in your Ahrefs account.');
      customErr.statusCode = 403;
      throw customErr;
    }

    if (status === 404) {
      const customErr = new Error(`No Domain Rating data was found for "${domain}" in the Ahrefs index.`);
      customErr.statusCode = 404;
      throw customErr;
    }

    if (status === 422) {
      const customErr = new Error(`Ahrefs was unable to process domain "${domain}". Please verify the domain is correct.`);
      customErr.statusCode = 422;
      throw customErr;
    }

    if (status === 429) {
      const customErr = new Error('Ahrefs API rate limit reached. Please wait a moment before trying again.');
      customErr.statusCode = 429;
      throw customErr;
    }

    if (status >= 500) {
      const customErr = new Error('The Ahrefs API service is temporarily unavailable. Please try again shortly.');
      customErr.statusCode = 502;
      throw customErr;
    }

    const detailMsg = typeof data === 'string'
      ? data
      : (Array.isArray(data) ? data.join(' ') : (data && (data.error || data.message) ? (data.error || data.message) : ''));
    const customErr = new Error(
      detailMsg
        ? `Ahrefs API error (${status}): ${detailMsg}`
        : `Ahrefs API request failed with status code ${status}.`
    );
    customErr.statusCode = status;
    throw customErr;
  }

  if (err.code === 'ECONNABORTED' || (err.message && err.message.includes('timeout'))) {
    const timeoutErr = new Error('The request to Ahrefs API timed out. Please try again in a moment.');
    timeoutErr.statusCode = 504;
    throw timeoutErr;
  }

  if (err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN') {
    const netErr = new Error('Unable to connect to Ahrefs API servers. Please check network connectivity.');
    netErr.statusCode = 502;
    throw netErr;
  }

  const fallbackErr = new Error(`Ahrefs API request failed: ${err.message}`);
  fallbackErr.statusCode = 500;
  throw fallbackErr;
}

module.exports = {
  normalizeTargetDomain,
  fetchDomainRating
};
