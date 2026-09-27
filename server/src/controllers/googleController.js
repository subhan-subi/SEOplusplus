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
  extractGoogleError,
} = require('../services/googleAuthService');

const GoogleOAuthSession = require('../models/GoogleOAuthSession');
const { connectDB } = require('../config/database');

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

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
  partitioned: true,
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

const CLEAR_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
  partitioned: true,
};

// ── Session Helper ────────────────────────────────────────────────────────────

function getSession(req, res) {
  let sessionId = req.cookies?.gsc_session;

  if (!sessionId) {
    sessionId = crypto.randomUUID();

    res.cookie('gsc_session', sessionId, COOKIE_OPTIONS);
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

    // Safe diagnostic log (never logs tokens, secrets, or codes)
    console.log('[Google OAuth Callback] Diagnostics:', {
      hasCode: !!code,
      hasState: !!state,
      stateVerificationPassed: !!statePayload,
      hasSessionCookie: !!sessionId,
      sessionMatchesState: Boolean(
        sessionId && statePayload && sessionId === statePayload.sessionId
      ),
    });

    if (!sessionId || sessionId !== statePayload.sessionId) {
      console.warn(
        '[Google OAuth] Session mismatch during callback.',
        {
          hasCookie: !!sessionId,
          hasStateSession: !!statePayload?.sessionId,
        }
      );

      return res.redirect(
        `${GSC_PATH}?error=state_mismatch`
      );
    }

    // Exchange authorization code for Google tokens.
    let newTokens;
    try {
      newTokens = await exchangeCodeForTokens(code);
      console.log('[Google OAuth Callback] Token exchange: SUCCESS');
    } catch (tokenErr) {
      const sanitized = extractGoogleError(tokenErr);
      console.error('[Google OAuth Callback] Token exchange: FAILED', {
        status: sanitized.status || 'UNKNOWN',
        error: sanitized.message,
      });
      throw tokenErr;
    }

    // Preserve existing session data (selectedSite + existing refresh_token
    // if Google did not issue a new one).
    try {
      await connectDB();
      const existing = await GoogleOAuthSession.findOne({ sessionId }).lean();

      const mergedTokens = {
        ...(existing?.tokens || {}),
        ...newTokens,
        // Keep existing refresh_token when Google omits it in the response
        refresh_token:
          newTokens.refresh_token ||
          existing?.tokens?.refresh_token ||
          null,
      };

      await GoogleOAuthSession.findOneAndUpdate(
        { sessionId },
        {
          tokens: mergedTokens,
          selectedSite: existing?.selectedSite || null,
        },
        { upsert: true, new: true }
      );

      console.log('[Google OAuth Callback] MongoDB session save: SUCCESS');
    } catch (dbErr) {
      console.error('[Google OAuth Callback] MongoDB session save: FAILED:', dbErr.message);
      throw dbErr;
    }

    // Refresh session cookie on callback with full TTL and Partitioned attribute
    res.cookie('gsc_session', sessionId, COOKIE_OPTIONS);

    return res.redirect(
      `${GSC_PATH}?connected=true`
    );
  } catch (err) {
    const sanitized = extractGoogleError(err);
    console.error(
      '[Google Callback Error]:',
      sanitized.message || err.message
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
async function getStatus(req, res) {
  try {
    const sessionId = req.cookies?.gsc_session;

    const sessionData = sessionId
      ? await GoogleOAuthSession.findOne({ sessionId }).lean()
      : null;

    const connected = !!(sessionData?.tokens?.access_token);

    res.json({
      success: true,
      connected,
      selectedSite: sessionData?.selectedSite || null,
    });
  } catch (err) {
    // Never crash the status check — return disconnected gracefully
    console.error('[GSC Status Error]:', err.message);
    res.json({ success: true, connected: false, selectedSite: null });
  }
}

/**
 * GET /api/google/properties
 *
 * Lists Search Console properties for connected account.
 */
async function getProperties(req, res, next) {
  try {
    const sessionId = req.cookies?.gsc_session;

    const sessionData = sessionId
      ? await GoogleOAuthSession.findOne({ sessionId }).lean()
      : null;

    if (!sessionData?.tokens) {
      return res.status(401).json({
        success: false,
        error: 'Not connected to Google. Please authorize first.',
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
    const sessionId = req.cookies?.gsc_session;

    const sessionData = sessionId
      ? await GoogleOAuthSession.findOne({ sessionId }).lean()
      : null;

    if (!sessionData?.tokens) {
      return res.status(401).json({
        success: false,
        error: 'Not connected to Google.',
      });
    }

    const { siteUrl } = req.body;

    if (!siteUrl || typeof siteUrl !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'siteUrl is required.',
      });
    }

    await GoogleOAuthSession.findOneAndUpdate(
      { sessionId },
      { selectedSite: siteUrl }
    );

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
    const sessionId = req.cookies?.gsc_session;

    const sessionData = sessionId
      ? await GoogleOAuthSession.findOne({ sessionId }).lean()
      : null;

    if (!sessionData?.tokens) {
      return res.status(401).json({
        success: false,
        error: 'Not connected to Google.',
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
async function disconnect(req, res) {
  try {
    const sessionId = req.cookies?.gsc_session;

    if (sessionId) {
      await GoogleOAuthSession.deleteOne({ sessionId });
    }

    res.clearCookie('gsc_session', CLEAR_COOKIE_OPTIONS);

    res.json({ success: true });
  } catch (err) {
    console.error('[GSC Disconnect Error]:', err.message);
    // Still clear the cookie even if DB delete fails
    res.clearCookie('gsc_session', CLEAR_COOKIE_OPTIONS);
    res.json({ success: true });
  }
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