/**
 * Google OAuth + Search Console controller.
 * FRONTEND_URL env var controls the redirect target.
 * Client Secret is NEVER exposed to the frontend.
 *
 * OAuth state is stateless/signed so it works correctly on
 * Vercel serverless deployments where in-memory state cannot
 * be relied upon between requests.
 */

const crypto = require('crypto');

const {
  getAuthUrl,
  exchangeCodeForTokens,
  getSearchConsoleProperties,
  getSearchPerformance,
} = require('../services/googleAuthService');

// Temporary in-memory token store.
// NOTE: This is still used for the connected session.
// Persistent storage should be used for long-term production sessions.
const tokenStore = new Map();

// ── Configuration ────────────────────────────────────────────────────────────

const FRONTEND =
  process.env.FRONTEND_URL || 'http://localhost:5173';

const GSC_PATH =
  `${FRONTEND}/tools/search-console`;

const STATE_SECRET =
  process.env.GOOGLE_OAUTH_STATE_SECRET ||
  process.env.GOOGLE_CLIENT_SECRET;

// ── OAuth State Helpers ───────────────────────────────────────────────────────

/**
 * Creates a signed OAuth state value.
 *
 * Format:
 * base64url(payload).signature
 *
 * Payload contains:
 * - sessionId
 * - timestamp
 * - random nonce
 */
function createOAuthState(sessionId) {
  const payload = {
    sessionId,
    timestamp: Date.now(),
    nonce: crypto.randomBytes(16).toString('hex'),
  };

  const encodedPayload = Buffer
    .from(JSON.stringify(payload))
    .toString('base64url');

  const signature = crypto
    .createHmac('sha256', STATE_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies and decodes OAuth state.
 *
 * State expires after 10 minutes.
 */
function verifyOAuthState(state) {
  if (!state || typeof state !== 'string') {
    return null;
  }

  const parts = state.split('.');

  if (parts.length !== 2) {
    return null;
  }

  const [encodedPayload, receivedSignature] = parts;

  const expectedSignature = crypto
    .createHmac('sha256', STATE_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  const receivedBuffer = Buffer.from(receivedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer
        .from(encodedPayload, 'base64url')
        .toString('utf8')
    );

    // OAuth state is valid for 10 minutes.
    const maxAge = 10 * 60 * 1000;

    if (
      !payload.timestamp ||
      Date.now() - payload.timestamp > maxAge
    ) {
      return null;
    }

    if (!payload.sessionId) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// ── Session Helper ────────────────────────────────────────────────────────────

function getSession(req, res) {
  let sessionId = req.cookies?.gsc_session;

  if (!sessionId) {
    sessionId = crypto.randomUUID();

    res.cookie('gsc_session', sessionId, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  return sessionId;
}

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * GET /api/google/auth
 *
 * Initiates Google OAuth flow.
 */
async function startAuth(req, res, next) {
  try {
    const sessionId = getSession(req, res);

    // Create a stateless signed state.
    const state = createOAuthState(sessionId);

    const authUrl = getAuthUrl(state);

    res.redirect(authUrl);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/google/callback
 *
 * Google redirects here after user approves access.
 */
async function handleCallback(req, res, next) {
  try {
    const {
      code,
      state,
      error,
    } = req.query;

    if (error) {
      return res.redirect(
        `${GSC_PATH}?error=access_denied`
      );
    }

    if (!code || !state) {
      return res.redirect(
        `${GSC_PATH}?error=invalid_callback`
      );
    }

    // Verify signed OAuth state.
    const statePayload = verifyOAuthState(state);

    if (!statePayload) {
      console.warn(
        '[Google OAuth] Invalid or expired OAuth state.'
      );

      return res.redirect(
        `${GSC_PATH}?error=state_mismatch`
      );
    }

    // Make sure the browser session matches the session
    // that originally started the OAuth flow.
    const sessionId = req.cookies?.gsc_session;

    if (!sessionId || sessionId !== statePayload.sessionId) {
      console.warn(
        '[Google OAuth] Session mismatch during callback.'
      );

      return res.redirect(
        `${GSC_PATH}?error=state_mismatch`
      );
    }

    // Exchange authorization code for Google tokens.
    const tokens = await exchangeCodeForTokens(code);

    // Preserve any existing session information.
    const existingSession =
      tokenStore.get(sessionId) || {};

    tokenStore.set(sessionId, {
      ...existingSession,
      tokens,
      selectedSite:
        existingSession.selectedSite || null,
    });

    return res.redirect(
      `${GSC_PATH}?connected=true`
    );
  } catch (err) {
    console.error(
      '[Google Callback Error]:',
      err.message
    );

    return res.redirect(
      `${GSC_PATH}?error=auth_failed`
    );
  }
}

/**
 * GET /api/google/status
 *
 * Returns connection status for the current session.
 */
function getStatus(req, res) {
  const sessionId =
    req.cookies?.gsc_session;

  const sessionData =
    sessionId
      ? tokenStore.get(sessionId)
      : null;

  const connected =
    !!(sessionData?.tokens?.access_token);

  res.json({
    success: true,
    connected,
    selectedSite:
      sessionData?.selectedSite || null,
  });
}

/**
 * GET /api/google/properties
 *
 * Lists Search Console properties for connected account.
 */
async function getProperties(req, res, next) {
  try {
    const sessionId =
      req.cookies?.gsc_session;

    const sessionData =
      sessionId
        ? tokenStore.get(sessionId)
        : null;

    if (!sessionData?.tokens) {
      return res.status(401).json({
        success: false,
        error:
          'Not connected to Google. Please authorize first.',
      });
    }

    const properties =
      await getSearchConsoleProperties(
        sessionData.tokens
      );

    res.json({
      success: true,
      properties,
    });
  } catch (err) {
    const status =
      err.gscStatus ||
      err.status ||
      err.code;

    const message =
      err.gscMessage ||
      err.message ||
      'Failed to fetch properties.';

    console.error(
      `[GSC Properties Error] HTTP ${status}: ${message}`
    );

    const isAuthError =
      status === 401 ||
      status === '401' ||
      err.message?.includes('invalid_grant') ||
      err.message?.includes('Token has been expired');

    if (isAuthError) {
      return res.status(401).json({
        success: false,
        error:
          'Google session expired. Please reconnect.',
      });
    }

    return res.status(
      status >= 400 && status < 600
        ? status
        : 500
    ).json({
      success: false,
      error:
        `Google Search Console error: ${message}`,
    });
  }
}

/**
 * POST /api/google/select-property
 */
async function selectProperty(req, res, next) {
  try {
    const sessionId =
      req.cookies?.gsc_session;

    const sessionData =
      sessionId
        ? tokenStore.get(sessionId)
        : null;

    if (!sessionData?.tokens) {
      return res.status(401).json({
        success: false,
        error:
          'Not connected to Google.',
      });
    }

    const { siteUrl } = req.body;

    if (
      !siteUrl ||
      typeof siteUrl !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        error:
          'siteUrl is required.',
      });
    }

    tokenStore.set(sessionId, {
      ...sessionData,
      selectedSite: siteUrl,
    });

    res.json({
      success: true,
      selectedSite: siteUrl,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/google/search-performance
 */
async function searchPerformance(req, res, next) {
  try {
    const sessionId =
      req.cookies?.gsc_session;

    const sessionData =
      sessionId
        ? tokenStore.get(sessionId)
        : null;

    if (!sessionData?.tokens) {
      return res.status(401).json({
        success: false,
        error:
          'Not connected to Google.',
      });
    }

    if (!sessionData.selectedSite) {
      return res.status(400).json({
        success: false,
        error:
          'No Search Console property selected.',
      });
    }

    const days =
      parseInt(req.query.days, 10) || 28;

    const data =
      await getSearchPerformance(
        sessionData.tokens,
        sessionData.selectedSite,
        days
      );

    res.json({
      success: true,
      ...data,
    });
  } catch (err) {
    const status =
      err.gscStatus ||
      err.status ||
      err.code;

    const message =
      err.gscMessage ||
      err.message ||
      'Failed to fetch performance data.';

    console.error(
      `[GSC Performance Error] HTTP ${status}: ${message}`
    );

    const isAuthError =
      status === 401 ||
      status === '401' ||
      message.includes('invalid_grant') ||
      message.includes('Token has been expired') ||
      message.includes('UNAUTHENTICATED');

    if (isAuthError) {
      return res.status(401).json({
        success: false,
        error:
          'Google session expired. Please reconnect.',
      });
    }

    const isForbidden =
      status === 403 ||
      status === '403' ||
      message.includes('PERMISSION_DENIED') ||
      message.includes(
        'does not have sufficient permission'
      ) ||
      message.includes(
        'User does not have any Search Console'
      );

    if (isForbidden) {
      return res.status(403).json({
        success: false,
        error:
          `Access denied: ${message}. Make sure the Google account has access to this Search Console property.`,
      });
    }

    const isBadRequest =
      status === 400 ||
      status === '400';

    if (isBadRequest) {
      return res.status(400).json({
        success: false,
        error:
          `Invalid request: ${message}. Check that the property URL exactly matches the verified Search Console property.`,
      });
    }

    const httpStatus =
      Number.isInteger(status) &&
        status >= 400 &&
        status < 600
        ? status
        : 502;

    return res.status(httpStatus).json({
      success: false,
      error:
        `Google Search Console API error (${status}): ${message}`,
    });
  }
}

/**
 * POST /api/google/disconnect
 */
function disconnect(req, res) {
  const sessionId =
    req.cookies?.gsc_session;

  if (sessionId) {
    tokenStore.delete(sessionId);
  }

  res.clearCookie('gsc_session');

  res.json({
    success: true,
  });
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