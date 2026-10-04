'use strict';

const {
  resolveRedirectUri,
  generateAuthUrl,
  exchangeCodeForTokens,
  persistRefreshToken,
  getConfigurationStatus
} = require('../services/googleAdsOAuthService');

/**
 * Controller for GET /api/google-ads/auth
 * Initiates the Google Ads OAuth2 authorization flow.
 */
function initiateAuth(req, res) {
  try {
    const redirectUri = resolveRedirectUri(req);
    const authUrl = generateAuthUrl(redirectUri);

    if (req.query.format === 'json') {
      return res.json({
        success: true,
        authUrl,
        redirectUri
      });
    }

    return res.redirect(authUrl);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: err.message || 'Failed to generate Google Ads authorization URL.'
    });
  }
}

/**
 * Controller for GET /api/google-ads/callback
 * Handles the OAuth2 code callback from Google, extracts tokens,
 * and securely updates the server environment.
 */
async function handleCallback(req, res) {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Google Ads Authorization Error</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
          .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; max-width: 480px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
          .icon { font-size: 40px; margin-bottom: 16px; }
          h1 { font-size: 20px; margin: 0 0 12px 0; color: #f87171; }
          p { color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0 0 24px 0; }
          a { display: inline-block; background: #3b82f6; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">⚠️</div>
          <h1>Authorization Cancelled or Failed</h1>
          <p>Google returned an error: <code>${encodeURIComponent(error)}</code>. Please try again from SEO++ Keyword Finder.</p>
          <a href="/tools/keyword-finder">Return to Keyword Finder</a>
        </div>
      </body>
      </html>
    `);
  }

  if (!code) {
    return res.status(400).send('Authorization code was not provided.');
  }

  try {
    const redirectUri = resolveRedirectUri(req);
    const tokens = await exchangeCodeForTokens(code, redirectUri);

    let saved = false;
    if (tokens.refreshToken) {
      saved = persistRefreshToken(tokens.refreshToken);
    } else if (process.env.GOOGLE_ADS_REFRESH_TOKEN) {
      // Existing refresh token already in environment
      saved = true;
    }

    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Google Ads Authorization Complete</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
          .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 36px; max-width: 500px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
          .icon { font-size: 48px; margin-bottom: 16px; }
          h1 { font-size: 22px; margin: 0 0 12px 0; color: #10b981; }
          p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; }
          .badge { display: inline-block; background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
          .btn { display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 14px; transition: background 0.2s; }
          .btn:hover { background: #1d4ed8; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">✨</div>
          <div class="badge">OAuth Connected</div>
          <h1>Google Ads Authorization Complete</h1>
          <p>Your Google Ads account has been authenticated with offline access enabled. The Keyword Finder tool can now retrieve live search volume and CPC data.</p>
          <a href="/tools/keyword-finder" class="btn">Return to Keyword Finder</a>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Token Exchange Failed</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
          .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; max-width: 480px; text-align: center; }
          h1 { font-size: 20px; color: #f87171; margin-bottom: 12px; }
          p { color: #94a3b8; font-size: 14px; }
          a { display: inline-block; margin-top: 20px; background: #3b82f6; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Authorization Failed</h1>
          <p>${err.message}</p>
          <a href="/tools/keyword-finder">Back to Keyword Finder</a>
        </div>
      </body>
      </html>
    `);
  }
}

/**
 * Controller for GET /api/google-ads/status
 * Returns configuration readiness without exposing secrets.
 */
function getStatus(req, res) {
  try {
    const status = getConfigurationStatus();
    return res.json({
      success: true,
      ...status
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

module.exports = {
  initiateAuth,
  handleCallback,
  getStatus
};
