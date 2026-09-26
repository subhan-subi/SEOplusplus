const { validateUrlForSsrf } = require('../utils/urlSecurity');
const { crawlPage } = require('../services/crawlerService');
const { analyzeSeo } = require('../services/seoAnalyzer');
const { calculateScore } = require('../services/scoreService');

/**
 * Controller to handle POST /api/analyze
 */
async function analyzeUrl(req, res, next) {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid website URL (e.g., example.com or https://example.com).'
      });
    }

    // 1. SSRF validation & normalization
    let validatedTarget;
    try {
      validatedTarget = await validateUrlForSsrf(url);
    } catch (validationErr) {
      return res.status(400).json({
        success: false,
        error: validationErr.message
      });
    }

    // 2. Fetch page and technical files (robots.txt, sitemap.xml)
    let crawlData;
    try {
      crawlData = await crawlPage(validatedTarget);
    } catch (crawlErr) {
      return res.status(422).json({
        success: false,
        error: `We couldn't analyze this website: ${crawlErr.message || 'The website may be unavailable, blocking automated requests, or taking too long to respond. Please check the URL and try again.'}`
      });
    }

    // 3. Run SEO checks on HTML & headers
    const analysis = analyzeSeo(crawlData, validatedTarget.normalizedUrl);

    // 4. Calculate score, categories, and prioritize recommendations
    const scoreData = calculateScore(analysis.checks);

    // 5. Return structured, predictable response
    return res.json({
      success: true,
      url: validatedTarget.normalizedUrl,
      normalizedUrl: crawlData.finalUrl,
      score: scoreData.score,
      grade: scoreData.grade,
      summary: scoreData.summary,
      categories: scoreData.categories,
      checks: analysis.checks,
      recommendations: scoreData.recommendations,
      meta: analysis.meta
    });

  } catch (error) {
    next(error);
  }
}

/**
 * Quick status check endpoint for API health
 */
function healthCheck(req, res) {
  res.json({
    status: 'ok',
    service: 'SEOly API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  analyzeUrl,
  healthCheck
};
