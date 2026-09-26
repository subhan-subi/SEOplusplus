/**
 * Centralized safe error handling middleware.
 * Ensures internal errors and stack traces are never exposed to the client.
 */
function errorHandler(err, req, res, next) {
  // Log server-side for diagnostics (without exposing to client)
  console.error('[SEOly Error]:', err.message || err);

  const statusCode = err.status || err.statusCode || 500;

  // Google API errors carry a gscMessage — surface it safely
  if (err.gscMessage) {
    return res.status(statusCode).json({
      success: false,
      error: `Google Search Console error: ${err.gscMessage}`,
    });
  }

  // Format friendly, helpful message for SEO analyzer routes
  let userFriendlyMessage = err.message;
  if (!userFriendlyMessage || (statusCode === 500 && req.path.startsWith('/analyze'))) {
    userFriendlyMessage =
      "We couldn't analyze this website. The website may be unavailable, blocking automated requests, or taking too long to respond. Please check the URL and try again.";
  }

  res.status(statusCode).json({
    success: false,
    error: userFriendlyMessage,
  });
}

module.exports = {
  errorHandler
};
