const rateLimit = require('express-rate-limit');

const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per window
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. To ensure fair use for everyone, please wait a few minutes before running another SEO audit.',
      retryAfterSeconds: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
    });
  }
});

module.exports = {
  analyzeLimiter
};
