'use strict';

/**
 * Google Ads Keyword Service
 *
 * Implements KeywordPlanIdeaService (generateKeywordIdeas) using the official
 * Google Ads API REST interface with OAuth2 authentication.
 *
 * Provides real Google Ads search volume, competition, competition index,
 * and top-of-page bid (CPC) metrics.
 */

const axios = require('axios');
const { getAccessToken, getConfigurationStatus } = require('./googleAdsOAuthService');
const { validateSeedKeyword } = require('./keywordService');

// Google Ads API REST Endpoint (v18 is the current stable API version)
const GOOGLE_ADS_API_VERSION = 'v18';
const GOOGLE_ADS_BASE_URL = `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}`;
const REQUEST_TIMEOUT_MS = 25000;

// Google Ads GeoTargetConstant Criterion IDs for supported countries
const GEO_TARGET_MAP = {
  global: null,      // No geographic constraint (Worldwide)
  worldwide: null,
  us: 'geoTargetConstants/2840', // United States
  uk: 'geoTargetConstants/2826', // United Kingdom
  gb: 'geoTargetConstants/2826', // United Kingdom
  ca: 'geoTargetConstants/2124', // Canada
  au: 'geoTargetConstants/2036', // Australia
  in: 'geoTargetConstants/2356', // India
  de: 'geoTargetConstants/2276', // Germany
  fr: 'geoTargetConstants/2250', // France
  es: 'geoTargetConstants/2724', // Spain
  it: 'geoTargetConstants/2380', // Italy
  br: 'geoTargetConstants/2076'  // Brazil
};

// Google Ads LanguageConstant IDs for supported languages
const LANGUAGE_MAP = {
  en: 'languageConstants/1000', // English
  es: 'languageConstants/1003', // Spanish
  fr: 'languageConstants/1002', // French
  de: 'languageConstants/1001', // German
  hi: 'languageConstants/1023', // Hindi
  pt: 'languageConstants/1014', // Portuguese
  it: 'languageConstants/1004'  // Italian
};

// In-Memory Response Cache for identical (seed + country + language) queries
const searchCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_CACHE_ENTRIES = 250;

/**
 * Builds a deterministic cache key.
 */
function getCacheKey(seed, country, language) {
  return `${seed.toLowerCase().trim()}|${(country || 'global').toLowerCase()}|${(language || 'en').toLowerCase()}`;
}

/**
 * Prunes expired cache entries.
 */
function pruneCache() {
  const now = Date.now();
  for (const [key, entry] of searchCache.entries()) {
    if (entry.expiresAt <= now) {
      searchCache.delete(key);
    }
  }
}

/**
 * Derives SEO++ search intent classification deterministically from keyword text.
 * Clearly designated as SEO++ classification, not Google-provided data.
 *
 * @param {string} keyword
 * @returns {string} 'Informational' | 'Commercial' | 'Transactional' | 'Navigational'
 */
function classifySearchIntent(keyword) {
  const kw = (keyword || '').toLowerCase().trim();

  // Navigational patterns (e.g. login, portal, near me, official site)
  if (/\b(login|log in|signin|sign in|portal|official website|account|near me|contact)\b/.test(kw)) {
    return 'Navigational';
  }

  // Transactional patterns
  if (/\b(buy|order|purchase|hire|coupon|discount|deal|pricing plans?|for sale|download|shop|cheap|affordable)\b/.test(kw)) {
    return 'Transactional';
  }

  // Commercial investigation patterns
  if (/\b(best|top|vs|versus|compare|comparison|review|reviews|ratings?|alternatives?|software|tools?|services?|agency|platform|vendor)\b/.test(kw)) {
    return 'Commercial';
  }

  // Informational (questions, how-tos, guides, tutorials, etc.)
  return 'Informational';
}

/**
 * Sanitizes and formats the Customer ID from environment variables.
 * Ensures hyphens are removed.
 *
 * @returns {string} 10-digit customer ID
 */
function getCleanCustomerId() {
  const rawId = process.env.GOOGLE_ADS_CUSTOMER_ID;
  if (!rawId || !rawId.trim()) {
    const err = new Error('Google Ads Customer ID is not configured on the server. Please ensure GOOGLE_ADS_CUSTOMER_ID is set in your environment variables.');
    err.statusCode = 503;
    throw err;
  }

  const clean = rawId.replace(/[^0-9]/g, '').trim();
  if (clean.length < 10) {
    const err = new Error('Invalid Google Ads Customer ID. It must be a 10-digit numeric account ID.');
    err.statusCode = 503;
    throw err;
  }

  return clean;
}

/**
 * Translates Google Ads API errors into safe, user-friendly messages
 * without exposing tokens, credentials, or internal URLs.
 *
 * @param {Error} err
 * @returns {Error} User-facing error
 */
function handleGoogleAdsError(err) {
  if (err.response) {
    const status = err.response.status;
    const data = err.response.data;

    // Check Google Ads specific error details
    const googleErrors = data?.error?.details?.[0]?.errors || [];
    const firstError = googleErrors[0];
    const errorCode = firstError?.errorCode ? Object.keys(firstError.errorCode).map(k => `${k}:${firstError.errorCode[k]}`).join(', ') : '';
    const errorMsg = firstError?.message || data?.error?.message || '';

    if (status === 401) {
      const e = new Error('Google Ads authentication failed. The access or refresh token is expired or unauthorized. Please re-authenticate via /api/google-ads/auth.');
      e.statusCode = 401;
      return e;
    }

    if (status === 403) {
      if (
        errorMsg.includes('DEVELOPER_TOKEN') ||
        errorCode.includes('DEVELOPER_TOKEN') ||
        errorCode.includes('DEVELOPER_TOKEN_NOT_APPROVED') ||
        errorCode.includes('DEVELOPER_TOKEN_PROHIBITED')
      ) {
        const e = new Error('Google Ads API requires an approved Developer Token. Please set GOOGLE_ADS_DEVELOPER_TOKEN in your server environment variables (server/.env). You can obtain one from the Google Ads API Center.');
        e.statusCode = 403;
        e.code = 'DEVELOPER_TOKEN_MISSING';
        return e;
      }
      const e = new Error('Google Ads API access forbidden: ' + (errorMsg || 'Ensure your Google Ads account has API access enabled and the Customer ID is correct.'));
      e.statusCode = 403;
      return e;
    }

    // Google gateway returns HTML 404 when the Developer Token is missing entirely
    // (the request never reaches the actual API service)
    if (status === 404) {
      const bodyStr = typeof data === 'string' ? data : '';
      if (bodyStr.includes('<!DOCTYPE html') || bodyStr.includes('Not Found')) {
        const e = new Error('Google Ads API requires an approved Developer Token to reach its endpoints. Please set GOOGLE_ADS_DEVELOPER_TOKEN in server/.env. Obtain one from the Google Ads API Center: https://developers.google.com/google-ads/api/docs/get-started/dev-token');
        e.statusCode = 403;
        e.code = 'DEVELOPER_TOKEN_MISSING';
        return e;
      }
      const e = new Error('Google Ads API endpoint not found (404). The API version may be unsupported or the Customer ID is invalid.');
      e.statusCode = 404;
      return e;
    }

    if (status === 400) {
      if (errorMsg.includes('CUSTOMER_NOT_FOUND') || errorMsg.includes('INVALID_CUSTOMER_ID')) {
        const e = new Error('Google Ads Customer ID was not recognized. Please check GOOGLE_ADS_CUSTOMER_ID in your server environment.');
        e.statusCode = 400;
        return e;
      }
      const e = new Error(`Google Ads API reported an invalid request: ${errorMsg || 'Check your seed keyword and parameters.'}`);
      e.statusCode = 400;
      return e;
    }

    if (status === 429) {
      const e = new Error('Google Ads API rate limit reached. Please wait a few moments before trying again.');
      e.statusCode = 429;
      return e;
    }

    if (status >= 500) {
      const e = new Error('Google Ads API service is temporarily unavailable. Please try again shortly.');
      e.statusCode = 502;
      return e;
    }

    const e = new Error(`Google Ads API error (${status}): ${errorMsg || 'Request failed'}`);
    e.statusCode = status;
    return e;
  }

  if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
    const e = new Error('The request to Google Ads API timed out. Please try again.');
    e.statusCode = 504;
    return e;
  }

  if (err.code === 'ECONNRESET' || err.code === 'EPIPE') {
    const e = new Error('The connection to Google Ads API was reset unexpectedly. Please try again in a moment.');
    e.statusCode = 502;
    return e;
  }

  if (err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN') {
    const e = new Error('Unable to connect to Google Ads API servers. Please check network connectivity.');
    e.statusCode = 502;
    return e;
  }

  if (err.code === 'ECONNREFUSED') {
    const e = new Error('Connection to Google Ads API was refused. Please check your network settings.');
    e.statusCode = 502;
    return e;
  }

  return err;
}

/**
 * Queries Google Ads KeywordPlanIdeaService to generate real keyword ideas with metrics.
 *
 * @param {string} rawSeed - User seed keyword
 * @param {Object} [options] - { country, language }
 * @returns {Promise<Object>} Keyword ideas and metrics payload
 */
async function generateGoogleAdsKeywordIdeas(rawSeed, options = {}) {
  // 1. Validate and sanitize seed keyword
  const cleanSeed = validateSeedKeyword(rawSeed);

  const country = (options.country || 'global').toLowerCase().trim();
  const language = (options.language || 'en').toLowerCase().trim();

  // 2. Check in-memory cache
  pruneCache();
  const cacheKey = getCacheKey(cleanSeed, country, language);
  const cached = searchCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return {
      ...cached.data,
      cached: true
    };
  }

  // 3. Verify Google Ads OAuth configuration
  const configStatus = getConfigurationStatus();
  if (!configStatus.isConfigured) {
    const missing = [];
    if (!configStatus.hasClientId) missing.push('GOOGLE_ADS_CLIENT_ID');
    if (!configStatus.hasClientSecret) missing.push('GOOGLE_ADS_CLIENT_SECRET');
    if (!configStatus.hasCustomerId) missing.push('GOOGLE_ADS_CUSTOMER_ID');
    if (!configStatus.hasRefreshToken) missing.push('GOOGLE_ADS_REFRESH_TOKEN');

    const err = new Error(
      `Google Ads API is not fully configured. Missing: ${missing.join(', ')}. ` +
      (missing.includes('GOOGLE_ADS_REFRESH_TOKEN')
        ? 'Please complete authorization at /api/google-ads/auth to obtain a refresh token.'
        : 'Please update your server environment variables.')
    );
    err.statusCode = 503;
    err.code = 'GOOGLE_ADS_NOT_CONFIGURED';
    throw err;
  }

  // 4. Retrieve fresh access token using refresh token
  const accessToken = await getAccessToken();
  const customerId = getCleanCustomerId();

  // 5. Build Google Ads API payload
  const endpointUrl = `${GOOGLE_ADS_BASE_URL}/customers/${customerId}:generateKeywordIdeas`;

  const requestPayload = {
    customerId: customerId,
    includeAdultKeywords: false,
    keywordPlanNetwork: 'GOOGLE_SEARCH_AND_PARTNERS',
    keywordSeed: {
      keywords: [cleanSeed]
    }
  };

  // Map Language
  const languageConstant = LANGUAGE_MAP[language] || LANGUAGE_MAP.en;
  requestPayload.language = languageConstant;

  // Map Geo Target (omit for global/worldwide)
  const geoTarget = GEO_TARGET_MAP[country];
  if (geoTarget) {
    requestPayload.geoTargetConstants = [geoTarget];
  }

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  // Developer token if configured
  if (process.env.GOOGLE_ADS_DEVELOPER_TOKEN && process.env.GOOGLE_ADS_DEVELOPER_TOKEN.trim()) {
    headers['developer-token'] = process.env.GOOGLE_ADS_DEVELOPER_TOKEN.trim();
  }

  let responseData;
  try {
    console.log(`[Google Ads] Requesting generateKeywordIdeas for seed: "${cleanSeed}" | country: ${country} | lang: ${language}`);
    const response = await axios.post(endpointUrl, requestPayload, {
      headers,
      timeout: REQUEST_TIMEOUT_MS
    });
    responseData = response.data;
    console.log(`[Google Ads] Success — ${responseData?.results?.length ?? 0} results returned`);
  } catch (err) {
    // Log safe diagnostic info — never log tokens or credentials
    const httpStatus = err.response?.status ?? err.code ?? 'unknown';
    const gadsErrCode = err.response?.data?.error?.details?.[0]?.errors?.[0]?.errorCode;
    console.error(`[Google Ads] API call failed | HTTP: ${httpStatus} | URL: ${endpointUrl.replace(/\/customers\/\d+/, '/customers/[REDACTED]')} | GadsErrorCode: ${gadsErrCode ? JSON.stringify(gadsErrCode) : 'n/a'} | msg: ${err.response?.data?.error?.message || err.message}`);
    throw handleGoogleAdsError(err);
  }

  // 6. Map and transform Google Ads results
  const rawResults = responseData?.results || [];
  const ideas = [];

  for (const item of rawResults) {
    const kwText = item.text || item.keyword;
    if (!kwText) continue;

    const metrics = item.keywordIdeaMetrics || {};

    // Average monthly searches (number or null)
    const avgSearches = metrics.avgMonthlySearches != null && metrics.avgMonthlySearches !== ''
      ? Number(metrics.avgMonthlySearches)
      : null;

    // Competition string (LOW, MEDIUM, HIGH, UNSPECIFIED)
    const competition = metrics.competition || 'UNSPECIFIED';

    // Competition index (0 - 100 number or null)
    const compIndex = metrics.competitionIndex != null && metrics.competitionIndex !== ''
      ? Number(metrics.competitionIndex)
      : null;

    // Bids in micros (1 micros = 0.000001 currency units)
    const lowBidMicros = metrics.lowTopOfPageBidMicros != null && metrics.lowTopOfPageBidMicros !== ''
      ? Number(metrics.lowTopOfPageBidMicros)
      : null;

    const highBidMicros = metrics.highTopOfPageBidMicros != null && metrics.highTopOfPageBidMicros !== ''
      ? Number(metrics.highTopOfPageBidMicros)
      : null;

    // Human-readable bids in standard currency units (e.g. $1.50)
    const lowBid = lowBidMicros != null
      ? Math.round((lowBidMicros / 1000000) * 100) / 100
      : null;

    const highBid = highBidMicros != null
      ? Math.round((highBidMicros / 1000000) * 100) / 100
      : null;

    // SEO++ derived search intent
    const intent = classifySearchIntent(kwText);
    const wordLength = kwText.trim().split(/\s+/).length;

    ideas.push({
      keyword: kwText,
      averageMonthlySearches: avgSearches,
      competition: competition,
      competitionIndex: compIndex,
      lowTopOfPageBidMicros: lowBidMicros,
      highTopOfPageBidMicros: highBidMicros,
      lowTopOfPageBid: lowBid,
      highTopOfPageBid: highBid,
      length: wordLength,
      intent: intent,
      intentSource: 'SEO++ Classification'
    });
  }

  const resultData = {
    success: true,
    keyword: cleanSeed,
    provider: 'Google Ads API',
    country: options.country || 'Global',
    language: options.language || 'English',
    total: ideas.length,
    ideas: ideas,
    disclaimer: 'Keyword metrics are provided by Google Ads API and may vary by location, language, and time.',
    generatedAt: new Date().toISOString()
  };

  // 7. Store in cache
  if (searchCache.size >= MAX_CACHE_ENTRIES) {
    const firstKey = searchCache.keys().next().value;
    searchCache.delete(firstKey);
  }
  searchCache.set(cacheKey, {
    data: resultData,
    expiresAt: Date.now() + CACHE_TTL_MS
  });

  return resultData;
}

module.exports = {
  generateGoogleAdsKeywordIdeas,
  classifySearchIntent,
  getCleanCustomerId,
  GEO_TARGET_MAP,
  LANGUAGE_MAP
};
