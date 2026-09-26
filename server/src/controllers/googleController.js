/**
 * Google OAuth + Search Console controller.
 * FRONTEND_URL env var controls the redirect target (defaults to localhost:5173).
 * Handles all /api/google/* endpoints.
 * Client Secret is NEVER exposed to the frontend.
 */
const crypto = require('crypto');
const {
  getAuthUrl,
  exchangeCodeForTokens,
  getSearchConsoleProperties,
  getSearchPerformance,
} = require('../services/googleAuthService');

// In-memory token store (session-keyed).
// For production, swap this with a DB (Redis, Postgres, etc.)
// without changing any frontend code or route signatures.
const tokenStore = new Map();

// ── Helper ────────────────────────────────────────────────────────────────────

function getSession(req, res) {
  let sessionId = req.cookies?.gsc_session;
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    res.cookie('gsc_session', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === 'production',
    });
  }
  return sessionId;
}

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * GET /api/google/auth
 * Initiates Google OAuth flow. Redirects user to Google's consent screen.
 */
async function startAuth(req, res, next) {
  try {
    const sessionId = getSession(req, res);
    // CSRF state: bind the session to the OAuth state param
    const state = `${sessionId}.${crypto.randomBytes(16).toString('hex')}`;

    // Store state temporarily to validate on callback
    const existing = tokenStore.get(sessionId) || {};
    tokenStore.set(sessionId, { ...existing, pendingState: state });

    const authUrl = getAuthUrl(state);
    res.redirect(authUrl);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/google/callback
 * Google redirects here after user approves. Exchanges code for tokens.
 */
async function handleCallback(req, res, next) {
  try {
    const { code, state, error } = req.query;

    const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:5173';
    const GSC_PATH = `${FRONTEND}/tools/search-console`;

    if (error) {
      // User denied access
      return res.redirect(`${GSC_PATH}?error=access_denied`);
    }

    if (!code || !state) {
      return res.redirect(`${GSC_PATH}?error=invalid_callback`);
    }

    // Validate CSRF state
    const sessionId = req.cookies?.gsc_session;
    const sessionData = sessionId ? tokenStore.get(sessionId) : null;

    if (!sessionData || sessionData.pendingState !== state) {
      return res.redirect(`${GSC_PATH}?error=state_mismatch`);
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Store tokens (clear pending state)
    tokenStore.set(sessionId, {
      tokens,
      selectedSite: sessionData.selectedSite || null,
    });

    res.redirect(`${GSC_PATH}?connected=true`);
  } catch (err) {
    const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:5173';
    console.error('[Google Callback Error]:', err.message);
    res.redirect(`${FRONTEND}/tools/search-console?error=auth_failed`);
  }
}

/**
 * GET /api/google/status
 * Returns connection status for the current session.
 */
function getStatus(req, res) {
  const sessionId = req.cookies?.gsc_session;
  const sessionData = sessionId ? tokenStore.get(sessionId) : null;

  const connected = !!(sessionData?.tokens?.access_token);
  res.json({
    success: true,
    connected,
    selectedSite: sessionData?.selectedSite || null,
  });
}

/**
 * GET /api/google/properties
 * Lists Search Console properties for the connected Google account.
 */
async function getProperties(req, res, next) {
  try {
    const sessionId = req.cookies?.gsc_session;
    const sessionData = sessionId ? tokenStore.get(sessionId) : null;

    if (!sessionData?.tokens) {
      return res.status(401).json({ success: false, error: 'Not connected to Google. Please authorize first.' });
    }

    const properties = await getSearchConsoleProperties(sessionData.tokens);
    res.json({ success: true, properties });
  } catch (err) {
    // Extract safe error details — never log token values
    const status = err.gscStatus || err.status || err.code;
    const message = err.gscMessage || err.message || 'Failed to fetch properties.';
    console.error(`[GSC Properties Error] HTTP ${status}: ${message}`);

    // Detect auth/token errors by numeric or string status code
    const isAuthError = status === 401 || status === '401' ||
      err.message?.includes('invalid_grant') ||
      err.message?.includes('Token has been expired');
    if (isAuthError) {
      return res.status(401).json({ success: false, error: 'Google session expired. Please reconnect.' });
    }
    // Surface the real Google error (safe — no token/secret in message)
    return res.status(status >= 400 && status < 600 ? status : 500).json({
      success: false,
      error: `Google Search Console error: ${message}`,
    });
  }
}

/**
 * POST /api/google/select-property
 * Stores the user's selected Search Console property.
 * Body: { siteUrl: "https://example.com/" }
 */
async function selectProperty(req, res, next) {
  try {
    const sessionId = req.cookies?.gsc_session;
    const sessionData = sessionId ? tokenStore.get(sessionId) : null;

    if (!sessionData?.tokens) {
      return res.status(401).json({ success: false, error: 'Not connected to Google.' });
    }

    const { siteUrl } = req.body;
    if (!siteUrl || typeof siteUrl !== 'string') {
      return res.status(400).json({ success: false, error: 'siteUrl is required.' });
    }

    tokenStore.set(sessionId, { ...sessionData, selectedSite: siteUrl });
    res.json({ success: true, selectedSite: siteUrl });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/google/search-performance
 * Fetches Search Console performance data for the selected property.
 * Optional query: ?days=28
 */
async function searchPerformance(req, res, next) {
  try {
    const sessionId = req.cookies?.gsc_session;
    const sessionData = sessionId ? tokenStore.get(sessionId) : null;

    if (!sessionData?.tokens) {
      return res.status(401).json({ success: false, error: 'Not connected to Google.' });
    }
    if (!sessionData.selectedSite) {
      return res.status(400).json({ success: false, error: 'No Search Console property selected.' });
    }

    const days = parseInt(req.query.days, 10) || 28;
    const data = await getSearchPerformance(sessionData.tokens, sessionData.selectedSite, days);
    res.json({ success: true, ...data });
  } catch (err) {
    // Extract safe error details — never log token values
    const status = err.gscStatus || err.status || err.code;
    const message = err.gscMessage || err.message || 'Failed to fetch performance data.';
    console.error(`[GSC Performance Error] HTTP ${status}: ${message}`);

    // Detect auth/token errors
    const isAuthError = status === 401 || status === '401' ||
      message.includes('invalid_grant') ||
      message.includes('Token has been expired') ||
      message.includes('UNAUTHENTICATED');
    if (isAuthError) {
      return res.status(401).json({ success: false, error: 'Google session expired. Please reconnect.' });
    }

    // Detect permission errors
    const isForbidden = status === 403 || status === '403' ||
      message.includes('PERMISSION_DENIED') ||
      message.includes('does not have sufficient permission') ||
      message.includes('User does not have any Search Console');
    if (isForbidden) {
      return res.status(403).json({
        success: false,
        error: `Access denied: ${message}. Make sure the Google account has access to this Search Console property.`,
      });
    }

    // Detect invalid property / URL format errors
    const isBadRequest = status === 400 || status === '400';
    if (isBadRequest) {
      return res.status(400).json({
        success: false,
        error: `Invalid request: ${message}. Check that the property URL exactly matches the verified Search Console property.`,
      });
    }

    // Generic Google API error — surface safe message instead of 500
    const httpStatus = Number.isInteger(status) && status >= 400 && status < 600 ? status : 502;
    return res.status(httpStatus).json({
      success: false,
      error: `Google Search Console API error (${status}): ${message}`,
    });
  }
}

/**
 * POST /api/google/disconnect
 * Clears the Google session / tokens.
 */
function disconnect(req, res) {
  const sessionId = req.cookies?.gsc_session;
  if (sessionId) {
    tokenStore.delete(sessionId);
  }
  res.clearCookie('gsc_session');
  res.json({ success: true });
}

module.exports = {
  startAuth,
  handleCallback,
  getStatus,
  getProperties,
  selectProperty,
  searchPerformance,
  disconnect,
};
