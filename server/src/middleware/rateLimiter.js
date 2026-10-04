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

// Limit publishing inquiries to prevent spam
const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'You have submitted several inquiries recently. Please wait before submitting another.'
    });
  }
});

// Admin key verification limiter
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts. Please try again in 15 minutes.'
    });
  }
});

// Domain Rating checker limiter to prevent third-party quota exhaustion
const drLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 DR checks per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. To ensure fair use for everyone, please wait a few minutes before checking another Domain Rating.',
      retryAfterSeconds: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
    });
  }
});

// Keyword Finder limiter to ensure fair shared use
const keywordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // Limit each IP to 60 keyword searches per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. To ensure fair use for everyone, please wait a few minutes before generating more keyword ideas.',
      retryAfterSeconds: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
    });
  }
});

module.exports = {
  analyzeLimiter,
  inquiryLimiter,
  adminLoginLimiter,
  drLimiter,
  keywordLimiter
};


