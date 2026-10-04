'use strict';

/**
 * Google Ads OAuth2 Service
 * Handles OAuth authorization URL generation, code-for-token exchange,
 * and access token refresh using the official googleapis auth library.
 *
 * Secrets and tokens NEVER leave the server.
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const GOOGLE_ADS_SCOPE = ['https://www.googleapis.com/auth/adwords'];

const LOCAL_REDIRECT_URI = 'http://localhost:5001/api/google-ads/callback';
const PRODUCTION_REDIRECT_URI = 'https://seoplusplus-backend.vercel.app/api/google-ads/callback';

/**
 * Resolves the appropriate redirect URI based on environment or request.
 *
 * @param {import('express').Request} [req]
 * @returns {string} Redirect URI
 */
function resolveRedirectUri(req) {
  if (process.env.GOOGLE_ADS_REDIRECT_URI && process.env.GOOGLE_ADS_REDIRECT_URI.trim()) {
    return process.env.GOOGLE_ADS_REDIRECT_URI.trim();
  }

  if (req) {
    const host = req.get('host') || '';
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      return LOCAL_REDIRECT_URI;
    }
  }

  if (process.env.NODE_ENV === 'development') {
    return LOCAL_REDIRECT_URI;
  }

  return PRODUCTION_REDIRECT_URI;
}

/**
 * Creates an OAuth2 client for Google Ads using environment variables.
 *
 * @param {string} [redirectUri]
 * @returns {import('googleapis').Auth.OAuth2Client}
 */
function createOAuth2Client(redirectUri) {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  const uri = redirectUri || resolveRedirectUri();

  if (!clientId || !clientId.trim() || !clientSecret || !clientSecret.trim()) {
    const err = new Error('Google Ads OAuth credentials not configured. Please ensure GOOGLE_ADS_CLIENT_ID and GOOGLE_ADS_CLIENT_SECRET are set in your environment variables.');
    err.statusCode = 503;
    throw err;
  }

  return new google.auth.OAuth2(clientId.trim(), clientSecret.trim(), uri);
}

/**
 * Generates the Google authorization URL for Google Ads offline access.
 *
 * @param {string} [redirectUri]
 * @param {string} [state] - Optional CSRF state
 * @returns {string} Authorization URL
 */
function generateAuthUrl(redirectUri, state) {
  const client = createOAuth2Client(redirectUri);
  return client.generateAuthUrl({
    access_type: 'offline', // Requests refresh_token
    prompt: 'consent',     // Forces consent screen to ensure refresh_token is returned
    scope: GOOGLE_ADS_SCOPE,
    state: state || 'google_ads_auth'
  });
}

/**
 * Exchanges the OAuth authorization code for access and refresh tokens.
 *
 * @param {string} code - Authorization code from Google
 * @param {string} [redirectUri]
 * @returns {Promise<{ accessToken: string, refreshToken?: string, expiryDate?: number }>}
 */
async function exchangeCodeForTokens(code, redirectUri) {
  if (!code || typeof code !== 'string' || !code.trim()) {
    const err = new Error('Authorization code is missing from callback.');
    err.statusCode = 400;
    throw err;
  }

  const client = createOAuth2Client(redirectUri);

  try {
    const { tokens } = await client.getToken(code.trim());
    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date
    };
  } catch (err) {
    const errorMsg = err.response?.data?.error_description || err.response?.data?.error || err.message || 'OAuth token exchange failed';
    const customErr = new Error(`Google Ads authorization failed: ${errorMsg}`);
    customErr.statusCode = 400;
    throw customErr;
  }
}

/**
 * Safely persists a new refresh token into server/.env if file exists locally.
 * Also updates process.env in memory. Does not overwrite if existing token is present and new one is missing.
 *
 * @param {string} refreshToken
 * @returns {boolean} Whether .env was updated on disk
 */
function persistRefreshToken(refreshToken) {
  if (!refreshToken || typeof refreshToken !== 'string' || !refreshToken.trim()) {
    return false;
  }

  const tokenVal = refreshToken.trim();
  process.env.GOOGLE_ADS_REFRESH_TOKEN = tokenVal;

  try {
    const envPath = path.resolve(__dirname, '../../.env');
    if (fs.existsSync(envPath)) {
      let content = fs.readFileSync(envPath, 'utf8');

      if (/^GOOGLE_ADS_REFRESH_TOKEN=.*/m.test(content)) {
        content = content.replace(/^GOOGLE_ADS_REFRESH_TOKEN=.*/m, `GOOGLE_ADS_REFRESH_TOKEN=${tokenVal}`);
      } else {
        content += `\nGOOGLE_ADS_REFRESH_TOKEN=${tokenVal}\n`;
      }

      fs.writeFileSync(envPath, content, 'utf8');
      return true;
    }
  } catch (err) {
    // In serverless / read-only filesystems (Vercel), writing .env is not supported.
    // In-memory process.env is already updated.
  }

  return false;
}

/**
 * Retrieves a valid access token using the stored refresh token.
 *
 * @returns {Promise<string>} Valid Google access token
 */
async function getAccessToken() {
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;

  if (!refreshToken || !refreshToken.trim()) {
    const err = new Error('Google Ads refresh token is not configured. Please complete authorization at /api/google-ads/auth to obtain a refresh token.');
    err.statusCode = 503;
    err.code = 'REFRESH_TOKEN_MISSING';
    throw err;
  }

  const client = createOAuth2Client();
  client.setCredentials({
    refresh_token: refreshToken.trim()
  });

  try {
    const { token } = await client.getAccessToken();
    if (!token) {
      throw new Error('Google did not return an access token.');
    }
    return token;
  } catch (err) {
    const errorMsg = err.response?.data?.error_description || err.response?.data?.error || err.message || 'Token refresh failed';
    const customErr = new Error(`Failed to refresh Google Ads access token: ${errorMsg}. Authorization may have been revoked.`);
    customErr.statusCode = 401;
    customErr.code = 'TOKEN_REFRESH_FAILED';
    throw customErr;
  }
}

/**
 * Returns safe status check of Google Ads API configuration without exposing any secret values.
 *
 * @returns {Object} Safe configuration status
 */
function getConfigurationStatus() {
  const hasClientId = !!(process.env.GOOGLE_ADS_CLIENT_ID && process.env.GOOGLE_ADS_CLIENT_ID.trim());
  const hasClientSecret = !!(process.env.GOOGLE_ADS_CLIENT_SECRET && process.env.GOOGLE_ADS_CLIENT_SECRET.trim());
  const hasCustomerId = !!(process.env.GOOGLE_ADS_CUSTOMER_ID && process.env.GOOGLE_ADS_CUSTOMER_ID.trim());
  const hasRefreshToken = !!(process.env.GOOGLE_ADS_REFRESH_TOKEN && process.env.GOOGLE_ADS_REFRESH_TOKEN.trim());
  const hasDeveloperToken = !!(process.env.GOOGLE_ADS_DEVELOPER_TOKEN && process.env.GOOGLE_ADS_DEVELOPER_TOKEN.trim());

  const isConfigured = hasClientId && hasClientSecret && hasCustomerId && hasRefreshToken;

  return {
    isConfigured,
    hasClientId,
    hasClientSecret,
    hasCustomerId,
    hasRefreshToken,
    hasDeveloperToken,
    customerIdFormatted: hasCustomerId ? process.env.GOOGLE_ADS_CUSTOMER_ID.trim().replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3') : null
  };
}

module.exports = {
  resolveRedirectUri,
  createOAuth2Client,
  generateAuthUrl,
  exchangeCodeForTokens,
  persistRefreshToken,
  getAccessToken,
  getConfigurationStatus,
  LOCAL_REDIRECT_URI,
  PRODUCTION_REDIRECT_URI
};
