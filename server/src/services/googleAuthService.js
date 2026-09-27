/**
 * Google OAuth2 + Search Console Service
 * Handles token management and Google API interactions.
 * Secrets never leave the server.
 */
const { google } = require('googleapis');

// Minimum required scope for Search Console read access
const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];

/**
 * Creates a new OAuth2 client using environment variables.
 * Call this per-request to avoid shared state issues.
 */
function createOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      'Missing Google OAuth environment variables. Ensure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI are set.'
    );
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/**
 * Generates the Google authorization URL with CSRF state token.
 * @param {string} state - CSRF state value to validate on callback
 * @returns {string} URL to redirect the user to Google
 */
function getAuthUrl(state) {
  const oauth2Client = createOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',  // Request refresh token
    prompt: 'consent',       // Always show consent screen so we get refresh_token
    scope: SCOPES,
    state,
  });
}

/**
 * Exchanges authorization code for access + refresh tokens.
 * @param {string} code - Authorization code from Google callback
 * @returns {Object} tokens { access_token, refresh_token, expiry_date, ... }
 */
async function exchangeCodeForTokens(code) {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

/**
 * Creates an authenticated OAuth2 client from stored tokens.
 * Handles automatic access token refresh via refresh_token.
 * @param {Object} tokens - Previously stored tokens object
 * @returns {google.auth.OAuth2} Authenticated client
 */
function createAuthenticatedClient(tokens) {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials(tokens);

  // Auto-refresh: update stored tokens when they are refreshed
  oauth2Client.on('tokens', (newTokens) => {
    if (newTokens.refresh_token) {
      tokens.refresh_token = newTokens.refresh_token;
    }
    tokens.access_token = newTokens.access_token;
    tokens.expiry_date = newTokens.expiry_date;
  });

  return oauth2Client;
}

/**
 * Extracts a clean, safe diagnostic message from a googleapis error.
 * NEVER includes token values or client secrets.
 */
function extractGoogleError(err) {
  // googleapis wraps errors — the real message is often nested
  const status = err.status || err.code;
  const googleMsg =
    err.errors?.[0]?.message ||
    err.response?.data?.error?.message ||
    err.response?.data?.error ||
    err.message ||
    'Unknown Google API error';

  return { status, message: googleMsg };
}

/**
 * Lists all Search Console properties available to the authenticated user.
 * @param {Object} tokens - Stored OAuth tokens
 * @returns {Array} Array of site URL strings
 */
async function getSearchConsoleProperties(tokens) {
  const auth = createAuthenticatedClient(tokens);
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const res = await searchconsole.sites.list();
  const siteEntries = res.data.siteEntry || [];

  return siteEntries.map((site) => ({
    siteUrl: site.siteUrl,
    permissionLevel: site.permissionLevel,
  }));
}

/**
 * Fetches Search Console performance data for a given site.
 * @param {Object} tokens - Stored OAuth tokens
 * @param {string} siteUrl - The Search Console property URL (must match exactly)
 * @param {number} days - Number of days back (default 28)
 * @returns {Object} Aggregated performance data
 */
async function getSearchPerformance(tokens, siteUrl, days = 28) {
  const auth = createAuthenticatedClient(tokens);
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const endDate = new Date();
  // Subtract an extra day: Search Console data is typically delayed 1–3 days
  endDate.setDate(endDate.getDate() - 2);
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - days);

  const fmtDate = (d) => d.toISOString().split('T')[0];
  const start = fmtDate(startDate);
  const end = fmtDate(endDate);

  // ── Totals ──────────────────────────────────────────────────────────────
  // NOTE: The Search Console API does NOT accept dimensions:[] for totals.
  // Omit the dimensions key entirely to get aggregate totals.
  let totals = { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  try {
    const totalsRes = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: start,
        endDate: end,
        // No dimensions = aggregate totals
      },
    });
    const row = (totalsRes.data.rows || [])[0] || {};
    totals = {
      clicks:      Math.round(row.clicks || 0),
      impressions: Math.round(row.impressions || 0),
      ctr:         row.ctr != null ? parseFloat((row.ctr * 100).toFixed(2)) : 0,
      position:    row.position != null ? parseFloat(row.position.toFixed(1)) : 0,
    };
  } catch (err) {
    const { status, message } = extractGoogleError(err);
    // Re-throw with better context so the controller can handle it
    const e = new Error(`Search Console totals query failed (HTTP ${status}): ${message}`);
    e.gscStatus = status;
    e.gscMessage = message;
    throw e;
  }

  // ── Top Queries ──────────────────────────────────────────────────────────
  let topQueries = [];
  try {
    const queriesRes = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: start,
        endDate: end,
        dimensions: ['query'],
        rowLimit: 10,
        orderBy: [{ fieldName: 'clicks', sortOrder: 'DESCENDING' }],
      },
    });
    topQueries = (queriesRes.data.rows || []).map((r) => ({
      query:       r.keys[0],
      clicks:      Math.round(r.clicks || 0),
      impressions: Math.round(r.impressions || 0),
      ctr:         parseFloat((r.ctr * 100).toFixed(2)),
      position:    parseFloat(r.position.toFixed(1)),
    }));
  } catch (err) {
    const { status, message } = extractGoogleError(err);
    console.warn(`[GSC] Top queries query warning (HTTP ${status}): ${message}`);
    // Non-fatal — continue with empty top queries
  }

  // ── Top Pages ────────────────────────────────────────────────────────────
  let topPages = [];
  try {
    const pagesRes = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: start,
        endDate: end,
        dimensions: ['page'],
        rowLimit: 10,
        orderBy: [{ fieldName: 'clicks', sortOrder: 'DESCENDING' }],
      },
    });
    topPages = (pagesRes.data.rows || []).map((r) => ({
      page:        r.keys[0],
      clicks:      Math.round(r.clicks || 0),
      impressions: Math.round(r.impressions || 0),
      ctr:         parseFloat((r.ctr * 100).toFixed(2)),
      position:    parseFloat(r.position.toFixed(1)),
    }));
  } catch (err) {
    const { status, message } = extractGoogleError(err);
    console.warn(`[GSC] Top pages query warning (HTTP ${status}): ${message}`);
    // Non-fatal — continue with empty top pages
  }

  return {
    siteUrl,
    dateRange: { startDate: start, endDate: end, days },
    totals,
    topQueries,
    topPages,
  };
}

module.exports = {
  getAuthUrl,
  exchangeCodeForTokens,
  getSearchConsoleProperties,
  getSearchPerformance,
  extractGoogleError,
};
