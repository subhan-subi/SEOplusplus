'use strict';

const { generateGoogleAdsKeywordIdeas } = require('../services/googleAdsService');
const { getConfigurationStatus } = require('../services/googleAdsOAuthService');
const { findKeywords, validateSeedKeyword } = require('../services/keywordService');

/**
 * Controller to handle POST /api/keywords/find
 *
 * Upgraded to query the official Google Ads API (KeywordPlanIdeaService)
 * for real search volume, competition, competition index, and CPC bids.
 */
async function getKeywordIdeas(req, res, next) {
  try {
    const rawKeyword = req.body?.keyword || req.body?.seed || req.body?.query;
    const country = req.body?.country;
    const language = req.body?.language;
    const mode = req.body?.mode; // optional: 'ideas' for deterministic fallback

    // Validate and sanitize seed keyword early
    const cleanKeyword = validateSeedKeyword(rawKeyword);

    const config = getConfigurationStatus();

    // If client explicitly asks for deterministic ideas or Google Ads is unconfigured
    if (mode === 'ideas') {
      const fallbackResult = await findKeywords(cleanKeyword, { country, language });
      return res.json({
        ...fallbackResult,
        provider: 'SEO++ Rule-Based Ideas (No Volume/CPC)'
      });
    }

    if (!config.isConfigured) {
      const missingFields = [];
      if (!config.hasClientId) missingFields.push('GOOGLE_ADS_CLIENT_ID');
      if (!config.hasClientSecret) missingFields.push('GOOGLE_ADS_CLIENT_SECRET');
      if (!config.hasCustomerId) missingFields.push('GOOGLE_ADS_CUSTOMER_ID');
      if (!config.hasRefreshToken) missingFields.push('GOOGLE_ADS_REFRESH_TOKEN');

      return res.status(503).json({
        success: false,
        error: `Google Ads API authorization is required to fetch real search volume, CPC, and competition data. Missing configuration: ${missingFields.join(', ')}. ` +
               (missingFields.includes('GOOGLE_ADS_REFRESH_TOKEN')
                 ? 'Please authenticate via /api/google-ads/auth to enable live Google metrics.'
                 : 'Please check your server environment settings.'),
        requiresAuth: !config.hasRefreshToken,
        authUrl: '/api/google-ads/auth',
        config
      });
    }

    // Call official Google Ads API service
    const result = await generateGoogleAdsKeywordIdeas(cleanKeyword, { country, language });
    return res.json(result);
  } catch (err) {
    const statusCode = err.statusCode || err.status || 500;
    console.error(`[Keyword API] Error for route POST /api/keywords/find | status: ${statusCode} | code: ${err.code || 'n/a'} | msg: ${err.message}`);
    return res.status(statusCode).json({
      success: false,
      error: err.message || 'Failed to retrieve Google Ads keyword data. Please try again.',
      code: err.code || undefined,
      requiresDevToken: err.message?.includes('developer token') || err.message?.includes('DEVELOPER_TOKEN') || false
    });
  }
}

module.exports = {
  getKeywordIdeas
};
